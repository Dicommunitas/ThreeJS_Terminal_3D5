
/**
 * Fornece os dados iniciais para equipamentos e camadas da aplicação.
 * Estes dados são usados para popular o estado inicial da aplicação quando ela é carregada.
 * Define a estrutura de cada equipamento e as camadas de visibilidade padrão.
 *
 * Exporta:
 * - `initialEquipment`: Array de objetos `Equipment` representando os itens 3D na cena.
 * - `initialLayers`: Array de objetos `Layer` especificando as camadas de visibilidade.
 * - `initialAnnotations`: Array inicial de `Annotation` (geralmente vazio para começar).
 */
import type { Equipment, Layer, Annotation } from '@/lib/types';

/**
 * Lista inicial de equipamentos para a cena 3D.
 * Cada equipamento possui propriedades como tag, nome, tipo, sistema, área, estado operacional,
 * produto, posição, dimensões (ou raio/altura), cor, detalhes e categoria.
 */
export const initialEquipment: Equipment[] = [
  // Buildings - Ajustados para testar a nova lógica de telhado
  { tag: 'bldg-01', name: 'Main Office', type: 'Building', sistema: 'NDD', area: 'Área 20', operationalState: 'Não aplicável', product: 'Não aplicável', position: { x: -15, y: 0, z: -10 }, size: { width: 10, height: 12, depth: 8 }, color: '#78909C', details: 'Primary administrative building (tall).' }, // Taller
  { tag: 'bldg-02', name: 'Warehouse A', type: 'Building', sistema: 'GA', area: 'Área 31', operationalState: 'Não aplicável', product: 'Não aplicável', position: { x: 15, y: 0, z: -12 }, size: { width: 20, height: 8, depth: 15 }, color: '#7E57C2', details: 'Storage for dry goods (wide/flat).' }, // Wider/Flatter
  { tag: 'bldg-03', name: 'Control Room', type: 'Building', sistema: 'MTBE', area: 'Área 32', operationalState: 'Não aplicável', product: 'Não aplicável', position: { x: 0, y: 0, z: -18 }, size: { width: 7, height: 4, depth: 7 }, color: '#5C6BC0', details: 'Central operations control (small/flat).' }, // Smaller/Flatter

  // Cranes
  { tag: 'crane-01', name: 'Gantry Crane 1', type: 'Crane', sistema: 'QAV', area: 'Área 40', operationalState: 'operando', product: "Não aplicável", position: { x: 0, y: 0, z: 8 }, size: { width: 12, height: 10, depth: 2 }, color: '#FF8A65', details: 'Heavy lift gantry crane.' },
  { tag: 'crane-02', name: 'Jib Crane', type: 'Crane', sistema: 'LASTRO', area: 'Área 50', operationalState: 'manutenção', product: "Não aplicável", position: { x: -10, y: 0, z: 5 }, size: { width: 1.5, height: 7, depth: 1.5 }, color: '#FFB74D', details: 'Small jib crane for workshop.' },

  // Tanks (posição y é a base do tanque)
  { tag: 'tank-01', name: 'Storage Tank Alpha', type: 'Tank', sistema: 'ODB', area: 'Área 33', operationalState: 'operando', product: '70H', position: { x: -8, y: 0, z: 12 }, radius: 3, height: 5, color: '#4FC3F7', details: 'Liquid storage tank for product 70H.', tankType: 'teto-fixo' },
  { tag: 'tank-02', name: 'Storage Tank Beta', type: 'Tank', sistema: 'ESCUROS', area: 'Área 33', operationalState: 'não operando', product: '6DH', position: { x: -2, y: 0, z: 12 }, radius: 2.5, height: 4, color: '#4DD0E1', details: 'Auxiliary liquid storage for product 6DH.', tankType: 'teto-flutuante-interno' }, // teto flutuante ainda não implementado visualmente diferente
  { tag: 'tank-03', name: 'Process Tank Gamma', type: 'Tank', sistema: 'NDD', area: 'Área 34', operationalState: 'em falha', product: '660', position: { x: 5, y: 0, z: 10 }, radius: 2, height: 6, color: '#4DB6AC', details: 'Processing tank for product 660.', tankType: 'teto-fixo' },

  // Pipes (posição y é o centro do cilindro)
  { tag: 'pipe-01', name: 'Main Feed Pipe', type: 'Pipe', sistema: 'GA', area: 'Área 35', operationalState: 'operando', product: '70H', position: { x: -5, y: 1, z: 5 }, radius: 0.3, height: 10, color: '#B0BEC5', details: 'Connects Tank Alpha to Process Area.', rotation: { x: 0, y: 0, z: Math.PI / 2 }, material: 'Aço Carbono' },
  { tag: 'pipe-02', name: 'Process Output Pipe', type: 'Pipe', sistema: 'MTBE', area: 'Área 34', operationalState: 'não operando', product: '660', position: { x: 0, y: 2.5, z: 9 }, radius: 0.2, height: 8, color: '#90A4AE', details: 'Carries product from Process Tank Gamma.', rotation: { x: Math.PI / 2, y: 0, z: 0 }, material: 'Aço Inox' },
  { tag: 'pipe-03', name: 'Vertical Riser', type: 'Pipe', sistema: 'QAV', area: 'Área 60', operationalState: 'manutenção', product: '198', position: { x: 8, y: 3.5, z: 8 }, radius: 0.25, height: 7, color: '#B0BEC5', details: 'Vertical pipe section for product 198.', material: 'Aço Carbono' },

  // Valves (posição y é o centro da esfera)
  { tag: 'valve-01', name: 'Tank Alpha Outlet Valve', type: 'Valve', sistema: 'LASTRO', area: 'Área 33', operationalState: 'operando', product: '70H', position: { x: -8, y: 0.5, z: 8.8 }, radius: 0.4, color: '#EF5350', details: 'Controls flow from Tank Alpha.', valveMechanism: 'gaveta', actuationType: 'manual' },
  { tag: 'valve-02', name: 'Process Inlet Valve', type: 'Valve', sistema: 'ODB', area: 'Área 34', operationalState: 'manutenção', product: '70H', position: { x: -1, y: 2.5, z: 5 }, radius: 0.3, color: '#F44336', details: 'Controls input to Process Tank Gamma.', valveMechanism: 'esfera', actuationType: 'motorizada' },
  { tag: 'valve-03', name: 'Safety Bypass Valve', type: 'Valve', sistema: 'ESCUROS', area: 'Área 60', operationalState: 'em falha', product: '198', position: { x: 8, y: 0.5, z: 4.5 }, radius: 0.3, color: '#E57373', details: 'Emergency bypass valve for product 198.', valveMechanism: 'controle', actuationType: 'motorizada' },

  // New Equipment Types (posição y é a base para bombas, centro para esferas e vasos)
  { tag: 'sphere-01', name: 'LPG Sphere', type: 'Sphere', sistema: 'GA', area: 'Área 70', operationalState: 'operando', product: 'GLP', position: { x: 20, y: 4, z: 5 }, radius: 4, color: '#AED581', details: 'Pressurized sphere for LPG storage.' },
  { tag: 'vessel-01', name: 'Separation Vessel V', type: 'Vessel', sistema: 'MTBE', area: 'Área 32', operationalState: 'operando', product: 'Mistura', position: { x: 3, y: 0, z: -18 }, radius: 1.5, height: 5, color: '#FFD54F', details: 'Vertical separation vessel.', orientation: 'vertical' },
  { tag: 'vessel-02', name: 'Horizontal Separator H', type: 'Vessel', sistema: 'GA', area: 'Área 32', operationalState: 'operando', product: 'Gás/Líquido', position: { x: 8, y: 1.5, z: -18 }, radius: 1.2, height: 6, color: '#FFC107', details: 'Horizontal three-phase separator.', orientation: 'horizontal', rotation: { x: 0, y: 0, z: Math.PI / 2 } },
  { tag: 'pump-01', name: 'Transfer Pump P-101A', type: 'Pump', sistema: 'ODB', area: 'Área 33', operationalState: 'operando', product: '70H', position: { x: -6, y: 0, z: 15 }, size: {width: 1, height: 1, depth: 1.5}, color: '#F06292', details: 'Main product transfer pump.', pumpType: 'centrifuga', motorDetails: { potenciaCv: 50, tensao: '440V'} },
  { tag: 'ship-01', name: 'Oil Tanker "Norte"', type: 'Ship', sistema: 'QAV', area: 'Cais 01', operationalState: 'operando', product: 'Petróleo Cru', position: { x: -30, y: 0 /* Base do casco no Y=0 da cena */, z: 0 }, size: { width: 10, height: 4, depth: 40 }, color: '#64B5F6', details: 'Oil tanker for crude oil transport.', capacityDwt: 50000 },
  { tag: 'barge-01', name: 'Fuel Barge B-01', type: 'Barge', sistema: 'LASTRO', area: 'Cais 02', operationalState: 'não operando', product: 'Diesel', position: { x: -25, y: 0 /* Base do casco no Y=0 da cena */, z: 15 }, size: { width: 8, height: 1.5, depth: 22 }, color: '#81C784', details: 'Barge for diesel fuel.', capacityDwt: 5000 },
];

/**
 * Lista inicial de camadas para controle de visibilidade na interface.
 * Cada camada define um nome, o tipo de equipamento que ela controla (ou 'Annotations' para pins de anotação, 'Terrain' para o chão),
 * e seu estado de visibilidade inicial.
 */
export const initialLayers: Layer[] = [
  { id: 'layer-terrain', name: 'Terreno', equipmentType: 'Terrain', isVisible: true },
  { id: 'layer-buildings', name: 'Prédios', equipmentType: 'Building', isVisible: true },
  { id: 'layer-cranes', name: 'Guindastes', equipmentType: 'Crane', isVisible: true },
  { id: 'layer-tanks', name: 'Tanques', equipmentType: 'Tank', isVisible: true },
  { id: 'layer-spheres', name: 'Esferas', equipmentType: 'Sphere', isVisible: true },
  { id: 'layer-vessels', name: 'Vasos', equipmentType: 'Vessel', isVisible: true },
  { id: 'layer-pumps', name: 'Bombas', equipmentType: 'Pump', isVisible: true },
  { id: 'layer-pipes', name: 'Tubulações', equipmentType: 'Pipe', isVisible: true },
  { id: 'layer-valves', name: 'Válvulas', equipmentType: 'Valve', isVisible: true },
  { id: 'layer-ships', name: 'Navios', equipmentType: 'Ship', isVisible: true },
  { id: 'layer-barges', name: 'Barcaças', equipmentType: 'Barge', isVisible: true },
  { id: 'layer-annotations', name: 'Anotações', equipmentType: 'Annotations', isVisible: true },
];

/**
 * Lista inicial de anotações. Geralmente vazia para começar,
 * a menos que queira popular com dados de exemplo.
 */
export const initialAnnotations: Annotation[] = [];

