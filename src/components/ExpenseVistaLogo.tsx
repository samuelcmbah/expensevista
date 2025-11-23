interface ExpenseVistaLogoProps {
  variant?: 'full' | 'icon';
  size?: number;
  className?: string;
}

export function ExpenseVistaLogo({
  variant = 'full',
  size = 40,
  className = ''
}: ExpenseVistaLogoProps) {
  // Define your accent green colors
  const darkGreen = "#1A5319"; // A darker green for the background circle
  const accentGreen = "#4CAF50"; // A brighter accent green for the bars

  if (variant === 'icon') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Background circle - now a darker green */}
        <circle cx="50" cy="50" r="50" fill={darkGreen} />

        {/* Three ascending bars - now accent green and bolder */}
        {/* Adjusted x, y, width, height for a bolder and balanced look */}
        <rect x="23" y="50" width="14" height="30" rx="3" fill={accentGreen} />
        <rect x="43" y="35" width="14" height="45" rx="3" fill={accentGreen} />
        <rect x="63" y="20" width="14" height="60" rx="3" fill={accentGreen} />
      </svg>
    );
  }

  
  return (
    <svg
      width={size * 5} // Adjust width to accommodate icon and potential text
      height={size}
      viewBox="0 0 500 100" // Adjust viewBox for broader content
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Icon part - circle background */}
      <circle cx="50" cy="50" r="45" fill={darkGreen} />

      {/* Three ascending bars */}
      <rect x="23" y="50" width="14" height="30" rx="3" fill={accentGreen} />
      <rect x="43" y="35" width="14" height="45" rx="3" fill={accentGreen} />
      <rect x="63" y="20" width="14" height="60" rx="3" fill={accentGreen} />

      
    </svg>
  );
}