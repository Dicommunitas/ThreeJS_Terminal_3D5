
import * as THREE from 'three';
import type { Equipment } from '@/lib/types';

export function createShipGeometry(item: Equipment): THREE.Group {
  const group = new THREE.Group();
  const hullWidth = item.size?.width || 10;
  const hullHeight = item.size?.height || 4; // Altura total do corpo principal do casco
  const hullDepth = item.size?.depth || 40;

  const tempMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, visible: false });

  // Casco Principal (Corpo + Proa + Popa)
  // O casco principal será um BoxGeometry, e a proa/popa serão adicionadas
  const mainHullDepth = hullDepth * 0.75; // Corpo principal do casco
  const bowLength = hullDepth * 0.15;     // Comprimento da seção da proa
  const sternLength = hullDepth * 0.10;   // Comprimento da seção da popa

  const mainHullGeo = new THREE.BoxGeometry(hullWidth, hullHeight, mainHullDepth);
  const mainHullMesh = new THREE.Mesh(mainHullGeo, tempMaterial.clone());
  // O centro Y do mainHullMesh é 0 em relação ao group. Sua base estará em -hullHeight/2.
  group.add(mainHullMesh);

  // Seção da Proa (afunilada)
  const bowShape = new THREE.Shape();
  bowShape.moveTo(-hullWidth / 2, 0); // Canto inferior esquerdo da base da proa
  bowShape.lineTo(hullWidth / 2, 0);  // Canto inferior direito
  bowShape.lineTo(0, bowLength);        // Ponta da proa
  bowShape.closePath();

  const bowExtrudeSettings = { depth: hullHeight, bevelEnabled: false };
  const bowGeo = new THREE.ExtrudeGeometry(bowShape, bowExtrudeSettings);
  bowGeo.rotateX(-Math.PI / 2); // Deita a forma para alinhar com o casco
  const bowMesh = new THREE.Mesh(bowGeo, tempMaterial.clone());
  // Posiciona a base da proa na frente do casco principal
  // O centro Z do mainHullMesh está em 0. Sua frente está em mainHullDepth / 2.
  // O centro Z da bowMesh (após rotação) é o centro do seu "comprimento" (bowLength).
  // Queremos que a base da proa (seu Z=0 na forma 2D) encoste na frente do casco.
  bowMesh.position.set(0, 0, mainHullDepth / 2);
  group.add(bowMesh);

  // Seção da Popa (levemente afunilada)
  const sternShape = new THREE.Shape();
  const sternTaperWidth = hullWidth * 0.9; // Popa um pouco mais estreita
  sternShape.moveTo(-sternTaperWidth / 2, 0); // Canto inferior esquerdo da base da popa
  sternShape.lineTo(sternTaperWidth / 2, 0);  // Canto inferior direito
  sternShape.lineTo(hullWidth / 2, -sternLength);    // Canto superior direito da popa
  sternShape.lineTo(-hullWidth / 2, -sternLength);   // Canto superior esquerdo
  sternShape.closePath();

  const sternExtrudeSettings = { depth: hullHeight, bevelEnabled: false };
  const sternGeo = new THREE.ExtrudeGeometry(sternShape, sternExtrudeSettings);
  sternGeo.rotateX(-Math.PI / 2);
  const sternMesh = new THREE.Mesh(sternGeo, tempMaterial.clone());
  // Posiciona a base da popa atrás do casco principal
  sternMesh.position.set(0, 0, -mainHullDepth / 2);
  group.add(sternMesh);


  // Superestrutura (Movida para a Popa)
  const superstructureGroup = new THREE.Group();
  const ssMainWidth = hullWidth * 0.65;
  const ssMainDepth = hullDepth * 0.22;
  const ssMainHeight = hullHeight * 1.3;

  const ssMainGeo = new THREE.BoxGeometry(ssMainWidth, ssMainHeight, ssMainDepth);
  const ssMainMesh = new THREE.Mesh(ssMainGeo, tempMaterial.clone());
  ssMainMesh.position.y = ssMainHeight / 2; // Base deste bloco no Y=0 do superstructureGroup
  superstructureGroup.add(ssMainMesh);

  const bridgeWidth = ssMainWidth * 0.8;
  const bridgeDepth = ssMainDepth * 0.6;
  const bridgeHeight = hullHeight * 0.9;
  const bridgeGeo = new THREE.BoxGeometry(bridgeWidth, bridgeHeight, bridgeDepth);
  const bridgeMesh = new THREE.Mesh(bridgeGeo, tempMaterial.clone());
  bridgeMesh.position.set(0, ssMainHeight + bridgeHeight / 2, -ssMainDepth * 0.1); // Ponte sobre o bloco principal, levemente recuada
  superstructureGroup.add(bridgeMesh);

  // Posiciona a base da superestrutura sobre o convés (hullHeight / 2 do navio), na popa
  superstructureGroup.position.set(0, hullHeight / 2, -mainHullDepth / 2 + ssMainDepth / 2 - sternLength * 0.5);
  group.add(superstructureGroup);

  // Chaminé (posicionada sobre a superestrutura)
  const funnelRadius = ssMainWidth * 0.08;
  const funnelHeightRatio = 0.9; // Relativo à altura da ponte
  const actualFunnelHeight = bridgeHeight * funnelHeightRatio;

  const funnelGeo = new THREE.CylinderGeometry(funnelRadius, funnelRadius * 0.75, actualFunnelHeight, 10);
  const funnelMesh = new THREE.Mesh(funnelGeo, tempMaterial.clone());
  // Y: topo da ponte + metade da altura da chaminé. Z: parte traseira da ponte.
  funnelMesh.position.set(0, bridgeHeight + actualFunnelHeight / 2, -bridgeDepth * 0.2);
  bridgeMesh.add(funnelMesh); // Adiciona à ponte para que se mova com ela


  // Guindastes/Mastros do Convés (simplificados)
  const cranePostRadius = hullWidth * 0.025;
  const cranePostHeight = hullHeight * 1.6;
  const derrickLength = hullWidth * 0.25;
  const derrickRadius = cranePostRadius * 0.8;

  const cranePositions = [
    { x: -hullWidth * 0.20, z: mainHullDepth * 0.1 }, // À frente da superestrutura
    { x: hullWidth * 0.20, z: mainHullDepth * 0.1 },
  ];

  cranePositions.forEach(pos => {
    const craneAssembly = new THREE.Group();

    const postGeo = new THREE.CylinderGeometry(cranePostRadius, cranePostRadius, cranePostHeight, 8);
    const postMesh = new THREE.Mesh(postGeo, tempMaterial.clone());
    postMesh.position.y = cranePostHeight / 2;
    craneAssembly.add(postMesh);

    const derrickGeo = new THREE.CylinderGeometry(derrickRadius, derrickRadius, derrickLength, 6);
    const derrickMesh = new THREE.Mesh(derrickGeo, tempMaterial.clone());
    derrickMesh.position.set(0, cranePostHeight * 0.75, derrickLength / 2); // Pivô no poste
    derrickMesh.rotation.x = Math.PI / 5; // Angulado para cima
    craneAssembly.add(derrickMesh);

    craneAssembly.position.set(pos.x, hullHeight / 2, pos.z); // Base no convés
    group.add(craneAssembly);
  });

  // Castelo de Proa (pequena plataforma elevada na proa)
  const forecastleWidth = hullWidth * 0.7;
  const forecastleDepth = bowLength * 0.6;
  const forecastleHeightDeck = hullHeight * 0.25; // Altura da plataforma em si

  const forecastleGeo = new THREE.BoxGeometry(forecastleWidth, forecastleHeightDeck, forecastleDepth);
  const forecastleMesh = new THREE.Mesh(forecastleGeo, tempMaterial.clone());
  // Posiciona a base da plataforma sobre o convés da proa
  forecastleMesh.position.set(
    0,
    hullHeight / 2 + forecastleHeightDeck / 2, // Y da base + metade da altura da plataforma
    mainHullDepth / 2 + bowLength - forecastleDepth / 2 // Na ponta da proa
  );
  group.add(forecastleMesh);


  return group;
}
