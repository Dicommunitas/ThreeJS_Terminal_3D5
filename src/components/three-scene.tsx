
/**
 * Componente React principal para renderizar e interagir com a cena 3D usando Three.js.
 *
 * Este componente atua como um orquestrador para a visualização 3D.
 * Ele delega responsabilidades específicas de configuração e gerenciamento da cena
 * para hooks customizados especializados, e então renderiza o elemento DOM
 * onde a cena Three.js será montada.
 *
 * Responsabilidades Principais:
 * -   **Orquestração de Hooks da Cena:** Utiliza `useSceneSetup` como um hook orquestrador
 *     para obter refs para os componentes centrais da cena Three.js (cena, câmera, renderizadores, etc.)
 *     e flags que indicam a prontidão desses componentes.
 * -   **Renderização de Elementos da Cena:** Utiliza hooks especializados para gerenciar a
 *     renderização de diferentes tipos de objetos na cena:
 *     -   `useEquipmentRenderer`: Para os meshes dos equipamentos.
 *     -   `useAnnotationPinRenderer`: Para os pins (marcadores) de anotações HTML.
 * -   **Gerenciamento de Interação:** Utiliza `useMouseInteractionManager` para processar
 *     cliques e movimentos do mouse, permitindo a seleção e o hover em equipamentos.
 * -   **Efeitos Visuais:** Utiliza `useSceneOutline` para aplicar um efeito de contorno
 *     visual aos equipamentos selecionados ou sob o cursor.
 * -   **Loop de Animação:** Utiliza `useAnimationLoop` para gerenciar o ciclo de renderização
 *     contínua da cena (`requestAnimationFrame`).
 * -   **Controle de Câmera Programático:** Implementa a lógica para animar a câmera para
 *     visualizações específicas (e.g., focar em um sistema), observando a prop `targetSystemToFrame`
 *     e utilizando uma animação de interpolação suave.
 * -   **Comunicação de Estado da Câmera:** Propaga mudanças no estado da câmera (via `onCameraChange`)
 *     que ocorrem devido à interação do usuário ou animações programáticas.
 * -   **Fornecimento do Ponto de Montagem:** Renderiza o `div` que serve como contêiner para
 *     os renderizadores Three.js.
 *
 * @see {@link /documentation/api/hooks/use-scene-setup/README.md} Para a orquestração da configuração da cena.
 * @see {@link /documentation/api/hooks/use-equipment-renderer/README.md} Para a renderização de equipamentos.
 * @see {@link /documentation/api/hooks/use-annotation-pin-renderer/README.md} Para a renderização de pins de anotação.
 * @see {@link /documentation/api/hooks/use-mouse-interaction/README.md} Para interações do mouse.
 * @see {@link /documentation/api/hooks/use-scene-outline/README.md} Para o efeito de contorno.
 * @see {@link /documentation/api/hooks/useAnimationLoop/README.md} Para o loop de animação.
 *
 * Diagrama de Composição do ThreeScene e seus Hooks:
 * ```mermaid
 * graph TD
 *     ThreeScene_Comp["ThreeScene (Componente React)"]
 *     MountPoint["<div ref={mountRef}> (Ponto de Montagem DOM)"]
 *
 *     ThreeScene_Comp -- renderiza --> MountPoint
 *
 *     subgraph "Hooks Utilizados por ThreeScene"
 *         direction LR
 *         H_SceneSetup["useSceneSetup (Orquestrador de Setup)"]
 *         H_EquipRenderer["useEquipmentRenderer"]
 *         H_AnnotPinRenderer["useAnnotationPinRenderer"]
 *         H_MouseInt["useMouseInteractionManager"]
 *         H_Outline["useSceneOutline"]
 *         H_AnimLoop["useAnimationLoop"]
 *     end
 *
 *     ThreeScene_Comp -- usa --> H_SceneSetup
 *     ThreeScene_Comp -- usa --> H_EquipRenderer
 *     ThreeScene_Comp -- usa --> H_AnnotPinRenderer
 *     ThreeScene_Comp -- usa --> H_MouseInt
 *     ThreeScene_Comp -- usa --> H_Outline
 *     ThreeScene_Comp -- usa --> H_AnimLoop
 *
 *     H_SceneSetup --> R_Scene["sceneRef"]
 *     H_SceneSetup --> R_Camera["cameraRef"]
 *     H_SceneSetup --> R_Renderer["rendererRef"]
 *     H_SceneSetup --> R_LabelRenderer["labelRendererRef"]
 *     H_SceneSetup --> R_Controls["controlsRef"]
 *     H_SceneSetup --> R_Composer["composerRef"]
 *     H_SceneSetup --> R_OutlinePass["outlinePassRef"]
 *     H_SceneSetup --> F_IsSceneReady["isSceneReady (flag)"]
 *     H_SceneSetup --> F_IsControlsReady["isControlsReady (flag)"]
 *
 *     H_EquipRenderer -- usa --> R_Scene
 *     H_AnnotPinRenderer -- usa --> R_Scene
 *     H_AnnotPinRenderer -- usa --> R_LabelRenderer
 *     H_MouseInt -- usa --> MountPoint
 *     H_MouseInt -- usa --> R_Camera
 *     H_Outline -- usa --> R_OutlinePass
 *     H_AnimLoop -- usa --> R_Scene
 *     H_AnimLoop -- usa --> R_Camera
 *     H_AnimLoop -- usa --> R_Controls
 *     H_AnimLoop -- usa --> R_Composer
 *     H_AnimLoop -- usa --> R_LabelRenderer
 *
 *     classDef comp fill:#lightcoral,stroke:#333,stroke-width:2px;
 *     classDef hook fill:#lightblue,stroke:#333,stroke-width:2px;
 *     classDef ref fill:#lightgoldenrodyellow,stroke:#333,stroke-width:2px;
 *     classDef flag fill:#lightpink,stroke:#333,stroke-width:2px;
 *
 *     class ThreeScene_Comp comp;
 *     class MountPoint comp;
 *     class H_SceneSetup,H_EquipRenderer,H_AnnotPinRenderer,H_MouseInt,H_Outline,H_AnimLoop hook;
 *     class R_Scene,R_Camera,R_Renderer,R_LabelRenderer,R_Controls,R_Composer,R_OutlinePass ref;
 *     class F_IsSceneReady,F_IsControlsReady flag;
 * ```
 */
"use client";

import React, { useRef, useEffect, useCallback, useState } from 'react';
import * as THREE from 'three';

// Hooks
import { useSceneSetup, type UseSceneSetupReturn } from '@/hooks/use-scene-setup';
import { useEquipmentRenderer } from '@/hooks/use-equipment-renderer';
import { useAnnotationPinRenderer } from '@/hooks/use-annotation-pin-renderer';
import { useMouseInteractionManager } from '@/hooks/use-mouse-interaction';
import { useSceneOutline } from '@/hooks/use-scene-outline';
import { useAnimationLoop } from '@/hooks/use-animation-loop';

// Types & Utils
import type { Equipment, Layer, CameraState, Annotation, ColorMode, TargetSystemInfo, SystemViewOptions, SystemView } from '@/lib/types';
import { getEquipmentColor } from '@/core/graphics/color-utils';
import { createGeometryForItem } from '@/core/three/equipment-geometry-factory';
import { calculateViewForMeshes } from '@/core/three/camera-utils';

/**
 * Props para o componente ThreeScene.
 * @interface ThreeSceneProps
 * @property {Equipment[]} equipment - Lista de equipamentos filtrados a serem renderizados na cena.
 * @property {Equipment[]} allEquipmentData - Lista completa de todos os equipamentos, para contexto (e.g., anotações).
 * @property {Layer[]} layers - Configuração das camadas de visibilidade.
 * @property {Annotation[]} annotations - Lista de anotações a serem exibidas.
 * @property {string[] | undefined} selectedEquipmentTags - Tags dos equipamentos atualmente selecionados.
 * @property {(tag: string | null, isMultiSelectModifierPressed: boolean) => void} onSelectEquipment - Callback para quando um equipamento é selecionado/deselecionado.
 * @property {string | null | undefined} hoveredEquipmentTag - Tag do equipamento atualmente sob o cursor.
 * @property {(tag: string | null) => void} setHoveredEquipmentTag - Callback para definir o equipamento em hover.
 * @property {CameraState | undefined} cameraState - O estado atual da câmera (posição, lookAt) gerenciado externamente. Pode ser indefinido durante a inicialização.
 * @property {(cameraState: CameraState, actionDescription?: string) => void} onCameraChange - Callback para quando o estado da câmera muda, com uma descrição opcional da ação.
 * @property {{ x: number; y: number; z: number }} initialCameraPosition - Posição inicial da câmera.
 * @property {{ x: number; y: number; z: number }} initialCameraLookAt - Ponto de observação (lookAt) inicial da câmera.
 * @property {ColorMode} colorMode - O modo de colorização atual para os equipamentos.
 * @property {TargetSystemInfo | null} targetSystemToFrame - O sistema que deve ser enquadrado pela câmera (se houver), incluindo o índice da visão.
 * @property {() => void} onSystemFramed - Callback chamado após a câmera terminar de enquadrar um sistema.
 */
export interface ThreeSceneProps {
  equipment: Equipment[];
  allEquipmentData: Equipment[];
  layers: Layer[];
  annotations: Annotation[];
  selectedEquipmentTags: string[] | undefined;
  onSelectEquipment: (tag: string | null, isMultiSelectModifierPressed: boolean) => void;
  hoveredEquipmentTag: string | null | undefined;
  setHoveredEquipmentTag: (tag: string | null) => void;
  cameraState: CameraState | undefined;
  onCameraChange: (cameraState: CameraState, actionDescription?: string) => void;
  initialCameraPosition: { x: number; y: number; z: number };
  initialCameraLookAt: { x: number; y: number; z: number };
  colorMode: ColorMode;
  targetSystemToFrame: TargetSystemInfo | null;
  onSystemFramed: () => void;
}

const ANIMATION_DURATION_MS = 700;

const positionEqualsWithTolerance = (v1: THREE.Vector3, v2: THREE.Vector3, epsilon: number = 0.001): boolean => {
  return (
    Math.abs(v1.x - v2.x) < epsilon &&
    Math.abs(v1.y - v2.y) < epsilon &&
    Math.abs(v1.z - v2.z) < epsilon
  );
};

/**
 * Componente React principal para renderizar e interagir com a cena 3D usando Three.js.
 * Atua como um orquestrador de hooks especializados que gerenciam diferentes aspectos da cena.
 * @param {ThreeSceneProps} props As props do componente.
 * @returns {JSX.Element} O elemento div que serve como contêiner para a cena 3D.
 */
const ThreeScene: React.FC<ThreeSceneProps> = (props) => {
  const {
    equipment,
    allEquipmentData,
    layers,
    annotations,
    selectedEquipmentTags,
    onSelectEquipment,
    hoveredEquipmentTag,
    setHoveredEquipmentTag,
    cameraState: programmaticCameraState,
    onCameraChange,
    initialCameraPosition,
    initialCameraLookAt,
    colorMode,
    targetSystemToFrame,
    onSystemFramed,
  } = props;

  const mountRef = useRef<HTMLDivElement>(null);

  const {
    sceneRef,
    cameraRef,
    rendererRef,
    labelRendererRef,
    controlsRef,
    composerRef,
    outlinePassRef,
    groundMeshRef,
    isSceneReady,
    isControlsReady,
  }: UseSceneSetupReturn = useSceneSetup({
    mountRef,
    initialCameraPosition,
    initialCameraLookAt,
    onCameraChange,
  });

  const onCameraChangeRef = useRef(onCameraChange);
  const onSystemFramedRef = useRef(onSystemFramed);
  useEffect(() => { onCameraChangeRef.current = onCameraChange; }, [onCameraChange]);
  useEffect(() => { onSystemFramedRef.current = onSystemFramed; }, [onSystemFramed]);

  const isAnimatingRef = useRef(false);
  const animationStartTimeRef = useRef(0);
  const animationStartPosRef = useRef<THREE.Vector3 | null>(null);
  const animationStartLookAtRef = useRef<THREE.Vector3 | null>(null);
  const animationTargetPosRef = useRef<THREE.Vector3 | null>(null);
  const animationTargetLookAtRef = useRef<THREE.Vector3 | null>(null);
  const animationOnCompleteCallbackRef = useRef<(() => void) | null>(null);

  const createSingleEquipmentMesh = useCallback((item: Equipment): THREE.Object3D => {
    const finalColor = getEquipmentColor(item, colorMode);
    const material = new THREE.MeshStandardMaterial({
      color: finalColor, metalness: 0.3, roughness: 0.6, transparent: false, opacity: 1.0,
    });
    
    const geometryOrGroup = createGeometryForItem(item);
    let meshOrGroup: THREE.Object3D;

    if (geometryOrGroup instanceof THREE.Group) {
        meshOrGroup = geometryOrGroup;
        // Aplica o material a todos os meshes filhos do grupo
        meshOrGroup.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                object.material = material;
                object.castShadow = false;
                object.receiveShadow = false;
            }
        });
    } else { // THREE.BufferGeometry
        meshOrGroup = new THREE.Mesh(geometryOrGroup, material);
        (meshOrGroup as THREE.Mesh).castShadow = false;
        (meshOrGroup as THREE.Mesh).receiveShadow = false;
    }
    
    meshOrGroup.position.set(item.position.x, item.position.y, item.position.z);
    if (item.rotation) {
      meshOrGroup.rotation.set(item.rotation.x, item.rotation.y, item.rotation.z);
    }
    meshOrGroup.userData = { tag: item.tag, type: item.type, sistema: item.sistema };
    meshOrGroup.visible = true; // Visibilidade inicial controlada aqui, pode ser ajustada por camadas
    
    return meshOrGroup;
  }, [colorMode]);

  const equipmentMeshesRef = useEquipmentRenderer({
    sceneRef,
    cameraRef,
    controlsRef,
    isSceneReady,
    isControlsReady,
    equipmentData: equipment,
    layers,
    colorMode,
    createSingleEquipmentMesh,
    groundMeshRef,
  });

  useAnnotationPinRenderer({
    sceneRef,
    labelRendererRef,
    isSceneReady,
    annotations,
    allEquipmentData,
    layers,
  });

  useMouseInteractionManager({
    mountRef,
    cameraRef,
    equipmentMeshesRef,
    isSceneReady: isSceneReady && isControlsReady,
    onSelectEquipment,
    setHoveredEquipmentTag,
  });

  useSceneOutline({
    outlinePassRef,
    equipmentMeshesRef,
    selectedEquipmentTags,
    hoveredEquipmentTag,
    isSceneReady,
  });

  const startCameraAnimation = useCallback((targetPos: THREE.Vector3, targetLookAt: THREE.Vector3, onComplete?: () => void) => {
    if (!cameraRef.current || !controlsRef.current) {
      onComplete?.();
      return;
    }
    animationStartPosRef.current = cameraRef.current.position.clone();
    animationStartLookAtRef.current = controlsRef.current.target.clone();
    animationTargetPosRef.current = targetPos;
    animationTargetLookAtRef.current = targetLookAt;
    animationStartTimeRef.current = performance.now();
    isAnimatingRef.current = true;
    animationOnCompleteCallbackRef.current = onComplete || null;
    if (controlsRef.current) {
        controlsRef.current.enabled = false;
    }
  }, [cameraRef, controlsRef]);

  useEffect(() => {
    if (programmaticCameraState && cameraRef.current && controlsRef.current && isSceneReady && isControlsReady) {
      const targetPosition = new THREE.Vector3(programmaticCameraState.position.x, programmaticCameraState.position.y, programmaticCameraState.position.z);
      const targetLookAt = new THREE.Vector3(programmaticCameraState.lookAt.x, programmaticCameraState.lookAt.y, programmaticCameraState.lookAt.z);
      const isAlreadyAtTarget = positionEqualsWithTolerance(cameraRef.current.position, targetPosition) && positionEqualsWithTolerance(controlsRef.current.target, targetLookAt);

      if (!isAlreadyAtTarget && !isAnimatingRef.current) {
        startCameraAnimation(targetPosition, targetLookAt);
      }
    }
  }, [programmaticCameraState, isSceneReady, isControlsReady, startCameraAnimation, cameraRef, controlsRef]);

  useEffect(() => {
    if (!targetSystemToFrame) return;
    if (!sceneRef.current || !cameraRef.current || !controlsRef.current || !isSceneReady || !isControlsReady) {
      onSystemFramedRef.current?.();
      return;
    }
    const equipmentMeshesToConsider = equipmentMeshesRef.current;
    if (!equipmentMeshesToConsider || (equipmentMeshesToConsider.length === 0 && targetSystemToFrame.systemName !== 'INITIAL_LOAD_NO_SYSTEM')) {
      onSystemFramedRef.current?.();
      return;
    }
    let systemMeshes: THREE.Object3D[] = [];
    if (targetSystemToFrame.systemName !== 'INITIAL_LOAD_NO_SYSTEM') {
      systemMeshes = equipmentMeshesToConsider.filter(mesh => mesh.userData.sistema === targetSystemToFrame.systemName && mesh.visible);
      if (systemMeshes.length === 0) {
        onSystemFramedRef.current?.();
        return;
      }
    } else {
      // Caso especial para 'INITIAL_LOAD_NO_SYSTEM', não precisa de meshes para calcular a vista.
      // A câmera já deve estar na posição inicial desejada pelo useCameraManager/useSceneSetup.
      onSystemFramedRef.current?.();
      return;
    }
    const viewOptions: SystemViewOptions | null = calculateViewForMeshes(systemMeshes, cameraRef.current);
    if (viewOptions) {
      let selectedView: SystemView;
      switch (targetSystemToFrame.viewIndex) {
        case 1: selectedView = viewOptions.topDown; break;
        case 2: selectedView = viewOptions.isometric; break;
        default: selectedView = viewOptions.default; break;
      }
      const targetPositionVec = new THREE.Vector3(selectedView.position.x, selectedView.position.y, selectedView.position.z);
      const targetLookAtVec = new THREE.Vector3(selectedView.lookAt.x, selectedView.lookAt.y, selectedView.lookAt.z);

      startCameraAnimation(targetPositionVec, targetLookAtVec, () => {
        if (cameraRef.current && controlsRef.current && onCameraChangeRef.current) {
          const finalStateAfterFocus: CameraState = {
            position: cameraRef.current.position.clone(),
            lookAt: controlsRef.current.target.clone(),
          };
          onCameraChangeRef.current(finalStateAfterFocus, `Foco no sistema ${targetSystemToFrame.systemName} (visão ${targetSystemToFrame.viewIndex})`);
        }
        onSystemFramedRef.current?.();
      });
    } else {
      onSystemFramedRef.current?.();
    }
  }, [targetSystemToFrame, isSceneReady, isControlsReady, equipmentMeshesRef, sceneRef, cameraRef, controlsRef, startCameraAnimation]);

  const handleFrameUpdate = useCallback(() => {
    if (isAnimatingRef.current && cameraRef.current && controlsRef.current && animationStartPosRef.current && animationStartLookAtRef.current && animationTargetPosRef.current && animationTargetLookAtRef.current) {
      const elapsedTime = performance.now() - animationStartTimeRef.current;
      let alpha = Math.min(elapsedTime / ANIMATION_DURATION_MS, 1);
      alpha = 1 - Math.pow(1 - alpha, 4); // ease-out quart
      cameraRef.current.position.lerpVectors(animationStartPosRef.current, animationTargetPosRef.current, alpha);
      controlsRef.current.target.lerpVectors(animationStartLookAtRef.current, animationTargetLookAtRef.current, alpha);
      controlsRef.current.update();
      if (alpha >= 1) {
        isAnimatingRef.current = false;
        if (controlsRef.current) {
            controlsRef.current.enabled = true;
        }
        animationOnCompleteCallbackRef.current?.();
        animationOnCompleteCallbackRef.current = null;
      }
    }
  }, [cameraRef, controlsRef]);

  useEffect(() => {
    const currentMount = mountRef.current;
    const handleWheel = (event: WheelEvent) => {
      if (isAnimatingRef.current) {
        isAnimatingRef.current = false;
        if (controlsRef.current) controlsRef.current.enabled = true;
        animationOnCompleteCallbackRef.current?.();
        animationOnCompleteCallbackRef.current = null;
      }
    };
    if (currentMount && (isSceneReady && isControlsReady)) {
      currentMount.addEventListener('wheel', handleWheel, { passive: true });
      return () => currentMount.removeEventListener('wheel', handleWheel);
    }
  }, [isSceneReady, isControlsReady, controlsRef, mountRef]);

  const overallReadyForAnimation = isSceneReady && isControlsReady;

  useAnimationLoop({
    isSceneReady: overallReadyForAnimation,
    sceneRef,
    cameraRef,
    controlsRef,
    composerRef,
    labelRendererRef,
    onFrameUpdate: handleFrameUpdate,
  });

  return <div ref={mountRef} className="w-full h-full" />;
};

export default ThreeScene;
