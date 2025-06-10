
import * as THREE from 'three';
import type { Equipment } from '@/lib/types';

export function createShipGeometry(item: Equipment): THREE.Group {
  const group = new THREE.Group();
  const shipWidth = item.size?.width || 12; // Beam
  const shipOverallHeight = item.size?.height || 6; // Total height from keel to main deck level for geometry
  const shipOverallLength = item.size?.depth || 50; // Total length

  const tempMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, visible: false });

  // --- Dimensions based on example's proportions more than absolute values ---
  const lowerHullHeight = shipOverallHeight * 0.6; // Part below main deck level
  const upperDeckHeight = shipOverallHeight * 0.4; // Main deck thickness + any bulwark

  const mainBodyLength = shipOverallLength * 0.75; // Main rectangular part of the hull
  const bowSectionLength = shipOverallLength * 0.25; // Length dedicated to the bow shape

  // 1. Main Hull - Lower Part (conceptual "underwater" part)
  const mainLowerHullGeo = new THREE.BoxGeometry(shipWidth, lowerHullHeight, mainBodyLength);
  const mainLowerHullMesh = new THREE.Mesh(mainLowerHullGeo, tempMaterial.clone());
  // Position its center: Y so its top is at overall Y=0, Z so its front is ready for bow
  mainLowerHullMesh.position.set(0, -upperDeckHeight / 2, -bowSectionLength / 2);
  group.add(mainLowerHullMesh);

  // 2. Main Hull - Upper Part/Deck
  const mainUpperDeckGeo = new THREE.BoxGeometry(shipWidth, upperDeckHeight, mainBodyLength);
  const mainUpperDeckMesh = new THREE.Mesh(mainUpperDeckGeo, tempMaterial.clone());
  // Position its center: Y so its bottom aligns with lower hull's top, Z same as lower hull
  mainUpperDeckMesh.position.set(0, lowerHullHeight / 2, -bowSectionLength / 2);
  group.add(mainUpperDeckMesh);

  // 3. Bow Section (combined upper and lower)
  const bowShape = new THREE.Shape();
  // Shape is in XY plane, will be extruded along Z, then rotated.
  // X maps to ship's width, Y maps to bow section's length.
  bowShape.moveTo(-shipWidth / 2, 0); // Back bottom-left of bow part
  bowShape.lineTo(shipWidth / 2, 0);  // Back bottom-right
  // Create a more pointed bow, less aggressively curved than example to avoid self-intersection issues with extrude
  bowShape.lineTo(shipWidth / 3, bowSectionLength * 0.5);
  bowShape.lineTo(0, bowSectionLength); // Tip of the bow
  bowShape.lineTo(-shipWidth / 3, bowSectionLength * 0.5);
  bowShape.lineTo(-shipWidth / 2, 0); // Back to start
  bowShape.closePath();
  
  const extrudeSettings = { depth: shipOverallHeight, bevelEnabled: false };
  const bowGeometry = new THREE.ExtrudeGeometry(bowShape, extrudeSettings);
  
  // Correctly orient and position the bow
  bowGeometry.rotateX(-Math.PI / 2); // Rotate shape from XY plane to XZ plane (top-down view), extrusion depth (Y) is height
  bowGeometry.translate(0, 0, bowSectionLength/2); // Center the geometry along its length

  const bowMesh = new THREE.Mesh(bowGeometry, tempMaterial.clone());
  // Position the centered bow part in front of the main hull.
  // Main hull front is at Z = (mainBodyLength/2 - bowSectionLength/2)
  // Bow's local Z=0 should align with that.
  bowMesh.position.set(0, 0, mainBodyLength / 2 ); 
  group.add(bowMesh);
  
  // 4. Superstructure (simplified, at the stern)
  const superstructureWidth = shipWidth * 0.7;
  const superstructureLength = shipOverallLength * 0.2;
  const superstructureHeight = shipOverallHeight * 1.2; // Taller than main hull

  const superstructureBaseGeo = new THREE.BoxGeometry(superstructureWidth, superstructureHeight, superstructureLength);
  const superstructureBaseMesh = new THREE.Mesh(superstructureBaseGeo, tempMaterial.clone());
  // Position on top of the deck, at the stern
  const deckTopY = (lowerHullHeight + upperDeckHeight) / 2;
  superstructureBaseMesh.position.set(
    0,
    deckTopY + superstructureHeight / 2 - upperDeckHeight, // Base of superstructure on deck
    -mainBodyLength / 2 + superstructureLength / 2 - bowSectionLength / 2 // At the stern part of main hull
  );
  group.add(superstructureBaseMesh);

  // Bridge (smaller box on top of superstructure)
  const bridgeWidth = superstructureWidth * 0.8;
  const bridgeLength = superstructureLength * 0.7;
  const bridgeHeight = superstructureHeight * 0.5;
  const bridgeGeo = new THREE.BoxGeometry(bridgeWidth, bridgeHeight, bridgeLength);
  const bridgeMesh = new THREE.Mesh(bridgeGeo, tempMaterial.clone());
  bridgeMesh.position.set(
    0,
    superstructureBaseMesh.position.y + superstructureHeight / 2 + bridgeHeight / 2,
    superstructureBaseMesh.position.z
  );
  group.add(bridgeMesh);

  // 5. Funnel (simple cylinder on superstructure)
  const funnelRadius = superstructureWidth * 0.15;
  const funnelHeight = superstructureHeight * 0.6;
  const funnelGeo = new THREE.CylinderGeometry(funnelRadius, funnelRadius * 0.8, funnelHeight, 16);
  const funnelMesh = new THREE.Mesh(funnelGeo, tempMaterial.clone());
  funnelMesh.position.set(
    0,
    bridgeMesh.position.y + bridgeHeight/2 , // On top of bridge or main superstructure
    superstructureBaseMesh.position.z - superstructureLength * 0.25 // Slightly towards the rear of superstructure
  );
  group.add(funnelMesh);

  // Ensure the group itself is centered around what would be its overall geometric center
  // if its base (keel) was at Y=0.
  // The 'item.position.y' in initial-data refers to the keel level.
  // The createSingleEquipmentMesh function expects the returned group to be centered
  // around its local (0,0,0) so it can apply 'item.position.y + effectiveHeight/2'.
  // Current construction places the keel effectively near group's local Y = -shipOverallHeight/2.
  // So, we need to shift the entire group up by shipOverallHeight/2 to center it.
  group.position.y = shipOverallHeight / 2;


  return group;
}

