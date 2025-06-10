
import * as THREE from 'three';
import type { Equipment } from '@/lib/types';
import { createBollardsGroup } from '../geometry-subcomponents';

export function createShipGeometry(item: Equipment): THREE.Group {
  const group = new THREE.Group();
  const hullWidth = item.size?.width || 10;
  const hullHeight = item.size?.height || 4; // Altura do casco principal (da linha d'água ao convés principal)
  const hullDepth = item.size?.depth || 40; // Comprimento do navio

  // Material temporário, será substituído pela lógica de renderização principal
  const tempMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, visible: false });

  // 1. Casco Principal
  // A posição Y do item.position define o centro vertical do casco.
  // O convés principal estará em item.position.y + hullHeight / 2.
  const hullGeo = new THREE.BoxGeometry(hullWidth, hullHeight, hullDepth);
  const hullMesh = new THREE.Mesh(hullGeo, tempMaterial.clone());
  // A malha do casco é adicionada ao grupo na origem do grupo.
  // A posição global do navio (item.position) será aplicada ao 'group' em createSingleEquipmentMesh.
  group.add(hullMesh);

  const deckLevelY = hullHeight / 2; // Nível do convés principal relativo ao centro do casco.

  // 2. Superestrutura (Acomodações e Ponte de Comando - à Ré)
  const superstructureGroup = new THREE.Group();

  const mainBlockWidth = hullWidth * 0.7;
  const mainBlockHeight = hullHeight * 1.5; // Mais alto que o casco
  const mainBlockDepth = hullDepth * 0.20;
  const mainBlockGeo = new THREE.BoxGeometry(mainBlockWidth, mainBlockHeight, mainBlockDepth);
  const mainBlockMesh = new THREE.Mesh(mainBlockGeo, tempMaterial.clone());
  mainBlockMesh.position.y = deckLevelY + mainBlockHeight / 2; // Base do bloco sobre o convés
  
  const bridgeBlockWidth = mainBlockWidth * 0.8;
  const bridgeBlockHeightAddition = mainBlockHeight * 0.45; // Altura adicional para a ponte
  const bridgeBlockDepth = mainBlockDepth * 0.65;
  const bridgeBlockGeo = new THREE.BoxGeometry(bridgeBlockWidth, bridgeBlockHeightAddition, bridgeBlockDepth);
  const bridgeBlockMesh = new THREE.Mesh(bridgeBlockGeo, tempMaterial.clone());
  // Posiciona a ponte sobre o bloco principal
  bridgeBlockMesh.position.y = mainBlockHeight / 2 + bridgeBlockHeightAddition / 2; 
  mainBlockMesh.add(bridgeBlockMesh); // Adiciona ponte como filha do bloco principal

  superstructureGroup.add(mainBlockMesh);
  // Posiciona a superestrutura um pouco à frente da popa extrema, no centro X do casco.
  superstructureGroup.position.set(0, 0, -hullDepth / 2 + mainBlockDepth / 2 + hullDepth * 0.05);
  group.add(superstructureGroup);

  // 3. Castelo de Proa (Estrutura elevada na frente)
  const forecastleWidth = hullWidth * 0.85;
  const forecastleHeight = hullHeight * 0.30; // Elevação modesta
  const forecastleDepth = hullDepth * 0.15;
  const forecastleGeo = new THREE.BoxGeometry(forecastleWidth, forecastleHeight, forecastleDepth);
  const forecastleMesh = new THREE.Mesh(forecastleGeo, tempMaterial.clone());
  forecastleMesh.position.y = deckLevelY + forecastleHeight / 2; // Base do castelo sobre o convés
  forecastleMesh.position.z = hullDepth / 2 - forecastleDepth / 2; // Na proa
  group.add(forecastleMesh);

  // 4. Mastros/Guindastes Simplificados
  const mastRadius = hullWidth * 0.025;
  
  // Mastro da Proa (no castelo de proa)
  const mainMastHeight = forecastleHeight + hullHeight * 1.5; // Altura do mastro a partir do convés do castelo
  const mastGeo = new THREE.CylinderGeometry(mastRadius, mastRadius * 0.7, mainMastHeight, 8);
  const forwardMastMesh = new THREE.Mesh(mastGeo, tempMaterial.clone());
  // Posicionado no centro do castelo de proa, com a base sobre o convés do castelo
  forwardMastMesh.position.set(0, forecastleHeight / 2 + mainMastHeight / 2, 0);
  forecastleMesh.add(forwardMastMesh); // Adiciona como filho do castelo de proa

  // Postes de Carga (Kingposts) a Meio-Navio
  const derrickHeight = hullHeight * 2.2;
  const derrickRadius = mastRadius * 2.2;
  const derrickGeo = new THREE.CylinderGeometry(derrickRadius, derrickRadius * 1.0, derrickHeight, 10);
  
  const derrickXOffset = hullWidth * 0.22; // Afastamento lateral do centro
  const derrickZPosition = hullDepth * 0.1; // Posição ao longo do comprimento (a partir do centro, para frente)

  const derrickPost1 = new THREE.Mesh(derrickGeo, tempMaterial.clone());
  derrickPost1.position.set(-derrickXOffset, deckLevelY + derrickHeight / 2, derrickZPosition);
  group.add(derrickPost1);

  const derrickPost2 = new THREE.Mesh(derrickGeo, tempMaterial.clone());
  derrickPost2.position.set(derrickXOffset, deckLevelY + derrickHeight / 2, derrickZPosition);
  group.add(derrickPost2);

  // 5. Cabeços de Amarração (Bollards)
  const bollards = createBollardsGroup({
    parentWidth: hullWidth,
    parentDepth: hullDepth,
    parentHeight: 0, // Bollards são posicionados no convés, altura do casco não é diretamente usada para seu Y local
    countPerSide: Math.max(4, Math.floor(hullDepth / 8) + 1),
    bollardRadiusRatio: 0.012,
    bollardHeightRatio: hullHeight * 0.08, // Altura do bollard relativa à altura do casco
    yOffset: deckLevelY, // Posiciona os bollards sobre o convés principal
  });
  group.add(bollards);

  return group;
}
