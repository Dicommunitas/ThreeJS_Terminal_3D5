
/**
 * @module hooks/useCommandHistory
 * Custom hook que fornece funcionalidade para gerenciar um histórico de comandos,
 * permitindo operações de desfazer (undo) e refazer (redo).
 *
 * Principal Responsabilidade:
 * Manter uma pilha de comandos executados, permitir a execução de novos comandos,
 * e fornecer a capacidade de navegar para frente (redo) e para trás (undo)
 * nesse histórico, chamando as funções `execute()` e `undo()` dos respectivos comandos.
 *
 * @example Diagrama de Estrutura do Hook e seus Retornos:
 * ```mermaid
 *   classDiagram
 *     class UseCommandHistoryReturn {
 *       +executeCommand(command: Command): void
 *       +undo(): void
 *       +redo(): void
 *       +canUndo: boolean
 *       +canRedo: boolean
 *       +commandHistory: Command[]
 *     }
 *     class Command {
 *       +id: string
 *       +type: string
 *       +description: string
 *       +execute(): void
 *       +undo(): void
 *     }
 *     UseCommandHistoryReturn ..> Command : manages array of
 *     class useCommandHistory {
 *       -state: CommandHistoryState
 *       +executeCommand()
 *       +undo()
 *       +redo()
 *     }
 *     useCommandHistory --|> UseCommandHistoryReturn : returns
 * ```
 */
import type { Command } from '@/lib/types';
import { useState, useCallback } from 'react';

/**
 * Interface para o estado interno do histórico de comandos.
 * @interface CommandHistoryState
 * @property {Command[]} history - Array de objetos de comando que foram executados.
 * @property {number} currentIndex - Índice do comando atual no array `history`.
 *                                  -1 se o histórico estiver vazio ou todos os comandos foram desfeitos.
 */
export interface CommandHistoryState {
  history: Command[];
  currentIndex: number;
}

/**
 * Retorno do hook `useCommandHistory`.
 * @interface UseCommandHistoryReturn
 * @property {(command: Command) => void} executeCommand - Executa um novo comando e o adiciona ao histórico.
 *                                                        Limpa o histórico de "redo" futuro.
 * @property {() => void} undo - Desfaz o último comando executado, se houver.
 * @property {() => void} redo - Refaz o último comando desfeito, se houver.
 * @property {boolean} canUndo - Verdadeiro se há comandos para desfazer, falso caso contrário.
 * @property {boolean} canRedo - Verdadeiro se há comandos para refazer, falso caso contrário.
 * @property {Command[]} commandHistory - O array completo do histórico de comandos, principalmente para depuração.
 */
export interface UseCommandHistoryReturn {
  executeCommand: (command: Command) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  commandHistory: Command[];
}

/**
 * Hook customizado para gerenciar um histórico de comandos, permitindo Undo e Redo.
 * Armazena uma lista de comandos e o índice atual, permitindo navegar para frente e para trás
 * através das ações do usuário que foram encapsuladas como comandos.
 * @param {CommandHistoryState} [initialState] - Estado inicial opcional para o histórico.
 *                                             Padrão: histórico vazio (`history: []`) e `currentIndex: -1`.
 * @returns {UseCommandHistoryReturn} Um objeto com funções para executar, desfazer, refazer comandos,
 * e flags indicando se undo/redo são possíveis, além do próprio histórico.
 */
export function useCommandHistory(initialState?: CommandHistoryState): UseCommandHistoryReturn {
  const [state, setState] = useState<CommandHistoryState>(
    initialState || { history: [], currentIndex: -1 }
  );

  /**
   * Executa um comando e o adiciona ao histórico.
   * Se houver comandos "futuros" (comandos que foram desfeitos e poderiam ser refeitos),
   * eles são descartados, pois uma nova ação invalida essa linha do tempo de redo.
   * @param {Command} command O comando a ser executado. A função `command.execute()` é chamada.
   */
  const executeCommand = useCallback((command: Command) => {
    command.execute();
    setState((prevState) => {
      const newHistory = prevState.history.slice(0, prevState.currentIndex + 1);
      newHistory.push(command);
      return {
        history: newHistory,
        currentIndex: newHistory.length - 1,
      };
    });
  }, []);

  /**
   * Desfaz o último comando executado (o comando no `currentIndex`).
   * Se não houver comandos para desfazer (`currentIndex < 0`), não faz nada.
   * Chama a função `undo()` do comando.
   */
  const undo = useCallback(() => {
    setState((prevState) => {
      if (prevState.currentIndex < 0) {
        return prevState;
      }
      const commandToUndo = prevState.history[prevState.currentIndex];
      commandToUndo.undo();
      return {
        ...prevState,
        currentIndex: prevState.currentIndex - 1,
      };
    });
  }, []);

  /**
   * Refaz o último comando desfeito (o comando após o `currentIndex`).
   * Se não houver comandos para refazer (`currentIndex` já é o último do histórico), não faz nada.
   * Chama a função `execute()` do comando a ser refeito.
   */
  const redo = useCallback(() => {
    setState((prevState) => {
      if (prevState.currentIndex >= prevState.history.length - 1) {
        return prevState;
      }
      const commandToRedo = prevState.history[prevState.currentIndex + 1];
      commandToRedo.execute();
      return {
        ...prevState,
        currentIndex: prevState.currentIndex + 1,
      };
    });
  }, []);

  const canUndo = state.currentIndex >= 0;
  const canRedo = state.currentIndex < state.history.length - 1;
  const commandHistory = state.history;

  return { executeCommand, undo, redo, canUndo, canRedo, commandHistory };
}
