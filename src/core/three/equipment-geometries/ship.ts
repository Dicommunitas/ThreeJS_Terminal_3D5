
import * as THREE from 'three';
import type { Equipment } from '@/lib/types';
// import { createBollardsGroup } from '../geometry-subcomponents'; // Removido pois os bollards do navio serão removidos

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

  // V-shape bow
  hullShape.moveTo(-hw, -hd * 0.9); // Stern port (um pouco para dentro para um casco mais afilado na popa)
  hullShape.lineTo(hw, -hd * 0.9);  // Stern starboard
  hullShape.lineTo(hw, hd * 0.5); // Bow curve start starboard (mid-ship)
  hullShape.lineTo(0, hd);        // Bow tip (sharpest point)
  hullShape.lineTo(-hw, hd * 0.5); // Bow curve start port (mid-ship)
  hullShape.closePath(); // Back to stern port

  const extrudeSettings = {
    steps: 1,
    depth: hullHeight,
    bevelEnabled: false,
  };
  const hullGeo = new THREE.ExtrudeGeometry(hullShape, extrudeSettings);
  hullGeo.rotateX(-Math.PI / 2);

  const hullMesh = new THREE.Mesh(hullGeo, tempMaterial.clone());
  // hullMesh.position.y = 0; // Casco centrado na origem Y do grupo, base ficará em -hullHeight/2
  group.add(hullMesh);

  // Superestrutura (dois blocos) - Movida para a popa
  const superstructureGroup = new THREE.Group();
  const mainBlockWidth = hullWidth * 0.6;
  const mainBlockHeight = hullHeight * 1.5;
  const mainBlockDepth = hullDepth * 0.20;
  const mainBlockGeo = new THREE.BoxGeometry(mainBlockWidth, mainBlockHeight, mainBlockDepth);
  const mainBlockMesh = new THREE.Mesh(mainBlockGeo, tempMaterial.clone());
  mainBlockMesh.position.y = mainBlockHeight / 2; // Base do mainBlock no nível Y=0 do superstructureGroup

  const bridgeBlockWidth = mainBlockWidth * 0.85;
  const bridgeBlockHeightAddition = mainBlockHeight * 0.6;
  const bridgeBlockDepth = mainBlockDepth * 0.7;
  const bridgeBlockGeo = new THREE.BoxGeometry(bridgeBlockWidth, bridgeBlockHeightAddition, bridgeBlockDepth);
  const bridgeBlockMesh = new THREE.Mesh(bridgeBlockGeo, tempMaterial.clone());
  // Posiciona o bridge em cima do mainBlock
  bridgeBlockMesh.position.y = mainBlockHeight + bridgeBlockHeightAddition / 2;
  superstructureGroup.add(mainBlockMesh);
  superstructureGroup.add(bridgeBlockMesh);

  // Posiciona a base do superstructureGroup no convés do navio, na popa
  // O Z negativo move para a popa. -hd é a extremidade da popa.
  // Adicionamos mainBlockDepth / 2 para alinhar a parte de trás da superestrutura com a popa.
  superstructureGroup.position.set(0, hullHeight / 2, -hd + mainBlockDepth / 2 + hullDepth * 0.05); // Ajustado para popa
  group.add(superstructureGroup);

  // Castelo de Proa (mantido, pois é uma estrutura separada da superestrutura principal)
  const forecastleWidth = hullWidth * 0.85;
  const forecastleHeight = hullHeight * 0.4;
  const forecastleDepth = hullDepth * 0.15;
  const forecastleGeo = new THREE.BoxGeometry(forecastleWidth, forecastleHeight, forecastleDepth);
  const forecastleMesh = new THREE.Mesh(forecastleGeo, tempMaterial.clone());
  forecastleMesh.position.set(0, hullHeight / 2 + forecastleHeight / 2, hd - forecastleDepth / 2 - hullDepth*0.05);
  group.add(forecastleMesh);

  // Guindastes/Mastros Melhorados (ajustar posições se necessário, após mover superestrutura)
  const cranePositions = [
    { x: -hullWidth * 0.22, z: hullDepth * 0.10 }, // Mais para o centro e para frente da superestrutura (que agora está na popa)
    { x: hullWidth * 0.22, z: hullDepth * 0.10 },
  ];

  const postRadius = hullWidth * 0.025;
  const postHeight = hullHeight * 1.3;
  const boomLength = hullWidth * 0.20;
  const boomRadius = postRadius * 0.9;
  const winchBaseSize = postRadius * 5;
  const winchBaseHeight = postHeight * 0.08;


  cranePositions.forEach(pos => {
    const craneGroup = new THREE.Group();

    const winchBaseGeo = new THREE.BoxGeometry(winchBaseSize, winchBaseHeight, winchBaseSize);
    const winchBaseMesh = new THREE.Mesh(winchBaseGeo, tempMaterial.clone());
    winchBaseMesh.position.y = winchBaseHeight / 2;
    craneGroup.add(winchBaseMesh);

    const postGeo = new THREE.CylinderGeometry(postRadius, postRadius, postHeight, 8);
    const postMesh = new THREE.Mesh(postGeo, tempMaterial.clone());
    postMesh.position.y = winchBaseHeight + postHeight / 2;
    craneGroup.add(postMesh);

    const boomGeo = new THREE.CylinderGeometry(boomRadius, boomRadius * 0.7, boomLength, 8);
    const boomMesh = new THREE.Mesh(boomGeo, tempMaterial.clone());
    const boomAngle = Math.PI / 7;
    boomMesh.position.set(
        0,
        winchBaseHeight + postHeight * 0.9,
        boomLength / 2 * Math.cos(boomAngle)
    );
    boomMesh.rotation.x = Math.PI / 2 - boomAngle;
    craneGroup.add(boomMesh);

    craneGroup.position.set(pos.x, hullHeight / 2, pos.z);
    group.add(craneGroup);
  });

  // Chaminé
  const funnelRadius = hullWidth * 0.06;
  const funnelEffectiveHeight = mainBlockHeight * 0.7;
  const funnelBaseHeight = funnelEffectiveHeight * 0.8;
  const funnelCapHeight = funnelEffectiveHeight * 0.2;
  const funnelCapRadius = funnelRadius * 1.2;

  const funnelGroup = new THREE.Group();
  const funnelBaseGeo = new THREE.CylinderGeometry(funnelRadius, funnelRadius * 0.9, funnelBaseHeight, 12);
  const funnelBaseMesh = new THREE.Mesh(funnelBaseGeo, tempMaterial.clone());
  funnelBaseMesh.position.y = funnelBaseHeight / 2; // Base da chaminé no nível 0 do funnelGroup
  funnelGroup.add(funnelBaseMesh);

  const funnelCapGeo = new THREE.CylinderGeometry(funnelCapRadius, funnelCapRadius, funnelCapHeight, 12);
  const funnelCapMesh = new THREE.Mesh(funnelCapGeo, tempMaterial.clone());
  funnelCapMesh.position.y = funnelBaseHeight + funnelCapHeight / 2; // Tampa sobre a base
  funnelGroup.add(funnelCapMesh);

  // Posiciona a base do funnelGroup sobre o bloco mais alto da superestrutura
  // A Y da superstructureGroup já é hullHeight / 2 (nível do convés).
  // mainBlockMesh está em Y = mainBlockHeight / 2 dentro do superstructureGroup.
  // bridgeBlockMesh está em Y = mainBlockHeight + bridgeBlockHeightAddition / 2 dentro do superstructureGroup.
  // O topo do bridgeBlock está em Y = mainBlockHeight + bridgeBlockHeightAddition dentro do superstructureGroup.
  // Então, a base da chaminé (funnelGroup) deve estar em Y = (mainBlockHeight + bridgeBlockHeightAddition) no superstructureGroup.
  funnelGroup.position.set(
    0,
    mainBlockHeight + bridgeBlockHeightAddition, // Base da chaminé no topo do bloco da ponte
    -mainBlockDepth * 0.25 // Um pouco atrás no bloco da ponte
  );
  superstructureGroup.add(funnelGroup);

  // Remoção dos Bollards do Navio - conforme solicitado
  // const bollards = createBollardsGroup({
  //   parentWidth: hullWidth,
  //   parentDepth: hullDepth,
  //   parentHeight: hullHeight,
  //   countPerSide: Math.max(4, Math.floor(hullDepth / 7) + 1),
  //   bollardRadiusRatio: 0.018,
  //   bollardHeightRatio: 0.08,
  //   yOffset: hullHeight / 2,
  // });
  // group.add(bollards);

  return group;
}
