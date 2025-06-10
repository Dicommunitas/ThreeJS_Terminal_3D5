export interface TerminalComponentData {
  id: string;
  name: string;
  type: 'Tank' | 'Pipeline' | 'LoadingDock';
  capacity?: string;
  material?: string;
  status: 'Operational' | 'Maintenance' | 'Offline';
  pressure?: string;
  temperature?: string;
  flowRate?: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
  meshUuid?: string; // Links to Three.js mesh UUID
  color?: string; // Default color for the component
}

export interface SceneSettings {
  isNightMode: boolean;
}

export type TerminalComponentType = TerminalComponentData['type'];
