
/**
 * @module hooks/useFilterManager
 * Custom hook para gerenciar os estados de filtragem e a lógica de filtragem de equipamentos.
 *
 * Principal Responsabilidade:
 * Manter os critérios de filtro (termo de busca, sistema, área), derivar listas
 * de opções de filtro disponíveis (sistemas, áreas) e calcular a lista de
 * equipamentos que correspondem aos filtros atuais, utilizando `getFilteredEquipment`.
 *
 * @example Diagrama de Estrutura do Hook e suas Dependências:
 * ```mermaid
 *   classDiagram
 *     class UseFilterManagerProps {
 *       +allEquipment: Equipment[]
 *     }
 *     class UseFilterManagerReturn {
 *       +searchTerm: string
 *       +setSearchTerm(value: string): void
 *       +selectedSistema: string
 *       +setSelectedSistema(value: string): void
 *       +selectedArea: string
 *       +setSelectedArea(value: string): void
 *       +availableSistemas: string[]
 *       +availableAreas: string[]
 *       +filteredEquipment: Equipment[]
 *     }
 *     class Equipment {
 *       +tag: string
 *       +name: string
 *       +type: string
 *       +sistema?: string
 *       +area?: string
 *     }
 *     class equipment_filter_module {
 *       +getFilteredEquipment(allEquipment: Equipment[], criteria: EquipmentFilterCriteria): Equipment[]
 *     }
 *     class EquipmentFilterCriteria {
 *     }
 *     UseFilterManagerProps ..> Equipment
 *     UseFilterManagerReturn ..> Equipment
 *     class useFilterManager {
 *       -searchTerm: string
 *       -selectedSistema: string
 *       -selectedArea: string
 *       +setSearchTerm()
 *       +setSelectedSistema()
 *       +setSelectedArea()
 *     }
 *     useFilterManager --|> UseFilterManagerReturn : returns
 *     useFilterManager ..> equipment_filter_module : uses getFilteredEquipment
 *     equipment_filter_module ..> EquipmentFilterCriteria : uses
 * ```
 */
'use client';

import { useState, useMemo, type Dispatch, type SetStateAction } from 'react';
import type { Equipment } from '@/lib/types';
import { getFilteredEquipment, type EquipmentFilterCriteria } from '@/core/logic/equipment-filter';

/**
 * Props para o hook `useFilterManager`.
 * @interface UseFilterManagerProps
 * @property {Equipment[]} allEquipment - A lista completa de todos os equipamentos que podem ser filtrados.
 */
export interface UseFilterManagerProps {
  allEquipment: Equipment[];
}

/**
 * Retorno do hook `useFilterManager`.
 * @interface UseFilterManagerReturn
 * @property {string} searchTerm - O termo de busca textual atualmente aplicado.
 * @property {Dispatch<SetStateAction<string>>} setSearchTerm - Função para atualizar o `searchTerm`.
 * @property {string} selectedSistema - O sistema atualmente selecionado para filtro (e.g., "GA", "All").
 * @property {Dispatch<SetStateAction<string>>} setSelectedSistema - Função para atualizar o `selectedSistema`.
 * @property {string} selectedArea - A área atualmente selecionada para filtro (e.g., "Área 31", "All").
 * @property {Dispatch<SetStateAction<string>>} setSelectedArea - Função para atualizar o `selectedArea`.
 * @property {string[]} availableSistemas - Lista ordenada de sistemas únicos disponíveis para seleção no filtro, incluindo "All".
 * @property {string[]} availableAreas - Lista ordenada de áreas únicas disponíveis para seleção no filtro, incluindo "All".
 * @property {Equipment[]} filteredEquipment - A lista de equipamentos resultante após a aplicação de todos os filtros ativos.
 */
export interface UseFilterManagerReturn {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  selectedSistema: string;
  setSelectedSistema: Dispatch<SetStateAction<string>>;
  selectedArea: string;
  setSelectedArea: Dispatch<SetStateAction<string>>;
  availableSistemas: string[];
  availableAreas: string[];
  filteredEquipment: Equipment[];
}

/**
 * Hook customizado para gerenciar a lógica de filtragem de equipamentos.
 * Encapsula os estados dos filtros (termo de busca, sistema, área),
 * deriva as listas de opções de filtro disponíveis a partir dos dados dos equipamentos,
 * e calcula a lista resultante de equipamentos filtrados.
 *
 * @param {UseFilterManagerProps} props As propriedades para o hook, incluindo `allEquipment` (a lista completa de equipamentos).
 * @returns {UseFilterManagerReturn} Um objeto contendo o estado dos filtros, as funções para atualizá-los,
 *                                 as listas de opções de filtro disponíveis e a lista de equipamentos filtrados.
 */
export function useFilterManager({ allEquipment }: UseFilterManagerProps): UseFilterManagerReturn {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSistema, setSelectedSistema] = useState('All');
  const [selectedArea, setSelectedArea] = useState('All');

  /**
   * Lista de sistemas únicos disponíveis, derivada de `allEquipment`.
   * Inclui "All" como a primeira opção e é ordenada alfabeticamente.
   * Memoizada para otimizar performance, recalculando apenas se `allEquipment` mudar.
   */
  const availableSistemas = useMemo(() => {
    const sistemas = new Set<string>(['All']);
    allEquipment.forEach(equip => {
      if (equip.sistema) sistemas.add(equip.sistema);
    });
    return Array.from(sistemas).sort((a, b) => (a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b)));
  }, [allEquipment]);

  /**
   * Lista de áreas únicas disponíveis, derivada de `allEquipment`.
   * Inclui "All" como a primeira opção e é ordenada alfabeticamente.
   * Memoizada para otimizar performance.
   */
  const availableAreas = useMemo(() => {
    const areas = new Set<string>(['All']);
    allEquipment.forEach(equip => {
      if (equip.area) areas.add(equip.area);
    });
    return Array.from(areas).sort((a, b) => (a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b)));
  }, [allEquipment]);

  /**
   * Lista de equipamentos filtrada com base nos critérios atuais (`searchTerm`, `selectedSistema`, `selectedArea`).
   * Utiliza a função `getFilteredEquipment` para aplicar a lógica de filtragem combinada.
   * Memoizada para recalcular apenas quando os critérios de filtro ou `allEquipment` mudarem.
   */
  const filteredEquipment = useMemo(() => {
    const criteria: EquipmentFilterCriteria = {
      searchTerm,
      selectedSistema,
      selectedArea,
    };
    return getFilteredEquipment(Array.isArray(allEquipment) ? allEquipment : [], criteria);
  }, [allEquipment, searchTerm, selectedSistema, selectedArea]);

  return {
    searchTerm,
    setSearchTerm,
    selectedSistema,
    setSelectedSistema,
    selectedArea,
    setSelectedArea,
    availableSistemas,
    availableAreas,
    filteredEquipment,
  };
}
