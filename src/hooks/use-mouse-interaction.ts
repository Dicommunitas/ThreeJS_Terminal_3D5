
"use client";

import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';

/**
 * @module hooks/useMouseInteractionManager
 * Custom hook para gerenciar interações do mouse (clique e movimento)
 * com objetos 3D em uma cena Three.js, especificamente para seleção e hover de equipamentos.
 * Anteriormente parte de `core/three/mouse-interaction-manager.ts`, agora encapsulado como hook.
 *
 * Principal Responsabilidade:
 * Encapsular a lógica de raycasting para detectar interseções do mouse com meshes de
 * equipamentos. Dispara callbacks fornecidos (`onSelectEquipment`, `setHoveredEquipmentTag`)
 * com base nessas interações. Adiciona e remove os ouvintes de eventos de mouse
 * do elemento de montagem da cena.
 * 
 * @example
 * // Diagrama de Composição e Dependências:
 * ```mermaid
 *   classDiagram
 *     class UseMouseInteractionManagerProps {
 *       +mountRef: RefObject_HTMLDivElement_
 *       +cameraRef: RefObject_PerspectiveCamera_
 *       +equipmentMeshesRef: RefObject_Object3D_Array_
 *       +isSceneReady: boolean
 *       +onSelectEquipment(tag: string | null, isMultiSelect: boolean): void
 *       +setHoveredEquipmentTag(tag: string | null): void
 *     }
 *     class useMouseInteractionManager {
 *
 *     }
 *     class ReactFCHook {
 *
 *     }
 *     class RefObject_HTMLDivElement_ {
 *     }
 *     class RefObject_PerspectiveCamera_ {
 *     }
 *     class RefObject_Object3D_Array_ {
 *     }
 *     useMouseInteractionManager --|> ReactFCHook
 *     UseMouseInteractionManagerProps ..> RefObject_HTMLDivElement_
 *     UseMouseInteractionManagerProps ..> RefObject_PerspectiveCamera_
 *     UseMouseInteractionManagerProps ..> RefObject_Object3D_Array_
 * ```
 */

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export interface UseMouseInteractionManagerProps {
  mountRef: React.RefObject<HTMLDivElement | null>;
  cameraRef: React.RefObject<THREE.PerspectiveCamera | null>;
  equipmentMeshesRef: React.RefObject<THREE.Object3D[] | null>;
  isSceneReady: boolean;
  onSelectEquipment: (tag: string | null, isMultiSelectModifierPressed: boolean) => void;
  setHoveredEquipmentTag: (tag: string | null) => void;
}

/**
 * Hook customizado para gerenciar interações do mouse (clique e movimento)
 * para seleção e hover de equipamentos em uma cena Three.js.
 *
 * @param {UseMouseInteractionManagerProps} props As props do hook.
 */
export function useMouseInteractionManager({
  mountRef,
  cameraRef,
  equipmentMeshesRef,
  isSceneReady,
  onSelectEquipment,
  setHoveredEquipmentTag,
}: UseMouseInteractionManagerProps): void {

  const onSelectEquipmentRef = useRef(onSelectEquipment);
  const setHoveredEquipmentTagRef = useRef(setHoveredEquipmentTag);

  useEffect(() => { onSelectEquipmentRef.current = onSelectEquipment; }, [onSelectEquipment]);
  useEffect(() => { setHoveredEquipmentTagRef.current = setHoveredEquipmentTag; }, [setHoveredEquipmentTag]);

  /**
   * Processa um evento de clique do mouse na cena para selecionar equipamento.
   */
  const processSceneClickInternal = useCallback((
    event: MouseEvent,
    currentMount: HTMLDivElement,
    currentCamera: THREE.PerspectiveCamera,
    currentMeshes: THREE.Object3D[],
    callback: (tag: string | null, isMultiSelect: boolean) => void
  ) => {
    const rect = currentMount.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, currentCamera);
    const visibleMeshes = currentMeshes.filter(m => m.visible);
    const intersects = raycaster.intersectObjects(visibleMeshes, true);

    const isMultiSelectModifierPressed = event.ctrlKey || event.metaKey;
    let tagToSelect: string | null = null;

    if (intersects.length > 0) {
      let selectedObject = intersects[0].object;
      while (selectedObject.parent && !selectedObject.userData.tag) {
        if (selectedObject.parent instanceof THREE.Scene) break; 
        selectedObject = selectedObject.parent;
      }
      if (selectedObject.userData.tag) {
        tagToSelect = selectedObject.userData.tag as string;
      }
    }
    callback(tagToSelect, isMultiSelectModifierPressed);
  }, []);

  /**
   * Processa um evento de movimento do mouse na cena para detectar equipamento em hover.
   */
  const processSceneMouseMoveInternal = useCallback((
    event: MouseEvent,
    currentMount: HTMLDivElement,
    currentCamera: THREE.PerspectiveCamera,
    currentMeshes: THREE.Object3D[],
    callback: (tag: string | null) => void
  ) => {
    const rect = currentMount.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, currentCamera);
    const visibleMeshes = currentMeshes.filter(m => m.visible);
    const intersects = raycaster.intersectObjects(visibleMeshes, true);

    let foundHoverTag: string | null = null;
    if (intersects.length > 0) {
      let hoveredObjectCandidate = intersects[0].object;
      while (hoveredObjectCandidate.parent && !hoveredObjectCandidate.userData.tag) {
        if (hoveredObjectCandidate.parent instanceof THREE.Scene) break;
        hoveredObjectCandidate = hoveredObjectCandidate.parent;
      }
      if (hoveredObjectCandidate.userData.tag) {
        foundHoverTag = hoveredObjectCandidate.userData.tag as string;
      }
    }
    callback(foundHoverTag);
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isSceneReady || !mountRef.current || !cameraRef.current || !equipmentMeshesRef.current) {
      return;
    }
    processSceneMouseMoveInternal(
      event,
      mountRef.current,
      cameraRef.current,
      equipmentMeshesRef.current, 
      setHoveredEquipmentTagRef.current
    );
  }, [isSceneReady, mountRef, cameraRef, equipmentMeshesRef, processSceneMouseMoveInternal]);

  const handleClick = useCallback((event: MouseEvent) => {
    if (event.button !== 0) return; 
    if (!isSceneReady || !mountRef.current || !cameraRef.current || !equipmentMeshesRef.current) {
      return;
    }
    processSceneClickInternal(
      event,
      mountRef.current,
      cameraRef.current,
      equipmentMeshesRef.current, 
      onSelectEquipmentRef.current
    );
  }, [isSceneReady, mountRef, cameraRef, equipmentMeshesRef, processSceneClickInternal]);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (currentMount && isSceneReady) {
      currentMount.addEventListener('click', handleClick);
      currentMount.addEventListener('mousemove', handleMouseMove);
      return () => {
        currentMount.removeEventListener('click', handleClick);
        currentMount.removeEventListener('mousemove', handleMouseMove);
      };
    }
    return () => {
        currentMount?.removeEventListener('click', handleClick);
        currentMount?.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mountRef, isSceneReady, handleClick, handleMouseMove]);
}
