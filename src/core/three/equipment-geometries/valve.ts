
import * as THREE from 'three';
import type { Equipment } from '@/lib/types';

export function createValveGeometry(item: Equipment): THREE.Group {
  const group = new THREE.Group();
  const radius = item.radius || 0.3;

  const tempMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, visible: false });

  // Corpo da válvula (esfera)
  const bodyGeo = new THREE.SphereGeometry(radius, 16, 12);
  const bodyMesh = new THREE.Mesh(bodyGeo, tempMaterial.clone());
  group.add(bodyMesh);

  // Conexões de tubulação (flanges simplificados)
  const flangeRadius = radius * 0.8;
  const flangeLength = radius * 0.5;
  const flangeGeo = new THREE.CylinderGeometry(flangeRadius, flangeRadius, flangeLength, 12);

  const flange1 = new THREE.Mesh(flangeGeo, tempMaterial.clone());
  flange1.position.z = radius + flangeLength / 2; // Conexão +Z
  flange1.rotation.x = Math.PI / 2;
  group.add(flange1);

  const flange2 = new THREE.Mesh(flangeGeo, tempMaterial.clone());
  flange2.position.z = -(radius + flangeLength / 2); // Conexão -Z
  flange2.rotation.x = Math.PI / 2;
  group.add(flange2);

  // Atuador/Volante
  const actuatorHeight = radius * 1.2;
  let actuatorMesh;

  if (item.actuationType === 'manual') {
    const wheelRadius = radius * 1.5;
    const wheelThickness = radius * 0.2;
    const wheelGeo = new THREE.TorusGeometry(wheelRadius, wheelThickness, 8, 12);
    actuatorMesh = new THREE.Mesh(wheelGeo, tempMaterial.clone());
    actuatorMesh.position.y = radius + wheelRadius * 0.2; // Posiciona o volante acima
    actuatorMesh.rotation.x = Math.PI / 2; // Deita o volante
  } else { // motorizada ou padrão
    const actuatorRadius = radius * 0.4;
    const actuatorBoxGeo = new THREE.BoxGeometry(actuatorRadius * 2, actuatorHeight, actuatorRadius * 2);
    actuatorMesh = new THREE.Mesh(actuatorBoxGeo, tempMaterial.clone());
    actuatorMesh.position.y = radius + actuatorHeight / 2;
  }
  group.add(actuatorMesh);

  return group;
}
