
/**
 * @module hooks/useThreeSceneElements
 * Hook customizado para configurar elementos básicos da cena Three.js, como iluminação e plano de chão.
 *
 * Este hook é responsável por adicionar elementos visuais e de ambiente fundamentais à cena.
 * Ele utiliza funções de utilidade (`setupLighting`, `setupGroundPlane`) para criar e adicionar
 * luzes (ambiente, hemisférica, direcional) e uma malha (mesh) para o plano de chão.
 * A execução depende da prontidão do núcleo da cena (objeto `THREE.Scene`).
 *
 * @see {@link documentation/api/core/three/scene-elements-setup/README.md#setupLighting} Para a função de configuração da iluminação.
 * @see {@link documentation/api/core/three/scene-elements-setup/README.md#setupGroundPlane} Para a função de configuração do plano de chão.
 *
 * Diagrama de Funcionalidade do useThreeSceneElements:
 * ```mermaid
 * graph TD
 *     useThreeSceneElements["useThreeSceneElements (Hook)"]
 *     Props["UseThreeSceneElementsProps"]
 *     Return["UseThreeSceneElementsReturn"]
 *     SceneRef_Prop["sceneRef (da Cena Principal)"]
 *     CoreReady_Flag["coreReady (flag)"]
 *     Utils_Module["scene-elements-setup Utilities"]
 *     Lighting_Elements["Iluminação (Ambient, Hemisphere, Directional)"]
 *     GroundPlane_Mesh["Plano de Chão (THREE.Mesh)"]
 *
 *     Props -- define --> SceneRef_Prop
 *     Props -- define --> CoreReady_Flag
 *     Props --> useThreeSceneElements
 *
 *     useThreeSceneElements -- verifica --> CoreReady_Flag
 *     useThreeSceneElements -- usa --> SceneRef_Prop
 *     useThreeSceneElements -- chama --> Utils_Module
 *     Utils_Module -- adiciona à cena --> Lighting_Elements
 *     Utils_Module -- cria e adiciona à cena --> GroundPlane_Mesh
 *
 *     useThreeSceneElements -- retorna ref para --> Return
 *     Return -- contém ref para --> GroundPlane_Mesh
 *
 *     classDef hook fill:#lightblue,stroke:#333,stroke-width:2px;
 *     classDef type fill:#lightgoldenrodyellow,stroke:#333,stroke-width:2px;
 *     classDef obj3d fill:#lightgreen,stroke:#333,stroke-width:2px;
 *     classDef util fill:#lightcoral,stroke:#333,stroke-width:2px;
 *     classDef flag fill:#lightpink,stroke:#333,stroke-width:2px;
 *
 *     class useThreeSceneElements hook;
 *     class Props,Return,SceneRef_Prop type;
 *     class CoreReady_Flag flag;
 *     class Lighting_Elements,GroundPlane_Mesh obj3d;
 *     class Utils_Module util;
 * ```
 */
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { setupLighting, setupGroundPlane } from '@/core/three/scene-elements-setup';

/**
 * Props para o hook `useThreeSceneElements`.
 * @interface UseThreeSceneElementsProps
 * @property {React.RefObject<THREE.Scene | null>} sceneRef - Ref para o objeto `THREE.Scene` onde os elementos serão adicionados.
 * @property {boolean} coreReady - Flag que indica se o núcleo da cena (incluindo `sceneRef.current`) está pronto.
 */
export interface UseThreeSceneElementsProps {
  sceneRef: React.RefObject<THREE.Scene | null>;
  coreReady: boolean;
}

/**
 * Valor de retorno do hook `useThreeSceneElements`.
 * @interface UseThreeSceneElementsReturn
 * @property {React.RefObject<THREE.Mesh | null>} groundMeshRef - Ref para a malha (mesh) do plano de chão criada.
 */
export interface UseThreeSceneElementsReturn {
  groundMeshRef: React.RefObject<THREE.Mesh | null>;
}

/**
 * Configura elementos básicos da cena, como iluminação e plano de chão.
 * @param {UseThreeSceneElementsProps} props - Propriedades para a configuração dos elementos da cena.
 * @returns {UseThreeSceneElementsReturn} Ref para a malha do plano de chão.
 */
export function useThreeSceneElements({ sceneRef, coreReady }: UseThreeSceneElementsProps): UseThreeSceneElementsReturn {
  const groundMeshRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    const currentScene = sceneRef.current;
    if (!coreReady || !currentScene) {
      return;
    }

    setupLighting(currentScene);
    groundMeshRef.current = setupGroundPlane(currentScene);

    return () => {
      // A limpeza da iluminação é geralmente tratada pela remoção da cena ou descarte do renderizador.
      // O plano de chão é explicitamente removido e seus recursos liberados.
      if (groundMeshRef.current && currentScene) {
        currentScene.remove(groundMeshRef.current);
        groundMeshRef.current.geometry?.dispose();
        if (groundMeshRef.current.material instanceof THREE.Material) {
          (groundMeshRef.current.material as THREE.Material).dispose();
        } else if (Array.isArray(groundMeshRef.current.material)) {
           (groundMeshRef.current.material as THREE.Material[]).forEach(m => m.dispose());
        }
        groundMeshRef.current = null;
      }
    };
  }, [sceneRef, coreReady]);

  return { groundMeshRef };
}
