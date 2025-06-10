
import * as THREE from 'three';
import type { Equipment } from '@/lib/types';

export function createShipGeometry(item: Equipment): THREE.Group {
  const tankerGroup = new THREE.Group();
  const tempMaterial = new THREE.MeshStandardMaterial({ color: item.color || 0x607D8B, visible: false });

  const shipWidth = item.size?.width || 12;
  const shipOverallHeight = item.size?.height || 6; // Altura do casco principal (e da proa)
  const mainHullDepth = (item.size?.depth || 50) * 0.8;
  const bowSectionLength = (item.size?.depth || 50) * 0.20;

  // 1. Casco Principal
  const mainHullMesh = new THREE.Mesh(
    new THREE.BoxGeometry(shipWidth, shipOverallHeight, mainHullDepth),
    tempMaterial
  );
  // Posiciona o casco principal de forma que sua frente (face +Z local)
  // esteja alinhada com onde a proa começará.
  mainHullMesh.position.set(0, 0, -bowSectionLength / 2);
  tankerGroup.add(mainHullMesh);

  // 2. Seção da Proa
  const bowShape = new THREE.Shape();
  bowShape.moveTo(-shipWidth / 2, 0); // Canto traseiro esquerdo da forma da proa
  bowShape.lineTo(shipWidth / 2, 0);  // Canto traseiro direito da forma da proa
  bowShape.lineTo(0, bowSectionLength);   // Ponta da proa (no comprimento da seção da proa)
  bowShape.closePath(); // Conecta a ponta de volta ao canto traseiro esquerdo

  // Extruda a forma para dar altura. A profundidade da extrusão se torna a altura do navio.
  const extrudeSettings = { depth: shipOverallHeight, bevelEnabled: false };
  const bowGeometry = new THREE.ExtrudeGeometry(bowShape, extrudeSettings);

  // Rotações e translações para orientar corretamente a geometria da proa:
  // A extrusão ocorre ao longo do eixo Z local da Shape.
  // Queremos que essa profundidade de extrusão se torne a altura (eixo Y) do navio.
  bowGeometry.rotateX(-Math.PI / 2); // Rotaciona para que a profundidade da extrusão seja agora ao longo do eixo Y negativo local.
                                     // O 'chão' da Shape original (seu plano XY) agora está no plano XZ do mundo.
                                     // A altura da proa agora se estende de Y=0 (topo) a Y=-shipOverallHeight (base) no espaço local da geometria.

  const bowMesh = new THREE.Mesh(bowGeometry, tempMaterial.clone());
  bowMesh.rotation.y = Math.PI; // Gira 180° para que a ponta da proa aponte para frente (+Z do grupo)

  // Posicionamento da Proa:
  // X: Centralizado com o casco principal.
  // Y: Ajustado para -shipOverallHeight. Como a geometria da proa agora se estende de Y=0 (topo) a Y=-shipOverallHeight (base) localmente,
  //    posicionar em -shipOverallHeight no grupo faz com que o topo da proa fique no Y=0 do grupo (centro do casco principal)
  //    e a base da proa em Y=-shipOverallHeight no grupo.
  // Z: Posiciona a "traseira" da seção da proa (que está em seu Z local = 0 após a rotação Y)
  //    para encontrar a "frente" do casco principal (que está em Z do grupo = mainHullDepth / 2 - bowSectionLength / 2).
  bowMesh.position.set(0, -shipOverallHeight, (mainHullDepth / 2) - (bowSectionLength / 2) );


  tankerGroup.add(bowMesh);

  // 3. Superestrutura (Ponte de comando, etc.) - Posicionada na Popa (traseira)
  const superstructureWidth = shipWidth * 0.6;
  const superstructureMainHeight = shipOverallHeight * 0.7;
  const superstructureBridgeHeight = shipOverallHeight * 0.5;
  const superstructureDepth = mainHullDepth * 0.25;

  const superstructureMainMesh = new THREE.Mesh(
    new THREE.BoxGeometry(superstructureWidth, superstructureMainHeight, superstructureDepth),
    tempMaterial.clone()
  );
  superstructureMainMesh.position.set(
    0,
    shipOverallHeight / 2 + superstructureMainHeight / 2, // No topo do convés principal
    mainHullMesh.position.z - mainHullDepth / 2 + superstructureDepth / 2 + mainHullDepth * 0.05 // Na popa
  );
  tankerGroup.add(superstructureMainMesh);

  const superstructureBridgeMesh = new THREE.Mesh(
    new THREE.BoxGeometry(superstructureWidth * 0.85, superstructureBridgeHeight, superstructureDepth * 0.9),
    tempMaterial.clone()
  );
  superstructureBridgeMesh.position.set(
    superstructureMainMesh.position.x,
    superstructureMainMesh.position.y + superstructureMainHeight / 2 + superstructureBridgeHeight / 2,
    superstructureMainMesh.position.z
  );
  tankerGroup.add(superstructureBridgeMesh);

  // 4. Chaminé (Funnel)
  const funnelRadius = superstructureWidth * 0.12;
  const funnelHeight = superstructureBridgeHeight * 1.2;
  const funnelMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(funnelRadius, funnelRadius * 0.9, funnelHeight, 16),
    tempMaterial.clone()
  );
  funnelMesh.position.set(
    superstructureBridgeMesh.position.x,
    superstructureBridgeMesh.position.y + superstructureBridgeHeight / 2 + funnelHeight / 2,
    superstructureBridgeMesh.position.z - superstructureDepth * 0.2 
  );
  tankerGroup.add(funnelMesh);
  
  // 5. Castelo de Proa (Forecastle) - Bloco elevado na proa
  const forecastleWidth = shipWidth * 0.8;
  const forecastleHeight = shipOverallHeight * 0.15;
  const forecastleDepth = bowSectionLength * 0.5;

  const forecastleMesh = new THREE.Mesh(
    new THREE.BoxGeometry(forecastleWidth, forecastleHeight, forecastleDepth),
    tempMaterial.clone()
  );
  forecastleMesh.position.set(
    bowMesh.position.x, // Alinhado com o X da proa
    shipOverallHeight / 2 + forecastleHeight / 2, // No topo do convés da proa
    bowMesh.position.z + bowSectionLength / 2 - forecastleDepth / 2 // Centralizado na seção da proa
  );
  // tankerGroup.add(forecastleMesh); // Opcional, pode poluir visualmente

  return tankerGroup;
}
