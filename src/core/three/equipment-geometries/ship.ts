
import * as THREE from 'three';
import type { Equipment } from '@/lib/types';

export function createShipGeometry(item: Equipment): THREE.Group {
  const tankerGroup = new THREE.Group();
  const tempMaterial = new THREE.MeshStandardMaterial({ color: item.color || 0x607D8B, visible: false });

  const shipWidth = item.size?.width || 12;
  const shipOverallHeight = item.size?.height || 6;
  const mainHullDepth = (item.size?.depth || 50) * 0.8; // 80% for main hull
  const bowSectionLength = (item.size?.depth || 50) * 0.20; // 20% for bow section

  // 1. Casco Principal
  const mainHullMesh = new THREE.Mesh(
    new THREE.BoxGeometry(shipWidth, shipOverallHeight, mainHullDepth),
    tempMaterial
  );
  mainHullMesh.position.set(0, 0, -bowSectionLength / 2); // Move main hull back slightly to make space for bow
  tankerGroup.add(mainHullMesh);

  // 2. Seção da Proa
  const bowShape = new THREE.Shape();
  // Start from bottom-left of the bow's base shape, going clockwise
  bowShape.moveTo(-shipWidth / 2, 0); // Back-left corner of bow section
  bowShape.lineTo(shipWidth / 2, 0);  // Back-right corner of bow section
  bowShape.lineTo(0, bowSectionLength);   // Tip of the bow
  bowShape.closePath(); // Connects tip back to back-left

  const extrudeSettings = { depth: shipOverallHeight, bevelEnabled: false };
  const bowGeometry = new THREE.ExtrudeGeometry(bowShape, extrudeSettings);

  // Orient the bow geometry:
  // The extrusion happens along the Z-axis of the shape. We want this to be the ship's height (Y-axis).
  bowGeometry.rotateX(-Math.PI / 2); // Now the shape's original XY plane is the XZ plane, extrusion (height) is along Y.
                                     // Assuming extrusion goes in positive Y, it ranges from Y=0 (base) to Y=shipOverallHeight (top).

  const bowMesh = new THREE.Mesh(bowGeometry, tempMaterial.clone());
  bowMesh.rotation.y = Math.PI; // Rotate so the pointed end faces forward (+Z of the group)

  // Position the bow:
  // Y: Align the base of the bow with the base of the main hull.
  //    Main hull base is at y = -shipOverallHeight / 2 (since its center is at y=0).
  //    Bow geometry's base (after rotateX) is at its local y=0.
  // Z: Place the "back" of the bow (its local z=0 after rotation.y) at the front of the main hull.
  //    Front of main hull is at z = mainHullMesh.position.z + mainHullDepth / 2
  //                          = -bowSectionLength / 2 + mainHullDepth / 2
  bowMesh.position.set(0, -shipOverallHeight / 2, (mainHullDepth - bowSectionLength) / 2);
  tankerGroup.add(bowMesh);


  // 3. Superestrutura (Ponte de comando, etc.) - Posicionada na Popa (traseira)
  const superstructureWidth = shipWidth * 0.7;
  const superstructureMainHeight = shipOverallHeight * 0.8; // Main block
  const superstructureBridgeHeight = shipOverallHeight * 0.6; // Bridge block on top
  const superstructureDepth = mainHullDepth * 0.2;

  // Main block of superstructure
  const superstructureMainMesh = new THREE.Mesh(
    new THREE.BoxGeometry(superstructureWidth, superstructureMainHeight, superstructureDepth),
    tempMaterial.clone()
  );
  superstructureMainMesh.position.set(
    0,
    shipOverallHeight / 2 + superstructureMainHeight / 2, // On top of the main deck
    mainHullMesh.position.z - mainHullDepth / 2 + superstructureDepth / 2 // At the stern
  );
  tankerGroup.add(superstructureMainMesh);

  // Bridge block
  const superstructureBridgeMesh = new THREE.Mesh(
    new THREE.BoxGeometry(superstructureWidth * 0.8, superstructureBridgeHeight, superstructureDepth * 0.9),
    tempMaterial.clone()
  );
  superstructureBridgeMesh.position.set(
    superstructureMainMesh.position.x,
    superstructureMainMesh.position.y + superstructureMainHeight / 2 + superstructureBridgeHeight / 2,
    superstructureMainMesh.position.z
  );
  tankerGroup.add(superstructureBridgeMesh);

  // 4. Chaminé (Funnel)
  const funnelRadius = superstructureWidth * 0.15;
  const funnelHeight = superstructureBridgeHeight * 1.1;
  const funnelMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(funnelRadius, funnelRadius * 0.8, funnelHeight, 16),
    tempMaterial.clone()
  );
  funnelMesh.position.set(
    superstructureBridgeMesh.position.x,
    superstructureBridgeMesh.position.y + superstructureBridgeHeight / 2 + funnelHeight / 2,
    superstructureBridgeMesh.position.z - superstructureDepth * 0.1 // Slightly towards the stern of the bridge
  );
  tankerGroup.add(funnelMesh);

  // 5. Guindastes/Mastros do Convés (Kingposts com Lanças)
  const craneBaseRadius = shipWidth * 0.03;
  const cranePostHeight = shipOverallHeight * 1.5;
  const craneBoomLength = mainHullDepth * 0.15;
  const craneBoomRadius = craneBaseRadius * 0.7;

  const createCrane = (posX: number, posZ: number) => {
    const craneGroup = new THREE.Group();
    // Base
    const baseGeo = new THREE.CylinderGeometry(craneBaseRadius * 1.5, craneBaseRadius * 1.5, shipOverallHeight * 0.05, 12);
    const baseMesh = new THREE.Mesh(baseGeo, tempMaterial.clone());
    baseMesh.position.y = shipOverallHeight / 2 + (shipOverallHeight * 0.05) / 2; // On deck
    craneGroup.add(baseMesh);
    // Kingpost (poste vertical)
    const postGeo = new THREE.CylinderGeometry(craneBaseRadius, craneBaseRadius, cranePostHeight, 12);
    const postMesh = new THREE.Mesh(postGeo, tempMaterial.clone());
    postMesh.position.y = baseMesh.position.y + (shipOverallHeight * 0.05) / 2 + cranePostHeight / 2;
    craneGroup.add(postMesh);
    // Boom (lança)
    const boomGeo = new THREE.CylinderGeometry(craneBoomRadius, craneBoomRadius, craneBoomLength, 8);
    const boomMesh = new THREE.Mesh(boomGeo, tempMaterial.clone());
    boomMesh.position.set(0, postMesh.position.y + cranePostHeight * 0.3, craneBoomLength / 2); // Origin at one end
    boomMesh.rotation.x = Math.PI / 6; // Angled slightly up
    craneGroup.add(boomMesh);

    craneGroup.position.set(posX, 0, posZ);
    return craneGroup;
  };

  const crane1 = createCrane(shipWidth * 0.2, mainHullMesh.position.z + mainHullDepth * 0.2);
  tankerGroup.add(crane1);
  const crane2 = createCrane(-shipWidth * 0.2, mainHullMesh.position.z + mainHullDepth * 0.2);
  tankerGroup.add(crane2);
  const crane3 = createCrane(shipWidth * 0.2, mainHullMesh.position.z - mainHullDepth * 0.25);
  tankerGroup.add(crane3);
  const crane4 = createCrane(-shipWidth * 0.2, mainHullMesh.position.z - mainHullDepth * 0.25);
  tankerGroup.add(crane4);


  return tankerGroup;
}
