import axios from "axios";
import { showToast, Toast } from "@raycast/api";

import { PATH, StampType } from "../../constants";

// 勤怠実績APIのレスポンス（NOTE: 実装で利用するもののみ抜粋）
export type RecordsResponse = {
  response: Array<{
    staff_id: string;
    working_records: Array<{
      date: string;
      working_day_category: number;
      start_time: string;
      end_time: string;
      break_time_results: Array<{
        result_break_time_start_time: string;
        result_break_time_end_time: string;
      }>;
    }>;
  }>;
};

// NOTE: API仕様から利用するプロパティのみ抜粋
type StaffResponse = {
  response: {
    login_company_code: string;
    Count: number;
    TotalCount: number;
    staffs: Array<{
      staffId: string;
    }>;
  };
};
export const fetchMe = async (domain: string, companyId: string, token: string) => {
  const response = await axios.get<StaffResponse>(PATH.akashi.staff(domain, companyId), {
    params: {
      token,
      target: token,
    },
  });
  return response.data.response.staffs[0];
};

/**
 * AKASHI 打刻実行 APIによる打刻を実行
 * https://akashi.zendesk.com/hc/ja/articles/115000475854-AKASHI-%E5%85%AC%E9%96%8BAPI-%E4%BB%95%E6%A7%98
 */
export const postStamp = async (
  domain: string,
  companyId: string,
  token: string,
  stampType: StampType,
  message?: string,
) => {
  await axios
    .post(PATH.akashi.stamp(domain, companyId), {
      token,
      type: stampType,
      timezone: "+09:00",
    })
    .then(async (response) => {
      await showToast({
        style: Toast.Style.Success,
        title: "打刻に成功しました",
        message: `${message ? `${message}:` : ""}${response.data.response.stampedAt}`,
      });
    });
};
