"use client";

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { TerminalComponentData, SceneSettings } from '@/types/terminal';
import TerminalControlsPanel from '@/components/petro-terminal/TerminalControlsPanel';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamically import ThreeScene to ensure it's client-side only
const ThreeScene = dynamic(() => import('@/components/petro-terminal/ThreeScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted">
      <Skeleton className="w-3/4 h-3/4" />
      <p className="absolute text-foreground">Loading 3D Scene...</p>
    </div>
  ),
});

export default function PetroTerminalPage() {
  const [selectedComponent, setSelectedComponent] = useState<TerminalComponentData | null>(null);
  const [sceneSettings, setSceneSettings] = useState<SceneSettings>({
    isNightMode: false,
  });

  const handleComponentSelect = useCallback((data: TerminalComponentData | null) => {
    setSelectedComponent(data);
  }, []);

  const handleSceneSettingsChange = useCallback((settings: SceneSettings) => {
    setSceneSettings(settings);
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <main className="flex-1 relative h-full">
        <ThreeScene 
          onComponentSelect={handleComponentSelect} 
          sceneSettings={sceneSettings}
          selectedComponentId={selectedComponent?.id}
        />
      </main>
      <aside className="w-[380px] h-full bg-card border-l border-border shadow-lg">
        <TerminalControlsPanel
          componentData={selectedComponent}
          sceneSettings={sceneSettings}
          onSceneSettingsChange={handleSceneSettingsChange}
        />
      </aside>
    </div>
  );
}
