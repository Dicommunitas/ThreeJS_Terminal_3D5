
/**
 * @module hooks/useThreeCore
 * Hook customizado para inicializar o núcleo de uma cena Three.js: a Cena (`THREE.Scene`) e a Câmera Perspectiva (`THREE.PerspectiveCamera`).
 *
 * Este hook é responsável pela criação fundamental da cena e da câmera.
 * A câmera é configurada com uma posição inicial e uma razão de aspecto derivada
 * do elemento DOM onde a cena será montada.
 *
 * @returns Refs para os objetos de cena e câmera criados.
 *
 * @example Diagrama de Responsabilidade do useThreeCore:
 * ```mermaid
 * graph TD
 *     useThreeCore["useThreeCore (Hook)"]
 *     Props["UseThreeCoreProps"]
 *     Return["UseThreeCoreReturn"]
 *     Scene["THREE.Scene"]
 *     Camera["THREE.PerspectiveCamera"]
 *     MountElement["Elemento DOM (para aspect ratio)"]
 *
 *     Props --> useThreeCore
 *     useThreeCore -- cria --> Scene
 *     useThreeCore -- cria e configura com base em --> MountElement
 *     useThreeCore -- cria e configura --> Camera
 *     useThreeCore -- retorna refs para --> Return
 *     Return -- contém ref para --> Scene
 *     Return -- contém ref para --> Camera
 *
 *     Props -- define --> PInitialPos["initialCameraPosition"]
 *     Props -- define --> PMountRef["mountRef"]
 *
 *     classDef hook fill:#lightblue,stroke:#333,stroke-width:2px;
 *     classDef type fill:#lightgoldenrodyellow,stroke:#333,stroke-width:2px;
 *     classDef obj3d fill:#lightgreen,stroke:#333,stroke-width:2px;
 *     classDef dom fill:#lightcoral,stroke:#333,stroke-width:2px;
 *
 *     class useThreeCore hook;
 *     class Props,Return,PInitialPos,PMountRef type;
 *     class Scene,Camera obj3d;
 *     class MountElement dom;
 * ```
 */
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * Props para o hook `useThreeCore`.
 * @interface UseThreeCoreProps
 * @property {{ x: number; y: number; z: number }} initialCameraPosition - A posição inicial da câmera.
 * @property {React.RefObject<HTMLDivElement | null>} mountRef - Ref para o elemento DOM contêiner da cena,
 *                                                               usado para calcular a razão de aspecto inicial da câmera.
 */
export interface UseThreeCoreProps {
  initialCameraPosition: { x: number; y: number; z: number };
  mountRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Valor de retorno do hook `useThreeCore`.
 * @interface UseThreeCoreReturn
 * @property {React.RefObject<THREE.Scene | null>} sceneRef - Ref para o objeto `THREE.Scene` criado.
 * @property {React.RefObject<THREE.PerspectiveCamera | null>} cameraRef - Ref para o objeto `THREE.PerspectiveCamera` criado.
 */
export interface UseThreeCoreReturn {
  sceneRef: React.RefObject<THREE.Scene | null>;
  cameraRef: React.RefObject<THREE.PerspectiveCamera | null>;
}

/**
 * Inicializa o núcleo da cena Three.js (cena e câmera perspectiva).
 * @param {UseThreeCoreProps} props - Propriedades para a configuração do núcleo.
 * @returns {UseThreeCoreReturn} Refs para a cena e a câmera.
 */
export function useThreeCore({ initialCameraPosition, mountRef }: UseThreeCoreProps): UseThreeCoreReturn {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) {
      return;
    }

    sceneRef.current = new THREE.Scene();
    const aspectRatio = Math.max(1, currentMount.clientWidth) / Math.max(1, currentMount.clientHeight);
    cameraRef.current = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 2000);
    cameraRef.current.position.set(initialCameraPosition.x, initialCameraPosition.y, initialCameraPosition.z);

    return () => {
      sceneRef.current = null;
      cameraRef.current = null;
    };
  }, [initialCameraPosition, mountRef]);

  return { sceneRef, cameraRef };
}
