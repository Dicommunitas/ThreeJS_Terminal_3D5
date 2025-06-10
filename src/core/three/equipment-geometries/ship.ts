
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
  const bowPointiness = hullDepth * 0.2; 

  hullShape.moveTo(-hw, -hd);
  hullShape.lineTo(-hw, hd - bowPointiness); 
  hullShape.quadraticCurveTo(-hw, hd, 0, hd); 
  hullShape.quadraticCurveTo(hw, hd, hw, hd - bowPointiness); 
  hullShape.lineTo(hw, -hd); 
  hullShape.closePath();

  const extrudeSettings = {
    steps: 1,
    depth: hullHeight,
    bevelEnabled: false,
  };
  const hullGeo = new THREE.ExtrudeGeometry(hullShape, extrudeSettings);
  hullGeo.rotateX(-Math.PI / 2); 
  
  const hullMesh = new THREE.Mesh(hullGeo, tempMaterial.clone());
  group.add(hullMesh);


  // Superestrutura
  const superstructureGroup = new THREE.Group();
  const mainBlockWidth = hullWidth * 0.6;
  const mainBlockHeight = hullHeight * 1.8; 
  const mainBlockDepth = hullDepth * 0.25;
  const mainBlockGeo = new THREE.BoxGeometry(mainBlockWidth, mainBlockHeight, mainBlockDepth);
  const mainBlockMesh = new THREE.Mesh(mainBlockGeo, tempMaterial.clone());
  mainBlockMesh.position.y = mainBlockHeight / 2; 
  
  const bridgeBlockWidth = mainBlockWidth * 0.85;
  const bridgeBlockHeightAddition = mainBlockHeight * 0.5; 
  const bridgeBlockDepth = mainBlockDepth * 0.7;
  const bridgeBlockGeo = new THREE.BoxGeometry(bridgeBlockWidth, bridgeBlockHeightAddition, bridgeBlockDepth);
  const bridgeBlockMesh = new THREE.Mesh(bridgeBlockGeo, tempMaterial.clone());
  bridgeBlockMesh.position.y = mainBlockHeight / 2 + bridgeBlockHeightAddition / 2; 
  mainBlockMesh.add(bridgeBlockMesh);

  superstructureGroup.add(mainBlockMesh);
  superstructureGroup.position.set(0, hullHeight / 2, -hullDepth * 0.15); 
  group.add(superstructureGroup);

  // Castelo de Proa
  const forecastleWidth = hullWidth * 0.9;
  const forecastleHeight = hullHeight * 0.4;
  const forecastleDepth = hullDepth * 0.18;
  const forecastleGeo = new THREE.BoxGeometry(forecastleWidth, forecastleHeight, forecastleDepth);
  const forecastleMesh = new THREE.Mesh(forecastleGeo, tempMaterial.clone());
  forecastleMesh.position.set(0, hullHeight / 2 + forecastleHeight / 2, hullDepth / 2 - forecastleDepth / 2 - bowPointiness * 0.3);
  group.add(forecastleMesh);

  // Guindastes/Mastros Simplificados
  const cranePositions = [
    { x: -hullWidth * 0.2, z: hullDepth * 0.25 },
    { x: hullWidth * 0.2, z: hullDepth * 0.25 },
    { x: -hullWidth * 0.2, z: -hullDepth * 0.05 },
    { x: hullWidth * 0.2, z: -hullDepth * 0.05 },
  ];

  const postRadius = hullWidth * 0.03;
  const postHeight = hullHeight * 1.5;
  const armLength = hullWidth * 0.15; // Length of the horizontal arm
  const armRadius = postRadius * 0.8;

  cranePositions.forEach(pos => {
    const craneGroup = new THREE.Group();

    // Vertical Post
    const postGeo = new THREE.CylinderGeometry(postRadius, postRadius, postHeight, 8);
    const postMesh = new THREE.Mesh(postGeo, tempMaterial.clone());
    postMesh.position.y = postHeight / 2; // Base of post at (0,0,0) of craneGroup
    craneGroup.add(postMesh);

    // Horizontal Arm
    const armGeo = new THREE.CylinderGeometry(armRadius, armRadius, armLength, 8);
    const armMesh = new THREE.Mesh(armGeo, tempMaterial.clone());
    armMesh.position.set(0, postHeight * 0.9, armLength / 2); // Position arm near top of post, extending forward (local +Z)
    armMesh.rotation.x = Math.PI / 2; // Lay cylinder flat along Z
    craneGroup.add(armMesh);
    
    craneGroup.position.set(pos.x, hullHeight / 2, pos.z); // Position base of crane on deck
    group.add(craneGroup);
  });

  // Chaminé
  const funnelRadius = hullWidth * 0.08;
  const funnelEffectiveHeight = hullHeight * 1.2; // Total height of the funnel structure

  const funnelGroup = new THREE.Group();
  const funnelBaseHeight = funnelEffectiveHeight * 0.85;
  const funnelBaseGeo = new THREE.CylinderGeometry(funnelRadius, funnelRadius * 0.9, funnelBaseHeight, 16);
  const funnelBaseMesh = new THREE.Mesh(funnelBaseGeo, tempMaterial.clone());
  // BaseMesh is at the origin of funnelGroup, its own center is at y=0 of funnelGroup
  funnelGroup.add(funnelBaseMesh);

  const funnelCapRadius = funnelRadius * 1.15;
  const funnelCapHeight = funnelEffectiveHeight * 0.15;
  const funnelCapGeo = new THREE.CylinderGeometry(funnelCapRadius, funnelCapRadius, funnelCapHeight, 16);
  const funnelCapMesh = new THREE.Mesh(funnelCapGeo, tempMaterial.clone());
  funnelCapMesh.position.y = funnelBaseHeight / 2 + funnelCapHeight / 2; // Cap on top of base
  funnelGroup.add(funnelCapMesh);

  // Position the entire funnel group relative to the superstructure
  // The superstructure's mainBlockMesh top is at mainBlockMesh.position.y + mainBlockHeight / 2
  // We want the base of the funnelGroup (which is the center of funnelBaseMesh) to be on top of that.
  const superstructureTopY = mainBlockMesh.position.y + mainBlockHeight / 2;
  funnelGroup.position.set(
    0, 
    superstructureTopY + (funnelBaseHeight / 2), // Place center of funnelBaseMesh (origin of funnelGroup) on top of superstructure
    mainBlockMesh.position.z - mainBlockDepth / 2 - funnelRadius - funnelCapRadius*0.5 // Slightly behind the main block
  );
  superstructureGroup.add(funnelGroup);


  const bollards = createBollardsGroup({
    parentWidth: hullWidth,
    parentDepth: hullDepth,
    parentHeight: hullHeight, 
    countPerSide: Math.max(4, Math.floor(hullDepth / 7) + 1),
    bollardRadiusRatio: 0.015,
    bollardHeightRatio: 0.1, 
    yOffset: hullHeight / 2, 
  });
  group.add(bollards);
  
  return group;
}

