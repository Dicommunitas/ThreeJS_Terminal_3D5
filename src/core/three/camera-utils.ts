
/**
 * @module core/three/camera-utils
 * Utilitários para cálculos relacionados à câmera na cena Three.js.
 *
 * Principal Responsabilidade:
 * Fornecer funções para calcular posições e alvos de câmera ideais
 * para enquadrar um conjunto específico de objetos (meshes) na cena,
 * oferecendo diferentes perspectivas como padrão, de cima e isométrica.
 *
 * @example Diagrama de Funcionalidade do calculateViewForMeshes:
 * ```mermaid
 *   classDiagram
 *     class calculateViewForMeshes_params {
 *       +meshes: THREE.Object3D[]
 *       +camera: THREE.PerspectiveCamera
 *     }
 *     class calculateViewForMeshes_return {
 *       +default: SystemView
 *       +topDown: SystemView
 *       +isometric: SystemView
 *     }
 *     class SystemView {
 *       +position: Point3D
 *       +lookAt: Point3D
 *     }
 *     class calculateViewForMeshes {
 *     }
 *     calculateViewForMeshes ..> calculateViewForMeshes_params : receives
 *     calculateViewForMeshes ..> calculateViewForMeshes_return : returns or null
 * ```
 */
import * as THREE from 'three';
import type { SystemViewOptions, SystemView } from '@/lib/types';

/**
 * Calcula múltiplas opções de visualização (padrão, de cima, isométrica) para a câmera
 * de forma a enquadrar um conjunto de meshes fornecidos.
 *
 * @param {THREE.Object3D[]} meshes - Um array de meshes 3D a serem enquadrados.
 * @param {THREE.PerspectiveCamera} camera - A câmera de perspectiva da cena.
 * @returns {SystemViewOptions | null} Um objeto contendo as diferentes visualizações calculadas
 *          ou null se não for possível calcular (e.g., nenhum mesh fornecido).
 */
export function calculateViewForMeshes(
  meshes: THREE.Object3D[],
  camera: THREE.PerspectiveCamera
): SystemViewOptions | null {
  if (!meshes || meshes.length === 0) {
    return null;
  }

  const boundingBox = new THREE.Box3();
  meshes.forEach(mesh => {
    if (mesh instanceof THREE.Mesh && mesh.geometry) {
      mesh.updateMatrixWorld(true);
      const meshBox = new THREE.Box3().setFromObject(mesh);
      if (!meshBox.isEmpty()) {
        boundingBox.union(meshBox);
      }
    }
  });

  if (boundingBox.isEmpty()) {
    return null;
  }

  const center = new THREE.Vector3();
  boundingBox.getCenter(center);

  const size = new THREE.Vector3();
  boundingBox.getSize(size);

  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  let cameraDistance = Math.max(maxDim / (2 * Math.tan(fov / 2)), 5); // Distância mínima
  const fillFactor = 1.5;
  cameraDistance *= fillFactor;


  // Visão Padrão (Default)
  const defaultPosVec = new THREE.Vector3(
    center.x,
    center.y + Math.max(size.y * 0.5, maxDim * 0.3) + 2, // Adiciona uma pequena elevação extra
    center.z + cameraDistance
  );
  if (size.y < maxDim * 0.2) { // Ajuste para objetos "baixos"
    defaultPosVec.y = Math.max(center.y + cameraDistance * 0.5, center.y + 2);
  }
  const defaultView: SystemView = {
    position: { x: defaultPosVec.x, y: defaultPosVec.y, z: defaultPosVec.z },
    lookAt: { x: center.x, y: center.y, z: center.z },
  };

  // Visão de Cima (Top-Down)
  const topDownDistance = Math.max(maxDim * 1.2, cameraDistance * 0.8); // Ajustar distância para visão de cima
  const topDownView: SystemView = {
    position: { x: center.x, y: center.y + topDownDistance, z: center.z + 0.1 }, // Pequeno offset em Z para não ser perfeitamente reto
    lookAt: { x: center.x, y: center.y, z: center.z },
  };

  // Visão Isométrica (Simulada para Câmera Perspectiva)
  const isoOffset = cameraDistance * 0.707;
  const isometricView: SystemView = {
    position: {
      x: center.x + isoOffset,
      y: center.y + isoOffset,
      z: center.z + isoOffset,
    },
    lookAt: { x: center.x, y: center.y, z: center.z },
  };

  return {
    default: defaultView,
    topDown: topDownView,
    isometric: isometricView,
  };
}
