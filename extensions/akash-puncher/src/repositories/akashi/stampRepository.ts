import axios from "axios";
import { showToast, Toast } from "@raycast/api";

import { PATH, StampType } from "../../constants";

export const stamp = async (
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
