
/**
 * @module hooks/useCameraManager
 * Hook customizado para gerenciar o estado e as interações da câmera 3D.
 *
 * Este hook é responsável por:
 * -   Manter o estado atual da câmera (posição e ponto de observação - `lookAt`).
 * -   Gerenciar a lógica para focar a câmera em sistemas específicos de equipamentos,
 *     incluindo a ciclagem entre diferentes visualizações (padrão, de cima, isométrica) para o mesmo sistema.
 * -   Integrar os movimentos de câmera (tanto os iniciados pelo usuário via `OrbitControls`
 *     quanto os programáticos como o foco em sistema) com o sistema de histórico de comandos,
 *     permitindo operações de Undo/Redo.
 * -   Expor o estado da câmera e funções para interagir com ela e responder a eventos.
 *
 * O estado da câmera (`currentCameraState`) é um estado React, garantindo que as atualizações
 * sejam propagadas para os componentes que o utilizam (e.g., `ThreeScene` para aplicar
 * o estado à câmera Three.js).
 *
 * @see {@link ../../lib/types/README.md#CameraState} Para a interface do estado da câmera.
 * @see {@link ../../lib/types/README.md#Command} Para a interface de comando (usada com `executeCommand`).
 * @see {@link ../../lib/types/README.md#TargetSystemInfo} Para a interface de informações do sistema alvo.
 * @param props - Propriedades para o hook, incluindo `executeCommand` para integração com histórico.
 * @returns Objeto contendo o estado da câmera, informações de foco, e funções para interagir com a câmera.
 *
 * @example
 * // Diagrama de Interação e Estado do useCameraManager:
 * ```mermaid
 * graph LR
 *     A[Terminal3DPage] -- chama --> B(handleSetCameraViewForSystem)
 *     B -- atualiza --> C{targetSystemToFrame};
 *     C -- atualiza --> D{focusedSystemNameUI};
 *     C -- atualiza --> E{currentViewIndexUI};
 *     A -- passa targetSystemToFrame --> F[ThreeScene]
 *
 *     F -- anima câmera e ao final chama --> G(onSystemFramed)
 *     G -- limpa --> C;
 *     F -- em interações manuais, chama --> H(handleCameraChangeFromScene)
 *
 *     H -- cria comando --> I{Comando}
 *     H -- chama --> J(executeCommand)
 *     J -- executa e salva --> I
 *
 *     subgraph useCameraManager [Hook useCameraManager]
 *         direction LR
 *         B
 *         G
 *         H
 *         C
 *         D
 *         E
 *         K[currentCameraState (Estado React)]
 *         L[lastCommittedCameraStateForUndoRef (Ref)]
 *     end
 *
 *     I -- no execute/undo --> M{setCurrentCameraState}
 *     M -- atualiza --> K
 *     K -- usado por --> F
 *
 *    classDef hook fill:#lightblue,stroke:#333,stroke-width:2px;
 *    classDef state fill:#lightgoldenrodyellow,stroke:#333,stroke-width:2px;
 *    classDef func fill:#lightgreen,stroke:#333,stroke-width:2px;
 *    classDef comp fill:#lightcoral,stroke:#333,stroke-width:2px;
 *
 *    class A,F comp;
 *    class B,G,H,J,M func;
 *    class C,D,E,K,L,I state;
 *    class useCameraManager hook;
 * ```
 */
"use client";

import { useState, useCallback, useRef } from 'react';
import type { CameraState, Command, TargetSystemInfo } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

// Número de visualizações disponíveis (default, topDown, isometric)
const NUMBER_OF_VIEWS = 3;

/** Posição inicial padrão da câmera: { x: 25, y: 20, z: 25 }. */
export const defaultInitialCameraPosition = { x: 25, y: 20, z: 25 };
/** Ponto de observação (lookAt) inicial padrão da câmera: { x: 0, y: 2, z: 0 }. */
export const defaultInitialCameraLookAt = { x: 0, y: 2, z: 0 };

/**
 * Props para o hook `useCameraManager`.
 * @interface UseCameraManagerProps
 * @property {(command: Command) => void} executeCommand - Função para executar comandos e adicioná-los ao histórico de undo/redo.
 */
export interface UseCameraManagerProps {
  executeCommand: (command: Command) => void;
}

/**
 * Retorno do hook `useCameraManager`.
 * @interface UseCameraManagerReturn
 * @property {CameraState} currentCameraState - O estado atual da câmera (posição e ponto de observação).
 * @property {TargetSystemInfo | null} targetSystemToFrame - O sistema alvo e o índice da visão para a câmera enquadrar. Null se nenhum foco ativo.
 * @property {string | null} focusedSystemNameUI - O nome do sistema atualmente focado (para UI, pode persistir mesmo após `targetSystemToFrame` ser limpo).
 * @property {number} currentViewIndexUI - O índice da visão atual para o sistema focado (para UI).
 * @property {(systemName: string) => void} handleSetCameraViewForSystem - Função para definir o sistema alvo e o índice da visão para a câmera enquadrar.
 * @property {(newSceneCameraState: CameraState, actionDescription?: string) => void} handleCameraChangeFromScene - Manipula mudanças de câmera provenientes da cena 3D (e.g., OrbitControls) e as registra no histórico.
 * @property {() => void} onSystemFramed - Callback para ser chamado pela `ThreeScene` após o enquadramento do sistema ser concluído.
 * @property {{ x: number; y: number; z: number }} defaultInitialCameraPosition - Exporta a posição inicial padrão da câmera.
 * @property {{ x: number; y: number; z: number }} defaultInitialCameraLookAt - Exporta o ponto de observação inicial padrão da câmera.
 */
export interface UseCameraManagerReturn {
  currentCameraState: CameraState; 
  targetSystemToFrame: TargetSystemInfo | null;
  focusedSystemNameUI: string | null;
  currentViewIndexUI: number;
  handleSetCameraViewForSystem: (systemName: string) => void;
  handleCameraChangeFromScene: (newSceneCameraState: CameraState, actionDescription?: string) => void;
  onSystemFramed: () => void;
  defaultInitialCameraPosition: { x: number; y: number; z: number };
  defaultInitialCameraLookAt: { x: number; y: number; z: number };
}

/**
 * Hook customizado para gerenciar o estado e as interações da câmera 3D.
 * Responsável pelo estado da câmera, foco em sistemas e integração com o histórico de comandos.
 * @param {UseCameraManagerProps} props As props do hook, incluindo `executeCommand` para integração com o histórico.
 * @returns {UseCameraManagerReturn} Um objeto contendo o estado da câmera e funções para interagir com ela.
 */
export function useCameraManager({ executeCommand }: UseCameraManagerProps): UseCameraManagerReturn {
  const [targetSystemToFrame, setTargetSystemToFrame] = useState<TargetSystemInfo | null>(null);
  const [focusedSystemNameUI, setFocusedSystemNameUI] = useState<string | null>(null);
  const [currentViewIndexUI, setCurrentViewIndexUI] = useState<number>(0);

  const focusedSystemRef = useRef<string | null>(null);
  const currentViewIndexRef = useRef<number>(0);

  const [currentCameraState, setCurrentCameraState] = useState<CameraState>(() => ({
    position: { ...defaultInitialCameraPosition },
    lookAt: { ...defaultInitialCameraLookAt },
  }));
  const lastCommittedCameraStateForUndoRef = useRef<CameraState>({ ...currentCameraState });


  const { toast } = useToast();

  /**
   * Define o sistema alvo e o índice da visão para a câmera enquadrar.
   * Se o mesmo sistema é clicado repetidamente, cicla entre as visualizações disponíveis.
   * @param {string} systemName - O nome do sistema para focar.
   */
  const handleSetCameraViewForSystem = useCallback((systemName: string) => {
    let nextViewIndex: number;
    if (systemName === focusedSystemRef.current) {
      nextViewIndex = (currentViewIndexRef.current + 1) % NUMBER_OF_VIEWS;
    } else {
      nextViewIndex = 0; // Reseta para a visão padrão ao focar em um novo sistema
    }
    focusedSystemRef.current = systemName;
    currentViewIndexRef.current = nextViewIndex;
    setFocusedSystemNameUI(systemName); // Atualiza estado para UI
    setCurrentViewIndexUI(nextViewIndex); // Atualiza estado para UI

    const newTargetSystemInfo: TargetSystemInfo = {
      systemName,
      viewIndex: nextViewIndex
    };
    setTargetSystemToFrame(newTargetSystemInfo);
  }, [setTargetSystemToFrame, setFocusedSystemNameUI, setCurrentViewIndexUI]);


  /**
   * Manipula mudanças de câmera provenientes da cena 3D (e.g., interações do usuário com OrbitControls)
   * ou de animações programáticas concluídas. Registra a mudança no histórico de comandos.
   * @param {CameraState} newSceneCameraState - O novo estado da câmera.
   * @param {string} [actionDescription] - Descrição opcional da ação para o histórico (e.g., "Foco no sistema X").
   */
  const handleCameraChangeFromScene = useCallback((newSceneCameraState: CameraState, actionDescription?: string) => {
    const oldStateForUndo = { ...lastCommittedCameraStateForUndoRef.current };

    const command: Command = {
      id: `camera-move-${Date.now()}`,
      type: 'CAMERA_MOVE',
      description: actionDescription || 'Câmera movida pelo usuário',
      execute: () => {
        setCurrentCameraState(newSceneCameraState); // Atualiza o estado React da câmera
        lastCommittedCameraStateForUndoRef.current = { ...newSceneCameraState }; // Atualiza o ref para o próximo undo
      },
      undo: () => {
        setCurrentCameraState(oldStateForUndo); // Restaura o estado React da câmera
        lastCommittedCameraStateForUndoRef.current = { ...oldStateForUndo }; // Restaura o ref
      },
    };
    executeCommand(command);
  }, [executeCommand]);


  /**
   * Callback para ser chamado pela `ThreeScene` após o enquadramento do sistema ser concluído.
   * Reseta `targetSystemToFrame`, indicando que o processo de foco foi finalizado.
   */
  const onSystemFramed = useCallback(() => {
    setTargetSystemToFrame(null);
  }, [setTargetSystemToFrame]);

  return {
    currentCameraState,
    targetSystemToFrame,
    focusedSystemNameUI,
    currentViewIndexUI,
    handleSetCameraViewForSystem,
    handleCameraChangeFromScene,
    onSystemFramed,
    defaultInitialCameraPosition,
    defaultInitialCameraLookAt,
  };
}
