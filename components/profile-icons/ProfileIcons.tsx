import React from 'react';

export interface ProfileIconProps {
  className?: string;
  size?: number;
}

// Hair colors
const HAIR_COLORS = {
  brown: '#8B4513',
  blonde: '#DAA520',
  black: '#2C1810'
};

// Skin tones
const SKIN_TONES = {
  light: '#FDBCB4',
  medium: '#E08B69',
  dark: '#8D5524'
};

// Short Hair - Brown
export const ShortHairBrown: React.FC<ProfileIconProps> = ({ className = "", size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
    <circle cx="32" cy="32" r="30" fill="#f0f9ff" stroke="#0ea5e9" strokeWidth="2"/>
    {/* Face */}
    <circle cx="32" cy="28" r="10" fill={SKIN_TONES.light}/>
    {/* Hair */}
    <path d="M22 20 Q32 14 42 20 Q40 24 32 24 Q24 24 22 20" fill={HAIR_COLORS.brown}/>
    <path d="M22 20 Q26 18 32 18 Q38 18 42 20 Q40 22 32 22 Q24 22 22 20" fill={HAIR_COLORS.brown}/>
    {/* Eyes */}
    <circle cx="28" cy="26" r="1.5" fill="#374151"/>
    <circle cx="36" cy="26" r="1.5" fill="#374151"/>
    {/* Smile */}
    <path d="M29 31 Q32 33 35 31" stroke="#374151" strokeWidth="1" fill="none"/>
    {/* Clothing */}
    <path d="M20 45 Q32 38 44 45 L44 56 Q32 48 20 56 Z" fill="#3b82f6"/>
  </svg>
);

// Short Hair - Blonde
export const ShortHairBlonde: React.FC<ProfileIconProps> = ({ className = "", size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
    <circle cx="32" cy="32" r="30" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2"/>
    {/* Face */}
    <circle cx="32" cy="28" r="10" fill={SKIN_TONES.medium}/>
    {/* Hair */}
    <path d="M22 20 Q32 14 42 20 Q40 24 32 24 Q24 24 22 20" fill={HAIR_COLORS.blonde}/>
    <path d="M22 20 Q26 18 32 18 Q38 18 42 20 Q40 22 32 22 Q24 22 22 20" fill={HAIR_COLORS.blonde}/>
    {/* Eyes */}
    <circle cx="28" cy="26" r="1.5" fill="#374151"/>
    <circle cx="36" cy="26" r="1.5" fill="#374151"/>
    {/* Smile */}
    <path d="M29 31 Q32 33 35 31" stroke="#374151" strokeWidth="1" fill="none"/>
    {/* Clothing */}
    <path d="M20 45 Q32 38 44 45 L44 56 Q32 48 20 56 Z" fill="#ec4899"/>
  </svg>
);

// Short Hair - Black
export const ShortHairBlack: React.FC<ProfileIconProps> = ({ className = "", size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
    <circle cx="32" cy="32" r="30" fill="#e0f7fa" stroke="#26c6da" strokeWidth="2"/>
    {/* Face */}
    <circle cx="32" cy="28" r="10" fill={SKIN_TONES.dark}/>
    {/* Hair */}
    <path d="M22 20 Q32 14 42 20 Q40 24 32 24 Q24 24 22 20" fill={HAIR_COLORS.black}/>
    <path d="M22 20 Q26 18 32 18 Q38 18 42 20 Q40 22 32 22 Q24 22 22 20" fill={HAIR_COLORS.black}/>
    {/* Eyes */}
    <circle cx="28" cy="26" r="1.5" fill="#374151"/>
    <circle cx="36" cy="26" r="1.5" fill="#374151"/>
    {/* Smile */}
    <path d="M29 31 Q32 33 35 31" stroke="#374151" strokeWidth="1" fill="none"/>
    {/* Clothing */}
    <path d="M20 45 Q32 38 44 45 L44 56 Q32 48 20 56 Z" fill="#059669"/>
  </svg>
);

// Medium Hair - Brown
export const MediumHairBrown: React.FC<ProfileIconProps> = ({ className = "", size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
    <circle cx="32" cy="32" r="30" fill="#ddd6fe" stroke="#8b5cf6" strokeWidth="2"/>
    {/* Face */}
    <circle cx="32" cy="28" r="10" fill={SKIN_TONES.light}/>
    {/* Hair */}
    <path d="M20 20 Q32 12 44 20 Q42 26 32 26 Q22 26 20 20" fill={HAIR_COLORS.brown}/>
    <path d="M20 22 Q24 20 32 20 Q40 20 44 22 Q42 24 32 24 Q22 24 20 22" fill={HAIR_COLORS.brown}/>
    {/* Hair sides */}
    <ellipse cx="21" cy="26" rx="3" ry="6" fill={HAIR_COLORS.brown}/>
    <ellipse cx="43" cy="26" rx="3" ry="6" fill={HAIR_COLORS.brown}/>
    {/* Eyes */}
    <circle cx="28" cy="26" r="1.5" fill="#374151"/>
    <circle cx="36" cy="26" r="1.5" fill="#374151"/>
    {/* Smile */}
    <path d="M29 31 Q32 33 35 31" stroke="#374151" strokeWidth="1" fill="none"/>
    {/* Clothing */}
    <path d="M21 45 Q32 38 43 45 L43 56 Q32 48 21 56 Z" fill="#dc2626"/>
  </svg>
);

// Medium Hair - Blonde
export const MediumHairBlonde: React.FC<ProfileIconProps> = ({ className = "", size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
    <circle cx="32" cy="32" r="30" fill="#fed7d7" stroke="#f56565" strokeWidth="2"/>
    {/* Face */}
    <circle cx="32" cy="28" r="10" fill={SKIN_TONES.medium}/>
    {/* Hair */}
    <path d="M20 20 Q32 12 44 20 Q42 26 32 26 Q22 26 20 20" fill={HAIR_COLORS.blonde}/>
    <path d="M20 22 Q24 20 32 20 Q40 20 44 22 Q42 24 32 24 Q22 24 20 22" fill={HAIR_COLORS.blonde}/>
    {/* Hair sides */}
    <ellipse cx="21" cy="26" rx="3" ry="6" fill={HAIR_COLORS.blonde}/>
    <ellipse cx="43" cy="26" rx="3" ry="6" fill={HAIR_COLORS.blonde}/>
    {/* Eyes */}
    <circle cx="28" cy="26" r="1.5" fill="#374151"/>
    <circle cx="36" cy="26" r="1.5" fill="#374151"/>
    {/* Smile */}
    <path d="M29 31 Q32 33 35 31" stroke="#374151" strokeWidth="1" fill="none"/>
    {/* Clothing */}
    <path d="M21 45 Q32 38 43 45 L43 56 Q32 48 21 56 Z" fill="#805ad5"/>
  </svg>
);

// Medium Hair - Black
export const MediumHairBlack: React.FC<ProfileIconProps> = ({ className = "", size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
    <circle cx="32" cy="32" r="30" fill="#f0fff4" stroke="#48bb78" strokeWidth="2"/>
    {/* Face */}
    <circle cx="32" cy="28" r="10" fill={SKIN_TONES.dark}/>
    {/* Hair */}
    <path d="M20 20 Q32 12 44 20 Q42 26 32 26 Q22 26 20 20" fill={HAIR_COLORS.black}/>
    <path d="M20 22 Q24 20 32 20 Q40 20 44 22 Q42 24 32 24 Q22 24 20 22" fill={HAIR_COLORS.black}/>
    {/* Hair sides */}
    <ellipse cx="21" cy="26" rx="3" ry="6" fill={HAIR_COLORS.black}/>
    <ellipse cx="43" cy="26" rx="3" ry="6" fill={HAIR_COLORS.black}/>
    {/* Eyes */}
    <circle cx="28" cy="26" r="1.5" fill="#374151"/>
    <circle cx="36" cy="26" r="1.5" fill="#374151"/>
    {/* Smile */}
    <path d="M29 31 Q32 33 35 31" stroke="#374151" strokeWidth="1" fill="none"/>
    {/* Clothing */}
    <path d="M21 45 Q32 38 43 45 L43 56 Q32 48 21 56 Z" fill="#1f2937"/>
  </svg>
);

// Long Hair - Brown
export const LongHairBrown: React.FC<ProfileIconProps> = ({ className = "", size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
    <circle cx="32" cy="32" r="30" fill="#fefcbf" stroke="#ecc94b" strokeWidth="2"/>
    {/* Face */}
    <circle cx="32" cy="28" r="10" fill={SKIN_TONES.light}/>
    {/* Long hair back */}
    <ellipse cx="18" cy="35" rx="5" ry="15" fill={HAIR_COLORS.brown}/>
    <ellipse cx="46" cy="35" rx="5" ry="15" fill={HAIR_COLORS.brown}/>
    {/* Hair top */}
    <path d="M18 18 Q32 10 46 18 Q44 28 32 28 Q20 28 18 18" fill={HAIR_COLORS.brown}/>
    <path d="M18 20 Q26 18 32 18 Q38 18 46 20 Q44 26 32 26 Q20 26 18 20" fill={HAIR_COLORS.brown}/>
    {/* Eyes */}
    <circle cx="28" cy="26" r="1.5" fill="#374151"/>
    <circle cx="36" cy="26" r="1.5" fill="#374151"/>
    {/* Smile */}
    <path d="M29 31 Q32 33 35 31" stroke="#374151" strokeWidth="1" fill="none"/>
    {/* Clothing */}
    <path d="M22 45 Q32 38 42 45 L42 56 Q32 48 22 56 Z" fill="#f97316"/>
  </svg>
);

// Long Hair - Blonde
export const LongHairBlonde: React.FC<ProfileIconProps> = ({ className = "", size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
    <circle cx="32" cy="32" r="30" fill="#e9d8fd" stroke="#9f7aea" strokeWidth="2"/>
    {/* Face */}
    <circle cx="32" cy="28" r="10" fill={SKIN_TONES.medium}/>
    {/* Long hair back */}
    <ellipse cx="18" cy="35" rx="5" ry="15" fill={HAIR_COLORS.blonde}/>
    <ellipse cx="46" cy="35" rx="5" ry="15" fill={HAIR_COLORS.blonde}/>
    {/* Hair top */}
    <path d="M18 18 Q32 10 46 18 Q44 28 32 28 Q20 28 18 18" fill={HAIR_COLORS.blonde}/>
    <path d="M18 20 Q26 18 32 18 Q38 18 46 20 Q44 26 32 26 Q20 26 18 20" fill={HAIR_COLORS.blonde}/>
    {/* Eyes */}
    <circle cx="28" cy="26" r="1.5" fill="#374151"/>
    <circle cx="36" cy="26" r="1.5" fill="#374151"/>
    {/* Smile */}
    <path d="M29 31 Q32 33 35 31" stroke="#374151" strokeWidth="1" fill="none"/>
    {/* Clothing */}
    <path d="M22 45 Q32 38 42 45 L42 56 Q32 48 22 56 Z" fill="#319795"/>
  </svg>
);

// Long Hair - Black
export const LongHairBlack: React.FC<ProfileIconProps> = ({ className = "", size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
    <circle cx="32" cy="32" r="30" fill="#fed7e2" stroke="#f687b3" strokeWidth="2"/>
    {/* Face */}
    <circle cx="32" cy="28" r="10" fill={SKIN_TONES.dark}/>
    {/* Long hair back */}
    <ellipse cx="18" cy="35" rx="5" ry="15" fill={HAIR_COLORS.black}/>
    <ellipse cx="46" cy="35" rx="5" ry="15" fill={HAIR_COLORS.black}/>
    {/* Hair top */}
    <path d="M18 18 Q32 10 46 18 Q44 28 32 28 Q20 28 18 18" fill={HAIR_COLORS.black}/>
    <path d="M18 20 Q26 18 32 18 Q38 18 46 20 Q44 26 32 26 Q20 26 18 20" fill={HAIR_COLORS.black}/>
    {/* Eyes */}
    <circle cx="28" cy="26" r="1.5" fill="#374151"/>
    <circle cx="36" cy="26" r="1.5" fill="#374151"/>
    {/* Smile */}
    <path d="M29 31 Q32 33 35 31" stroke="#374151" strokeWidth="1" fill="none"/>
    {/* Clothing */}
    <path d="M22 45 Q32 38 42 45 L42 56 Q32 48 22 56 Z" fill="#6b46c1"/>
  </svg>
);

// Spiky Hair - Brown
export const SpikyHairBrown: React.FC<ProfileIconProps> = ({ className = "", size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
    <circle cx="32" cy="32" r="30" fill="#e6fffa" stroke="#38b2ac" strokeWidth="2"/>
    {/* Face */}
    <circle cx="32" cy="28" r="10" fill={SKIN_TONES.light}/>
    {/* Spiky hair base */}
    <path d="M22 22 Q32 16 42 22 Q40 26 32 26 Q24 26 22 22" fill={HAIR_COLORS.brown}/>
    {/* Spikes */}
    <path d="M24 20 L26 12 L28 20" fill={HAIR_COLORS.brown}/>
    <path d="M28 18 L30 10 L32 18" fill={HAIR_COLORS.brown}/>
    <path d="M32 18 L34 10 L36 18" fill={HAIR_COLORS.brown}/>
    <path d="M36 20 L38 12 L40 20" fill={HAIR_COLORS.brown}/>
    {/* Eyes */}
    <circle cx="28" cy="26" r="1.5" fill="#374151"/>
    <circle cx="36" cy="26" r="1.5" fill="#374151"/>
    {/* Smile */}
    <path d="M29 31 Q32 33 35 31" stroke="#374151" strokeWidth="1" fill="none"/>
    {/* Clothing */}
    <path d="M20 45 Q32 38 44 45 L44 56 Q32 48 20 56 Z" fill="#e53e3e"/>
  </svg>
);

// Spiky Hair - Blonde
export const SpikyHairBlonde: React.FC<ProfileIconProps> = ({ className = "", size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
    <circle cx="32" cy="32" r="30" fill="#f3e8ff" stroke="#a78bfa" strokeWidth="2"/>
    {/* Face */}
    <circle cx="32" cy="28" r="10" fill={SKIN_TONES.medium}/>
    {/* Spiky hair base */}
    <path d="M22 22 Q32 16 42 22 Q40 26 32 26 Q24 26 22 22" fill={HAIR_COLORS.blonde}/>
    {/* Spikes */}
    <path d="M24 20 L26 12 L28 20" fill={HAIR_COLORS.blonde}/>
    <path d="M28 18 L30 10 L32 18" fill={HAIR_COLORS.blonde}/>
    <path d="M32 18 L34 10 L36 18" fill={HAIR_COLORS.blonde}/>
    <path d="M36 20 L38 12 L40 20" fill={HAIR_COLORS.blonde}/>
    {/* Eyes */}
    <circle cx="28" cy="26" r="1.5" fill="#374151"/>
    <circle cx="36" cy="26" r="1.5" fill="#374151"/>
    {/* Smile */}
    <path d="M29 31 Q32 33 35 31" stroke="#374151" strokeWidth="1" fill="none"/>
    {/* Clothing */}
    <path d="M20 45 Q32 38 44 45 L44 56 Q32 48 20 56 Z" fill="#10b981"/>
  </svg>
);

// Spiky Hair - Black
export const SpikyHairBlack: React.FC<ProfileIconProps> = ({ className = "", size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
    <circle cx="32" cy="32" r="30" fill="#ecfdf5" stroke="#10b981" strokeWidth="2"/>
    {/* Face */}
    <circle cx="32" cy="28" r="10" fill={SKIN_TONES.dark}/>
    {/* Spiky hair base */}
    <path d="M22 22 Q32 16 42 22 Q40 26 32 26 Q24 26 22 22" fill={HAIR_COLORS.black}/>
    {/* Spikes */}
    <path d="M24 20 L26 12 L28 20" fill={HAIR_COLORS.black}/>
    <path d="M28 18 L30 10 L32 18" fill={HAIR_COLORS.black}/>
    <path d="M32 18 L34 10 L36 18" fill={HAIR_COLORS.black}/>
    <path d="M36 20 L38 12 L40 20" fill={HAIR_COLORS.black}/>
    {/* Eyes */}
    <circle cx="28" cy="26" r="1.5" fill="#374151"/>
    <circle cx="36" cy="26" r="1.5" fill="#374151"/>
    {/* Smile */}
    <path d="M29 31 Q32 33 35 31" stroke="#374151" strokeWidth="1" fill="none"/>
    {/* Clothing */}
    <path d="M20 45 Q32 38 44 45 L44 56 Q32 48 20 56 Z" fill="#1e40af"/>
  </svg>
);

export const PROFILE_ICONS = [
  { id: 'short_brown', name: 'Short Brown Hair', component: ShortHairBrown },
  { id: 'short_blonde', name: 'Short Blonde Hair', component: ShortHairBlonde },
  { id: 'short_black', name: 'Short Black Hair', component: ShortHairBlack },
  { id: 'medium_brown', name: 'Medium Brown Hair', component: MediumHairBrown },
  { id: 'medium_blonde', name: 'Medium Blonde Hair', component: MediumHairBlonde },
  { id: 'medium_black', name: 'Medium Black Hair', component: MediumHairBlack },
  { id: 'long_brown', name: 'Long Brown Hair', component: LongHairBrown },
  { id: 'long_blonde', name: 'Long Blonde Hair', component: LongHairBlonde },
  { id: 'long_black', name: 'Long Black Hair', component: LongHairBlack },
  { id: 'spiky_brown', name: 'Spiky Brown Hair', component: SpikyHairBrown },
  { id: 'spiky_blonde', name: 'Spiky Blonde Hair', component: SpikyHairBlonde },
  { id: 'spiky_black', name: 'Spiky Black Hair', component: SpikyHairBlack },
];

export const getProfileIcon = (iconId: string) => {
  return PROFILE_ICONS.find(icon => icon.id === iconId);
};