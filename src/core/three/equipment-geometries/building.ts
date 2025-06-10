
import * as THREE from 'three';
import type { Equipment } from '@/lib/types';

/**
 * Cria a geometria para um equipamento do tipo 'Building'.
 * Retorna um THREE.Group contendo o corpo principal e detalhes do telhado.
 * O grupo é centrado em sua origem local.
 * @param {Equipment} item - O objeto do equipamento.
 * @returns {THREE.Group} O grupo contendo la geometria del edificio.
 */
export function createBuildingGeometry(item: Equipment): THREE.Group {
  const group = new THREE.Group();

  const width = item.size?.width || 5;
  const height = item.size?.height || 5;
  const depth = item.size?.depth || 5;

  const tempMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, visible: false });

  const bodyGeo = new THREE.BoxGeometry(width, height, depth);
  const bodyMesh = new THREE.Mesh(bodyGeo, tempMaterial);
  // bodyMesh.position.y = 0; // O corpo já está centrado na origem do grupo
  group.add(bodyMesh);

  const isTallBuilding = height > Math.max(width, depth) * 1.1; // Ajustado o multiplicador

  if (isTallBuilding) {
    const rooftopStructureHeight = height * 0.15;
    const rooftopStructureWidth = width * 0.7;
    const rooftopStructureDepth = depth * 0.7;

    const rooftopGeo = new THREE.BoxGeometry(rooftopStructureWidth, rooftopStructureHeight, rooftopStructureDepth);
    const rooftopMesh = new THREE.Mesh(rooftopGeo, tempMaterial.clone());
    rooftopMesh.position.y = height / 2 + rooftopStructureHeight / 2; // Posiciona no topo do corpo
    group.add(rooftopMesh);
  } else {
    const parapetHeight = Math.min(height * 0.05, 0.3);
    const parapetThickness = Math.min(width * 0.03, depth * 0.03, 0.15);

    const parapetTopY = height / 2 + parapetHeight / 2;

    const parapetFrontBackGeo = new THREE.BoxGeometry(width + parapetThickness * 2, parapetHeight, parapetThickness);
    const parapetFrontMesh = new THREE.Mesh(parapetFrontBackGeo, tempMaterial.clone());
    parapetFrontMesh.position.set(0, parapetTopY, depth / 2 + parapetThickness / 2);
    group.add(parapetFrontMesh);

    const parapetBackMesh = new THREE.Mesh(parapetFrontBackGeo, tempMaterial.clone());
    parapetBackMesh.position.set(0, parapetTopY, -depth / 2 - parapetThickness / 2);
    group.add(parapetBackMesh);

    const parapetSideGeo = new THREE.BoxGeometry(parapetThickness, parapetHeight, depth); // Profundidade total
    const parapetLeftMesh = new THREE.Mesh(parapetSideGeo, tempMaterial.clone());
    parapetLeftMesh.position.set(-width / 2 - parapetThickness / 2, parapetTopY, 0);
    group.add(parapetLeftMesh);

    const parapetRightMesh = new THREE.Mesh(parapetSideGeo, tempMaterial.clone());
    parapetRightMesh.position.set(width / 2 + parapetThickness / 2, parapetTopY, 0);
    group.add(parapetRightMesh);
  }

  return group;
}
