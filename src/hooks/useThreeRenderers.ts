
/**
 * @module hooks/useThreeRenderers
 * Hook customizado para configurar os renderizadores Three.js e o pipeline de pós-processamento.
 *
 * Este hook é responsável por inicializar e configurar:
 * -   `THREE.WebGLRenderer`: Para a renderização principal da cena 3D.
 * -   `THREE.CSS2DRenderer`: Para renderizar elementos HTML (como rótulos/pins) sobrepostos à cena.
 * -   `THREE.EffectComposer`: Para gerenciar passes de pós-processamento.
 * -   `THREE.RenderPass`: O passe base que renderiza a cena.
 * -   `THREE.OutlinePass`: Para adicionar efeitos de contorno a objetos selecionados.
 *
 * O hook também gerencia a anexação dos elementos DOM dos renderizadores ao ponto de montagem fornecido
 * e lida com eventos de contexto WebGL (perda e restauração).
 *
 * @returns Refs para os renderizadores, composer, outline pass, e uma flag indicando sua prontidão.
 *
 * @example Diagrama de Componentes Criados por useThreeRenderers:
 * ```mermaid
 * graph TD
 *     useThreeRenderers["useThreeRenderers (Hook)"]
 *     Props["UseThreeRenderersProps"]
 *     Return["UseThreeRenderersReturn"]
 *
 *     subgraph "Objetos Three.js Gerenciados"
 *         WebGLRenderer["THREE.WebGLRenderer"]
 *         CSS2DRenderer["THREE.CSS2DRenderer"]
 *         EffectComposer["THREE.EffectComposer"]
 *         RenderPass["THREE.RenderPass"]
 *         OutlinePass["THREE.OutlinePass"]
 *     end
 *
 *     Props -- define --> PExistingSceneRef["sceneRef (existente)"]
 *     Props -- define --> PExistingCameraRef["cameraRef (existente)"]
 *     Props -- define --> PMountRef["mountRef (DOM)"]
 *
 *     useThreeRenderers -- usa --> PExistingSceneRef
 *     useThreeRenderers -- usa --> PExistingCameraRef
 *     useThreeRenderers -- anexa ao --> PMountRef
 *
 *     useThreeRenderers -- cria e configura --> WebGLRenderer
 *     useThreeRenderers -- cria e configura --> CSS2DRenderer
 *     useThreeRenderers -- cria e configura --> EffectComposer
 *     EffectComposer -- contém --> RenderPass
 *     EffectComposer -- contém --> OutlinePass
 *
 *     Return -- contém ref para --> WebGLRenderer
 *     Return -- contém ref para --> CSS2DRenderer
 *     Return -- contém ref para --> EffectComposer
 *     Return -- contém ref para --> OutlinePass
 *     Return -- contém --> FAreRenderersReady["areRenderersReady (flag)"]
 *
 *     classDef hook fill:#lightblue,stroke:#333,stroke-width:2px;
 *     classDef type fill:#lightgoldenrodyellow,stroke:#333,stroke-width:2px;
 *     classDef obj3d fill:#lightgreen,stroke:#333,stroke-width:2px;
 *     classDef dom fill:#lightcoral,stroke:#333,stroke-width:2px;
 *     classDef flag fill:#lightpink,stroke:#333,stroke-width:2px;
 *
 *     class useThreeRenderers hook;
 *     class Props,Return,PExistingSceneRef,PExistingCameraRef,PMountRef type;
 *     class WebGLRenderer,CSS2DRenderer,EffectComposer,RenderPass,OutlinePass obj3d;
 *     class FAreRenderersReady flag;
 * ```
 */
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';

/**
 * Props para o hook `useThreeRenderers`.
 * @interface UseThreeRenderersProps
 * @property {React.RefObject<HTMLDivElement | null>} mountRef - Ref para o elemento DOM onde os renderizadores serão montados.
 * @property {React.RefObject<THREE.Scene | null>} sceneRef - Ref para a cena Three.js existente.
 * @property {React.RefObject<THREE.PerspectiveCamera | null>} cameraRef - Ref para a câmera perspectiva existente.
 */
export interface UseThreeRenderersProps {
  mountRef: React.RefObject<HTMLDivElement | null>;
  sceneRef: React.RefObject<THREE.Scene | null>;
  cameraRef: React.RefObject<THREE.PerspectiveCamera | null>;
}

/**
 * Valor de retorno do hook `useThreeRenderers`.
 * @interface UseThreeRenderersReturn
 * @property {React.RefObject<THREE.WebGLRenderer | null>} rendererRef - Ref para o `WebGLRenderer`.
 * @property {React.RefObject<CSS2DRenderer | null>} labelRendererRef - Ref para o `CSS2DRenderer`.
 * @property {React.RefObject<EffectComposer | null>} composerRef - Ref para o `EffectComposer`.
 * @property {React.RefObject<OutlinePass | null>} outlinePassRef - Ref para o `OutlinePass`.
 * @property {boolean} areRenderersReady - Flag que indica se todos os renderizadores e o composer foram inicializados com sucesso.
 */
export interface UseThreeRenderersReturn {
  rendererRef: React.RefObject<THREE.WebGLRenderer | null>;
  labelRendererRef: React.RefObject<CSS2DRenderer | null>;
  composerRef: React.RefObject<EffectComposer | null>;
  outlinePassRef: React.RefObject<OutlinePass | null>;
  areRenderersReady: boolean;
}

/**
 * Configura os renderizadores Three.js (WebGL, CSS2D) e o pipeline de pós-processamento (EffectComposer, OutlinePass).
 * Gerencia a anexação ao DOM e eventos de contexto WebGL.
 * @param {UseThreeRenderersProps} props - Propriedades para a configuração dos renderizadores.
 * @returns {UseThreeRenderersReturn} Refs para os renderizadores, composer, outline pass, e flag de prontidão.
 */
export function useThreeRenderers({ mountRef, sceneRef, cameraRef }: UseThreeRenderersProps): UseThreeRenderersReturn {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const labelRendererRef = useRef<CSS2DRenderer | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const outlinePassRef = useRef<OutlinePass | null>(null);
  const [areRenderersReady, setAreRenderersReady] = useState(false);

  useEffect(() => {
    const currentMount = mountRef.current;
    const currentScene = sceneRef.current;
    const currentCamera = cameraRef.current;

    if (!currentMount || !currentScene || !currentCamera) {
      setAreRenderersReady(false);
      return;
    }

    const initialWidth = Math.max(1, currentMount.clientWidth);
    const initialHeight = Math.max(1, currentMount.clientHeight);

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(initialWidth, initialHeight);
    renderer.shadowMap.enabled = false;
    currentScene.background = new THREE.Color(0xA9C1D1);
    currentScene.fog = new THREE.Fog(0xA9C1D1, 200, 1000);
    rendererRef.current = renderer;

    // CSS2D Renderer
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(initialWidth, initialHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.style.left = '0px';
    labelRenderer.domElement.style.pointerEvents = 'none';
    labelRendererRef.current = labelRenderer;

    // EffectComposer
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(currentScene, currentCamera);
    composer.addPass(renderPass);
    const outlinePass = new OutlinePass(new THREE.Vector2(initialWidth, initialHeight), currentScene, currentCamera);
    outlinePass.edgeStrength = 0;
    outlinePass.edgeGlow = 0.0;
    outlinePass.edgeThickness = 1.0;
    outlinePass.visibleEdgeColor.set('#ffffff');
    outlinePass.hiddenEdgeColor.set('#190a05');
    outlinePass.pulsePeriod = 0;
    composer.addPass(outlinePass);
    composerRef.current = composer;
    outlinePassRef.current = outlinePass;

    currentMount.appendChild(renderer.domElement);
    currentMount.appendChild(labelRenderer.domElement);

    const handleContextLost = (event: Event) => { event.preventDefault(); };
    const handleContextRestored = () => { renderer.compile(currentScene, currentCamera); };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored, false);

    setAreRenderersReady(true);

    return () => {
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost, false);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored, false);

      composerRef.current?.passes.forEach(pass => { if ((pass as any).dispose) (pass as any).dispose(); });

      if (rendererRef.current && rendererRef.current.domElement.parentNode === currentMount) {
        currentMount.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();

      if (labelRendererRef.current && labelRendererRef.current.domElement.parentNode === currentMount) {
        currentMount.removeChild(labelRendererRef.current.domElement);
      }

      rendererRef.current = null;
      labelRendererRef.current = null;
      composerRef.current = null;
      outlinePassRef.current = null;
      setAreRenderersReady(false);
    };
  }, [mountRef, sceneRef, cameraRef]);

  return { rendererRef, labelRendererRef, composerRef, outlinePassRef, areRenderersReady };
}
