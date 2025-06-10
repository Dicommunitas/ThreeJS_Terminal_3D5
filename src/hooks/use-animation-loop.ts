
/**
 * @module hooks/useAnimationLoop
 * Hook customizado para gerenciar o loop de animação de uma cena Three.js.
 *
 * Este hook é responsável por encapsular a lógica de `requestAnimationFrame`
 * para renderizar continuamente uma cena Three.js. Ele lida com:
 * -   Atualização dos controles de órbita (`OrbitControls`).
 * -   Renderização do `EffectComposer` (para efeitos de pós-processamento).
 * -   Renderização do `CSS2DRenderer` (para rótulos HTML sobrepostos à cena).
 * -   Execução de uma callback opcional (`onFrameUpdate`) a cada quadro de animação,
 *     permitindo lógicas personalizadas de atualização por frame (e.g., animações de câmera).
 *
 * O loop de animação só é iniciado quando a flag `isSceneReady` (fornecida como prop)
 * é verdadeira, indicando que todos os componentes necessários da cena (câmera, renderizadores, controles)
 * foram inicializados e estão prontos.
 *
 * @param props - Propriedades para configurar o loop de animação.
 *
 * Diagrama de Fluxo do useAnimationLoop:
 * ```mermaid
 * sequenceDiagram
 *     participant ComponentePai as Comp. (ex: ThreeScene)
 *     participant useAnimationLoop as Hook
 *     participant Navegador
 *     participant OrbitControls
 *     participant EffectComposer
 *     participant CSS2DRenderer
 *
 *     ComponentePai ->>+ useAnimationLoop: Chama com refs e isSceneReady=true
 *     useAnimationLoop ->> Navegador: requestAnimationFrame(animate)
 *     Navegador -->> useAnimationLoop: Chama animate()
 *     loop Cada Quadro
 *         useAnimationLoop ->> OrbitControls: controls.update() (se habilitado)
 *         useAnimationLoop ->> ComponentePai: onFrameUpdate() (callback opcional)
 *         useAnimationLoop ->> EffectComposer: composer.render()
 *         useAnimationLoop ->> CSS2DRenderer: labelRenderer.render()
 *         useAnimationLoop ->> Navegador: requestAnimationFrame(animate)
 *     end
 *     Note right of ComponentePai: Quando desmontado ou isSceneReady=false
 *     useAnimationLoop ->> Navegador: cancelAnimationFrame()
 * ```
 */
import type * as THREE from 'three';
import { useEffect, type RefObject } from 'react';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import type { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

/**
 * Props para o hook `useAnimationLoop`.
 * @interface UseAnimationLoopProps
 * @property {boolean} isSceneReady - Flag que indica se a cena e todos os seus componentes dependentes
 *                                   (câmera, renderizadores, controles) estão prontos para iniciar o loop de animação.
 * @property {RefObject<THREE.Scene | null>} sceneRef - Ref para o objeto da cena Three.js.
 * @property {RefObject<THREE.PerspectiveCamera | null>} cameraRef - Ref para o objeto da câmera perspectiva.
 * @property {RefObject<OrbitControls | null>} controlsRef - Ref para os `OrbitControls`.
 * @property {RefObject<EffectComposer | null>} composerRef - Ref para o `EffectComposer` (usado para pós-processamento).
 * @property {RefObject<CSS2DRenderer | null>} labelRendererRef - Ref para o `CSS2DRenderer` (usado para rótulos HTML).
 * @property {() => void} [onFrameUpdate] - Callback opcional executado a cada quadro de animação,
 *                                          útil para lógicas de atualização personalizadas (e.g., animações de câmera).
 */
export interface UseAnimationLoopProps {
  isSceneReady: boolean;
  sceneRef: RefObject<THREE.Scene | null>;
  cameraRef: RefObject<THREE.PerspectiveCamera | null>;
  controlsRef: RefObject<OrbitControls | null>;
  composerRef: RefObject<EffectComposer | null>;
  labelRendererRef: RefObject<CSS2DRenderer | null>;
  onFrameUpdate?: () => void;
}

/**
 * Hook customizado para gerenciar o loop de animação de uma cena Three.js.
 * Ele configura e executa o `requestAnimationFrame` para renderizar a cena
 * e atualizar os controles, o composer e o renderizador de rótulos.
 * O loop só é iniciado quando `isSceneReady` é verdadeiro e todos os refs necessários estão populados.
 *
 * @param {UseAnimationLoopProps} props - As props necessárias para o loop de animação.
 */
export function useAnimationLoop({
  isSceneReady,
  sceneRef,
  cameraRef,
  controlsRef,
  composerRef,
  labelRendererRef,
  onFrameUpdate,
}: UseAnimationLoopProps): void {
  useEffect(() => {
    if (!isSceneReady ||
        !sceneRef.current ||
        !cameraRef.current ||
        !controlsRef.current ||
        !composerRef.current ||
        !labelRendererRef.current) {
      return;
    }

    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const composer = composerRef.current;
    const labelRenderer = labelRendererRef.current;

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (onFrameUpdate) {
        onFrameUpdate();
      }

      if (controls.enabled) { // Só atualiza OrbitControls se estiverem habilitados
        controls.update();
      }

      composer.render();
      labelRenderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isSceneReady, sceneRef, cameraRef, controlsRef, composerRef, labelRendererRef, onFrameUpdate]);
}
