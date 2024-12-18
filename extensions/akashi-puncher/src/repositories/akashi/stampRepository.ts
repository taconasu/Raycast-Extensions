import axios from "axios";
import { showToast, Toast } from "@raycast/api";

import { PATH, StampType } from "../../constants";

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
