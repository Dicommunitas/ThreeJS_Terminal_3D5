
/**
 * @module components/main-scene-area
 * Componente que encapsula a área principal da cena 3D e o painel de informações (InfoPanel).
 *
 * Responsabilidades Principais:
 * -   **Layout:** Estrutura o layout que contém o `ThreeScene` e o `InfoPanel`,
 *     posicionando o `InfoPanel` de forma flutuante sobre a cena.
 * -   **Delegação de Props:** Recebe um grande conjunto de props da `Terminal3DPage`
 *     (dados de equipamentos, estado da câmera, callbacks de interação, etc.)
 *     e as repassa de forma apropriada para os componentes filhos `ThreeScene` e `InfoPanel`.
 *     Isso simplifica a lógica na `Terminal3DPage`, concentrando a passagem de props
 *     relevantes para a visualização 3D e o painel de detalhes neste componente.
 *
 * ```mermaid
 *   classDiagram
 *     class MainSceneAreaProps {
 *       +equipment: Equipment[]
 *       +allEquipmentData: Equipment[]
 *       +layers: Layer[]
 *       +annotations: Annotation[]
 *       +selectedEquipmentTags: string[]
 *       +onSelectEquipment(tag: string | null, isMultiSelect: boolean): void
 *       +hoveredEquipmentTag: string | null
 *       +setHoveredEquipmentTag(tag: string | null): void
 *       +cameraState: CameraState | undefined
 *       +onCameraChange(cameraState: CameraState): void
 *       +initialCameraPosition: Point3D
 *       +initialCameraLookAt: Point3D
 *       +colorMode: ColorMode
 *       +targetSystemToFrame: TargetSystemInfo | null
 *       +onSystemFramed(): void
 *       +selectedEquipmentDetails: Equipment | null
 *       +equipmentAnnotation: Annotation | null
 *       +onOpenAnnotationDialog(): void
 *       +onDeleteAnnotation(equipmentTag: string): void
 *       +onOperationalStateChange(equipmentTag: string, newState: string): void
 *       +availableOperationalStatesList: string[]
 *       +onProductChange(equipmentTag: string, newProduct: string): void
 *       +availableProductsList: string[]
 *     }
 *     class Point3D {
 *       +x: number
 *       +y: number
 *       +z: number
 *     }
 *     class Equipment {
 *     }
 *     class Layer {
 *     }
 *     class Annotation {
 *     }
 *     class CameraState {
 *     }
 *     class ColorMode {
 *     }
 *    class TargetSystemInfo {
 *       +systemName: string
 *       +viewIndex: number
 *    }
 *     MainSceneAreaProps ..> Equipment
 *     MainSceneAreaProps ..> Layer
 *     MainSceneAreaProps ..> Annotation
 *     MainSceneAreaProps ..> CameraState
 *     MainSceneAreaProps ..> ColorMode
 *     MainSceneAreaProps ..> Point3D
 *     MainSceneAreaProps ..> TargetSystemInfo
 *     class MainSceneArea {
 *     }
 *     class ReactFC {
 *     }
 *     class ThreeScene {
 *     }
 *     class InfoPanel {
 *     }
 *     MainSceneArea --|> ReactFC
 *     MainSceneArea ..> ThreeScene : uses
 *     MainSceneArea ..> InfoPanel : uses
 * ```
 *
 */
"use client";

import type { Equipment, Layer, CameraState, Annotation, ColorMode, TargetSystemInfo } from '@/lib/types';
import ThreeScene from '@/components/three-scene';
import { InfoPanel } from '@/components/info-panel';

/**
 * Props para o componente MainSceneArea.
 * Estas props são, em grande parte, repassadas para `ThreeScene` e `InfoPanel`.
 *
 * @interface MainSceneAreaProps
 * @property {Equipment[]} equipment - Lista de equipamentos filtrados a serem renderizados na cena.
 * @property {Equipment[]} allEquipmentData - Lista completa de todos os equipamentos, para contexto (e.g., anotações no `ThreeScene`).
 * @property {Layer[]} layers - Configuração das camadas de visibilidade.
 * @property {Annotation[]} annotations - Lista de anotações a serem exibidas.
 * @property {string[]} selectedEquipmentTags - Tags dos equipamentos atualmente selecionados.
 * @property {(tag: string | null, isMultiSelect: boolean) => void} onSelectEquipment - Callback para quando um equipamento é selecionado/deselecionado.
 * @property {string | null} hoveredEquipmentTag - Tag do equipamento atualmente sob o cursor.
 * @property {(tag: string | null) => void} setHoveredEquipmentTag - Callback para definir o equipamento em hover.
 * @property {CameraState | undefined} cameraState - O estado atual da câmera (posição, lookAt).
 * @property {(cameraState: CameraState) => void} onCameraChange - Callback para quando o estado da câmera muda devido à interação do usuário na cena.
 * @property {{ x: number; y: number; z: number }} initialCameraPosition - Posição inicial da câmera.
 * @property {{ x: number; y: number; z: number }} initialCameraLookAt - Ponto de observação (lookAt) inicial da câmera.
 * @property {ColorMode} colorMode - O modo de colorização atual para os equipamentos.
 * @property {TargetSystemInfo | null} targetSystemToFrame - Informações sobre o sistema e visão a serem enquadrados pela câmera (se houver).
 * @property {() => void} onSystemFramed - Callback chamado após a câmera terminar de enquadrar um sistema.
 * @property {Equipment | null} selectedEquipmentDetails - Detalhes do equipamento único selecionado (para InfoPanel).
 * @property {Annotation | null} equipmentAnnotation - Anotação do equipamento único selecionado (para InfoPanel).
 * @property {() => void} onOpenAnnotationDialog - Callback para abrir o diálogo de anotação.
 * @property {(equipmentTag: string) => void} onDeleteAnnotation - Callback para excluir uma anotação.
 * @property {(equipmentTag: string, newState: string) => void} onOperationalStateChange - Callback para alterar o estado operacional de um equipamento.
 * @property {string[]} availableOperationalStatesList - Lista de estados operacionais disponíveis.
 * @property {(equipmentTag: string, newProduct: string) => void} onProductChange - Callback para alterar o produto de um equipamento.
 * @property {string[]} availableProductsList - Lista de produtos disponíveis.
 */
export interface MainSceneAreaProps {
  equipment: Equipment[];
  allEquipmentData: Equipment[];
  layers: Layer[];
  annotations: Annotation[];
  selectedEquipmentTags: string[];
  onSelectEquipment: (tag: string | null, isMultiSelect: boolean) => void;
  hoveredEquipmentTag: string | null;
  setHoveredEquipmentTag: (tag: string | null) => void;
  cameraState: CameraState | undefined;
  onCameraChange: (cameraState: CameraState) => void;
  initialCameraPosition: { x: number; y: number; z: number };
  initialCameraLookAt: { x: number; y: number; z: number };
  colorMode: ColorMode;
  targetSystemToFrame: TargetSystemInfo | null; // Atualizado
  onSystemFramed: () => void;
  selectedEquipmentDetails: Equipment | null;
  equipmentAnnotation: Annotation | null;
  onOpenAnnotationDialog: () => void;
  onDeleteAnnotation: (equipmentTag: string) => void;
  onOperationalStateChange: (equipmentTag: string, newState: string) => void;
  availableOperationalStatesList: string[];
  onProductChange: (equipmentTag: string, newProduct: string) => void;
  availableProductsList: string[];
}

/**
 * Renderiza a área principal da cena 3D e o InfoPanel sobreposto.
 * Passa todas as props necessárias para os componentes filhos `ThreeScene` e `InfoPanel`.
 * @param {MainSceneAreaProps} props As props do componente.
 * @returns {JSX.Element} O componente MainSceneArea.
 */
export function MainSceneArea({
  equipment,
  allEquipmentData,
  layers,
  annotations,
  selectedEquipmentTags,
  onSelectEquipment,
  hoveredEquipmentTag,
  setHoveredEquipmentTag,
  cameraState,
  onCameraChange,
  initialCameraPosition,
  initialCameraLookAt,
  colorMode,
  targetSystemToFrame, // Tipo já atualizado na interface
  onSystemFramed,
  selectedEquipmentDetails,
  equipmentAnnotation,
  onOpenAnnotationDialog,
  onDeleteAnnotation,
  onOperationalStateChange,
  availableOperationalStatesList,
  onProductChange,
  availableProductsList,
}: MainSceneAreaProps): JSX.Element {
  return (
    <div className="flex-1 relative w-full bg-muted/20 min-w-0"> {/* min-w-0 é importante para flexbox */}
      <ThreeScene
        equipment={equipment}
        allEquipmentData={allEquipmentData}
        layers={layers}
        annotations={annotations}
        selectedEquipmentTags={selectedEquipmentTags}
        onSelectEquipment={onSelectEquipment}
        hoveredEquipmentTag={hoveredEquipmentTag}
        setHoveredEquipmentTag={setHoveredEquipmentTag}
        cameraState={cameraState}
        onCameraChange={onCameraChange}
        initialCameraPosition={initialCameraPosition}
        initialCameraLookAt={initialCameraLookAt}
        colorMode={colorMode}
        targetSystemToFrame={targetSystemToFrame} // Passando o tipo atualizado
        onSystemFramed={onSystemFramed}
      />
      <InfoPanel
        equipment={selectedEquipmentDetails}
        annotation={equipmentAnnotation}
        onClose={() => onSelectEquipment(null, false)}
        onOpenAnnotationDialog={onOpenAnnotationDialog}
        onDeleteAnnotation={onDeleteAnnotation}
        onOperationalStateChange={onOperationalStateChange}
        availableOperationalStatesList={availableOperationalStatesList}
        onProductChange={onProductChange}
        availableProductsList={availableProductsList}
      />
    </div>
  );
}
