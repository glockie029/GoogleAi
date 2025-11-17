
import React, { useState } from 'react';
import Header from './components/Header';
import FeatureTabs from './components/FeatureTabs';
import Meditate from './components/Meditate';
import Visualize from './components/Visualize';
import Chat from './components/Chat';

type Feature = 'meditate' | 'visualize' | 'chat';

const App: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<Feature>('meditate');

  const renderFeature = () => {
    switch (activeFeature) {
      case 'meditate':
        return <Meditate />;
      case 'visualize':
        return <Visualize />;
      case 'chat':
        return <Chat />;
      default:
        return <Meditate />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
        <Header />
        <FeatureTabs activeFeature={activeFeature} setActiveFeature={setActiveFeature} />
        <main className="flex-grow bg-slate-800/50 rounded-b-lg shadow-2xl p-6 md:p-8">
          {renderFeature()}
        </main>
        <footer className="text-center text-xs text-slate-500 mt-8">
          <p>Created with Serenity by Gemini</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
