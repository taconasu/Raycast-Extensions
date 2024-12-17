export const STAMP_TYPE = {
  PUNCH_IN: 11,
  PUNCH_OUT: 12,
  GO_STRAIGHT: 21,
  GO_STRAIGHT_HOME: 22,
  REST_IN: 31,
  REST_OUT: 32,
} as const;

export type StampType = (typeof STAMP_TYPE)[keyof typeof STAMP_TYPE];
