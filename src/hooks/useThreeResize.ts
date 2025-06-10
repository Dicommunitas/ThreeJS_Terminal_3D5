
/**
 * @module hooks/useThreeResize
 * Hook customizado para lidar com eventos de redimensionamento para uma cena Three.js.
 *
 * Este hook é responsável por:
 * -   Configurar um `ResizeObserver` para monitorar mudanças nas dimensões do elemento DOM de montagem da cena.
 * -   Quando um evento de redimensionamento ocorre (e todos os componentes necessários estão prontos),
 *     ele atualiza as seguintes propriedades para manter a responsividade:
 *     -   A razão de aspecto (`aspect`) da `THREE.PerspectiveCamera` e chama `updateProjectionMatrix()`.
 *     -   O tamanho (`setSize`) do `THREE.WebGLRenderer`.
 *     -   O tamanho (`setSize`) do `CSS2DRenderer`.
 *     -   O tamanho (`setSize`) do `THREE.EffectComposer`.
 *     -   A resolução (`resolution.set`) do `THREE.OutlinePass`.
 * -   Realizar uma chamada inicial de redimensionamento para garantir que as dimensões corretas
 *     sejam aplicadas assim que os componentes estiverem prontos.
 * -   Limpar (desconectar) o `ResizeObserver` quando o componente é desmontado ou as dependências mudam,
 *     para evitar vazamentos de memória e chamadas desnecessárias.
 *
 * @param props - Objeto contendo refs para os elementos Three.js que precisam ser redimensionados e uma flag de prontidão.
 *
 * @example Diagrama de Funcionalidade do useThreeResize:
 * ```mermaid
 * graph TD
 *     useThreeResize["useThreeResize (Hook)"]
 *     Props["UseThreeResizeProps"]
 *     MountElement["Elemento DOM (mountRef)"]
 *     ResizeObserver_API["ResizeObserver API"]
 *     Camera["Câmera (cameraRef)"]
 *     Renderer["WebGLRenderer (rendererRef)"]
 *     LabelRenderer["CSS2DRenderer (labelRendererRef)"]
 *     Composer["EffectComposer (composerRef)"]
 *     OutlinePass["OutlinePass (outlinePassRef)"]
 *     ReadyFlag["ready (flag)"]
 *
 *     Props -- define --> MountElement
 *     Props -- define --> Camera
 *     Props -- define --> Renderer
 *     Props -- define --> LabelRenderer
 *     Props -- define --> Composer
 *     Props -- define --> OutlinePass
 *     Props -- define --> ReadyFlag
 *     Props --> useThreeResize
 *
 *     useThreeResize -- verifica --> ReadyFlag
 *     useThreeResize -- observa --> MountElement
 *     MountElement -- dispara evento de redimensionamento --> ResizeObserver_API
 *     ResizeObserver_API -- chama callback --> useThreeResize
 *
 *     subgraph "Callback de Redimensionamento (handleResize)"
 *         direction LR
 *         Callback["handleResize"] -- atualiza --> Camera
 *         Callback -- atualiza --> Renderer
 *         Callback -- atualiza --> LabelRenderer
 *         Callback -- atualiza --> Composer
 *         Callback -- atualiza --> OutlinePass
 *     end
 *
 *     useThreeResize -- executa na montagem e quando 'ready' muda --> Callback
 *
 *     classDef hook fill:#lightblue,stroke:#333,stroke-width:2px;
 *     classDef type fill:#lightgoldenrodyellow,stroke:#333,stroke-width:2px;
 *     classDef obj3d fill:#lightgreen,stroke:#333,stroke-width:2px;
 *     classDef dom fill:#lightcoral,stroke:#333,stroke-width:2px;
 *     classDef api fill:#lightsalmon,stroke:#333,stroke-width:2px;
 *     classDef flag fill:#lightpink,stroke:#333,stroke-width:2px;
 *
 *     class useThreeResize hook;
 *     class Props type;
 *     class Camera,Renderer,LabelRenderer,Composer,OutlinePass obj3d;
 *     class MountElement dom;
 *     class ResizeObserver_API api;
 *     class ReadyFlag flag;
 * ```
 */
import { useEffect, useCallback } from 'react';
import type * as THREE from 'three';
import type { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import type { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import type { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';

/**
 * Props para o hook `useThreeResize`.
 * @interface UseThreeResizeProps
 * @property {React.RefObject<HTMLDivElement | null>} mountRef - Ref para o elemento DOM contêiner da cena.
 * @property {React.RefObject<THREE.PerspectiveCamera | null>} cameraRef - Ref para a câmera perspectiva.
 * @property {React.RefObject<THREE.WebGLRenderer | null>} rendererRef - Ref para o renderizador WebGL.
 * @property {React.RefObject<CSS2DRenderer | null>} labelRendererRef - Ref para o renderizador CSS2D.
 * @property {React.RefObject<EffectComposer | null>} composerRef - Ref para o EffectComposer.
 * @property {React.RefObject<OutlinePass | null>} outlinePassRef - Ref para o OutlinePass.
 * @property {boolean} ready - Flag que indica se todos os componentes que precisam ser redimensionados estão prontos.
 */
export interface UseThreeResizeProps {
  mountRef: React.RefObject<HTMLDivElement | null>;
  cameraRef: React.RefObject<THREE.PerspectiveCamera | null>;
  rendererRef: React.RefObject<THREE.WebGLRenderer | null>;
  labelRendererRef: React.RefObject<CSS2DRenderer | null>;
  composerRef: React.RefObject<EffectComposer | null>;
  outlinePassRef: React.RefObject<OutlinePass | null>;
  ready: boolean;
}

/**
 * Lida com eventos de redimensionamento para a cena Three.js, atualizando câmera e renderizadores.
 * @param {UseThreeResizeProps} props - Refs para elementos que precisam ser redimensionados e uma flag de prontidão.
 */
export function useThreeResize({
  mountRef,
  cameraRef,
  rendererRef,
  labelRendererRef,
  composerRef,
  outlinePassRef,
  ready,
}: UseThreeResizeProps): void {
  const handleResize = useCallback(() => {
    if (
      !mountRef.current ||
      !cameraRef.current ||
      !rendererRef.current ||
      !labelRendererRef.current ||
      !composerRef.current ||
      !outlinePassRef.current
    ) {
      return;
    }

    const width = Math.max(1, mountRef.current.clientWidth);
    const height = Math.max(1, mountRef.current.clientHeight);

    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();

    rendererRef.current.setSize(width, height);
    labelRendererRef.current.setSize(width, height);
    composerRef.current.setSize(width, height);
    outlinePassRef.current.resolution.set(width, height);
  }, [mountRef, cameraRef, rendererRef, labelRendererRef, composerRef, outlinePassRef]);

  useEffect(() => {
    if (!ready || !mountRef.current) {
      return;
    }
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mountRef.current);

    handleResize();

    return () => {
      if (mountRef.current) {
        resizeObserver.unobserve(mountRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [ready, mountRef, handleResize]);
}
