
/**
 * @module hooks/useLayerManager
 * Custom hook para gerenciar o estado das camadas (layers) de visibilidade na cena 3D
 * e a lógica para alternar sua visibilidade.
 *
 * Principal Responsabilidade:
 * Manter o estado da lista de camadas (com seu ID, nome, tipo de equipamento que controla e visibilidade)
 * e fornecer uma função para alternar a visibilidade de uma camada específica.
 * Esta ação de alternância é integrada com o sistema de histórico de comandos (`useCommandHistory`)
 * para permitir undo/redo.
 *
 * @example Diagrama de Estrutura do Hook e suas Dependências:
 * ```mermaid
 *   classDiagram
 *     class UseLayerManagerProps {
 *       +executeCommand(command: Command): void
 *     }
 *     class UseLayerManagerReturn {
 *       +layers: Layer[]
 *       +handleToggleLayer(layerId: string): void
 *     }
 *     class Command {
 *       +id: string
 *       +type: string
 *       +description: string
 *       +execute(): void
 *       +undo(): void
 *     }
 *     class Layer {
 *       +id: string
 *       +name: string
 *       +equipmentType: string
 *       +isVisible: boolean
 *     }
 *     UseLayerManagerProps ..> Command
 *     UseLayerManagerReturn ..> Layer
 *     class useLayerManager {
 *       -layers: Layer[]
 *       +handleToggleLayer()
 *     }
 *     useLayerManager --|> UseLayerManagerReturn : returns
 *     useLayerManager ..> Command : uses (via executeCommand)
 *     useLayerManager ..> initialLayers_data : initializes with
 *     class initialLayers_data {
 *     }
 * ```
 */
"use client";

import { useState, useCallback } from 'react';
import type { Layer, Command } from '@/lib/types';
import { initialLayers } from '@/core/data/initial-data';

/**
 * Props para o hook `useLayerManager`.
 * @interface UseLayerManagerProps
 * @property {(command: Command) => void} executeCommand - Função para executar comandos
 *                                                        (e.g., alternância de visibilidade de camada)
 *                                                        e adicioná-los ao histórico de undo/redo.
 */
export interface UseLayerManagerProps {
  executeCommand: (command: Command) => void;
}

/**
 * Retorno do hook `useLayerManager`.
 * @interface UseLayerManagerReturn
 * @property {Layer[]} layers - A lista atual de todas as camadas e seus respectivos estados de visibilidade.
 * @property {(layerId: string) => void} handleToggleLayer - Função para alternar a visibilidade de uma camada específica.
 *                                                          Esta ação é registrada no histórico de comandos.
 */
export interface UseLayerManagerReturn {
  layers: Layer[];
  handleToggleLayer: (layerId: string) => void;
}

/**
 * Hook customizado para gerenciar o estado das camadas de visibilidade da cena e sua manipulação.
 * Inicializa as camadas com os dados de `initialLayers` e permite alternar a visibilidade
 * de cada camada, registrando a ação no histórico de comandos para suportar undo/redo.
 *
 * @param {UseLayerManagerProps} props As props do hook, principalmente `executeCommand` para
 *                                     integração com o sistema de histórico.
 * @returns {UseLayerManagerReturn} Um objeto contendo o estado atual das camadas e a função
 *                                  para alternar sua visibilidade.
 */
export function useLayerManager({ executeCommand }: UseLayerManagerProps): UseLayerManagerReturn {
  const [layers, setLayers] = useState<Layer[]>(initialLayers);

  /**
   * Manipula a alternância de visibilidade de uma camada específica.
   * Encontra a camada pelo `layerId`, cria um novo estado de camadas com a visibilidade
   * da camada alvo invertida, e então cria e executa um comando para o histórico de Undo/Redo
   * que aplicará essa mudança (e permitirá revertê-la).
   *
   * @param {string} layerId O ID da camada cuja visibilidade deve ser alternada.
   */
  const handleToggleLayer = useCallback((layerId: string) => {
    const layerIndex = layers.findIndex(l => l.id === layerId);
    if (layerIndex === -1) {
      return;
    }

    const oldLayersState = layers.map(l => ({ ...l }));
    const newLayersState = layers.map(l =>
      l.id === layerId ? { ...l, isVisible: !l.isVisible } : { ...l }
    );

    const toggledLayerName = oldLayersState[layerIndex].name;
    const newVisibilityStatus = newLayersState[layerIndex].isVisible ? 'ativada' : 'desativada';
    const commandDescription = `Visibilidade da camada "${toggledLayerName}" ${newVisibilityStatus}.`;

    const command: Command = {
      id: `toggle-layer-${layerId}-${Date.now()}`,
      type: 'LAYER_VISIBILITY',
      description: commandDescription,
      execute: () => {
        setLayers(newLayersState);
      },
      undo: () => {
        setLayers(oldLayersState);
      },
    };
    executeCommand(command);
  }, [layers, executeCommand]);

  return { layers, handleToggleLayer };
}
