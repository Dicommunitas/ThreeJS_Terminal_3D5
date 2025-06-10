
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
 * Seleciona a geometria correta ou monta um grupo de geometrias
 * com base no `item.type` e utiliza as dimensões fornecidas no objeto `item`.
 * @param {Equipment} item - O objeto de equipamento contendo tipo e dimensões.
 * @returns {THREE.BufferGeometry | THREE.Group} A geometria ou grupo criado para o equipamento.
 *                                  Retorna um `BoxGeometry(1,1,1)` para tipos desconhecidos.
 */
export function createGeometryForItem(item: Equipment): THREE.BufferGeometry | THREE.Group {
  switch (item.type) {
    case 'Building':
      return createBuildingGeometry(item);
    case 'Crane':
      return new THREE.BoxGeometry(
        item.size?.width || 3,
        item.size?.height || 10,
        item.size?.depth || 3
      );
    case 'Tank':
      return createTankGeometry(item);
    case 'Pipe':
      return new THREE.CylinderGeometry(
        item.radius || 0.2,
        item.radius || 0.2,
        item.height || 5, // Para Pipe, height é o comprimento
        16
      );
    case 'Valve':
      return createValveGeometry(item);
    case 'Sphere':
      return new THREE.SphereGeometry(
        item.radius || 3,
        32,
        16 // Reduzido para performance, esferas não precisam de tantos segmentos verticais
      );
    case 'Vessel':
      // A orientação 'horizontal' deve ser tratada pela rotação do item nos dados iniciais
      return new THREE.CylinderGeometry(
        item.radius || 1,
        item.radius || 1,
        item.height || 3,
        32
      );
    case 'Pump':
      return createPumpGeometry(item);
    case 'Barge':
      return createBargeGeometry(item);
    case 'Ship':
      return createShipGeometry(item);
    case 'Terrain': // Terrain não deve gerar geometria aqui, é tratado separadamente
      console.warn(`Tipo 'Terrain' não deve chamar createGeometryForItem. Será ignorado.`);
      return new THREE.BoxGeometry(0.001, 0.001, 0.001); // Geometria mínima para evitar erros
    default:
      console.warn(`Geometria desconhecida para o tipo de equipamento: ${item.type}. Usando BoxGeometry padrão.`);
      return new THREE.BoxGeometry(1, 1, 1);
  }
}

