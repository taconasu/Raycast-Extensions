export const STAMP_TYPE = {
  PUNCH_IN: 11,
  PUNCH_OUT: 12,
  GO_STRAIGHT: 21,
  GO_STRAIGHT_HOME: 22,
  REST_IN: 31,
  REST_OUT: 32,
} as const;
export const STAMP_TYPE_LABELS = [
  { value: STAMP_TYPE.PUNCH_IN, label: "出勤" },
  { value: STAMP_TYPE.PUNCH_OUT, label: "退勤" },
  { value: STAMP_TYPE.GO_STRAIGHT, label: "直行" },
  { value: STAMP_TYPE.GO_STRAIGHT_HOME, label: "直帰" },
  { value: STAMP_TYPE.REST_IN, label: "休憩入り" },
  { value: STAMP_TYPE.REST_OUT, label: "休憩戻り" },
];

export type StampType = (typeof STAMP_TYPE)[keyof typeof STAMP_TYPE];
