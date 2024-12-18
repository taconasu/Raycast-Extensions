export const PATH = {
  akashi: {
    staff: (domain: string, companyId: string) => `https://${domain}/api/cooperation/${companyId}/staffs/`,
    stamp: (domain: string, companyId: string) => `https://${domain}/api/cooperation/${companyId}/stamps`,
    workingRecords: (
      domain: string,
      companyId: string,
      token: string,
      startDate: string,
      endDate: string,
      target: string,
    ) =>
      `https://${domain}/api/cooperation/${companyId}/working_records?token=${token}&start_date=${startDate}&end_date=${endDate}&staff_ids=${target}&include_break_results=1`,
  },
};
