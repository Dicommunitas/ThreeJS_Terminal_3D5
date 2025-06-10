
/**
 * @module hooks/useThreeOrbitControls
 * Hook customizado para configurar e gerenciar os `OrbitControls` do Three.js.
 *
 * Este hook é responsável por:
 * -   Importar dinamicamente o módulo `OrbitControls` dos exemplos do Three.js.
 * -   Inicializar os `OrbitControls` com a câmera e o elemento DOM do renderizador fornecidos.
 * -   Configurar propriedades importantes dos controles, como `enableDamping` (para suavização),
 *     `target` (ponto inicial de observação) e o mapeamento dos botões do mouse (esquerdo/meio para rotação, direito para pan).
 * -   Adicionar um ouvinte de evento ao evento 'end' dos controles para disparar o callback `onCameraChange`
 *     quando o usuário finaliza uma interação com a câmera.
 * -   Gerenciar uma flag de estado `isControlsReady` que se torna `true` assim que os controles
 *     são carregados e inicializados com sucesso.
 * -   Lidar com a limpeza (dispose) dos controles e remoção do ouvinte de evento quando o componente
 *     é desmontado ou as dependências do hook mudam.
 *
 * @returns Ref para a instância de `OrbitControls` e uma flag indicando sua prontidão.
 *
 * @example Diagrama de Fluxo do useThreeOrbitControls:
 * ```mermaid
 * sequenceDiagram
 *     participant Usuário
 *     participant ThreeScene as Componente React
 *     participant useThreeOrbitControls as Hook
 *     participant OrbitControls as Módulo Three.js
 *
 *     ThreeScene ->>+ useThreeOrbitControls: Chama com cameraRef, rendererRef, etc.
 *     Note right of useThreeOrbitControls: renderersReady = true?
 *     useThreeOrbitControls ->>+ OrbitControls: import('OrbitControls.js')
 *     OrbitControls -->>- useThreeOrbitControls: Módulo carregado
 *     useThreeOrbitControls -->> OrbitControls: new OrbitControls(camera, renderer.domElement)
 *     useThreeOrbitControls -->> OrbitControls: Configura (enableDamping, target, mouseButtons)
 *     useThreeOrbitControls -->> OrbitControls: addEventListener('end', handleEnd)
 *     useThreeOrbitControls -->> ThreeScene: Retorna controlsRef, isControlsReady = true
 *     activate Usuário
 *     Usuário ->> OrbitControls: Interage com a câmera (arrasta mouse)
 *     OrbitControls -->> OrbitControls: Atualiza posição/rotação da câmera
 *     Usuário ->> OrbitControls: Solta o botão do mouse
 *     deactivate Usuário
 *     OrbitControls -->> useThreeOrbitControls: Dispara evento 'end'
 *     useThreeOrbitControls ->> ThreeScene: Chama onCameraChange(novoEstado)
 *     Note right of ThreeScene: Atualiza estado da câmera da aplicação
 * ```
 */
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsType } from 'three/examples/jsm/controls/OrbitControls.js';
import type { CameraState } from '@/lib/types';

/**
 * Props para o hook `useThreeOrbitControls`.
 * @interface UseThreeOrbitControlsProps
 * @property {React.RefObject<THREE.PerspectiveCamera | null>} cameraRef - Ref para a câmera perspectiva.
 * @property {React.RefObject<THREE.WebGLRenderer | null>} rendererRef - Ref para o renderizador WebGL (necessário para o `domElement`).
 * @property {{ x: number; y: number; z: number }} initialCameraLookAt - O ponto inicial para onde a câmera (e os controles) deve olhar.
 * @property {(cameraState: CameraState, actionDescription?: string) => void} onCameraChange - Callback acionado quando o usuário finaliza uma interação com a câmera.
 * @property {boolean} renderersReady - Flag que indica se os renderizadores (especialmente o `domElement` do WebGLRenderer) estão prontos.
 */
export interface UseThreeOrbitControlsProps {
  cameraRef: React.RefObject<THREE.PerspectiveCamera | null>;
  rendererRef: React.RefObject<THREE.WebGLRenderer | null>;
  initialCameraLookAt: { x: number; y: number; z: number };
  onCameraChange: (cameraState: CameraState, actionDescription?: string) => void;
  renderersReady: boolean;
}

/**
 * Valor de retorno do hook `useThreeOrbitControls`.
 * @interface UseThreeOrbitControlsReturn
 * @property {React.RefObject<OrbitControlsType | null>} controlsRef - Ref para a instância de `OrbitControls`.
 * @property {boolean} isControlsReady - Flag que indica se os `OrbitControls` foram carregados e inicializados com sucesso.
 */
export interface UseThreeOrbitControlsReturn {
  controlsRef: React.RefObject<OrbitControlsType | null>;
  isControlsReady: boolean;
}

/**
 * Configura e gerencia os `OrbitControls` do Three.js.
 * Lida com importação dinâmica, configuração e ouvintes de eventos para mudanças na câmera.
 * @param {UseThreeOrbitControlsProps} props - Propriedades para a configuração dos OrbitControls.
 * @returns {UseThreeOrbitControlsReturn} Ref para os OrbitControls e flag de prontidão.
 */
export function useThreeOrbitControls({
  cameraRef,
  rendererRef,
  initialCameraLookAt,
  onCameraChange,
  renderersReady,
}: UseThreeOrbitControlsProps): UseThreeOrbitControlsReturn {
  const controlsRef = useRef<OrbitControlsType | null>(null);
  const [isControlsReady, setIsControlsReady] = useState(false);
  const onCameraChangeRef = useRef(onCameraChange);

  useEffect(() => {
    onCameraChangeRef.current = onCameraChange;
  }, [onCameraChange]);

  useEffect(() => {
    if (!renderersReady || !cameraRef.current || !rendererRef.current || !rendererRef.current.domElement) {
      setIsControlsReady(false);
      return;
    }

    const currentCamera = cameraRef.current;
    const currentRendererDOMElement = rendererRef.current.domElement;

    let localControlsInstance: OrbitControlsType | null = null;
    let isEffectMounted = true;

    import('three/examples/jsm/controls/OrbitControls.js')
      .then(module => {
        if (!isEffectMounted || !currentCamera || !currentRendererDOMElement) {
          if (isEffectMounted) setIsControlsReady(false);
          return;
        }
        const OrbitControls = module.OrbitControls;
        localControlsInstance = new OrbitControls(currentCamera, currentRendererDOMElement);
        controlsRef.current = localControlsInstance;

        localControlsInstance.enableDamping = true;
        localControlsInstance.target.set(initialCameraLookAt.x, initialCameraLookAt.y, initialCameraLookAt.z);
        localControlsInstance.mouseButtons = {
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.ROTATE,
          RIGHT: THREE.MOUSE.PAN
        };
        localControlsInstance.update();

        const handleControlsChangeEnd = () => {
          if (cameraRef.current && controlsRef.current && onCameraChangeRef.current) {
            const newCameraState: CameraState = {
              position: cameraRef.current.position.clone(),
              lookAt: controlsRef.current.target.clone(),
            };
            onCameraChangeRef.current(newCameraState, 'Câmera movida pelo usuário (OrbitControls)');
          }
        };
        (localControlsInstance as any).__private_handleControlsChangeEndListener = handleControlsChangeEnd;
        localControlsInstance.addEventListener('end', handleControlsChangeEnd);

        if (isEffectMounted) {
          setIsControlsReady(true);
        }
      })
      .catch(err => {
        console.error("[useThreeOrbitControls] Falha ao carregar OrbitControls", err);
        if (isEffectMounted) {
          setIsControlsReady(false);
        }
      });

    return () => {
      isEffectMounted = false;
      if (controlsRef.current) {
        const listener = (controlsRef.current as any).__private_handleControlsChangeEndListener;
        if (listener) {
          controlsRef.current.removeEventListener('end', listener);
        }
        controlsRef.current.dispose();
        controlsRef.current = null;
      }
      setIsControlsReady(false);
    };
  }, [cameraRef, rendererRef, initialCameraLookAt, renderersReady]);

  return { controlsRef, isControlsReady };
}
