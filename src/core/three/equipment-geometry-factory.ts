
/**
 * Fábrica para criar geometrias de equipamentos para a cena Three.js.
 *
 * Principal Responsabilidade:
 * Atuar como um despachante (dispatcher) que invoca a função de fábrica correta
 * para construir a geometria de um equipamento com base em seu tipo.
 * Geometrias mais simples podem ser definidas diretamente aqui, enquanto geometrias
 * mais complexas são delegadas a módulos dedicados.
 *
 */
import * as THREE from 'three';
import type { Equipment } from '@/lib/types';

// Importa as fábricas de geometria específicas
import { createBuildingGeometry } from './equipment-geometries/building';
import { createTankGeometry } from './equipment-geometries/tank';
import { createValveGeometry } from './equipment-geometries/valve';
import { createPumpGeometry } from './equipment-geometries/pump';
import { createBargeGeometry } from './equipment-geometries/barge';
import { createShipGeometry } from './equipment-geometries/ship';

/**
 * Cria e retorna uma `THREE.BufferGeometry` ou `THREE.Group` apropriada para o tipo de equipamento.
 * Todas as geometrias/grupos retornados são centrados em sua própria origem local (0,0,0).
 * O posicionamento final (incluindo deslocamento Y para a base) é tratado em `createSingleEquipmentMesh`.
 * @param {Equipment} item - O objeto de equipamento contendo tipo e dimensões.
 * @returns {THREE.BufferGeometry | THREE.Group} A geometria ou grupo criado para o equipamento.
 *                                  Retorna um `BoxGeometry(1,1,1)` para tipos desconhecidos.
 */
export function createGeometryForItem(item: Equipment): THREE.BufferGeometry | THREE.Group {
  switch (item.type) {
    case 'Building':
      return createBuildingGeometry(item); // Retorna Group centrado
    case 'Crane':
      return new THREE.BoxGeometry( // Centrado por padrão
        item.size?.width || 3,
        item.size?.height || 10,
        item.size?.depth || 3
      );
    case 'Tank':
      return createTankGeometry(item); // Retorna Group centrado
    case 'Pipe':
      return new THREE.CylinderGeometry( // Centrado por padrão
        item.radius || 0.2,
        item.radius || 0.2,
        item.height || 5, 
        16
      );
    case 'Valve':
      return createValveGeometry(item); // Retorna Group centrado
    case 'Sphere':
      return new THREE.SphereGeometry( // Centrado por padrão
        item.radius || 3,
        32,
        16 
      );
    case 'Vessel':
      // Para Vessels, a orientação é importante. A geometria do cilindro é sempre criada centrada.
      // A rotação para horizontal e o ajuste de Y para vertical (para que `item.position.y` seja a base)
      // são tratados em `createSingleEquipmentMesh` e/ou pelos dados de rotação do item.
      return new THREE.CylinderGeometry( 
        item.radius || 1,
        item.radius || 1,
        item.height || 3,
        32
      );
    case 'Pump':
      return createPumpGeometry(item); // Retorna Group centrado
    case 'Barge':
      return createBargeGeometry(item); // Retorna Group centrado
    case 'Ship':
      return createShipGeometry(item); // Retorna Group centrado
    case 'Terrain': 
      console.warn(`Tipo 'Terrain' não deve chamar createGeometryForItem. Será ignorado.`);
      return new THREE.BoxGeometry(0.001, 0.001, 0.001); 
    default:
      console.warn(`Geometria desconhecida para o tipo de equipamento: ${item.type}. Usando BoxGeometry padrão.`);
      return new THREE.BoxGeometry(1, 1, 1); // Centrado por padrão
  }
}
