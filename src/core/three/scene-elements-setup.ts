
/**
 * @module core/three/scene-elements-setup
 * Utilitários para configurar elementos básicos e gerenciar meshes de equipamentos em uma cena Three.js.
 *
 * Principal Responsabilidade:
 * Encapsular a lógica de baixo nível para a criação, configuração e atualização de
 * componentes fundamentais da cena 3D, como iluminação, plano de chão, renderizadores
 * (WebGL e CSS2D), pipeline de pós-processamento (EffectComposer, OutlinePass), e a
 * sincronização dinâmica dos meshes de equipamentos com os dados da aplicação.
 *
 * Diagrama de Estrutura e Interdependências:
 * ```mermaid
 *   graph TD;
 *     A[setupRenderPipeline] --> B{renderer: WebGLRenderer};
 *     A --> C{labelRenderer: CSS2DRenderer};
 *     A --> D{composer: EffectComposer};
 *     A --> E{outlinePass: OutlinePass};
 *
 *     F[UpdateEquipmentMeshesParams] --> G[updateEquipmentMeshesInScene];
 *     class H[Equipment] --> F;
 *     class I[Layer] --> F;
 *     class J[ColorMode] --> F;
 *
 *     classDef params fill:#DCDCDC,stroke:#333,stroke-width:2px,color:black;
 *     classDef func fill:#ADD8E6,stroke:#333,stroke-width:2px,color:black;
 *     classDef return fill:#90EE90,stroke:#333,stroke-width:2px,color:black;
 *     classDef type fill:#FFFFE0,stroke:#333,stroke-width:2px,color:black;
 *
 *     class A func;
 *     class B,C,D,E return;
 *     class F params;
 *     class G func;
 *     class H,I,J type;
 * ```
 *
 * Exporta:
 * - `setupLighting`: Configura a iluminação da cena.
 * - `setupGroundPlane`: Configura o plano de chão.
 * - `setupRenderPipeline`: Inicializa os renderizadores e o pipeline de pós-processamento.
 * - `updateEquipmentMeshesInScene`: Atualiza dinamicamente os meshes dos equipamentos.
 */
import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import type { Equipment, Layer, ColorMode } from '@/lib/types';

/**
 * Configura a iluminação padrão para a cena.
 * Adiciona uma AmbientLight para iluminação geral, uma HemisphereLight para simular luz do céu e do chão,
 * e uma DirectionalLight para simular luz solar com sombras (atualmente desabilitadas por performance).
 * @param scene A instância da cena Three.js onde as luzes serão adicionadas.
 */
export function setupLighting(scene: THREE.Scene): void {
  const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
  scene.add(ambientLight);

  const hemisphereLight = new THREE.HemisphereLight(0xADD8E6, 0x495436, 0.8);
  scene.add(hemisphereLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 3.0);
  directionalLight.position.set(10, 15, 10);
  directionalLight.castShadow = false;
  scene.add(directionalLight);
}

/**
 * Configura o plano de chão (terreno) para a cena.
 * Cria um `THREE.Mesh` com `PlaneGeometry` e `MeshStandardMaterial`.
 * O plano é posicionado em Y=0 e rotacionado para ficar horizontal.
 * @param scene A instância da cena Three.js onde o plano será adicionado.
 * @returns O mesh do plano de chão criado.
 */
export function setupGroundPlane(scene: THREE.Scene): THREE.Mesh {
  const groundGeometry = new THREE.PlaneGeometry(100, 100);
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0xE6D8B0,
    side: THREE.DoubleSide,
    metalness: 0.1,
    roughness: 0.8,
    transparent: false,
    opacity: 1.0,
  });
  const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = 0;
  groundMesh.receiveShadow = false;
  groundMesh.userData = { tag: 'terrain-ground-plane' };
  scene.add(groundMesh);
  return groundMesh;
}


/**
 * Configura os renderizadores principais (WebGL, CSS2D) e o pipeline de pós-processamento.
 * Centraliza a criação do WebGLRenderer, CSS2DRenderer, EffectComposer e OutlinePass.
 * @param mountElement - O elemento DOM onde o canvas WebGL e o renderer de labels serão montados.
 * @param scene - A cena Three.js.
 * @param camera - A câmera da cena.
 * @returns Um objeto contendo as instâncias configuradas, ou null se mountElement não for válido.
 */
export function setupRenderPipeline(
  mountElement: HTMLElement,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
): {
  renderer: THREE.WebGLRenderer;
  labelRenderer: CSS2DRenderer;
  composer: EffectComposer;
  outlinePass: OutlinePass;
} | null {
  if (!mountElement) {
    return null;
  }
  const initialWidth = Math.max(1, mountElement.clientWidth);
  const initialHeight = Math.max(1, mountElement.clientHeight);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true,
    alpha: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(initialWidth, initialHeight);
  renderer.shadowMap.enabled = false;
  scene.background = new THREE.Color(0xA9C1D1);
  scene.fog = new THREE.Fog(0xA9C1D1, 200, 1000);

  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(initialWidth, initialHeight);
  labelRenderer.domElement.style.position = 'absolute';
  labelRenderer.domElement.style.top = '0px';
  labelRenderer.domElement.style.left = '0px';
  labelRenderer.domElement.style.pointerEvents = 'none';

  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const outlinePass = new OutlinePass(new THREE.Vector2(initialWidth, initialHeight), scene, camera);
  outlinePass.edgeStrength = 0;
  outlinePass.edgeGlow = 0.0;
  outlinePass.edgeThickness = 1.0;
  outlinePass.visibleEdgeColor.set('#ffffff');
  outlinePass.hiddenEdgeColor.set('#190a05');
  outlinePass.pulsePeriod = 0;
  composer.addPass(outlinePass);

  if (!renderer.domElement.parentNode) {
    mountElement.appendChild(renderer.domElement);
  }
  if (!labelRenderer.domElement.parentNode) {
    mountElement.appendChild(labelRenderer.domElement);
  }

  return { renderer, labelRenderer, composer, outlinePass };
}

/**
 * Interface para os parâmetros da função `updateEquipmentMeshesInScene`.
 * @interface UpdateEquipmentMeshesParams
 * @property scene - A cena Three.js.
 * @property equipmentMeshesRef - Ref para o array de meshes de equipamentos existentes na cena.
 * @property newEquipmentData - A nova lista de equipamentos a serem renderizados (já filtrada).
 * @property layers - A lista de camadas para determinar a visibilidade por tipo de equipamento e do terreno.
 * @property colorMode - O modo de colorização atual para os equipamentos.
 * @property createSingleEquipmentMesh - Função callback para criar um mesh de equipamento individual.
 * @property groundMeshRef - Ref para o mesh do plano de chão, para controle de visibilidade.
 *
 * Representação da interface:
 * ```mermaid
 * classDiagram
 *     class UpdateEquipmentMeshesParams {
 *       +scene: THREE.Scene
 *       +equipmentMeshesRef: React.MutableRefObject_Object3D_Array_
 *       +newEquipmentData: Equipment[]
 *       +layers: Layer[]
 *       +colorMode: ColorMode
 *       +createSingleEquipmentMesh(item: Equipment): THREE.Object3D
 *       +groundMeshRef: React.MutableRefObject_Mesh_
 *     }
 *     class Equipment {
 *     }
 *     class Layer {
 *     }
 *     class ColorMode {
 *     }
 *     class THREE_Object3D {
 *     }
 *     class THREE_Mesh {
 *     }
 *     class THREE_Scene {
 *     }
 *     class React_MutableRefObject {
 *     }
 *
 *     UpdateEquipmentMeshesParams --> THREE_Scene : scene
 *     UpdateEquipmentMeshesParams --> React_MutableRefObject : equipmentMeshesRef
 *     UpdateEquipmentMeshesParams --> React_MutableRefObject : groundMeshRef
 *     React_MutableRefObject --> THREE_Object3D : (array for equipment)
 *     React_MutableRefObject --> THREE_Mesh : (for ground)
 *     UpdateEquipmentMeshesParams --> Equipment : newEquipmentData (array)
 *     UpdateEquipmentMeshesParams --> Layer : layers (array)
 *     UpdateEquipmentMeshesParams --> ColorMode : colorMode
 *
 *     style UpdateEquipmentMeshesParams fill:#DCDCDC,stroke:#333,stroke-width:2px,color:black
 *     style Equipment,Layer,ColorMode,THREE_Object3D,THREE_Mesh,THREE_Scene,React_MutableRefObject fill:#FFFFE0,stroke:#333,stroke-width:2px,color:black
 * ```
 */
export interface UpdateEquipmentMeshesParams {
  scene: THREE.Scene;
  equipmentMeshesRef: React.MutableRefObject<THREE.Object3D[]>;
  newEquipmentData: Equipment[];
  layers: Layer[];
  colorMode: ColorMode;
  createSingleEquipmentMesh: (item: Equipment) => THREE.Object3D;
  groundMeshRef: React.MutableRefObject<THREE.Mesh | null>;
}

/**
 * Atualiza a lista de meshes de equipamentos na cena com base nos novos dados.
 * Remove meshes antigos, atualiza existentes (recriando-os para garantir consistência de material/cor)
 * e adiciona novos, considerando a visibilidade das camadas. Também gerencia a visibilidade do plano de chão.
 * Esta função é otimizada para recriar meshes apenas quando necessário, mas a lógica atual recria
 * para simplificar a atualização de cor e outras propriedades visuais baseadas em `colorMode` ou dados do equipamento.
 *
 * @param params - Os parâmetros para a função.
 */
export function updateEquipmentMeshesInScene({
  scene,
  equipmentMeshesRef,
  newEquipmentData,
  layers,
  colorMode,
  createSingleEquipmentMesh,
  groundMeshRef,
}: UpdateEquipmentMeshesParams): void {
  if (!scene) {
    return;
  }
  if (!equipmentMeshesRef || equipmentMeshesRef.current === undefined || equipmentMeshesRef.current === null) {
    return;
  }

  const currentMeshesByTag: Map<string, THREE.Object3D> = new Map();
  equipmentMeshesRef.current.forEach(mesh => {
    if (mesh.userData.tag) {
      currentMeshesByTag.set(mesh.userData.tag, mesh);
    }
  });

  const tagsInNewData = new Set(newEquipmentData.map(e => e.tag));
  const newVisibleMeshesList: THREE.Object3D[] = [];

  equipmentMeshesRef.current.forEach(existingMesh => {
    const itemTag = existingMesh.userData.tag;
    const itemInNewData = newEquipmentData.find(e => e.tag === itemTag);
    const layerForItem = itemInNewData ? layers.find(l => l.equipmentType === itemInNewData.type) : undefined;
    const isVisibleByLayer = layerForItem?.isVisible ?? (itemInNewData ? true : false);

    if (!tagsInNewData.has(itemTag) || (itemInNewData && !isVisibleByLayer)) {
      scene.remove(existingMesh);
      // Dispose resources of the mesh and its children if it's a group
      existingMesh.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry?.dispose();
          if (Array.isArray(object.material)) {
            (object.material as THREE.Material[]).forEach(m => m.dispose());
          } else if (object.material) {
            (object.material as THREE.Material).dispose();
          }
        }
      });
      currentMeshesByTag.delete(itemTag);
    }
  });

  newEquipmentData.forEach(item => {
    const layerForItem = layers.find(l => l.equipmentType === item.type);
    const isVisibleByLayer = layerForItem?.isVisible ?? true;

    if (!isVisibleByLayer) {
      return;
    }

    let existingMesh = currentMeshesByTag.get(item.tag);

    if (existingMesh) {
        scene.remove(existingMesh);
        existingMesh.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                object.geometry?.dispose();
                if (Array.isArray(object.material)) {
                    (object.material as THREE.Material[]).forEach(m => m.dispose());
                } else if (object.material) {
                    (object.material as THREE.Material).dispose();
                }
            }
        });
    }

    const newOrUpdatedMesh = createSingleEquipmentMesh(item);
    newOrUpdatedMesh.visible = isVisibleByLayer; // Ensure visibility is set based on layer
    scene.add(newOrUpdatedMesh);
    newVisibleMeshesList.push(newOrUpdatedMesh);
  });

  equipmentMeshesRef.current = newVisibleMeshesList;

  const terrainLayer = layers.find(l => l.id === 'layer-terrain');
  if (terrainLayer && groundMeshRef && groundMeshRef.current) {
    const isGroundInScene = scene.children.some(child => child.uuid === groundMeshRef.current?.uuid);
    const groundShouldBeVisible = terrainLayer.isVisible;

    if (groundShouldBeVisible && !isGroundInScene) {
      scene.add(groundMeshRef.current);
    } else if (!groundShouldBeVisible && isGroundInScene) {
      scene.remove(groundMeshRef.current);
    }
    groundMeshRef.current.visible = groundShouldBeVisible;
  }
}
