// src/utils/formatAmount.ts

export const formatAmount = (value: string | number | undefined | null): string => {
  if (value === null || value === undefined) return "--";

  // Convert to number safely
  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) return "0.00";

  // Optional abbreviation for billions
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(2) + "B";
  }

  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
