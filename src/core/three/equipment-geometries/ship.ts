
import * as THREE from 'three';
import type { Equipment } from '@/lib/types';

export function createShipGeometry(item: Equipment): THREE.Group {
  const group = new THREE.Group();
  const tempMaterial = new THREE.MeshStandardMaterial({ color: item.color || 0x607D8B, visible: false });

  const shipWidth = item.size?.width || 12;
  const shipOverallHeight = item.size?.height || 6; // Altura total do corpo principal do casco
  const mainHullDepth = (item.size?.depth || 50) * 0.8; // Parte principal retangular
  const bowSectionLength = (item.size?.depth || 50) * 0.2; // Comprimento da seção da proa

  // 1. Casco Principal (Corpo Retangular)
  // A geometria Box é centrada em sua origem local.
  const mainHullMesh = new THREE.Mesh(
    new THREE.BoxGeometry(shipWidth, shipOverallHeight, mainHullDepth),
    tempMaterial
  );
  // Posiciona o centro do casco principal para que sua parte traseira esteja na origem Z do grupo,
  // e a frente esteja pronta para a proa.
  mainHullMesh.position.set(0, 0, -bowSectionLength / 2); // Ajustado para alinhar com a nova lógica de proa
  group.add(mainHullMesh);

  // 2. Seção da Proa (Extrusão de uma Forma 2D)
  const bowShape = new THREE.Shape();
  // O formato é definido no plano XY, onde Y representa o comprimento da proa e X a largura.
  bowShape.moveTo(-shipWidth / 2, 0); // Ponto traseiro esquerdo da base da proa
  bowShape.lineTo(shipWidth / 2, 0);  // Ponto traseiro direito da base da proa
  // Curva para a ponta da proa
  bowShape.quadraticCurveTo(shipWidth / 3, bowSectionLength * 0.8, 0, bowSectionLength); // Ponta
  bowShape.quadraticCurveTo(-shipWidth / 3, bowSectionLength * 0.8, -shipWidth / 2, 0); // Curva de volta para o início
  bowShape.closePath();

  const extrudeSettings = { depth: shipOverallHeight, bevelEnabled: false };
  const bowGeometry = new THREE.ExtrudeGeometry(bowShape, extrudeSettings);
  
  // A extrusão ocorre ao longo do eixo Z local da geometria.
  // Rotacionamos para que a profundidade da extrusão se torne a altura (eixo Y).
  bowGeometry.rotateX(-Math.PI / 2);
  // Após a rotação, a geometria extrudada pode não estar centrada verticalmente.
  // Transladamos para que seu centro Y local seja 0.
  bowGeometry.translate(0, shipOverallHeight / 2, 0); 
  // A "frente" da forma (ao longo do seu eixo Y original) agora aponta ao longo do eixo Z local.

  const bowMesh = new THREE.Mesh(bowGeometry, tempMaterial.clone());
  // Posiciona o centro da seção da proa à frente do centro do casco principal.
  // O Z do centro do casco é -bowSectionLength/2. A frente do casco é -bowSectionLength/2 + mainHullDepth/2.
  // O Z do centro da proa deve ser (frente do casco) + bowSectionLength/2.
  bowMesh.position.set(0, 0, (-bowSectionLength / 2 + mainHullDepth / 2) + bowSectionLength / 2);
  
  // Gira a proa 180 graus para que a ponta afilada aponte para frente.
  bowMesh.rotation.y = Math.PI;
  group.add(bowMesh);


  // 3. Superestrutura Simplificada (Popa)
  const superstructureWidth = shipWidth * 0.6;
  const superstructureHeight = shipOverallHeight * 0.8;
  const superstructureDepth = mainHullDepth * 0.25;

  const superstructureMesh = new THREE.Mesh(
    new THREE.BoxGeometry(superstructureWidth, superstructureHeight, superstructureDepth),
    tempMaterial.clone()
  );
  // Posiciona na parte traseira (popa) do casco principal, sobre o convés.
  // O Y do convés é shipOverallHeight / 2 (relativo ao centro do casco).
  superstructureMesh.position.set(
    0,
    shipOverallHeight / 2 + superstructureHeight / 2, // Base da superestrutura no convés
    mainHullMesh.position.z - mainHullDepth / 2 + superstructureDepth / 2 // Na popa
  );
  group.add(superstructureMesh);

  // Chaminé sobre a superestrutura
  const funnelRadius = superstructureWidth * 0.15;
  const funnelHeight = superstructureHeight * 0.7;
  const funnelMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(funnelRadius, funnelRadius * 0.9, funnelHeight, 16),
    tempMaterial.clone()
  );
  funnelMesh.position.set(
    superstructureMesh.position.x,
    superstructureMesh.position.y + superstructureHeight / 2 + funnelHeight / 2, // Topo da superestrutura + metade da altura da chaminé
    superstructureMesh.position.z - superstructureDepth * 0.2 // Um pouco para trás na superestrutura
  );
  group.add(funnelMesh);
  
  // Ajuste final do grupo:
  // A intenção é que o item.position.y nos dados iniciais represente o nível da quilha (base do navio).
  // A função createSingleEquipmentMesh adiciona effectiveHeight/2 a item.position.y para centralizar o objeto.
  // Portanto, este grupo retornado deve ter sua origem local (0,0,0) no centro geométrico do navio.
  // A construção atual já posiciona os componentes de forma que o centro Y do casco principal (e da proa alinhada)
  // esteja em Y=0 do grupo. O centro Z do navio como um todo está aproximadamente na origem Z do grupo.
  // Nenhuma translação adicional do grupo é necessária aqui se createSingleEquipmentMesh fizer o ajuste final.

  return group;
}
