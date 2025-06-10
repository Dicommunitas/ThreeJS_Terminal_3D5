
"use client";

import type * as THREE from 'three';
import { useEffect, useRef } from 'react';
import type { Equipment, Layer, ColorMode } from '@/lib/types';
import { updateEquipmentMeshesInScene } from '@/core/three/scene-elements-setup';
import type { OrbitControls as OrbitControlsType } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * @module hooks/useEquipmentRenderer
 * Hook customizado para gerenciar a renderização dos meshes de equipamentos na cena 3D.
 *
 * Principal Responsabilidade:
 * Encapsular a lógica de criação, atualização e remoção dos meshes 3D que representam
 * os equipamentos. Observa mudanças nos dados dos equipamentos (filtrados), camadas de visibilidade
 * e modo de colorização, e atualiza a cena Three.js de acordo.
 * Utiliza `updateEquipmentMeshesInScene` de `scene-elements-setup.ts` para a lógica de sincronização
 * dos meshes e do plano de chão com base na visibilidade das camadas.
 *
 * @example Diagrama de Composição e Dependências:
 * ```mermaid
 *   classDiagram
 *     class UseEquipmentRendererProps {
 *       +sceneRef: RefObject_Scene_
 *       +cameraRef: RefObject_PerspectiveCamera_
 *       +controlsRef: RefObject_OrbitControls_
 *       +isSceneReady: boolean
 *       +isControlsReady: boolean
 *       +equipmentData: Equipment[]  // Lista filtrada
 *       +layers: Layer[]
 *       +colorMode: ColorMode
 *       +createSingleEquipmentMesh(item: Equipment): Object3D
 *       +groundMeshRef: RefObject_Mesh_
 *     }
 *     class useEquipmentRenderer {
 *       #equipmentMeshesRef: React.MutableRefObject_Object3D[]
 *     }
 *     class ReactFCHook {
 *     }
 *     class scene_elements_setup_module {
 *       +updateEquipmentMeshesInScene()
 *     }
 *     class Equipment {
 *     }
 *     class Layer {
 *     }
 *     class ColorMode {
 *     }
 *     class RefObject_Scene_ {
 *     }
 *     class RefObject_PerspectiveCamera_ {
 *     }
 *     class RefObject_OrbitControls_ {
 *     }
 *     class RefObject_Mesh_ {
 *     }
 *     useEquipmentRenderer --|> ReactFCHook
 *     useEquipmentRenderer ..> scene_elements_setup_module : uses updateEquipmentMeshesInScene
 *     UseEquipmentRendererProps ..> Equipment
 *     UseEquipmentRendererProps ..> Layer
 *     UseEquipmentRendererProps ..> ColorMode
 *     UseEquipmentRendererProps ..> RefObject_Scene_
 *     UseEquipmentRendererProps ..> RefObject_Mesh_
 *     UseEquipmentRendererProps ..> RefObject_PerspectiveCamera_
 *     UseEquipmentRendererProps ..> RefObject_OrbitControls_
 * ```
 */
export interface UseEquipmentRendererProps {
  sceneRef: React.RefObject<THREE.Scene | null>;
  cameraRef: React.RefObject<THREE.PerspectiveCamera | null>;
  controlsRef: React.RefObject<OrbitControlsType | null>;
  isSceneReady: boolean;
  isControlsReady: boolean;
  equipmentData: Equipment[];
  layers: Layer[];
  colorMode: ColorMode;
  createSingleEquipmentMesh: (item: Equipment) => THREE.Object3D;
  groundMeshRef: React.RefObject<THREE.Mesh | null>;
}

/**
 * Hook customizado para gerenciar a renderização (criação, atualização, remoção)
 * dos meshes de equipamentos na cena Three.js.
 *
 * @param {UseEquipmentRendererProps} props As props do hook.
 * @returns {React.RefObject<THREE.Object3D[]>} Ref para a lista de meshes de equipamentos atualmente na cena.
 *          Este ref é gerenciado internamente pelo hook mas retornado para que outros hooks
 *          (e.g., para raycasting) possam acessá-lo.
 */
export function useEquipmentRenderer({
  sceneRef,
  cameraRef,
  controlsRef,
  isSceneReady,
  isControlsReady,
  equipmentData,
  layers,
  colorMode,
  createSingleEquipmentMesh,
  groundMeshRef,
}: UseEquipmentRendererProps): React.RefObject<THREE.Object3D[]> {
  const equipmentMeshesRef = useRef<THREE.Object3D[]>([]);

  useEffect(() => {
    if (!isSceneReady || !isControlsReady || !sceneRef.current || !cameraRef.current || !controlsRef.current || !Array.isArray(equipmentData)) {
      if (equipmentMeshesRef.current.length > 0 && sceneRef.current) {
         updateEquipmentMeshesInScene({
            scene: sceneRef.current,
            equipmentMeshesRef: equipmentMeshesRef,
            newEquipmentData: [],
            layers,
            colorMode,
            createSingleEquipmentMesh,
            groundMeshRef,
         });
      }
      return;
    }

    updateEquipmentMeshesInScene({
      scene: sceneRef.current,
      equipmentMeshesRef: equipmentMeshesRef,
      newEquipmentData: equipmentData,
      layers,
      colorMode,
      createSingleEquipmentMesh,
      groundMeshRef,
    });
  }, [equipmentData, layers, colorMode, isSceneReady, isControlsReady, sceneRef, createSingleEquipmentMesh, groundMeshRef, cameraRef, controlsRef]);

  return equipmentMeshesRef;
}
