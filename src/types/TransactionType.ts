// ✅ Replace enum with union + const
export const TransactionType = {
  Expense: 0,
  Income: 1,
} as const;

export type TransactionType = typeof TransactionType[keyof typeof TransactionType];
