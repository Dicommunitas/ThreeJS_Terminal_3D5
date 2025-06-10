
/**
 * @module components/command-history-panel
 * Componente de painel para exibir controles de histórico de comandos (Undo/Redo).
 *
 * Principal Responsabilidade:
 * Renderizar botões que permitem ao usuário desfazer (Undo) e refazer (Redo)
 * ações previamente executadas na aplicação, com base no estado fornecido pelo
 * hook `useCommandHistory`.
 *
 * ```mermaid
 *   classDiagram
 *     class CommandHistoryPanelProps {
 *       +canUndo: boolean
 *       +canRedo: boolean
 *       +onUndo(): void
 *       +onRedo(): void
 *     }
 *     class CommandHistoryPanel {
 *
 *     }
 *     class ReactFC {
 *
 *     }
 *     class Button {
 *
 *     }
 *     class Card {
 *
 *     }
 *     class Undo2Icon {
 *
 *     }
 *     class Redo2Icon {
 *
 *     }
 *     CommandHistoryPanel --|> ReactFC
 *     CommandHistoryPanel ..> Button : uses
 *     CommandHistoryPanel ..> Card : uses
 *     CommandHistoryPanel ..> Undo2Icon : uses
 *     CommandHistoryPanel ..> Redo2Icon : uses
 * ```
 *
 */
"use client";

import { Button } from '@/components/ui/button';
import { Undo2Icon, Redo2Icon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Props para o componente CommandHistoryPanel.
 * @interface CommandHistoryPanelProps
 * @property {boolean} canUndo - Indica se a ação de desfazer está disponível.
 * @property {boolean} canRedo - Indica se a ação de refazer está disponível.
 * @property {() => void} onUndo - Callback chamado quando o botão "Undo" é clicado.
 * @property {() => void} onRedo - Callback chamado quando o botão "Redo" é clicado.
 */
export interface CommandHistoryPanelProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

/**
 * Renderiza um painel com botões de Undo e Redo.
 * A habilitação dos botões é controlada pelas props `canUndo` e `canRedo`.
 * @param {CommandHistoryPanelProps} props As props do componente.
 * @returns {JSX.Element} O componente CommandHistoryPanel.
 */
export function CommandHistoryPanel({ canUndo, canRedo, onUndo, onRedo }: CommandHistoryPanelProps): JSX.Element {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M12 20v-6M6 20V10M18 20V4"/><path d="m18 4-4 4h4Z"/><path d="m6 10-4 4h4Z"/></svg>
          Histórico
        </CardTitle>
      </CardHeader>
      <CardContent className="flex space-x-2">
        <Button variant="outline" onClick={onUndo} disabled={!canUndo} className="flex-1">
          <Undo2Icon className="mr-2 h-4 w-4" /> Desfazer
        </Button>
        <Button variant="outline" onClick={onRedo} disabled={!canRedo} className="flex-1">
          <Redo2Icon className="mr-2 h-4 w-4" /> Refazer
        </Button>
      </CardContent>
    </Card>
  );
}
