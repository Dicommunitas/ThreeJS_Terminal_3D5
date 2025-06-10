
import * as THREE from 'three';
import type { Equipment } from '@/lib/types';
import { createBollardsGroup, createFendersGroup } from '../geometry-subcomponents';

export function createBargeGeometry(item: Equipment): THREE.Group {
  const group = new THREE.Group();
  const hullWidth = item.size?.width || 8;
  const hullHeight = item.size?.height || 1.5;
  const hullDepth = item.size?.depth || 20;

  const tempMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, visible: false });

  const hullGeo = new THREE.BoxGeometry(hullWidth, hullHeight, hullDepth);
  const hullMesh = new THREE.Mesh(hullGeo, tempMaterial);
  // hullMesh.position.y = 0; // Casco centrado na origem do grupo
  group.add(hullMesh);

  // Pequena cabine de controle
  const cabinWidth = hullWidth * 0.3;
  const cabinHeight = hullHeight * 0.8;
  const cabinDepth = hullDepth * 0.1;
  const cabinGeo = new THREE.BoxGeometry(cabinWidth, cabinHeight, cabinDepth);
  const cabinMesh = new THREE.Mesh(cabinGeo, tempMaterial.clone());
  cabinMesh.position.set(0, hullHeight / 2 + cabinHeight / 2, -hullDepth / 2 + cabinDepth / 2 + hullDepth * 0.05);
  group.add(cabinMesh);


  const bollards = createBollardsGroup({
    parentWidth: hullWidth,
    parentDepth: hullDepth,
    parentHeight: hullHeight, // Usado para proporção
    countPerSide: Math.max(2, Math.floor(hullDepth / 6) + 1),
    bollardRadiusRatio: 0.025, // Maiores para barcaças
    bollardHeightRatio: 0.2, // Proporcionalmente mais altos
    yOffset: hullHeight/2, // No nível do convés
  });
  group.add(bollards);

  const fenders = createFendersGroup({
    parentWidth: hullWidth,
    parentDepth: hullDepth,
    parentHeight: hullHeight,
    countPerSide: Math.max(2, Math.floor(hullDepth / 5)),
    fenderRadiusRatio: 0.18,
    fenderTubeRatio: 0.22,
    yOffset: 0, // Fenders são posicionados no centro Y do casco
  });
  group.add(fenders);

  return group;
}
