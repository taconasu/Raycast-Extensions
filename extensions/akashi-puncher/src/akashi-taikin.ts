import { getPreferenceValues } from "@raycast/api";

import { STAMP_TYPE } from "./constants";
import { postStamp } from "./repositories/akashi/stampRepository";

/**
 * AKASHI 打刻実行 APIによる退勤を実行
 * https://akashi.zendesk.com/hc/ja/articles/115000475854-AKASHI-%E5%85%AC%E9%96%8BAPI-%E4%BB%95%E6%A7%98#stamp
 */
export default async function main() {
  const { Domain, CompanyId, APIToken } = getPreferenceValues<Preferences.AkashiTaikin>();

  await postStamp(Domain, CompanyId, APIToken, STAMP_TYPE.PUNCH_OUT, "退勤時刻");
}
