
import * as THREE from 'three';
import type { Equipment } from '@/lib/types';

export function createPumpGeometry(item: Equipment): THREE.Group {
  const group = new THREE.Group();
  const bodyWidth = item.size?.width || 0.8;
  const bodyHeight = item.size?.height || 0.8;
  const bodyDepth = item.size?.depth || 1.2;

  // Material temporário, será substituído
  const tempMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, visible: false });

  const bodyGeo = new THREE.BoxGeometry(bodyWidth, bodyHeight, bodyDepth);
  const bodyMesh = new THREE.Mesh(bodyGeo, tempMaterial.clone());
  group.add(bodyMesh);

  const motorSize = bodyHeight * 0.6;
  const motorGeo = new THREE.BoxGeometry(motorSize, motorSize, motorSize);
  const motorMesh = new THREE.Mesh(motorGeo, tempMaterial.clone());
  motorMesh.position.set(0, bodyHeight / 2 + motorSize / 2, 0);
  group.add(motorMesh);

  // bodyGeo.dispose();
  // motorGeo.dispose();
  return group;
}
