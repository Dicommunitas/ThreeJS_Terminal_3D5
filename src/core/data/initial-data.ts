
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
 * Para equipamentos que ficam no chão, `position.y` = 0 (base no chão).
 * Para equipamentos flutuantes/centrados (Pipe, Valve, Sphere, Vessel horizontal), `position.y` é o centro Y.
 * Navio e Barcaça: y = 0 representa a linha d'água / base.
 * Esfera: y = raio para que a base toque o chão.
 */
export const initialEquipment: Equipment[] = [
  // Equipamentos Mapeados e Atualizados
  {
    tag: 'ship-01', name: 'Navio Petroleiro Geo', type: 'Ship', sistema: 'QAV', area: 'Cais Geo 01',
    operationalState: 'operando', product: 'Petróleo Cru',
    position: { x: 0, y: 0, z: 0 }, // Ponto de referência
    size: { width: 12, height: 5, depth: 50 }, color: '#64B5F6',
    details: 'Navio Tanque posicionado via geo-coordenadas.', capacityDwt: 50000
  },
  {
    tag: 'barge-01', name: 'Barcaça de Combustível Geo', type: 'Barge', sistema: 'LASTRO', area: 'Cais Geo 02',
    operationalState: 'não operando', product: 'Diesel',
    position: { x: -21.41, y: 0, z: 22.75 },
    size: { width: 10, height: 2, depth: 25 }, color: '#81C784',
    details: 'Barcaça posicionada via geo-coordenadas.', capacityDwt: 5000
  },
  {
    tag: 'sphere-01', name: 'Esfera GLP Geo', type: 'Sphere', sistema: 'GA', area: 'Área Geo 70',
    operationalState: 'operando', product: 'GLP',
    position: { x: -56.14, y: 4, z: 119.82 }, // y = radius para base no chão
    radius: 4, color: '#AED581',
    details: 'Esfera de GLP posicionada via geo-coordenadas.'
  },
  {
    tag: 'tank-02', name: 'Tanque TFI SLP-01', type: 'Tank', sistema: 'ESCUROS', area: 'Área Geo 33',
    operationalState: 'não operando', product: '6DH',
    position: { x: -48.04, y: 0, z: 104.36 },
    radius: 3.5, height: 5.5, color: '#4DD0E1',
    details: 'Tanque de teto flutuante interno posicionado via geo-coordenadas.', tankType: 'teto-flutuante-interno'
  },
  {
    tag: 'tank-01', name: 'Tanque TF SLP-01', type: 'Tank', sistema: 'ODB', area: 'Área Geo 33',
    operationalState: 'operando', product: '70H',
    position: { x: -46.97, y: 0, z: 80.86 },
    radius: 4.5, height: 6.5, color: '#4DB6AC',
    details: 'Tanque de teto fixo posicionado via geo-coordenadas.', tankType: 'teto-fixo'
  },
  {
    tag: 'bldg-01', name: 'Prédio Administrativo Geo', type: 'Building', sistema: 'NDD', area: 'Área Geo 20',
    operationalState: 'Não aplicável', product: 'Não aplicável',
    position: { x: -4.42, y: 0, z: 101.09 },
    size: { width: 12, height: 10, depth: 9 }, color: '#78909C',
    details: 'Prédio Administrativo posicionado via geo-coordenadas.'
  },

  // Novos Equipamentos Adicionados
  {
    tag: 'tank-tfe-01', name: 'Tanque TFE SLP-01', type: 'Tank', sistema: 'GA', area: 'Área Geo 34',
    operationalState: 'operando', product: 'Gasolina',
    position: { x: -39.62, y: 0, z: 107.41 },
    radius: 5, height: 7, color: '#4FC3F7',
    details: 'Novo Tanque de teto flutuante externo (geo).', tankType: 'teto-flutuante-externo'
  },
  {
    tag: 'bldg-operacao', name: 'Prédio da Operação Geo', type: 'Building', sistema: 'NDD', area: 'Área Geo 21',
    operationalState: 'Não aplicável', product: 'Não aplicável',
    position: { x: -3.28, y: 0, z: 111.32 },
    size: { width: 10, height: 6, depth: 10 }, color: '#607D8B',
    details: 'Novo Prédio da Operação (geo).'
  },
  {
    tag: 'bldg-manutencao', name: 'Prédio da Manutenção Geo', type: 'Building', sistema: 'NDD', area: 'Área Geo 22',
    operationalState: 'Não aplicável', product: 'Não aplicável',
    position: { x: -4.33, y: 0, z: 78.43 },
    size: { width: 12, height: 7, depth: 8 }, color: '#546E7A',
    details: 'Novo Prédio da Manutenção (geo).'
  },
  {
    tag: 'tank-tfe-02', name: 'Tanque TFE SLP-02', type: 'Tank', sistema: 'ODB', area: 'Área Geo 35',
    operationalState: 'manutenção', product: 'Querosene',
    position: { x: -27.47, y: 0, z: 97.12 },
    radius: 5.5, height: 8, color: '#29B6F6',
    details: 'Novo Tanque de teto flutuante externo #2 (geo).', tankType: 'teto-flutuante-externo'
  },
  {
    tag: 'tank-tf-02', name: 'Tanque TF SLP-02', type: 'Tank', sistema: 'ESCUROS', area: 'Área Geo 36',
    operationalState: 'não operando', product: 'Óleo Diesel',
    position: { x: -25.11, y: 0, z: 71.57 },
    radius: 3, height: 6, color: '#26A69A',
    details: 'Novo Tanque de teto fixo #2 (geo).', tankType: 'teto-fixo'
  },
];

/**
 * Lista inicial de camadas para controle de visibilidade na interface.
 * Cada camada define um nome, o tipo de equipamento que ela controla (ou 'Annotations' para pins de anotação, 'Terrain' para o chão),
 * e seu estado de visibilidade inicial.
 */
export const initialLayers: Layer[] = [
  { id: 'layer-terrain', name: 'Terreno', equipmentType: 'Terrain', isVisible: true },
  { id: 'layer-buildings', name: 'Prédios', equipmentType: 'Building', isVisible: true },
  { id: 'layer-cranes', name: 'Guindastes', equipmentType: 'Crane', isVisible: true }, // Mantido caso haja intenção de adicionar guindastes depois
  { id: 'layer-tanks', name: 'Tanques', equipmentType: 'Tank', isVisible: true },
  { id: 'layer-spheres', name: 'Esferas', equipmentType: 'Sphere', isVisible: true },
  { id: 'layer-vessels', name: 'Vasos', equipmentType: 'Vessel', isVisible: true }, // Mantido
  { id: 'layer-pumps', name: 'Bombas', equipmentType: 'Pump', isVisible: true }, // Mantido
  { id: 'layer-pipes', name: 'Tubulações', equipmentType: 'Pipe', isVisible: true }, // Mantido
  { id: 'layer-valves', name: 'Válvulas', equipmentType: 'Valve', isVisible: true }, // Mantido
  { id: 'layer-ships', name: 'Navios', equipmentType: 'Ship', isVisible: true },
  { id: 'layer-barges', name: 'Barcaças', equipmentType: 'Barge', isVisible: true },
  { id: 'layer-annotations', name: 'Anotações', equipmentType: 'Annotations', isVisible: true },
];

/**
 * Lista inicial de anotações. Geralmente vazia para começar,
 * a menos que queira popular com dados de exemplo.
 */
export const initialAnnotations: Annotation[] = [];

    