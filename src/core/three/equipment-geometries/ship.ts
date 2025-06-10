
import * as THREE from 'three';
import type { Equipment } from '@/lib/types';

export function createShipGeometry(item: Equipment): THREE.Group {
  const tankerGroup = new THREE.Group();
  const tempMaterial = new THREE.MeshStandardMaterial({ color: item.color || 0x607D8B, visible: false });

  const shipWidth = item.size?.width || 12;
  const shipOverallHeight = item.size?.height || 6; // Overall height of the hull
  const mainHullDepth = (item.size?.depth || 50) * 0.8; // Length of the main rectangular part
  const bowSectionLength = (item.size?.depth || 50) * 0.2; // Length of the tapered bow section

  // 1. Casco Principal (Main Rectangular Body)
  // The BoxGeometry is centered at its local origin by default.
  const mainHullMesh = new THREE.Mesh(
    new THREE.BoxGeometry(shipWidth, shipOverallHeight, mainHullDepth),
    tempMaterial
  );
  mainHullMesh.position.set(0, 0, 0); // Main hull centered at group origin for simplicity
  tankerGroup.add(mainHullMesh);

  // 2. Seção da Proa (Bow Section)
  // Create a 2D shape for the bow's footprint (top-down view)
  const bowShape = new THREE.Shape();
  bowShape.moveTo(-shipWidth / 2, 0); // Back-left corner of bow shape
  bowShape.lineTo(shipWidth / 2, 0);  // Back-right corner of bow shape
  bowShape.lineTo(0, bowSectionLength);   // Tip of the bow
  bowShape.closePath(); // Connects tip back to back-left

  // Extrude this shape to give it height. The extrusion depth becomes the ship's height.
  const extrudeSettings = { depth: shipOverallHeight, bevelEnabled: false };
  const bowGeometry = new THREE.ExtrudeGeometry(bowShape, extrudeSettings);

  // After extrusion, the geometry is along the Z-axis. We need to rotate it.
  // Rotate so that the extrusion depth (shipOverallHeight) becomes the Y-axis (height),
  // and the original Y-axis of the shape (bowSectionLength) becomes the Z-axis (length of bow).
  bowGeometry.rotateX(-Math.PI / 2);
  // Now the bowGeometry is oriented correctly in its local space:
  // - X is width
  // - Y is height (shipOverallHeight), centered at local Y=0
  // - Z is length (bowSectionLength), with the connecting face at local Z=0 and tip at local Z=bowSectionLength

  const bowMesh = new THREE.Mesh(bowGeometry, tempMaterial.clone());
  // Rotate the bow mesh so its pointy end (local +Z) faces the group's +Z (forward).
  bowMesh.rotation.y = Math.PI;

  // Position the bow:
  // - X: Centered with the main hull (0).
  // - Y: Apply a small empirical offset to align visually with the main hull.
  // - Z: The main hull's front is at group_Z = mainHullDepth / 2.
  //   The bowMesh's connecting face is at its local Z=0 (after Y-rotation).
  //   So, placing bowMesh.position.z = mainHullDepth / 2 aligns them.
  bowMesh.position.set(0, -0.25, mainHullDepth / 2);
  tankerGroup.add(bowMesh);


  // 3. Superestrutura (Ponte de comando, etc.) - Posicionada na Popa (traseira)
  const superstructureWidth = shipWidth * 0.7;
  const superstructureMainHeight = shipOverallHeight * 0.6;
  const superstructureBridgeHeight = shipOverallHeight * 0.4;
  const superstructureDepth = mainHullDepth * 0.3; // Shorter than before

  const superstructureMainMesh = new THREE.Mesh(
    new THREE.BoxGeometry(superstructureWidth, superstructureMainHeight, superstructureDepth),
    tempMaterial.clone()
  );
  // Position superstructure based on main hull's center (0,0,0) and its dimensions
  // Y: On top of main hull's deck (mainHull localY=0 is its center, so deck is at shipOverallHeight/2)
  // Z: Towards the stern (negative Z)
  superstructureMainMesh.position.set(
    0,
    shipOverallHeight / 2 + superstructureMainHeight / 2,
    -mainHullDepth / 2 + superstructureDepth / 2 + (mainHullDepth * 0.05) // slightly forward from absolute stern
  );
  tankerGroup.add(superstructureMainMesh);

  const superstructureBridgeMesh = new THREE.Mesh(
    new THREE.BoxGeometry(superstructureWidth * 0.8, superstructureBridgeHeight, superstructureDepth * 0.8),
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
  const funnelHeight = superstructureBridgeHeight * 1.6;
  const funnelMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(funnelRadius, funnelRadius * 0.85, funnelHeight, 16),
    tempMaterial.clone()
  );
  funnelMesh.position.set(
    superstructureBridgeMesh.position.x,
    superstructureBridgeMesh.position.y + superstructureBridgeHeight / 2 + funnelHeight / 2,
    superstructureBridgeMesh.position.z - superstructureDepth * 0.15 // Slightly back on the bridge
  );
  tankerGroup.add(funnelMesh);

  // 5. Castelo de Proa (Forecastle) - Bloco elevado na proa
  const forecastleWidth = shipWidth * 0.9;
  const forecastleHeight = shipOverallHeight * 0.1; // Low profile
  const forecastleDepth = bowSectionLength * 0.6;

  const forecastleMesh = new THREE.Mesh(
    new THREE.BoxGeometry(forecastleWidth, forecastleHeight, forecastleDepth),
    tempMaterial.clone()
  );
  forecastleMesh.position.set(
    0,
    shipOverallHeight / 2 + forecastleHeight / 2, // On top of the deck level
    mainHullDepth / 2 + forecastleDepth/2 // Positioned on the bow section
  );
  // tankerGroup.add(forecastleMesh); // Keeping it commented as per last request to remove clutter

  return tankerGroup;
}
