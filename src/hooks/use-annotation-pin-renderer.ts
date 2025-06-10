
"use client";

import type * as THREE from 'three';
import { useEffect, useRef } from 'react';
import type { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import type { Annotation, Equipment, Layer } from '@/lib/types';
import { updateAnnotationPins } from '@/core/three/label-renderer-utils';

/**
 * Custom hook para gerenciar a renderização de pins de anotação na cena 3D.
 *
 * Principal Responsabilidade:
 * Encapsular a lógica de criação, atualização e remoção dos `CSS2DObject` (pins)
 * que representam as anotações. Observa mudanças nas anotações, dados dos equipamentos
 * (para posicionamento), e camadas de visibilidade, atualizando os pins conforme necessário.
 * Utiliza `updateAnnotationPins` de `label-renderer-utils.ts` para a lógica de sincronização.
 * ```mermaid
 *   classDiagram
 *     class UseAnnotationPinRendererProps {
 *       +sceneRef: RefObject_Scene_
 *       +labelRendererRef: RefObject_CSS2DRenderer_
 *       +isSceneReady: boolean
 *       +annotations: Annotation[]
 *       +allEquipmentData: Equipment[] // Full list for correct positioning
 *       +layers: Layer[]
 *     }
 *     class useAnnotationPinRenderer {
 *
 *     }
 *     class ReactFCHook {
 *
 *     }
 *     class label_renderer_utils{
 *
 *     }
 *     class Annotation {
 *
 *     }
 *     class Equipment {
 *
 *     }
 *     class Layer {
 *
 *     }
 *     class RefObject_Scene_ {
 *
 *     }
 *     class RefObject_CSS2DRenderer_ {
 *
 *     }
 *     useAnnotationPinRenderer --|> ReactFCHook
 *     useAnnotationPinRenderer ..> label_renderer_utils : uses updateAnnotationPins
 *     UseAnnotationPinRendererProps ..> Annotation
 *     UseAnnotationPinRendererProps ..> Equipment
 *     UseAnnotationPinRendererProps ..> Layer
 *     UseAnnotationPinRendererProps ..> RefObject_Scene_
 *     UseAnnotationPinRendererProps ..> RefObject_CSS2DRenderer_
 * ```
 * 
 */
export interface UseAnnotationPinRendererProps {
  sceneRef: React.RefObject<THREE.Scene | null>;
  labelRendererRef: React.RefObject<CSS2DRenderer | null>;
  isSceneReady: boolean;
  annotations: Annotation[];
  allEquipmentData: Equipment[]; // Crucial: Needs all equipment data for correct pin positioning,
                                // even if some equipment is visually filtered out from the main scene.
  layers: Layer[];
}

/**
 * Hook customizado para gerenciar a renderização (criação, atualização, remoção)
 * dos pins de anotação (`CSS2DObject`) na cena.
 *
 * @param {UseAnnotationPinRendererProps} props As props do hook.
 */
export function useAnnotationPinRenderer({
  sceneRef,
  labelRendererRef,
  isSceneReady,
  annotations,
  allEquipmentData, // Use the full list here
  layers,
}: UseAnnotationPinRendererProps): void {
  const annotationPinObjectsRef = useRef<CSS2DObject[]>([]);

  useEffect(() => {
    // console.log(`[useAnnotationPinRenderer] useEffect triggered. isSceneReady: ${isSceneReady}, annotations count: ${annotations.length}`);
    if (!isSceneReady || !sceneRef.current || !labelRendererRef.current || !Array.isArray(annotations) || !Array.isArray(allEquipmentData)) {
      // console.log('[useAnnotationPinRenderer] Skipping update: Scene not ready or data invalid.');
      return;
    }
    updateAnnotationPins({
      scene: sceneRef.current,
      labelRenderer: labelRendererRef.current,
      annotations: annotations,
      equipmentData: allEquipmentData, // Use allEquipmentData here
      layers: layers,
      existingPinsRef: annotationPinObjectsRef,
    });

    // Cleanup for pins (removing from scene and DOM)
    // This cleanup runs when dependencies change or component unmounts.
    return () => {
      // console.log('[useAnnotationPinRenderer] Cleanup: Removing annotation pins.');
      if (sceneRef.current) { // Check if scene still exists
        annotationPinObjectsRef.current.forEach(pinObj => {
          sceneRef.current?.remove(pinObj); // Use optional chaining
          if (pinObj.element.parentNode) {
            pinObj.element.parentNode.removeChild(pinObj.element);
          }
        });
      }
      annotationPinObjectsRef.current = []; // Clear the ref's array
    };
  }, [annotations, layers, allEquipmentData, isSceneReady, sceneRef, labelRendererRef]);
}
