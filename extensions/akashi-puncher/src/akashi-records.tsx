import { useFetch, usePromise } from "@raycast/utils";
import { fetchMe, RecordsResponse } from "./repositories/akashi/stampRepository";
import { Action, ActionPanel, getPreferenceValues, List } from "@raycast/api";
import { useMemo } from "react";
import { dayjs } from "./lib/dayjs";
import { PATH } from "./constants";
import { getActiveToken } from "./repositories/akashi/tokenRepository";

const RecordActionPanel = () => (
  <ActionPanel title="">
    {/* eslint-disable-next-line @raycast/prefer-title-case */}
    <Action.OpenInBrowser title="Open AKASHI in Browser" url="https://atnd.ak4.jp/ja/attendance" />
  </ActionPanel>
);

const Records = () => {
  const { Domain, CompanyId, APIToken } = getPreferenceValues<Preferences.AkashiRecords>();
  const { data: activeToken, isLoading: isTokenLoading } = usePromise(getActiveToken, [Domain, CompanyId, APIToken]);
  const { data, isLoading: isMeLoading } = usePromise(fetchMe, [Domain, CompanyId, activeToken || ""], {
    execute: !!activeToken,
  });
  const currentStartDate = dayjs().startOf("month").format("YYYYMMDD");
  const currentEndDate = dayjs().endOf("month").format("YYYYMMDD");
  const { data: records, isLoading } = useFetch<RecordsResponse>(
    PATH.akashi.workingRecords(
      Domain,
      CompanyId,
      activeToken || "",
      currentStartDate,
      currentEndDate,
      data?.staffId || "",
    ),
    {
      execute: !!activeToken && !!data,
    },
  );

  const workingRecords = useMemo(() => {
    if (!records || !records.response[0]?.working_records) return [];

    // 労働日のデータのみ抽出
    return records.response[0].working_records.filter((record) => record.working_day_category === 0);
  }, [records]);

  return (
    <List isLoading={isTokenLoading || isMeLoading || isLoading}>
      {workingRecords.length === 0 ? (
        <List.EmptyView title="No Working Records Data" />
      ) : (
        <>
          {workingRecords.toReversed().map((record) => (
            <List.Section key={record.date} title={record.date}>
              {record.start_time && (
                <List.Item
                  title={`🏃‍♂️ 出勤: ${dayjs(record.start_time).format("HH:mm")}`}
                  actions={<RecordActionPanel />}
                />
              )}
              {record.break_time_results.length > 0 &&
                record.break_time_results.map((breakTime, breakIndex) => (
                  <List.Item
                    key={breakIndex}
                    title={`☕️ 休憩: ${dayjs(breakTime.result_break_time_start_time).format("HH:mm")} - ${dayjs(breakTime.result_break_time_end_time).format("HH:mm")}`}
                    actions={<RecordActionPanel />}
                  />
                ))}
              {record.end_time && (
                <List.Item
                  title={`🚗 退勤: ${dayjs(record.end_time).format("HH:mm")}`}
                  actions={<RecordActionPanel />}
                />
              )}
            </List.Section>
          ))}
        </>
      )}
    </List>
  );
};

export default Records;
