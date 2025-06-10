
import * as THREE from 'three';
import type { Equipment } from '@/lib/types';
import { createBollardsGroup, createFendersGroup } from '../geometry-subcomponents';

export function createBargeGeometry(item: Equipment): THREE.Group {
  const group = new THREE.Group();
  const hullWidth = item.size?.width || 8;
  const hullHeight = item.size?.height || 1.5;
  const hullDepth = item.size?.depth || 20;

  const hullGeo = new THREE.BoxGeometry(hullWidth, hullHeight, hullDepth);
  // Material temporário, será substituído
  const tempMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, visible: false });
  const hullMesh = new THREE.Mesh(hullGeo, tempMaterial);
  group.add(hullMesh);

  const bollards = createBollardsGroup({
    parentWidth: hullWidth,
    parentDepth: hullDepth,
    parentHeight: hullHeight,
    countPerSide: Math.max(2, Math.floor(hullDepth / 5) + 1),
    bollardRadiusRatio: 0.03,
    bollardHeightRatio: 0.4,
    yOffset: 0,
  });
  group.add(bollards);

  const fenders = createFendersGroup({
    parentWidth: hullWidth,
    parentDepth: hullDepth,
    parentHeight: hullHeight,
    countPerSide: Math.max(2, Math.floor(hullDepth / 6)),
    fenderRadiusRatio: 0.20,
    fenderTubeRatio: 0.25,
    yOffset: 0,
  });
  group.add(fenders);

  // hullGeo.dispose(); // Não descarte aqui, pois a malha ainda está usando
  return group;
}
