
/**
 * @module hooks/use-scene-setup
 * Hook orquestrador para a configuração completa de uma cena Three.js.
 *
 * Este hook atua como um orquestrador, compondo vários hooks especializados para inicializar
 * todos os aspectos de um ambiente Three.js. Ele gerencia a sequência de setup,
 * as dependências entre os diferentes componentes da cena e retorna referências (refs)
 * para os principais objetos Three.js, além de flags indicando a prontidão da cena.
 *
 * Responsabilidades Principais:
 * -   **Composição de Hooks:** Importa e utiliza hooks especializados para cada parte da configuração da cena:
 *     -   `useThreeCore`: Para `THREE.Scene` e `THREE.PerspectiveCamera`.
 *     -   `useThreeRenderers`: Para `WebGLRenderer`, `CSS2DRenderer`, `EffectComposer`, e `OutlinePass`.
 *     -   `useThreeOrbitControls`: Para `OrbitControls`.
 *     -   `useThreeSceneElements`: Para iluminação e plano de chão.
 *     -   `useThreeResize`: Para responsividade da cena.
 * -   **Orquestração da Inicialização:** Garante que os hooks sejam chamados na ordem correta,
 *     respeitando as dependências (e.g., renderizadores precisam estar prontos antes dos controles).
 * -   **Agregação de Refs e Estado:** Coleta e retorna as refs para os objetos Three.js criados
 *     (e.g., `sceneRef`, `cameraRef`, `rendererRef`) e as flags de estado de prontidão
 *     (`isSceneReady`, `isControlsReady`).
 *
 * @see {@link documentation/api/hooks/useThreeCore/README.md} Para inicialização da cena e câmera.
 * @see {@link documentation/api/hooks/useThreeRenderers/README.md} Para configuração dos renderizadores e pós-processamento.
 * @see {@link documentation/api/hooks/useThreeOrbitControls/README.md} Para configuração dos controles de órbita.
 * @see {@link documentation/api/hooks/useThreeSceneElements/README.md} Para configuração de iluminação e plano de chão.
 * @see {@link documentation/api/hooks/useThreeResize/README.md} Para manipulação de redimensionamento.
 *
 * Diagrama de Composição do useSceneSetup:
 * ```mermaid
 * graph TD
 *     useSceneSetup_Orchestrator["useSceneSetup (Orquestrador)"]
 *
 *     subgraph "Hooks Especializados de Setup"
 *         direction LR
 *         H_Core["useThreeCore"]
 *         H_Renderers["useThreeRenderers"]
 *         H_Controls["useThreeOrbitControls"]
 *         H_Elements["useThreeSceneElements"]
 *         H_Resize["useThreeResize"]
 *     end
 *
 *     useSceneSetup_Orchestrator -- compõe --> H_Core
 *     useSceneSetup_Orchestrator -- compõe --> H_Renderers
 *     useSceneSetup_Orchestrator -- compõe --> H_Controls
 *     useSceneSetup_Orchestrator -- compõe --> H_Elements
 *     useSceneSetup_Orchestrator -- compõe --> H_Resize
 *
 *     H_Core --> R_Scene["sceneRef"]
 *     H_Core --> R_Camera["cameraRef"]
 *
 *     H_Renderers -- usa --> R_Scene
 *     H_Renderers -- usa --> R_Camera
 *     H_Renderers --> R_Renderer["rendererRef"]
 *     H_Renderers --> R_LabelRenderer["labelRendererRef"]
 *     H_Renderers --> R_Composer["composerRef"]
 *     H_Renderers --> R_OutlinePass["outlinePassRef"]
 *     H_Renderers --> F_RenderersReady["areRenderersReady (flag)"]
 *
 *     H_Controls -- usa --> R_Camera
 *     H_Controls -- usa --> R_Renderer
 *     H_Controls --> R_OrbitControls["controlsRef"]
 *     H_Controls --> F_ControlsReady["isControlsReady (flag)"]
 *
 *     H_Elements -- usa --> R_Scene
 *     H_Elements --> R_GroundMesh["groundMeshRef"]
 *
 *     H_Resize -- usa --> R_Camera
 *     H_Resize -- usa --> R_Renderer
 *     H_Resize -- usa --> R_LabelRenderer
 *     H_Resize -- usa --> R_Composer
 *     H_Resize -- usa --> R_OutlinePass
 *
 *     useSceneSetup_Orchestrator -- retorna --> R_Scene
 *     useSceneSetup_Orchestrator -- retorna --> R_Camera
 *     useSceneSetup_Orchestrator -- retorna --> R_Renderer
 *     useSceneSetup_Orchestrator -- retorna --> R_LabelRenderer
 *     useSceneSetup_Orchestrator -- retorna --> R_OrbitControls
 *     useSceneSetup_Orchestrator -- retorna --> R_Composer
 *     useSceneSetup_Orchestrator -- retorna --> R_OutlinePass
 *     useSceneSetup_Orchestrator -- retorna --> R_GroundMesh
 *     useSceneSetup_Orchestrator -- retorna --> F_SceneReady["isSceneReady (flag combinada)"]
 *     useSceneSetup_Orchestrator -- retorna --> F_ControlsReady
 *
 *     classDef hook fill:#lightblue,stroke:#333,stroke-width:2px;
 *     classDef ref fill:#lightgoldenrodyellow,stroke:#333,stroke-width:2px;
 *     classDef flag fill:#lightpink,stroke:#333,stroke-width:2px;
 *
 *     class useSceneSetup_Orchestrator hook;
 *     class H_Core,H_Renderers,H_Controls,H_Elements,H_Resize hook;
 *     class R_Scene,R_Camera,R_Renderer,R_LabelRenderer,R_OrbitControls,R_Composer,R_OutlinePass,R_GroundMesh ref;
 *     class F_RenderersReady,F_ControlsReady,F_SceneReady flag;
 * ```
 */
import type * as THREE from 'three';
import type { OrbitControls as OrbitControlsType } from 'three/examples/jsm/controls/OrbitControls.js';
import type { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import type { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import type { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import type { CameraState } from '@/lib/types';

import { useThreeCore } from './useThreeCore';
import { useThreeRenderers } from './useThreeRenderers';
import { useThreeOrbitControls } from './useThreeOrbitControls';
import { useThreeSceneElements } from './useThreeSceneElements';
import { useThreeResize } from './useThreeResize';

/**
 * Props para o hook orquestrador da configuração da cena.
 * @interface UseSceneSetupProps
 * @property {React.RefObject<HTMLDivElement>} mountRef - Ref para o elemento DOM contêiner da cena.
 * @property {{ x: number; y: number; z: number }} initialCameraPosition - Posição inicial da câmera.
 * @property {{ x: number; y: number; z: number }} initialCameraLookAt - Ponto de observação (lookAt) inicial da câmera.
 * @property {(cameraState: CameraState, actionDescription?: string) => void} onCameraChange - Callback para quando o estado da câmera muda.
 */
export interface UseSceneSetupProps {
  mountRef: React.RefObject<HTMLDivElement>;
  initialCameraPosition: { x: number; y: number; z: number };
  initialCameraLookAt: { x: number; y: number; z: number };
  onCameraChange: (cameraState: CameraState, actionDescription?: string) => void;
}

/**
 * Valor de retorno do hook orquestrador da configuração da cena.
 * Agrega refs e flags de prontidão dos hooks especializados.
 * @interface UseSceneSetupReturn
 * @property {React.RefObject<THREE.Scene | null>} sceneRef - Ref para a cena Three.js.
 * @property {React.RefObject<THREE.PerspectiveCamera | null>} cameraRef - Ref para a câmera perspectiva.
 * @property {React.RefObject<THREE.WebGLRenderer | null>} rendererRef - Ref para o renderizador WebGL.
 * @property {React.RefObject<CSS2DRenderer | null>} labelRendererRef - Ref para o renderizador CSS2D (para rótulos).
 * @property {React.RefObject<OrbitControlsType | null>} controlsRef - Ref para os OrbitControls.
 * @property {React.RefObject<EffectComposer | null>} composerRef - Ref para o EffectComposer (pós-processamento).
 * @property {React.RefObject<OutlinePass | null>} outlinePassRef - Ref para o OutlinePass (efeito de contorno).
 * @property {React.RefObject<THREE.Mesh | null>} groundMeshRef - Ref para a malha do plano de chão.
 * @property {boolean} isSceneReady - Flag que indica se os componentes principais da cena (núcleo, renderizadores, elementos) estão prontos.
 * @property {boolean} isControlsReady - Flag que indica se os OrbitControls estão prontos (carregamento dinâmico).
 */
export interface UseSceneSetupReturn {
  sceneRef: React.RefObject<THREE.Scene | null>;
  cameraRef: React.RefObject<THREE.PerspectiveCamera | null>;
  rendererRef: React.RefObject<THREE.WebGLRenderer | null>;
  labelRendererRef: React.RefObject<CSS2DRenderer | null>;
  controlsRef: React.RefObject<OrbitControlsType | null>;
  composerRef: React.RefObject<EffectComposer | null>;
  outlinePassRef: React.RefObject<OutlinePass | null>;
  groundMeshRef: React.RefObject<THREE.Mesh | null>;
  isSceneReady: boolean;
  isControlsReady: boolean;
}

/**
 * Orquestra a configuração de uma cena Three.js compondo hooks especializados.
 * Este hook é responsável por inicializar o núcleo da cena, renderizadores, controles,
 * elementos básicos da cena (iluminação, chão) e manipulação de redimensionamento.
 * Ele fornece refs para todos os principais componentes Three.js e flags indicando sua prontidão.
 *
 * @param {UseSceneSetupProps} props - Propriedades de configuração para a montagem da cena.
 * @returns {UseSceneSetupReturn} Refs para os componentes da cena e flags de prontidão.
 */
export function useSceneSetup(props: UseSceneSetupProps): UseSceneSetupReturn {
  const { mountRef, initialCameraPosition, initialCameraLookAt, onCameraChange } = props;

  // 1. Núcleo (Cena, Câmera)
  const { sceneRef, cameraRef } = useThreeCore({ initialCameraPosition, mountRef });
  const coreReady = !!(mountRef.current && sceneRef.current && cameraRef.current);

  // 2. Renderizadores (WebGL, CSS2D, Composer, OutlinePass)
  const {
    rendererRef,
    labelRendererRef,
    composerRef,
    outlinePassRef,
    areRenderersReady
  } = useThreeRenderers({ mountRef, sceneRef, cameraRef });

  // 3. OrbitControls - Depende dos renderizadores estarem prontos (para rendererRef.current.domElement)
  const { controlsRef, isControlsReady } = useThreeOrbitControls({
    cameraRef,
    rendererRef,
    initialCameraLookAt,
    onCameraChange,
    renderersReady: areRenderersReady,
  });

  // 4. Elementos da Cena (Iluminação, Plano de Chão) - Depende do núcleo estar pronto
  const { groundMeshRef } = useThreeSceneElements({ sceneRef, coreReady });
  const elementsReady = coreReady && !!groundMeshRef.current;

  // 5. Prontidão combinada para a base da cena (tudo exceto controles, que são assíncronos)
  const baseSceneComponentsReady = coreReady && areRenderersReady && elementsReady;

  // 6. Manipulação de Redimensionamento - Depende de todos os componentes visuais estarem prontos
  useThreeResize({
    mountRef,
    cameraRef,
    rendererRef,
    labelRendererRef,
    composerRef,
    outlinePassRef,
    ready: baseSceneComponentsReady,
  });

  return {
    sceneRef,
    cameraRef,
    rendererRef,
    labelRendererRef,
    controlsRef,
    composerRef,
    outlinePassRef,
    groundMeshRef,
    isSceneReady: baseSceneComponentsReady,
    isControlsReady,
  };
}
