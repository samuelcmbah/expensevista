// src/utils/formatAmount.ts

export const formatAmount = (value: string | number | undefined | null): string => {
  if (value === null || value === undefined) return "--";

  // Convert to number safely
   let num: number;
  if (typeof value === "string") {
    const cleaned = value.replace(/,/g, ""); // remove commas
    num = parseFloat(cleaned);
  } else {
    num = value;
  }

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
