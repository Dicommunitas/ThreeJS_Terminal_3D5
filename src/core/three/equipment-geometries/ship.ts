
import * as THREE from 'three';
import type { Equipment } from '@/lib/types';

export function createShipGeometry(item: Equipment): THREE.Group {
  const tankerGroup = new THREE.Group();
  const tempMaterial = new THREE.MeshStandardMaterial({ color: item.color || 0x607D8B, visible: false });

  const shipWidth = item.size?.width || 12;
  const shipOverallHeight = item.size?.height || 6;
  const mainHullDepth = (item.size?.depth || 50) * 0.8;
  const bowSectionLength = (item.size?.depth || 50) * 0.2;

  // 1. Casco Principal (Corpo Retangular)
  const mainHullMesh = new THREE.Mesh(
    new THREE.BoxGeometry(shipWidth, shipOverallHeight, mainHullDepth),
    tempMaterial
  );
  mainHullMesh.position.set(0, 0, -bowSectionLength / 2); // Centro do casco principal deslocado para trás
  tankerGroup.add(mainHullMesh);

  // 2. Seção da Proa
  const bowShape = new THREE.Shape();
  // Uma forma de V mais pronunciada para a proa
  bowShape.moveTo(0, bowSectionLength); // Ponta da proa
  bowShape.lineTo(-shipWidth / 2, 0);    // Canto traseiro esquerdo da base da proa
  bowShape.lineTo(shipWidth / 2, 0);     // Canto traseiro direito da base da proa
  bowShape.closePath();                  // Fecha a forma de volta à ponta (criando uma linha, mas ExtrudeGeometry lida com isso)
  // Ou, para uma base reta na conexão com o casco:
  // bowShape.moveTo(-shipWidth / 2, 0); // Canto traseiro esquerdo
  // bowShape.lineTo(shipWidth / 2, 0);  // Canto traseiro direito
  // bowShape.lineTo(0, bowSectionLength); // Ponta da proa
  // bowShape.closePath();


  const extrudeSettings = { depth: shipOverallHeight, bevelEnabled: false };
  const bowGeometry = new THREE.ExtrudeGeometry(bowShape, extrudeSettings);

  // A geometria é criada no plano XY e extrudada ao longo de Z.
  // Rotaciona para que a extrusão (altura do navio) fique ao longo de Y,
  // e o 'comprimento' da forma (bowSectionLength) fique ao longo de Z.
  bowGeometry.rotateX(-Math.PI / 2);

  // Centraliza a geometria da proa verticalmente e ao longo de seu próprio comprimento.
  // Originalmente, após a rotação X, a extrusão (altura) está de Y=0 a Y=-shipOverallHeight.
  // E o comprimento da proa (originalmente Y na Shape) está de Z=0 a Z=bowSectionLength.
  bowGeometry.translate(0, shipOverallHeight / 2, -bowSectionLength / 2); // Centraliza altura e comprimento

  const bowMesh = new THREE.Mesh(bowGeometry, tempMaterial.clone());
  // Posiciona o centro da proa à frente do centro do casco principal.
  bowMesh.position.set(0, 0, mainHullDepth / 2); // Agora deve encaixar corretamente
  // A rotação de 180 graus não é mais necessária se a Shape for definida corretamente para apontar para frente.
  // Se a ponta da Shape (0, bowSectionLength) é a frente, a rotação de -PI/2 em X já a orienta.
  // Se necessário, ajuste a rotação da Shape ou do Mesh aqui. Se a forma está "de costas":
  // bowMesh.rotation.y = Math.PI; // Descomente se a proa estiver virada para trás

  tankerGroup.add(bowMesh);

  // 3. Superestrutura Simplificada (Popa)
  const superstructureWidth = shipWidth * 0.7;
  const superstructureBaseHeight = shipOverallHeight * 0.5;
  const superstructureTopHeight = shipOverallHeight * 0.4;
  const superstructureDepth = mainHullDepth * 0.3;

  const superstructureBaseMesh = new THREE.Mesh(
    new THREE.BoxGeometry(superstructureWidth, superstructureBaseHeight, superstructureDepth),
    tempMaterial.clone()
  );
  // Posiciona na popa, sobre o convés (Y=0 é o centro do casco principal)
  superstructureBaseMesh.position.set(
    0,
    superstructureBaseHeight / 2, // Metade da altura da base da superestrutura acima do convés (que está em Y=0 do grupo)
    mainHullMesh.position.z - mainHullDepth / 2 + superstructureDepth / 2 + mainHullDepth * 0.05 // Na popa
  );
  tankerGroup.add(superstructureBaseMesh);

  const superstructureTopMesh = new THREE.Mesh(
    new THREE.BoxGeometry(superstructureWidth * 0.8, superstructureTopHeight, superstructureDepth * 0.7),
    tempMaterial.clone()
  );
  superstructureTopMesh.position.set(
    superstructureBaseMesh.position.x,
    superstructureBaseMesh.position.y + superstructureBaseHeight / 2 + superstructureTopHeight / 2,
    superstructureBaseMesh.position.z
  );
  tankerGroup.add(superstructureTopMesh);

  // 4. Chaminé
  const funnelRadius = superstructureWidth * 0.1;
  const funnelHeight = superstructureTopHeight * 1.5;
  const funnelMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(funnelRadius, funnelRadius, funnelHeight, 16),
    tempMaterial.clone()
  );
  funnelMesh.position.set(
    superstructureTopMesh.position.x,
    superstructureTopMesh.position.y + superstructureTopHeight / 2 + funnelHeight / 2,
    superstructureTopMesh.position.z - superstructureDepth * 0.25 // Um pouco para trás na superestrutura
  );
  tankerGroup.add(funnelMesh);
  
  // 5. Castelo de Proa
  const forecastleWidth = shipWidth * 0.8;
  const forecastleHeight = shipOverallHeight * 0.15; // Mais baixo
  const forecastleDepth = bowSectionLength * 0.5; // Metade do comprimento da proa

  const forecastleMesh = new THREE.Mesh(
    new THREE.BoxGeometry(forecastleWidth, forecastleHeight, forecastleDepth),
    tempMaterial.clone()
  );
  // Posiciona sobre a seção da proa, à frente
  // O convés da proa está em Y=0 do grupo. O castelo fica sobre ele.
  forecastleMesh.position.set(
    0,
    forecastleHeight / 2, 
    bowMesh.position.z + bowSectionLength / 2 - forecastleDepth / 2 // Na parte da frente da proa
  );
  tankerGroup.add(forecastleMesh);

  return tankerGroup;
}
