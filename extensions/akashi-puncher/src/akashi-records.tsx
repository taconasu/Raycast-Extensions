import { useFetch, usePromise } from "@raycast/utils";
import { fetchMe, RecordsResponse } from "./repositories/akashi/stampRepository";
import { getPreferenceValues, List } from "@raycast/api";
import { useMemo } from "react";
import { dayjs } from "./lib/dayjs";
import { PATH } from "./constants";

const Records = () => {
  const { Domain, CompanyId, APIToken } = getPreferenceValues<Preferences.AkashiRecords>();
  const { data, isLoading: isMeLoading } = usePromise(fetchMe, [Domain, CompanyId, APIToken]);
  const currentStartDate = dayjs().startOf("month").format("YYYYMMDD");
  const currentEndDate = dayjs().endOf("month").format("YYYYMMDD");
  const { data: records, isLoading } = useFetch<RecordsResponse>(
    PATH.akashi.workingRecords(Domain, CompanyId, APIToken, currentStartDate, currentEndDate, data?.staffId || ""),
    {
      execute: !!data,
    },
  );

  const workingRecords = useMemo(() => {
    if (!records || !records.response[0]?.working_records) return [];

    // 労働日のデータのみ抽出
    return records.response[0].working_records.filter((record) => record.working_day_category === 0);
  }, [records]);

  return (
    <List isLoading={isMeLoading || isLoading}>
      {workingRecords.length === 0 ? (
        <List.EmptyView title="No Working Records Data" />
      ) : (
        <>
          {workingRecords.map((record) => (
            <List.Section key={record.date} title={record.date}>
              {record.start_time && <List.Item title={`出勤: ${record.start_time}`} />}
              {record.end_time && <List.Item title={`退勤: ${record.end_time}`} />}
            </List.Section>
          ))}
        </>
      )}
    </List>
  );
};

export default Records;
