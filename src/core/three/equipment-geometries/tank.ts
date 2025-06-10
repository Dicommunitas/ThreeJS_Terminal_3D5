
import * as THREE from 'three';
import type { Equipment } from '@/lib/types';

export function createTankGeometry(item: Equipment): THREE.Group {
  const group = new THREE.Group();
  const radius = item.radius || 2;
  const height = item.height || 4;

  const tempMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, visible: false });

  const bodyGeo = new THREE.CylinderGeometry(radius, radius, height, 32);
  const bodyMesh = new THREE.Mesh(bodyGeo, tempMaterial.clone());
  // bodyMesh.position.y = 0; // O corpo já é centrado na origem do grupo
  group.add(bodyMesh);

  if (item.tankType === 'teto-fixo') {
    const roofHeight = radius * 0.3; // Telhado cônico mais baixo
    const roofGeo = new THREE.ConeGeometry(radius, roofHeight, 32);
    const roofMesh = new THREE.Mesh(roofGeo, tempMaterial.clone());
    roofMesh.position.y = height / 2 + roofHeight / 2; // Posiciona no topo do corpo
    group.add(roofMesh);
  } else if (item.tankType === 'teto-flutuante-interno' || item.tankType === 'teto-flutuante-externo') {
    // Representação simplificada de teto flutuante como um disco no topo ou levemente para dentro
    const floatingRoofHeight = height * 0.05; // Bem fino
    const floatingRoofRadius = radius * 0.95; // Ligeiramente menor que o tanque
    const floatingRoofGeo = new THREE.CylinderGeometry(floatingRoofRadius, floatingRoofRadius, floatingRoofHeight, 32);
    const floatingRoofMesh = new THREE.Mesh(floatingRoofGeo, tempMaterial.clone());
    // Posição do teto flutuante (pode ser ajustada com base no nível do produto no futuro)
    floatingRoofMesh.position.y = height / 2 - floatingRoofHeight / 2 - (height * 0.02); // Um pouco abaixo do topo
    group.add(floatingRoofMesh);
  }
  // else, sem teto específico (topo aberto ou outro tipo)
  
  return group;
}
