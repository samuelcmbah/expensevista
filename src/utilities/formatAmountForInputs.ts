export const formatAmountForInput = (raw: string): string => {
  // Remove invalid characters (keep only digits and dot)
  let cleaned = raw.replace(/[^0-9.]/g, "");

  // Block dot as first character
  if (cleaned.startsWith(".")) {
    return "";
  }

  // Allow only one dot
  const dotIndex = cleaned.indexOf(".");
  if (dotIndex !== -1) {
    const beforeDot = cleaned.slice(0, dotIndex);
    let afterDot = cleaned.slice(dotIndex + 1);

    // Restrict to max 2 decimals
    afterDot = afterDot.slice(0, 2);

    cleaned = beforeDot + "." + afterDot;
  }

  // Split into integer + decimals
  const [intPart, decPart] = cleaned.split(".");

  // Add commas to integer part
  const withCommas = intPart
    .replace(/^0+(?!$)/, "") // remove leading zeros
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return decPart !== undefined ? `${withCommas}.${decPart}` : withCommas;
};
