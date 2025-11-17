import React from 'react';
import { MeditateIcon, VisualizeIcon, ChatIcon } from './icons/FeatureIcons';

type Feature = 'meditate' | 'visualize' | 'chat';

interface FeatureTabsProps {
  activeFeature: Feature;
  setActiveFeature: (feature: Feature) => void;
}

const FeatureTabs: React.FC<FeatureTabsProps> = ({ activeFeature, setActiveFeature }) => {
  // FIX: Replaced JSX.Element with React.ReactElement to resolve the "Cannot find namespace 'JSX'" error by using an explicit type from the imported React module.
  const tabs: { id: Feature; label: string; icon: React.ReactElement }[] = [
    { id: 'meditate', label: 'Meditate', icon: <MeditateIcon /> },
    { id: 'visualize', label: 'Visualize', icon: <VisualizeIcon /> },
    { id: 'chat', label: 'Chat Guide', icon: <ChatIcon /> },
  ];

  return (
    <div className="flex justify-center bg-slate-800/50 rounded-t-lg backdrop-blur-sm">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveFeature(tab.id)}
          className={`flex-1 sm:flex-initial sm:px-8 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-300 border-b-2
            ${activeFeature === tab.id
              ? 'text-cyan-400 border-cyan-400'
              : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-700/50'
            }
            ${tab.id === 'meditate' ? 'rounded-tl-lg' : ''}
          `}
        >
          {tab.icon}
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default FeatureTabs;
