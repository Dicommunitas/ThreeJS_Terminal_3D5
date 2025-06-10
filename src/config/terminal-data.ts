import type { TerminalComponentData } from '@/types/terminal';

export const initialTerminalComponents: TerminalComponentData[] = [
  {
    id: 'tank-001',
    name: 'Crude Oil Tank T-101',
    type: 'Tank',
    capacity: '50,000 m³',
    material: 'Carbon Steel ASTM A283',
    status: 'Operational',
    lastMaintenance: '2023-08-15',
    nextMaintenance: '2024-08-15',
    pressure: 'Atmospheric',
    temperature: 'Ambient',
    color: '#A0A0A0', // Light gray
  },
  {
    id: 'tank-002',
    name: 'Gasoline Storage Tank T-204',
    type: 'Tank',
    capacity: '25,000 m³',
    material: 'Stainless Steel 304L',
    status: 'Maintenance',
    lastMaintenance: '2023-11-01',
    nextMaintenance: '2024-11-01',
    pressure: 'Atmospheric',
    temperature: 'Ambient',
    color: '#A0A0A0', // Light gray
  },
  {
    id: 'pipeline-001',
    name: 'Main Transfer Line P-001',
    type: 'Pipeline',
    material: 'API 5L Grade B',
    status: 'Operational',
    flowRate: '1,200 m³/hr',
    pressure: '15 bar',
    temperature: '30°C',
    color: '#808080', // Medium gray
  },
  {
    id: 'dock-001',
    name: 'Jetty 1 - Loading Dock',
    type: 'LoadingDock',
    status: 'Offline',
    capacity: 'VLCC Class',
    color: '#C0C0C0', // Silver
  },
];
