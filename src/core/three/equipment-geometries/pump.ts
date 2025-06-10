
import * as THREE from 'three';
import type { Equipment } from '@/lib/types';

export function createPumpGeometry(item: Equipment): THREE.Group {
  const group = new THREE.Group();
  const bodyWidth = item.size?.width || 0.6;
  const bodyHeight = item.size?.height || 0.6;
  const bodyDepth = item.size?.depth || 1.0;

  const tempMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, visible: false });

  // Corpo da bomba (carcaça)
  const bodyGeo = new THREE.BoxGeometry(bodyWidth, bodyHeight, bodyDepth);
  const bodyMesh = new THREE.Mesh(bodyGeo, tempMaterial.clone());
  // bodyMesh.position.y = 0; // Corpo centrado na origem do grupo
  group.add(bodyMesh);

  // Motor (cilindro ou caixa menor)
  const motorRadius = bodyWidth * 0.4;
  const motorLength = bodyDepth * 0.5;
  const motorGeo = new THREE.CylinderGeometry(motorRadius, motorRadius, motorLength, 16);
  const motorMesh = new THREE.Mesh(motorGeo, tempMaterial.clone());
  // Posiciona o motor na parte superior traseira do corpo da bomba
  motorMesh.position.set(0, bodyHeight / 2 + motorRadius * 0.2 , -bodyDepth / 2 + motorLength / 2);
  motorMesh.rotation.x = Math.PI / 2; // Deita o cilindro
  group.add(motorMesh);

  // Flange de sucção (frontal)
  const flangeRadius = bodyWidth * 0.3;
  const flangeThickness = bodyDepth * 0.1;
  const suctionFlangeGeo = new THREE.CylinderGeometry(flangeRadius, flangeRadius, flangeThickness, 16);
  const suctionFlangeMesh = new THREE.Mesh(suctionFlangeGeo, tempMaterial.clone());
  suctionFlangeMesh.position.set(0, 0, bodyDepth / 2 + flangeThickness / 2); // No centro Y do corpo, à frente
  suctionFlangeMesh.rotation.x = Math.PI / 2;
  group.add(suctionFlangeMesh);
  
  // Flange de descarga (topo)
  const dischargeFlangeGeo = new THREE.CylinderGeometry(flangeRadius * 0.8, flangeRadius * 0.8, flangeThickness, 16);
  const dischargeFlangeMesh = new THREE.Mesh(dischargeFlangeGeo, tempMaterial.clone());
  dischargeFlangeMesh.position.set(0, bodyHeight / 2 + flangeThickness / 2, 0); // No centro X/Z do corpo, no topo
  // dischargeFlangeMesh.rotation.y = Math.PI / 2; // Rotação não necessária para o topo
  group.add(dischargeFlangeMesh);

  return group;
}
