
import * as THREE from 'three';
import type { Equipment } from '@/lib/types';
// Removed createBollardsGroup and createFendersGroup as they are not used in this simplified version
// and were related to previous, more detailed attempts.

export function createShipGeometry(item: Equipment): THREE.Group {
  const tankerGroup = new THREE.Group();
  // Use a single, non-visible material for all parts for now.
  // The actual color is applied by createSingleEquipmentMesh in scene-elements-setup.ts
  const tempMaterial = new THREE.MeshStandardMaterial({ color: item.color || 0x607D8B, visible: false });

  const shipWidth = item.size?.width || 12;
  const shipOverallHeight = item.size?.height || 6; // This is the total height of the hull + deck structure
  const mainHullDepth = (item.size?.depth || 50) * 0.8; // Main rectangular part
  const bowSectionLength = (item.size?.depth || 50) * 0.2; // Length of the tapered bow section

  // 1. Casco Principal (Main Rectangular Body)
  // Centered at (0,0,0) within the tankerGroup
  const mainHullMesh = new THREE.Mesh(
    new THREE.BoxGeometry(shipWidth, shipOverallHeight, mainHullDepth),
    tempMaterial
  );
  mainHullMesh.position.set(0, 0, 0); // Explicitly center main hull in the group
  tankerGroup.add(mainHullMesh);

  // 2. Seção da Proa (Bow Section)
  const bowShape = new THREE.Shape();
  // Define shape in XY plane, bowLength along Y-axis of the shape
  bowShape.moveTo(-shipWidth / 2, 0); // Base of bow, left corner
  bowShape.lineTo(shipWidth / 2, 0);  // Base of bow, right corner
  bowShape.lineTo(0, bowSectionLength);   // Tip of the bow
  bowShape.closePath();

  const extrudeSettings = { depth: shipOverallHeight, bevelEnabled: false };
  const bowGeometry = new THREE.ExtrudeGeometry(bowShape, extrudeSettings);

  // Orient the bow geometry:
  // Rotate so that the extrusion depth (shipOverallHeight) is along the Y-axis,
  // and the shape's Y-axis (bowSectionLength) is along the new -Z axis.
  bowGeometry.rotateX(-Math.PI / 2);
  // IMPORTANT: No local Y or Z translation on the geometry itself.
  // It should be centered around its local (0,0,0) after rotation.
  // The default ExtrudeGeometry is centered along its extrusion axis.

  const bowMesh = new THREE.Mesh(bowGeometry, tempMaterial.clone());
  // Rotate the bow mesh to point forward (tip towards +Z in group space)
  bowMesh.rotation.y = Math.PI; 
  // Position the bow mesh:
  // Y=0 to align its vertical center with the main hull's vertical center.
  // Z = mainHullDepth / 2 to place its local Z=0 (connecting face) at the front of the main hull.
  bowMesh.position.set(0, 0, mainHullDepth / 2);
  tankerGroup.add(bowMesh);

  // 3. Superestrutura Simplificada (na Popa - Stern)
  const superstructureWidth = shipWidth * 0.6;
  const superstructureHeight = shipOverallHeight * 0.7; // Taller than before
  const superstructureDepth = mainHullDepth * 0.25;

  const superstructureMesh = new THREE.Mesh(
    new THREE.BoxGeometry(superstructureWidth, superstructureHeight, superstructureDepth),
    tempMaterial.clone()
  );
  // Position superstructure on top of the main hull, towards the stern
  superstructureMesh.position.set(
    0,
    shipOverallHeight / 2 + superstructureHeight / 2, // Base of superstructure on deck
    -mainHullDepth / 2 + superstructureDepth / 2 // Positioned at the rear part of the main hull
  );
  tankerGroup.add(superstructureMesh);

  // 4. Chaminé (Funnel)
  const funnelRadius = superstructureWidth * 0.15;
  const funnelHeight = superstructureHeight * 0.8; 
  const funnelMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(funnelRadius, funnelRadius, funnelHeight, 16),
    tempMaterial.clone()
  );
  // Position funnel on top of the superstructure
  funnelMesh.position.set(
    superstructureMesh.position.x, // Align with superstructure center X
    superstructureMesh.position.y + superstructureHeight / 2 + funnelHeight / 2, // On top
    superstructureMesh.position.z // Align with superstructure center Z
  );
  tankerGroup.add(funnelMesh);
  
  // Note: Removed cranes/masts and forecastle for simplification to focus on hull and superstructure.
  // They can be added back once the main body is correct.

  return tankerGroup;
}
