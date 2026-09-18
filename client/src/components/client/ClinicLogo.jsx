import React from 'react';

const ClinicLogo = ({ size = 'md', className = '', variant = 'default' }) => {
  const isLarge = size === 'lg';
  const iconHeight = isLarge ? 48 : 36;
  const isWhite = variant === 'white';
  
  const color1 = isWhite ? '#ffffff' : '#2c7a94';
  const color2 = isWhite ? '#ffffff' : '#cc3b38';
  const color3 = isWhite ? '#e2e8f0' : '#3b8296';
  
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Sharnam Clinic SVG Emblem */}
      <svg
        width={iconHeight * 1.1}
        height={iconHeight}
        viewBox="0 0 100 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Outer Top Arch Frame */}
        <path
          d="M 15 45 V 20 C 15 12, 22 5, 30 5 H 50 V 12 H 30 C 25 12, 22 15, 22 20 V 45 Z"
          fill={color1}
        />
        <path
          d="M 85 45 V 20 C 85 12, 78 5, 70 5 H 50 V 12 H 70 C 75 12, 78 15, 78 20 V 45 Z"
          fill={color2}
        />

        {/* Inner Arch Lines */}
        <path
          d="M 27 45 V 25 C 27 20, 32 15, 38 15 H 50 V 19 H 38 C 35 19, 32 21, 32 25 V 45 Z"
          fill={color1}
        />
        <path
          d="M 73 45 V 25 C 73 20, 68 15, 62 15 H 50 V 19 H 62 C 65 19, 68 21, 68 25 V 45 Z"
          fill={color2}
        />

        {/* Heart with Cross */}
        <path
          d="M 50 38 C 46 32, 38 32, 35 37 C 32 42, 36 48, 50 58 C 64 48, 68 42, 65 37 C 62 32, 54 32, 50 38 Z"
          fill={color2}
        />
        {/* Medical Cross inside Heart */}
        <rect x="48.5" y="38" width="3" height="10" fill={isWhite ? '#2c7a94' : '#ffffff'} rx="1" />
        <rect x="45" y="41.5" width="10" height="3" fill={isWhite ? '#2c7a94' : '#ffffff'} rx="1" />

        {/* Caring Hand Icon Below Heart */}
        <path
          d="M 25 60 C 25 60, 32 55, 45 55 C 55 55, 62 60, 75 60 C 70 70, 55 75, 40 73 C 32 72, 27 67, 25 60 Z"
          fill={color1}
        />
        <path
          d="M 28 61 C 35 57, 46 56, 56 60 C 65 64, 73 62, 73 62 C 67 71, 52 75, 38 72 C 32 70, 29 66, 28 61 Z"
          fill={color3}
        />
      </svg>

      {/* Text Branding */}
      <div className="flex flex-col leading-none">
        <span className={`font-['Playfair_Display'] font-extrabold tracking-tight ${isWhite ? 'text-white' : 'text-[#cc3b38]'} ${isLarge ? 'text-[28px]' : 'text-[22px]'}`}>
          Sharnam
        </span>
        <span className={`font-['Inter'] font-semibold tracking-wide ${isWhite ? 'text-white/90' : 'text-[#2c7a94]'} ${isLarge ? 'text-[18px] -mt-1' : 'text-[14px] -mt-0.5'}`}>
          Clinic
        </span>
      </div>
    </div>
  );
};

export default ClinicLogo;
