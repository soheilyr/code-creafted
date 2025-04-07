export default function CodePatternBackground() {
  return (
    <div className="absolute z-[2] inset-0  overflow-hidden pointer-events-none">
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="codeSymbols"
            x="0"
            y="0"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <text x="10" y="20" fontSize="18" fill="#ffffff0d">
              {"{}"}
            </text>
            <text x="40" y="40" fontSize="18" fill="#ffffff0a">
              {"</>"}
            </text>
            <text x="10" y="60" fontSize="16" fill="#ffffff0a">
              {";"}
            </text>
            <text x="50" y="15" fontSize="16" fill="#ffffff0a">
              {":"}
            </text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#codeSymbols)" />
      </svg>
    </div>
  );
}
