
import * as THREE from 'three';
import type { Equipment } from '@/lib/types';

export function createShipGeometry(item: Equipment): THREE.Group {
  const tankerGroup = new THREE.Group();
  const tempMaterial = new THREE.MeshStandardMaterial({ color: item.color || 0x607D8B, visible: false });

  const shipWidth = item.size?.width || 12;
  const shipOverallHeight = item.size?.height || 6;
  const mainHullDepth = (item.size?.depth || 50) * 0.8;
  const bowSectionLength = (item.size?.depth || 50) * 0.2;

  // 1. Casco Principal (Main Rectangular Body)
  const mainHullMesh = new THREE.Mesh(
    new THREE.BoxGeometry(shipWidth, shipOverallHeight, mainHullDepth),
    tempMaterial
  );
  mainHullMesh.position.set(0, 0, 0); // Main hull centered at the group's origin
  tankerGroup.add(mainHullMesh);

  // 2. Seção da Proa (Bow Section)
  const bowShape = new THREE.Shape();
  // Define shape in XY plane, bow's length along Y-axis of the shape
  bowShape.moveTo(-shipWidth / 2, 0); // Base left
  bowShape.lineTo(shipWidth / 2, 0);  // Base right
  bowShape.lineTo(0, bowSectionLength);   // Tip of the bow
  bowShape.closePath();

  const extrudeSettings = { depth: shipOverallHeight, bevelEnabled: false };
  const bowGeometry = new THREE.ExtrudeGeometry(bowShape, extrudeSettings);

  // Orient the bow geometry:
  // Shape's Y-axis (bowSectionLength) becomes Z-axis, extrusion depth becomes Y-axis (height).
  // After this, the connecting face (base of the original shape) is at local z=0.
  bowGeometry.rotateX(-Math.PI / 2);

  const bowMesh = new THREE.Mesh(bowGeometry, tempMaterial.clone());
  // Rotate the bow mesh so its tip points forward (+Z in group space).
  // Its connecting face (local z=0) now effectively points towards -Z of the group.
  bowMesh.rotation.y = Math.PI;

  // Position the bow:
  // The main hull's front face is at z = mainHullDepth / 2.
  // We want the bowMesh's local z=0 (its connecting face) to be at this global Z.
  bowMesh.position.set(0, 0, mainHullDepth / 2);
  tankerGroup.add(bowMesh);

  // 3. Superestrutura Simplificada (na Popa - Stern)
  const superstructureWidth = shipWidth * 0.6;
  const superstructureMainHeight = shipOverallHeight * 0.5;
  const superstructureBridgeHeight = shipOverallHeight * 0.3;
  const superstructureDepth = mainHullDepth * 0.25;

  const superstructureMainMesh = new THREE.Mesh(
    new THREE.BoxGeometry(superstructureWidth, superstructureMainHeight, superstructureDepth),
    tempMaterial.clone()
  );
  superstructureMainMesh.position.set(
    0,
    shipOverallHeight / 2 + superstructureMainHeight / 2, // Base on deck
    -mainHullDepth / 2 + superstructureDepth / 2 // Positioned at the rear part of the main hull
  );
  tankerGroup.add(superstructureMainMesh);

  const superstructureBridgeMesh = new THREE.Mesh(
    new THREE.BoxGeometry(superstructureWidth * 0.8, superstructureBridgeHeight, superstructureDepth * 0.7),
    tempMaterial.clone()
  );
  superstructureBridgeMesh.position.set(
    0,
    superstructureMainMesh.position.y + superstructureMainHeight / 2 + superstructureBridgeHeight / 2,
    superstructureMainMesh.position.z
  );
  tankerGroup.add(superstructureBridgeMesh);


  // 4. Chaminé (Funnel)
  const funnelRadius = superstructureWidth * 0.12;
  const funnelHeight = superstructureBridgeHeight * 1.5;
  const funnelMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(funnelRadius, funnelRadius * 0.8, funnelHeight, 16),
    tempMaterial.clone()
  );
  funnelMesh.position.set(
    0,
    superstructureBridgeMesh.position.y + superstructureBridgeHeight / 2 + funnelHeight / 2,
    superstructureBridgeMesh.position.z + superstructureDepth * 0.1 // Slightly back on the bridge
  );
  tankerGroup.add(funnelMesh);

  // 5. Castelo de Proa (Forecastle) - Optional simple raised block
  const forecastleWidth = shipWidth * 0.8;
  const forecastleHeight = shipOverallHeight * 0.15;
  const forecastleDepth = bowSectionLength * 0.5; // Covers part of the bow

  const forecastleMesh = new THREE.Mesh(
    new THREE.BoxGeometry(forecastleWidth, forecastleHeight, forecastleDepth),
    tempMaterial.clone()
  );
  forecastleMesh.position.set(
    0,
    shipOverallHeight / 2 + forecastleHeight / 2, // On top of the deck level
    mainHullDepth / 2 + bowSectionLength / 2 - forecastleDepth / 2 // Positioned on the bow section
  );
  // tankerGroup.add(forecastleMesh); // Temporarily remove to see if it's causing visual clutter with the bow

  // 6. Guindastes/Mastros do Convés (Simplified Kingposts with Derricks)
  const createDerrick = (posX: number, posZ: number) => {
    const derrickGroup = new THREE.Group();
    const postRadius = shipWidth * 0.03;
    const postHeight = shipOverallHeight * 1.2;
    const boomLength = mainHullDepth * 0.15;
    const boomRadius = postRadius * 0.7;

    const postGeo = new THREE.CylinderGeometry(postRadius, postRadius, postHeight, 8);
    const postMesh = new THREE.Mesh(postGeo, tempMaterial.clone());
    postMesh.position.y = shipOverallHeight / 2 + postHeight / 2;
    derrickGroup.add(postMesh);

    const boomGeo = new THREE.CylinderGeometry(boomRadius, boomRadius, boomLength, 8);
    const boomMesh = new THREE.Mesh(boomGeo, tempMaterial.clone());
    boomMesh.position.set(0, postHeight * 0.4, boomLength / 2 * 0.7); // Attach to post, angle outwards
    boomMesh.rotation.x = Math.PI / 5; // Angled up
    postMesh.add(boomMesh); // Add boom as child of post for easier rotation if needed later

    derrickGroup.position.set(posX, 0, posZ);
    return derrickGroup;
  };

  // tankerGroup.add(createDerrick(shipWidth * 0.3, mainHullDepth * 0.1));
  // tankerGroup.add(createDerrick(-shipWidth * 0.3, mainHullDepth * 0.1));
  // tankerGroup.add(createDerrick(shipWidth * 0.3, -mainHullDepth * 0.25));
  // tankerGroup.add(createDerrick(-shipWidth * 0.3, -mainHullDepth * 0.25));
  // Temporarily removed derricks to focus on hull shape.

  return tankerGroup;
}
