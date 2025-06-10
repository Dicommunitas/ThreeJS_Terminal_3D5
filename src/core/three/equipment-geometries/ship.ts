
import * as THREE from 'three';
import type { Equipment } from '@/lib/types';
import { createBollardsGroup } from '../geometry-subcomponents';

export function createShipGeometry(item: Equipment): THREE.Group {
  const group = new THREE.Group();
  const hullWidth = item.size?.width || 10;
  const hullHeight = item.size?.height || 4; 
  const hullDepth = item.size?.depth || 40; 

  const tempMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, visible: false });

  // Casco Principal
  const hullShape = new THREE.Shape();
  const hw = hullWidth / 2;
  const hd = hullDepth / 2;
  const bowPointiness = hullDepth * 0.2; // Quão "pontuda" é a proa

  hullShape.moveTo(-hw, -hd);
  hullShape.lineTo(-hw, hd - bowPointiness); // Início da curva da proa
  hullShape.quadraticCurveTo(-hw, hd, 0, hd); // Curva da proa (lado esquerdo)
  hullShape.quadraticCurveTo(hw, hd, hw, hd - bowPointiness); // Curva da proa (lado direito)
  hullShape.lineTo(hw, -hd); // Popa
  hullShape.closePath();

  const extrudeSettings = {
    steps: 1,
    depth: hullHeight,
    bevelEnabled: false,
  };
  const hullGeo = new THREE.ExtrudeGeometry(hullShape, extrudeSettings);
  hullGeo.rotateX(-Math.PI / 2); // Deita a extrusão para formar o casco
  hullGeo.translate(0, 0, 0); // Centro da extrusão já está na origem XY, Z precisa ser ajustado

  const hullMesh = new THREE.Mesh(hullGeo, tempMaterial.clone());
  // O centro da geometria extrudada está em (0,0, depth/2).
  // Precisamos que o centro do grupo seja (0,0,0) para a altura.
  // E a posição do item.position.y seja a base.
  // A malha do casco é adicionada na origem do grupo
  group.add(hullMesh);


  // Superestrutura
  const superstructureGroup = new THREE.Group();
  const mainBlockWidth = hullWidth * 0.6;
  const mainBlockHeight = hullHeight * 1.8; 
  const mainBlockDepth = hullDepth * 0.25;
  const mainBlockGeo = new THREE.BoxGeometry(mainBlockWidth, mainBlockHeight, mainBlockDepth);
  const mainBlockMesh = new THREE.Mesh(mainBlockGeo, tempMaterial.clone());
  mainBlockMesh.position.y = mainBlockHeight / 2; // Base do bloco sobre o convés (local Y=0 do grupo)
  
  const bridgeBlockWidth = mainBlockWidth * 0.85;
  const bridgeBlockHeightAddition = mainBlockHeight * 0.5; 
  const bridgeBlockDepth = mainBlockDepth * 0.7;
  const bridgeBlockGeo = new THREE.BoxGeometry(bridgeBlockWidth, bridgeBlockHeightAddition, bridgeBlockDepth);
  const bridgeBlockMesh = new THREE.Mesh(bridgeBlockGeo, tempMaterial.clone());
  bridgeBlockMesh.position.y = mainBlockHeight / 2 + bridgeBlockHeightAddition / 2; // Ponte sobre o bloco principal
  mainBlockMesh.add(bridgeBlockMesh);

  superstructureGroup.add(mainBlockMesh);
  superstructureGroup.position.set(0, hullHeight / 2, -hullDepth * 0.15); // Na parte traseira
  group.add(superstructureGroup);

  // Castelo de Proa
  const forecastleWidth = hullWidth * 0.9;
  const forecastleHeight = hullHeight * 0.4;
  const forecastleDepth = hullDepth * 0.18;
  const forecastleGeo = new THREE.BoxGeometry(forecastleWidth, forecastleHeight, forecastleDepth);
  const forecastleMesh = new THREE.Mesh(forecastleGeo, tempMaterial.clone());
  forecastleMesh.position.set(0, hullHeight / 2 + forecastleHeight / 2, hullDepth / 2 - forecastleDepth / 2 - bowPointiness * 0.3);
  group.add(forecastleMesh);

  // Guindastes/Mastros Simplificados (cilindros)
  const craneRadius = hullWidth * 0.03;
  const craneHeight = hullHeight * 2.5;
  const craneGeo = new THREE.CylinderGeometry(craneRadius, craneRadius * 0.8, craneHeight, 12);
  
  const cranePositions = [
    { x: -hullWidth * 0.2, z: hullDepth * 0.25 },
    { x: hullWidth * 0.2, z: hullDepth * 0.25 },
    { x: -hullWidth * 0.2, z: -hullDepth * 0.05 },
    { x: hullWidth * 0.2, z: -hullDepth * 0.05 },
  ];

  cranePositions.forEach(pos => {
    const craneMesh = new THREE.Mesh(craneGeo, tempMaterial.clone());
    craneMesh.position.set(pos.x, hullHeight / 2 + craneHeight / 2, pos.z);
    group.add(craneMesh);
  });

  // Chaminé
  const funnelRadius = hullWidth * 0.08;
  const funnelHeight = hullHeight * 1.2;
  const funnelGeo = new THREE.CylinderGeometry(funnelRadius, funnelRadius * 0.9, funnelHeight, 16);
  const funnelMesh = new THREE.Mesh(funnelGeo, tempMaterial.clone());
  // Posiciona chaminé atrás da superestrutura principal
  funnelMesh.position.set(0, (mainBlockMesh.position.y + mainBlockHeight/2) + funnelHeight/2, mainBlockMesh.position.z - mainBlockDepth/2 - funnelRadius);
  superstructureGroup.add(funnelMesh);


  const bollards = createBollardsGroup({
    parentWidth: hullWidth,
    parentDepth: hullDepth,
    parentHeight: hullHeight, // Usado para proporção do cabeço
    countPerSide: Math.max(4, Math.floor(hullDepth / 7) + 1),
    bollardRadiusRatio: 0.015,
    bollardHeightRatio: 0.1, // Altura do cabeço (proporcional à altura do casco)
    yOffset: hullHeight / 2, // No nível do convés
  });
  group.add(bollards);
  
  // Certifique-se que o grupo esteja centrado na origem para que o posicionamento em `createSingleEquipmentMesh` funcione como esperado.
  // A geometria extrudada já está centrada em X e Z pela forma, e Y será ajustado pelo posicionamento do grupo.
  return group;
}
