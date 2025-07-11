"use client";

import React from 'react';
import { PROFILE_ICONS } from './ProfileIcons';

interface IconSelectorProps {
  selectedIcon: string;
  onIconSelect: (iconId: string) => void;
  className?: string;
}

export const IconSelector: React.FC<IconSelectorProps> = ({
  selectedIcon,
  onIconSelect,
  className = ""
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="text-sm font-medium text-gray-700 mb-3">Choose an avatar:</h4>
      <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto p-2 bg-white/50 rounded-lg border border-gray-200">
        {PROFILE_ICONS.map((icon) => {
          const IconComponent = icon.component;
          const isSelected = selectedIcon === icon.id;
          
          return (
            <button
              key={icon.id}
              onClick={() => onIconSelect(icon.id)}
              className={`
                p-2 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2
                ${isSelected 
                  ? 'bg-gradient-to-br from-blue-100 to-purple-100 ring-2 ring-blue-400 ring-offset-2 shadow-lg transform scale-105' 
                  : 'bg-white hover:bg-gray-50 hover:shadow-md border border-gray-200'
                }
              `}
              title={icon.name}
            >
              <IconComponent size={48} className="mx-auto" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default IconSelector;