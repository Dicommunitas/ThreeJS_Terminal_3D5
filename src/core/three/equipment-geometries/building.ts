
import * as THREE from 'three';
import type { Equipment } from '@/lib/types';

/**
 * Cria a geometria para um equipamento do tipo 'Building'.
 * Retorna um THREE.Group contendo o corpo principal e detalhes do telhado.
 * @param {Equipment} item - O objeto do equipamento.
 * @returns {THREE.Group} O grupo contendo a geometria do prédio.
 */
export function createBuildingGeometry(item: Equipment): THREE.Group {
  const group = new THREE.Group();

  const width = item.size?.width || 5;
  const height = item.size?.height || 5;
  const depth = item.size?.depth || 5;

  // Material temporário, será substituído na lógica de renderização principal
  const tempMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, visible: false });

  // Corpo principal do prédio
  const bodyGeo = new THREE.BoxGeometry(width, height, depth);
  const bodyMesh = new THREE.Mesh(bodyGeo, tempMaterial);
  // O corpo é posicionado na origem do grupo.
  // O grupo em si será posicionado de forma que a base do prédio (y=0 do corpo)
  // corresponda a item.position.y no mundo.
  // Isso significa que o grupo será posicionado em:
  // item.position.x, item.position.y + height / 2, item.position.z
  // E o bodyMesh fica em 0,0,0 localmente no grupo.
  group.add(bodyMesh);

  // Adiciona detalhes ao telhado
  const isTallBuilding = height > Math.max(width, depth) * 1.2;

  if (isTallBuilding) {
    // Para prédios altos, adiciona uma estrutura elevada no telhado
    const rooftopStructureHeight = height * 0.2;
    const rooftopStructureWidth = width * 0.6;
    const rooftopStructureDepth = depth * 0.6;

    const rooftopGeo = new THREE.BoxGeometry(rooftopStructureWidth, rooftopStructureHeight, rooftopStructureDepth);
    const rooftopMesh = new THREE.Mesh(rooftoGeo, tempMaterial.clone());
    // Posiciona no topo do corpo principal
    rooftopMesh.position.y = height / 2 + rooftopStructureHeight / 2;
    group.add(rooftopMesh);
  } else {
    // Para prédios mais baixos/largos, adiciona um parapeito
    const parapetHeight = Math.min(height * 0.1, 0.5); // Altura do parapeito
    const parapetThickness = Math.min(width * 0.05, depth * 0.05, 0.2); // Espessura do parapeito

    // Parapeito frontal e traseiro
    const parapetFrontBackGeo = new THREE.BoxGeometry(width + parapetThickness * 2, parapetHeight, parapetThickness);
    const parapetFrontMesh = new THREE.Mesh(parapetFrontBackGeo, tempMaterial.clone());
    parapetFrontMesh.position.set(0, height / 2 + parapetHeight / 2, depth / 2 + parapetThickness / 2);
    group.add(parapetFrontMesh);

    const parapetBackMesh = new THREE.Mesh(parapetFrontBackGeo, tempMaterial.clone());
    parapetBackMesh.position.set(0, height / 2 + parapetHeight / 2, -depth / 2 - parapetThickness / 2);
    group.add(parapetBackMesh);

    // Parapeito lateral esquerdo e direito
    const parapetSideGeo = new THREE.BoxGeometry(parapetThickness, parapetHeight, depth);
    const parapetLeftMesh = new THREE.Mesh(parapetSideGeo, tempMaterial.clone());
    parapetLeftMesh.position.set(-width / 2 - parapetThickness / 2, height / 2 + parapetHeight / 2, 0);
    group.add(parapetLeftMesh);

    const parapetRightMesh = new THREE.Mesh(parapetSideGeo, tempMaterial.clone());
    parapetRightMesh.position.set(width / 2 + parapetThickness / 2, height / 2 + parapetHeight / 2, 0);
    group.add(parapetRightMesh);
  }

  return group;
}
