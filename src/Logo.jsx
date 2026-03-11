export default function Logo({ size = 'default', showText = true }) {
  const dimensions = size === 'small' ? 32 : size === 'large' ? 64 : 40;
  return (
    <div className="flex items-center gap-3">
      <svg width={dimensions} height={dimensions} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Chicago AI Group Logo">
        <title>Chicago AI Group Logo</title>
        <path d="M70 15 A42 42 0 1 0 70 85" stroke="url(#logoGradient)" strokeWidth="6" strokeLinecap="round" fill="none" />
        <line x1="30" y1="35" x2="50" y2="50" stroke="#64748b" strokeWidth="2" />
        <line x1="30" y1="65" x2="50" y2="50" stroke="#64748b" strokeWidth="2" />
        <line x1="30" y1="35" x2="30" y2="65" stroke="#64748b" strokeWidth="2" />
        <line x1="50" y1="50" x2="68" y2="50" stroke="#64748b" strokeWidth="2" />
        <circle cx="30" cy="35" r="5" fill="#e2e8f0" />
        <circle cx="30" cy="65" r="5" fill="#e2e8f0" />
        <circle cx="68" cy="50" r="4" fill="#e2e8f0" />
        <circle cx="50" cy="50" r="10" fill="#3b82f6" filter="url(#blueGlow)" />
        <circle cx="50" cy="50" r="6" fill="#60a5fa" />
        <polygon points="82,38 84,42 88,42 85,45 86,49 82,46 78,49 79,45 76,42 80,42" fill="#60a5fa" />
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <filter id="blueGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
      </svg>
      {showText && (
        <div className="flex flex-col leading-none">
          <span style={{ fontWeight: 600, letterSpacing: '3px', fontSize: size === 'small' ? '12px' : '14px' }}>CHICAGO AI</span>
          <span style={{ fontWeight: 500, letterSpacing: '5px', fontSize: size === 'small' ? '10px' : '11px', color: '#64748b' }}>GROUP</span>
        </div>
      )}
    </div>
  );
}
