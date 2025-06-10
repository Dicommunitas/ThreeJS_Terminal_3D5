
import * as THREE from 'three';
import type { Equipment } from '@/lib/types';

export function createTankGeometry(item: Equipment): THREE.Group {
  const group = new THREE.Group();
  const radius = item.radius || 2;
  const height = item.height || 4;

  // Material temporário, será substituído
  const tempMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, visible: false });

  const bodyGeo = new THREE.CylinderGeometry(radius, radius, height, 32);
  const bodyMesh = new THREE.Mesh(bodyGeo, tempMaterial.clone());
  group.add(bodyMesh);

  if (item.tankType === 'teto-fixo') {
    const roofHeight = radius * 0.5;
    const roofGeo = new THREE.ConeGeometry(radius, roofHeight, 32);
    const roofMesh = new THREE.Mesh(roofGeo, tempMaterial.clone());
    roofMesh.position.y = height / 2 + roofHeight / 2;
    group.add(roofMesh);
    // roofGeo.dispose(); // Não descarte aqui
  }
  // Adicionar lógica para 'teto-flutuante-externo' e 'teto-flutuante-interno' se necessário
  
  // bodyGeo.dispose(); // Não descarte aqui
  return group;
}
