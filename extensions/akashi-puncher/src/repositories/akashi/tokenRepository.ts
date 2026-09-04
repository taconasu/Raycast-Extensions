import axios from "axios";
import { LocalStorage } from "@raycast/api";

import { PATH } from "../../constants";
import { dayjs } from "../../lib/dayjs";

type ReissueTokenResponse = {
  success: boolean;
  response?: {
    token: string;
    expired_at: string;
  };
  errors?: Array<{
    message: string;
  }>;
};

type StoredToken = {
  preferenceToken: string;
  token: string;
  expiredAt: string;
};

const TOKEN_STORAGE_KEY_PREFIX = "akashi-api-token";
// 5営業日休んで9連休にする人でも期限切れを防ぐため10日前から再発行する
const REFRESH_THRESHOLD_DAYS = 10;

const getStorageKey = (domain: string, companyId: string) => `${TOKEN_STORAGE_KEY_PREFIX}:${domain}:${companyId}`;

const parseStoredToken = async (domain: string, companyId: string) => {
  const storageKey = getStorageKey(domain, companyId);
  const rawValue = await LocalStorage.getItem<string>(storageKey);
  if (!rawValue) return null;

  try {
    return JSON.parse(rawValue) as StoredToken;
  } catch {
    await LocalStorage.removeItem(storageKey);
    return null;
  }
};

const saveStoredToken = async (domain: string, companyId: string, token: StoredToken) => {
  await LocalStorage.setItem(getStorageKey(domain, companyId), JSON.stringify(token));
};

const isExpiringSoon = (expiredAt: string) => {
  const expirationDate = dayjs.tz(expiredAt);
  if (!expirationDate.isValid()) return true;

  return expirationDate.diff(dayjs().tz(), "day", true) <= REFRESH_THRESHOLD_DAYS;
};

const reissueToken = async (domain: string, companyId: string, token: string) => {
  const response = await axios.post<ReissueTokenResponse>(PATH.akashi.reissueToken(domain, companyId), { token });
  if (!response.data.success || !response.data.response) {
    throw new Error(response.data.errors?.[0]?.message || "AKASHI APIトークンの再発行に失敗しました");
  }

  return response.data.response;
};

// NOTE: 開発モード(ray develop)ではReact Strict ModeによりgetActiveTokenが2回呼ばれ、
// 再発行APIも2回走ることを確認済み。本番ビルドではStrict Modeが無効化されるため1回になる想定だが、
// 本番で複数回叩かれているのを確認した場合は、inflightRefreshes等で並行呼び出しを集約する対策を入れる。
export const getActiveToken = async (domain: string, companyId: string, preferenceToken: string) => {
  const storedToken = await parseStoredToken(domain, companyId);
  const hasSamePreferenceToken = storedToken?.preferenceToken === preferenceToken;

  if (storedToken && hasSamePreferenceToken && !isExpiringSoon(storedToken.expiredAt)) {
    return storedToken.token;
  }

  const baseToken = storedToken && hasSamePreferenceToken ? storedToken.token : preferenceToken;

  try {
    const refreshedToken = await reissueToken(domain, companyId, baseToken);
    await saveStoredToken(domain, companyId, {
      preferenceToken,
      token: refreshedToken.token,
      expiredAt: refreshedToken.expired_at,
    });
    return refreshedToken.token;
  } catch (error) {
    if (storedToken && hasSamePreferenceToken && dayjs.tz(storedToken.expiredAt).isAfter(dayjs().tz())) {
      return storedToken.token;
    }

    throw error;
  }
};
