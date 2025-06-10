"use client";

import React from 'react';
import type { TerminalComponentData, SceneSettings } from '@/types/terminal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Droplets, Waypoints, Ship, Sun, Moon, Info, AlertTriangle, CheckCircle2, Settings2 } from 'lucide-react';

interface TerminalControlsPanelProps {
  componentData: TerminalComponentData | null;
  sceneSettings: SceneSettings;
  onSceneSettingsChange: (settings: SceneSettings) => void;
}

const iconMap: Record<TerminalComponentData['type'], React.ElementType> = {
  Tank: Droplets,
  Pipeline: Waypoints,
  LoadingDock: Ship,
};

const statusIconMap: Record<TerminalComponentData['status'], React.ElementType> = {
  Operational: CheckCircle2,
  Maintenance: Settings2,
  Offline: AlertTriangle,
};

const statusColorMap: Record<TerminalComponentData['status'], string> = {
  Operational: 'text-green-500',
  Maintenance: 'text-yellow-500',
  Offline: 'text-red-500',
};


const DetailItem: React.FC<{ label: string; value?: string }> = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="mb-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
};

const TerminalControlsPanel: React.FC<TerminalControlsPanelProps> = ({
  componentData,
  sceneSettings,
  onSceneSettingsChange,
}) => {
  const handleNightModeToggle = (isNight: boolean) => {
    onSceneSettingsChange({ ...sceneSettings, isNightMode: isNight });
  };

  const ComponentIcon = componentData ? iconMap[componentData.type] : Info;
  const StatusIcon = componentData ? statusIconMap[componentData.status] : null;
  const statusColor = componentData ? statusColorMap[componentData.status] : '';

  return (
    <ScrollArea className="h-full">
      <div className="p-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Settings2 className="mr-2 h-5 w-5" /> Scene Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="night-mode-toggle" className="flex items-center">
                {sceneSettings.isNightMode ? (
                  <Moon className="mr-2 h-4 w-4" />
                ) : (
                  <Sun className="mr-2 h-4 w-4" />
                )}
                Night Mode
              </Label>
              <Switch
                id="night-mode-toggle"
                checked={sceneSettings.isNightMode}
                onCheckedChange={handleNightModeToggle}
                aria-label="Toggle night mode"
              />
            </div>
          </CardContent>
        </Card>

        <Separator className="my-4" />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <ComponentIcon className="mr-2 h-5 w-5" /> Component Information
            </CardTitle>
            {!componentData && <CardDescription>Select a component in the 3D view to see its details.</CardDescription>}
          </CardHeader>
          {componentData && (
            <CardContent>
              <h3 className="text-md font-semibold mb-1">{componentData.name}</h3>
              <div className="flex items-center mb-3">
                {StatusIcon && <StatusIcon className={`mr-2 h-4 w-4 ${statusColor}`} />}
                <span className={`text-sm font-medium ${statusColor}`}>{componentData.status}</span>
              </div>
              
              <DetailItem label="Type" value={componentData.type} />
              <DetailItem label="Material" value={componentData.material} />
              <DetailItem label="Capacity" value={componentData.capacity} />
              <DetailItem label="Pressure" value={componentData.pressure} />
              <DetailItem label="Temperature" value={componentData.temperature} />
              <DetailItem label="Flow Rate" value={componentData.flowRate} />
              
              { (componentData.lastMaintenance || componentData.nextMaintenance) && <Separator className="my-3" /> }
              
              <DetailItem label="Last Maintenance" value={componentData.lastMaintenance} />
              <DetailItem label="Next Maintenance" value={componentData.nextMaintenance} />
            </CardContent>
          )}
        </Card>
      </div>
    </ScrollArea>
  );
};

export default TerminalControlsPanel;
