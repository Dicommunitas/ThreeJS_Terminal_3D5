
import * as THREE from 'three';
import type { Equipment } from '@/lib/types';

export function createValveGeometry(item: Equipment): THREE.Group {
  const group = new THREE.Group();
  const radius = item.radius || 0.3;

  // Material temporário, será substituído
  const tempMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, visible: false });

  const bodyGeo = new THREE.SphereGeometry(radius, 16, 16);
  const bodyMesh = new THREE.Mesh(bodyGeo, tempMaterial.clone());
  group.add(bodyMesh);

  const actuatorRadius = radius * 0.5;
  const actuatorHeight = radius * 1.5;
  const actuatorGeo = new THREE.CylinderGeometry(actuatorRadius, actuatorRadius, actuatorHeight, 8);
  const actuatorMesh = new THREE.Mesh(actuatorGeo, tempMaterial.clone());
  actuatorMesh.position.y = radius + actuatorHeight / 2;
  group.add(actuatorMesh);

  // bodyGeo.dispose();
  // actuatorGeo.dispose();
  return group;
}
