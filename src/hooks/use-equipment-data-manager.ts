
/**
 * @module hooks/useEquipmentDataManager
 * Hook customizado para gerenciar os dados dos equipamentos, atuando como uma fachada para o repositório em memória.
 *
 * Este hook é responsável por:
 * -   Obter e manter uma cópia local (estado React) dos dados de todos os equipamentos
 *     a partir do `equipmentRepository`.
 * -   Fornecer funções para modificar propriedades específicas dos equipamentos, como
 *     estado operacional e produto. Essas modificações são persistidas no `equipmentRepository`.
 * -   Após cada modificação no repositório, o estado local do hook é atualizado para
 *     refletir os dados mais recentes, garantindo a reatividade da UI.
 * -   Utilizar `useToast` para fornecer feedback visual ao usuário sobre as operações.
 *
 * @see {@link ../../core/repository/memory-repository/README.md#equipmentRepository} Para a fonte de dados.
 * @see {@link ../../lib/types/README.md#Equipment} Para a interface de Equipamento.
 * @returns Objeto contendo os dados dos equipamentos e funções para modificá-los e atualizá-los.
 *
 * @example
 * // Diagrama de Interação do useEquipmentDataManager:
 * ```mermaid
 * graph TD
 *     A[Componente UI (ex: InfoPanel)] -- chama --> B(handleOperationalStateChange)
 *
 *     subgraph useEquipmentDataManager [Hook useEquipmentDataManager]
 *         direction LR
 *         B -- chama --> C[equipmentRepository.updateEquipment]
 *         C -- retorna --> B{Equipamento Atualizado}
 *         B -- chama --> D[equipmentRepository.getAllEquipment]
 *         D -- retorna --> E[setEquipmentData (Estado React)]
 *         E -- atualiza --> F[equipmentData (Estado React)]
 *         B -- chama --> G[toast]
 *     end
 *
 *     F -- usado por --> A
 *
 *    classDef hook fill:#lightblue,stroke:#333,stroke-width:2px;
 *    classDef state fill:#lightgoldenrodyellow,stroke:#333,stroke-width:2px;
 *    classDef func fill:#lightgreen,stroke:#333,stroke-width:2px;
 *    classDef repo fill:#lightcoral,stroke:#333,stroke-width:2px;
 *    classDef ui fill:#peachpuff,stroke:#333,stroke-width:2px;
 *
 *    class A ui;
 *    class B,G func;
 *    class C,D repo;
 *    class E,F state;
 *    class useEquipmentDataManager hook;
 * ```
 */
"use client";

import { useState, useCallback, useEffect } from 'react';
import type { Equipment } from '@/lib/types';
import { equipmentRepository } from '@/core/repository/memory-repository';
import { useToast } from '@/hooks/use-toast';

/**
 * Retorno do hook `useEquipmentDataManager`.
 * @interface UseEquipmentDataManagerReturn
 * @property {Equipment[]} equipmentData - A lista atual de todos os equipamentos (cópia local do estado do repositório).
 * @property {(equipmentTag: string, newState: string) => void} handleOperationalStateChange - Função para modificar
 *                                                                                             o estado operacional
 *                                                                                             de um equipamento específico.
 * @property {(equipmentTag: string, newProduct: string) => void} handleProductChange - Função para modificar o produto
 *                                                                                      associado a um equipamento específico.
 * @property {() => void} refreshEquipmentData - Função para recarregar os dados do repositório para o estado local do hook.
 */
export interface UseEquipmentDataManagerReturn {
  equipmentData: Equipment[];
  handleOperationalStateChange: (equipmentTag: string, newState: string) => void;
  handleProductChange: (equipmentTag: string, newProduct: string) => void;
  refreshEquipmentData: () => void; 
}

/**
 * Hook customizado para gerenciar os dados dos equipamentos, atuando como uma fachada para o `equipmentRepository`.
 * Inicializa os dados do repositório e fornece funções para modificar
 * propriedades como estado operacional e produto, com feedback via toast.
 * @returns {UseEquipmentDataManagerReturn} Um objeto contendo os dados dos equipamentos
 *                                         e funções para modificá-los.
 */
export function useEquipmentDataManager(): UseEquipmentDataManagerReturn {
  const [equipmentData, setEquipmentData] = useState<Equipment[]>(() => equipmentRepository.getAllEquipment());
  const { toast } = useToast();

  useEffect(() => {
    // Garante que o estado do hook está sincronizado com o repositório na montagem.
    setEquipmentData(equipmentRepository.getAllEquipment());
  }, []);

  /**
   * Recarrega os dados dos equipamentos do repositório para o estado local do hook.
   */
  const refreshEquipmentData = useCallback(() => {
    setEquipmentData(equipmentRepository.getAllEquipment());
  }, []);

  /**
   * Manipula a alteração do estado operacional de um equipamento.
   * Atualiza o repositório e, em seguida, o estado local do hook.
   * @param {string} equipmentTag - A tag do equipamento a ser modificado.
   * @param {string} newState - O novo estado operacional para o equipamento.
   */
  const handleOperationalStateChange = useCallback((equipmentTag: string, newState: string) => {
    const updatedEquipment = equipmentRepository.updateEquipment(equipmentTag, { operationalState: newState });
    if (updatedEquipment) {
      refreshEquipmentData(); // Atualiza o estado local com todos os dados do repositório
      toast({ title: "Estado Atualizado", description: `Estado de ${updatedEquipment.name || 'Equipamento'} alterado para ${newState}.` });
    } else {
      toast({ title: "Erro", description: `Equipamento com TAG ${equipmentTag} não encontrado.`, variant: "destructive" });
    }
  }, [toast, refreshEquipmentData]);

  /**
   * Manipula a alteração do produto de um equipamento.
   * Atualiza o repositório e, em seguida, o estado local do hook.
   * @param {string} equipmentTag - A tag do equipamento a ser modificado.
   * @param {string} newProduct - O novo produto para o equipamento.
   */
  const handleProductChange = useCallback((equipmentTag: string, newProduct: string) => {
    const updatedEquipment = equipmentRepository.updateEquipment(equipmentTag, { product: newProduct });
    if (updatedEquipment) {
      refreshEquipmentData(); // Atualiza o estado local
      toast({ title: "Produto Atualizado", description: `Produto de ${updatedEquipment.name || 'Equipamento'} alterado para ${newProduct}.` });
    } else {
      toast({ title: "Erro", description: `Equipamento com TAG ${equipmentTag} não encontrado.`, variant: "destructive" });
    }
  }, [toast, refreshEquipmentData]);

  return {
    equipmentData,
    handleOperationalStateChange,
    handleProductChange,
    refreshEquipmentData,
  };
}
