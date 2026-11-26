import { useState } from 'react';
import { AssistantWorkspace } from './components/AssistantWorkspace';
import { BenefitsAndFooter } from './components/BenefitsAndFooter';
import { HeroSection } from './components/HeroSection';
import { LandingSections } from './components/LandingSections';
import { Navbar } from './components/Navbar';

export default function App() {
  const [assistantTab, setAssistantTab] = useState<'builder' | 'chat'>('builder');
  const [queuedChatPrompt, setQueuedChatPrompt] = useState<string | null>(null);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenBuilder = () => {
    setAssistantTab('builder');
    scrollToSection('ai-assistant');
  };

  const handleSelectFeature = (prompt: string) => {
    setAssistantTab('chat');
    setQueuedChatPrompt(prompt);
    scrollToSection('ai-assistant');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#1E293B]">
      <Navbar onNavigate={scrollToSection} />

      <main className="flex-1">
        <HeroSection
          onBuildPlan={handleOpenBuilder}
          onExploreFeatures={() => scrollToSection('features')}
        />

        <LandingSections
          onSelectFeature={handleSelectFeature}
          onStartBuilder={handleOpenBuilder}
        />

        <AssistantWorkspace
          activeTab={assistantTab}
          onTabChange={setAssistantTab}
          queuedChatPrompt={queuedChatPrompt}
          onConsumeQueuedPrompt={() => setQueuedChatPrompt(null)}
        />

        <BenefitsAndFooter onBuildPlan={handleOpenBuilder} onNavigate={scrollToSection} />
      </main>
    </div>
  );
}
