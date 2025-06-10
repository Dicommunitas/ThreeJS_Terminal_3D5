
/**
 * @module core/repository/memory-repository
 * Repositório em memória para gerenciar os dados da aplicação Terminal 3D.
 *
 * Este módulo atua como a "fonte da verdade" para os dados de `Equipment` (equipamentos) e `Annotation` (anotações)
 * durante a execução da aplicação. Ele encapsula a lógica de armazenamento em memória (utilizando `Map` para acesso eficiente por ID/tag)
 * e fornece uma interface CRUD (Criar, Ler, Atualizar, Excluir) para acessar e modificar esses dados.
 *
 * O repositório é auto-inicializável com os dados de `initialEquipment` e `initialAnnotations`
 * definidos em `src/core/data/initial-data.ts` na primeira vez que é importado.
 * Funções de obtenção (get/getAll) retornam cópias dos objetos para promover a imutabilidade
 * e evitar modificações acidentais do estado interno do repositório por referências externas.
 *
 * @see {@link documentation/api/core/data/initial-data/README.md} Para os dados iniciais de equipamentos e camadas.
 * @see {@link documentation/api/lib/types/README.md#Equipment} Para a interface de Equipamento.
 * @see {@link documentation/api/lib/types/README.md#Annotation} Para a interface de Anotação.
 *
 * Diagrama de Estrutura do Repositório em Memória:
 * ```mermaid
 * classDiagram
 *     class RepositorioMemoria {
 *         -equipmentStore: Map_string_Equipment_
 *         -annotationStore: Map_string_Annotation_
 *         -isInitialized: boolean
 *         +initializeRepository() void
 *     }
 *     class RepositorioEquipamentos {
 *         +getEquipmentByTag(tag: string): Equipment | undefined
 *         +getAllEquipment(): Equipment[]
 *         +addEquipment(equipment: Equipment): Equipment
 *         +updateEquipment(tag: string, updates: Partial_Equipment_): Equipment | undefined
 *         +deleteEquipment(tag: string): boolean
 *         +_resetAndLoadInitialData(): void
 *     }
 *     class RepositorioAnotacoes {
 *         +getAnnotationByEquipmentTag(equipmentTag: string): Annotation | undefined
 *         +getAllAnnotations(): Annotation[]
 *         +addOrUpdateAnnotation(annotation: Annotation): Annotation
 *         +deleteAnnotation(equipmentTag: string): boolean
 *         +initializeAnnotations(annotations: Annotation[]): void
 *     }
 *     class DadosIniciais {
 *         +initialEquipment: Equipment[]
 *         +initialAnnotations: Annotation[]
 *     }
 *
 *     RepositorioMemoria --|> DadosIniciais : carrega dados de
 *     RepositorioMemoria o-- RepositorioEquipamentos : expõe
 *     RepositorioMemoria o-- RepositorioAnotacoes : expõe
 *
 *     note for RepositorioMemoria "Módulo auto-inicializável."
 *     note for RepositorioEquipamentos "Gerencia o CRUD de Equipamentos."
 *     note for RepositorioAnotacoes "Gerencia o CRUD de Anotações."
 * ```
 */
import type { Equipment, Annotation } from '@/lib/types';
import { initialEquipment, initialAnnotations as defaultInitialAnnotations } from '@/core/data/initial-data';

// Stores para os dados, usando Map para acesso eficiente por ID/tag.
let equipmentStore = new Map<string, Equipment>();
let annotationStore = new Map<string, Annotation>(); // Chave: equipmentTag

let isInitialized = false; // Flag para controlar a inicialização única

/**
 * Inicializa os repositórios com os dados iniciais.
 * Esta função é chamada automaticamente na primeira importação do módulo
 * e pode ser chamada manualmente para resetar os dados (e.g., em testes).
 * @private
 */
function initializeRepository() {
  if (isInitialized) return;

  equipmentStore.clear();
  initialEquipment.forEach(eq => equipmentStore.set(eq.tag, { ...eq }));

  annotationStore.clear();
  defaultInitialAnnotations.forEach(an => annotationStore.set(an.equipmentTag, { ...an }));

  isInitialized = true;
}

// Garante a inicialização ao importar o módulo
initializeRepository();

/**
 * Objeto repositório para gerenciar dados de `Equipment`.
 */
export const equipmentRepository = {
  /**
   * Obtém um equipamento pela sua tag.
   * @param {string} tag - A tag do equipamento.
   * @returns {Equipment | undefined} O objeto do equipamento (uma cópia), ou undefined se não encontrado.
   */
  getEquipmentByTag: (tag: string): Equipment | undefined => {
    const equipment = equipmentStore.get(tag);
    return equipment ? { ...equipment } : undefined;
  },

  /**
   * Obtém todos os equipamentos.
   * @returns {Equipment[]} Um array com todos os equipamentos (cópias).
   */
  getAllEquipment: (): Equipment[] => {
    return Array.from(equipmentStore.values()).map(eq => ({ ...eq }));
  },

  /**
   * Adiciona um novo equipamento. Se um equipamento com a mesma tag já existir,
   * ele será atualizado em vez de adicionar um novo.
   * @param {Equipment} equipment - O objeto do equipamento a ser adicionado.
   * @returns {Equipment} O equipamento adicionado (ou atualizado, uma cópia).
   */
  addEquipment: (equipment: Equipment): Equipment => {
    if (equipmentStore.has(equipment.tag)) {
      return equipmentRepository.updateEquipment(equipment.tag, equipment)!;
    }
    const newEquipment = { ...equipment };
    equipmentStore.set(equipment.tag, newEquipment);
    return { ...newEquipment };
  },

  /**
   * Atualiza um equipamento existente.
   * @param {string} tag - A tag do equipamento a ser atualizado.
   * @param {Partial<Equipment>} updates - Um objeto com as propriedades do equipamento a serem atualizadas.
   *                                      A propriedade `tag` não pode ser alterada por este método.
   * @returns {Equipment | undefined} O equipamento atualizado (uma cópia), ou undefined se não encontrado.
   */
  updateEquipment: (tag: string, updates: Partial<Equipment>): Equipment | undefined => {
    const existingEquipment = equipmentStore.get(tag);
    if (!existingEquipment) {
      return undefined;
    }
    const { tag: _tag, ...restOfUpdates } = updates;
    const updatedEquipment = { ...existingEquipment, ...restOfUpdates, tag: existingEquipment.tag };

    equipmentStore.set(tag, updatedEquipment);
    return { ...updatedEquipment };
  },

  /**
   * Exclui um equipamento pela sua tag.
   * @param {string} tag - A tag do equipamento a ser excluído.
   * @returns {boolean} True se o equipamento foi excluído com sucesso, false caso contrário.
   */
  deleteEquipment: (tag: string): boolean => {
    const result = equipmentStore.delete(tag);
    return result;
  },

  /**
   * Método interno para redefinir os dados do repositório e recarregar os dados iniciais.
   * Útil para testes ou cenários de reset.
   * @private
   */
  _resetAndLoadInitialData: () => {
    isInitialized = false;
    initializeRepository();
  }
};

/**
 * Objeto repositório para gerenciar dados de `Annotation`.
 */
export const annotationRepository = {
  /**
   * Obtém uma anotação pela tag do equipamento associado.
   * @param {string} equipmentTag - A tag do equipamento.
   * @returns {Annotation | undefined} A anotação (uma cópia), ou undefined se não encontrada.
   */
  getAnnotationByEquipmentTag: (equipmentTag: string): Annotation | undefined => {
    const annotation = annotationStore.get(equipmentTag);
    return annotation ? { ...annotation } : undefined;
  },

  /**
   * Obtém todas as anotações.
   * @returns {Annotation[]} Um array com todas as anotações (cópias).
   */
  getAllAnnotations: (): Annotation[] => {
    return Array.from(annotationStore.values()).map(an => ({ ...an }));
  },

  /**
   * Adiciona uma nova anotação ou atualiza uma existente se já houver uma para a mesma `equipmentTag`.
   * @param {Annotation} annotation - O objeto da anotação a ser adicionado/atualizado.
   * @returns {Annotation} A anotação adicionada/atualizada (uma cópia).
   */
  addOrUpdateAnnotation: (annotation: Annotation): Annotation => {
    const newAnnotation = { ...annotation };
    annotationStore.set(annotation.equipmentTag, newAnnotation);
    return { ...newAnnotation };
  },

  /**
   * Exclui uma anotação pela tag do equipamento associado.
   * @param {string} equipmentTag - A tag do equipamento cuja anotação será excluída.
   * @returns {boolean} True se a anotação foi excluída com sucesso, false caso contrário.
   */
  deleteAnnotation: (equipmentTag: string): boolean => {
    const result = annotationStore.delete(equipmentTag);
    return result;
  },

  /**
   * Inicializa explicitamente as anotações no repositório.
   * Limpa quaisquer anotações existentes e popula com as fornecidas.
   * @param {Annotation[]} annotations - Um array de anotações para inicializar o repositório.
   */
  initializeAnnotations: (annotations: Annotation[]) => {
    annotationStore.clear();
    annotations.forEach(an => annotationStore.set(an.equipmentTag, { ...an }));
  }
};
