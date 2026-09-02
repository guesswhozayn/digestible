import React, { useId } from 'react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  color?: string;
  textColor?: string;
}

export const AbstractDLogo: React.FC<LogoProps> = ({
  size = 32,
  showText = true,
  color = '#FF5B22',
  textColor = '#0F172A',
}) => {
  const rawId = useId();
  const cleanId = rawId.replace(/:/g, '');
  const gradientId = `clientoDGrad_${cleanId}`;
  const maskId = `clientoDMask_${cleanId}`;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF6B35" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
          <mask id={maskId}>
            <rect width="40" height="40" fill="#FFFFFF" />
            {/* True transparent aperture cutout */}
            <circle cx="16" cy="20" r="4.5" fill="#000000" />
          </mask>
        </defs>

        {/* Digestible Organic D Silhouette */}
        <path
          d="M 8 4 C 18 4 34 8 34 20 C 34 32 18 36 8 36 C 3.5 36 3.5 4 8 4 Z"
          fill={`url(#${gradientId})`}
          mask={`url(#${maskId})`}
        />
      </svg>

      {showText && (
        <span
          className="font-serif"
          style={{
            fontSize: `${size * 1.1}px`,
            color: textColor,
            letterSpacing: '-0.5px',
            lineHeight: 1,
            fontWeight: 700,
          }}
        >
          Digestible
        </span>
      )}
    </div>
  );
};
