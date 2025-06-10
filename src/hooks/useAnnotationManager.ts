
/**
 * Hook customizado para gerenciar o estado e a lógica das anotações textuais dos equipamentos,
 * atuando como uma fachada para o `annotationRepository`.
 *
 * Este hook é responsável por:
 * -   Obter e manter uma cópia local (estado React) das anotações a partir do `annotationRepository`.
 * -   Gerenciar o estado do diálogo de adição/edição de anotações (`isAnnotationDialogOpen`, `editingAnnotation`, `annotationTargetEquipment`).
 * -   Fornecer uma API (funções `handleOpenAnnotationDialog`, `handleSaveAnnotation`, `handleDeleteAnnotation`, `getAnnotationForEquipment`)
 *     para criar, ler, atualizar e excluir anotações. Estas operações persistem as mudanças no `annotationRepository`.
 * -   Após cada modificação no repositório, o estado local de anotações do hook é atualizado para
 *     refletir os dados mais recentes, garantindo a reatividade da UI.
 * -   Utilizar `useToast` para fornecer feedback visual ao usuário sobre as operações de anotação.
 *
 * @see {@link /documentation/api/core/repository/memory-repository/README.md#annotationrepository} Para a fonte de dados das anotações.
 * @see {@link /documentation/api/core/repository/memory-repository/README.md#equipmentrepository} Para obter dados de equipamentos (e.g., nome para toasts).
 * @see {@link /documentation/api/lib/types/README.md#annotation} Para a interface de Anotação.
 * @see {@link /documentation/api/lib/types/README.md#equipment} Para a interface de Equipamento.
 * @param props - Propriedades de configuração para o hook (atualmente, `initialAnnotations` é opcional e usado para uma potencial inicialização única do repositório, embora o repositório seja auto-inicializável).
 * @returns Objeto contendo o estado das anotações, o estado do diálogo e funções para manipular anotações.
 *
 * ```mermaid
 * graph TD
 *     A[Componente UI (ex: InfoPanel)] -- chama --> B(handleOpenAnnotationDialog)
 *     B -- define estados --> DialogState["isAnnotationDialogOpen, editingAnnotation, annotationTargetEquipment"]
 *
 *     C[Componente UI (ex: AnnotationDialog)] -- no submit --> D(handleSaveAnnotation)
 *
 *     subgraph useAnnotationManager [Hook useAnnotationManager]
 *         direction LR
 *         D -- chama --> E[annotationRepository.addOrUpdateAnnotation]
 *         E -- retorna --> D{Anotação Salva}
 *         D -- chama --> F[refreshAnnotationsFromRepo]
 *         F -- chama --> G[annotationRepository.getAllAnnotations]
 *         G -- retorna --> H[setAnnotationsState (Estado React)]
 *         H -- atualiza --> I[annotations (Estado React)]
 *         D -- chama --> J[toast]
 *         DialogState
 *     end
 *
 *     I -- usado por --> A
 *     DialogState -- usado por --> C
 *
 *    classDef hook fill:#lightblue,stroke:#333,stroke-width:2px;
 *    classDef state fill:#lightgoldenrodyellow,stroke:#333,stroke-width:2px;
 *    classDef func fill:#lightgreen,stroke:#333,stroke-width:2px;
 *    classDef repo fill:#lightcoral,stroke:#333,stroke-width:2px;
 *    classDef ui fill:#peachpuff,stroke:#333,stroke-width:2px;
 *
 *    class A,C ui;
 *    class B,D,F,J func;
 *    class E,G repo;
 *    class DialogState,H,I state;
 *    class useAnnotationManager hook;
 * ```
 */
"use client";

import { useState, useCallback, useEffect } from 'react';
import type { Annotation, Equipment } from '@/lib/types';
import { annotationRepository, equipmentRepository } from '@/core/repository/memory-repository';
import { useToast } from '@/hooks/use-toast';

/**
 * Props para o hook `useAnnotationManager`.
 * @interface UseAnnotationManagerProps
 * @property {Annotation[]} [initialAnnotations] - Lista inicial opcional de anotações. Pode ser usada para uma
 *                                                  inicialização única do repositório se ele estiver vazio e este array contiver dados.
 *                                                  No entanto, o `annotationRepository` é geralmente auto-inicializável.
 */
export interface UseAnnotationManagerProps {
  initialAnnotations?: Annotation[];
}

/**
 * Retorno do hook `useAnnotationManager`.
 * @interface UseAnnotationManagerReturn
 * @property {Annotation[]} annotations - A lista atual de todas as anotações (cópia local do estado do repositório).
 * @property {boolean} isAnnotationDialogOpen - Indica se o diálogo de anotação está aberto.
 * @property {Equipment | null} annotationTargetEquipment - O equipamento que é o alvo atual para adicionar/editar uma anotação.
 * @property {Annotation | null} editingAnnotation - A anotação que está atualmente em edição no diálogo (null se for uma nova anotação).
 * @property {(equipment: Equipment | null) => void} handleOpenAnnotationDialog - Abre o diálogo de anotação para o equipamento fornecido.
 * @property {(text: string) => void} handleSaveAnnotation - Salva (cria ou atualiza) a anotação para o `annotationTargetEquipment`.
 * @property {(equipmentTag: string) => void} handleDeleteAnnotation - Exclui a anotação associada à tag do equipamento fornecida.
 * @property {(equipmentTag: string | null) => Annotation | null} getAnnotationForEquipment - Retorna a anotação para a tag do equipamento fornecida, ou null se não existir.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setIsAnnotationDialogOpen - Função para definir o estado de abertura/fechamento do diálogo.
 */
export interface UseAnnotationManagerReturn {
  annotations: Annotation[];
  isAnnotationDialogOpen: boolean;
  annotationTargetEquipment: Equipment | null;
  editingAnnotation: Annotation | null;
  handleOpenAnnotationDialog: (equipment: Equipment | null) => void;
  handleSaveAnnotation: (text: string) => void;
  handleDeleteAnnotation: (equipmentTag: string) => void;
  getAnnotationForEquipment: (equipmentTag: string | null) => Annotation | null;
  setIsAnnotationDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Hook customizado para gerenciar anotações textuais associadas a equipamentos.
 * Atua como uma fachada para o `annotationRepository`, gerenciando o estado do diálogo de edição
 * e sincronizando o estado local de anotações com o repositório.
 * @param {UseAnnotationManagerProps} props - Propriedades de configuração para o hook.
 * @returns {UseAnnotationManagerReturn} Um objeto contendo o estado das anotações e funções para manipulá-las.
 */
export function useAnnotationManager({ initialAnnotations = [] }: UseAnnotationManagerProps): UseAnnotationManagerReturn {
  const [annotations, setAnnotationsState] = useState<Annotation[]>(() => annotationRepository.getAllAnnotations());
  const [isAnnotationDialogOpen, setIsAnnotationDialogOpen] = useState(false);
  const [annotationTargetEquipment, setAnnotationTargetEquipment] = useState<Equipment | null>(null);
  const [editingAnnotation, setEditingAnnotation] = useState<Annotation | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const currentRepoAnnotations = annotationRepository.getAllAnnotations();
    if (currentRepoAnnotations.length === 0 && initialAnnotations.length > 0 && !sessionStorage.getItem('annotationRepoInitializedHook')) {
      annotationRepository.initializeAnnotations(initialAnnotations);
      setAnnotationsState(annotationRepository.getAllAnnotations());
      sessionStorage.setItem('annotationRepoInitializedHook', 'true');
    } else {
      setAnnotationsState(currentRepoAnnotations);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  /**
   * Atualiza o estado local de anotações buscando os dados mais recentes do `annotationRepository`.
   */
  const refreshAnnotationsFromRepo = useCallback(() => {
    setAnnotationsState(annotationRepository.getAllAnnotations());
  }, []);

  /**
   * Abre o diálogo de anotação para um equipamento específico.
   * Se o equipamento já possui uma anotação, preenche o diálogo para edição.
   * @param {Equipment | null} equipment - O equipamento para o qual a anotação será gerenciada.
   */
  const handleOpenAnnotationDialog = useCallback((equipment: Equipment | null) => {
    if (equipment) {
      const existing = annotationRepository.getAnnotationByEquipmentTag(equipment.tag);
      setEditingAnnotation(existing || null);
      setAnnotationTargetEquipment(equipment);
      setIsAnnotationDialogOpen(true);
    } else {
      setTimeout(() => {
        toast({ title: "Nenhum Equipamento Selecionado", description: "Por favor, selecione um equipamento para gerenciar sua anotação.", variant: "destructive" });
      }, 0);
    }
  }, [toast]);

  /**
   * Salva uma anotação (nova ou existente) para o `annotationTargetEquipment`.
   * Atualiza a data de criação/modificação, persiste no repositório e atualiza o estado local.
   * @param {string} text - O texto da anotação a ser salvo.
   */
  const handleSaveAnnotation = useCallback((text: string) => {
    if (!annotationTargetEquipment) return;

    const equipmentName = annotationTargetEquipment.name;
    const currentDate = new Date().toISOString();

    const annotationToSave: Annotation = {
      equipmentTag: annotationTargetEquipment.tag,
      text,
      createdAt: currentDate,
    };

    annotationRepository.addOrUpdateAnnotation(annotationToSave);
    refreshAnnotationsFromRepo();

    const toastDescriptionMessage = editingAnnotation
        ? `Anotação para ${equipmentName} atualizada.`
        : `Anotação para ${equipmentName} adicionada.`;

    setTimeout(() => {
      toast({ title: "Anotação Salva", description: toastDescriptionMessage });
    }, 0);

    setIsAnnotationDialogOpen(false);
    setEditingAnnotation(null);
    setAnnotationTargetEquipment(null);
  }, [annotationTargetEquipment, editingAnnotation, toast, refreshAnnotationsFromRepo]);

  /**
   * Exclui a anotação de um equipamento específico.
   * Remove do repositório e atualiza o estado local.
   * @param {string} equipmentTag - A tag do equipamento cuja anotação será excluída.
   */
  const handleDeleteAnnotation = useCallback((equipmentTag: string) => {
    const equipment = equipmentRepository.getEquipmentByTag(equipmentTag);
    if (!equipment) return;

    const success = annotationRepository.deleteAnnotation(equipmentTag);

    let toastTitleMessage = "";
    let toastDescriptionMessage = "";
    let toastVariantValue: "default" | "destructive" | undefined = undefined;

    if (success) {
      refreshAnnotationsFromRepo();
      toastTitleMessage = "Anotação Excluída";
      toastDescriptionMessage = `Anotação para ${equipment.name} foi excluída.`;
      if (annotationTargetEquipment?.tag === equipmentTag) {
          setIsAnnotationDialogOpen(false);
          setEditingAnnotation(null);
          setAnnotationTargetEquipment(null);
      }
    } else {
      toastTitleMessage = "Nenhuma Anotação";
      toastDescriptionMessage = `Nenhuma anotação encontrada para ${equipment.name} para excluir.`;
      toastVariantValue = "destructive";
    }

    setTimeout(() => {
      toast({ title: toastTitleMessage, description: toastDescriptionMessage, variant: toastVariantValue });
    }, 0);
  }, [toast, annotationTargetEquipment, refreshAnnotationsFromRepo]);

  /**
   * Obtém a anotação para um equipamento específico diretamente do repositório.
   * @param {string | null} equipmentTag - A tag do equipamento. Se null, retorna null.
   * @returns {Annotation | null} A anotação encontrada (uma cópia), ou null se não existir.
   */
  const getAnnotationForEquipment = useCallback((equipmentTag: string | null): Annotation | null => {
    if (!equipmentTag) return null;
    return annotationRepository.getAnnotationByEquipmentTag(equipmentTag) || null;
  }, []);

  return {
    annotations,
    isAnnotationDialogOpen,
    setIsAnnotationDialogOpen,
    annotationTargetEquipment,
    editingAnnotation,
    handleOpenAnnotationDialog,
    handleSaveAnnotation,
    handleDeleteAnnotation,
    getAnnotationForEquipment,
  };
}
