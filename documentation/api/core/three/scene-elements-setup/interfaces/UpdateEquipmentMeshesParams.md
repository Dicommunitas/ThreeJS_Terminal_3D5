[**3D Terminal System API Documentation**](../../../../README.md)

***

[3D Terminal System API Documentation](../../../../README.md) / [core/three/scene-elements-setup](../README.md) / UpdateEquipmentMeshesParams

# Interface: UpdateEquipmentMeshesParams

Defined in: [src/core/three/scene-elements-setup.ts:212](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/core/three/scene-elements-setup.ts#L212)

Interface para os parâmetros da função `updateEquipmentMeshesInScene`.
 UpdateEquipmentMeshesParams

## Example

```mermaid
classDiagram
    class UpdateEquipmentMeshesParams {
      +scene: THREE.Scene
      +equipmentMeshesRef: React.MutableRefObject_Object3D_Array_
      +newEquipmentData: Equipment[]
      +layers: Layer[]
      +colorMode: ColorMode
      +createSingleEquipmentMesh(item: Equipment): THREE.Object3D
      +groundMeshRef: React.MutableRefObject_Mesh_
    }
    class Equipment {
    }
    class Layer {
    }
    class ColorMode {
    }
    class THREE_Object3D {
    }
    class THREE_Mesh {
    }
    class THREE_Scene {
    }
    class React_MutableRefObject {
    }

    UpdateEquipmentMeshesParams --> THREE_Scene : scene
    UpdateEquipmentMeshesParams --> React_MutableRefObject : equipmentMeshesRef
    UpdateEquipmentMeshesParams --> React_MutableRefObject : groundMeshRef
    React_MutableRefObject --> THREE_Object3D : (array for equipment)
    React_MutableRefObject --> THREE_Mesh : (for ground)
    UpdateEquipmentMeshesParams --> Equipment : newEquipmentData (array)
    UpdateEquipmentMeshesParams --> Layer : layers (array)
    UpdateEquipmentMeshesParams --> ColorMode : colorMode

    style UpdateEquipmentMeshesParams fill:#DCDCDC,stroke:#333,stroke-width:2px,color:black
    style Equipment,Layer,ColorMode,THREE_Object3D,THREE_Mesh,THREE_Scene,React_MutableRefObject fill:#FFFFE0,stroke:#333,stroke-width:2px,color:black
```

## Properties

### colorMode

> **colorMode**: [`ColorMode`](../../../../lib/types/type-aliases/ColorMode.md)

Defined in: [src/core/three/scene-elements-setup.ts:217](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/core/three/scene-elements-setup.ts#L217)

O modo de colorização atual para os equipamentos.

***

### createSingleEquipmentMesh()

> **createSingleEquipmentMesh**: (`item`) => `Object3D`

Defined in: [src/core/three/scene-elements-setup.ts:218](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/core/three/scene-elements-setup.ts#L218)

Função callback para criar um mesh de equipamento individual.

#### Parameters

##### item

[`Equipment`](../../../../lib/types/interfaces/Equipment.md)

#### Returns

`Object3D`

***

### equipmentMeshesRef

> **equipmentMeshesRef**: `MutableRefObject`\<`Object3D`\<`Object3DEventMap`\>[]\>

Defined in: [src/core/three/scene-elements-setup.ts:214](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/core/three/scene-elements-setup.ts#L214)

Ref para o array de meshes de equipamentos existentes na cena.

***

### groundMeshRef

> **groundMeshRef**: `MutableRefObject`\<`null` \| `Mesh`\<`BufferGeometry`\<`NormalBufferAttributes`\>, `Material` \| `Material`[], `Object3DEventMap`\>\>

Defined in: [src/core/three/scene-elements-setup.ts:219](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/core/three/scene-elements-setup.ts#L219)

Ref para o mesh do plano de chão, para controle de visibilidade.

***

### layers

> **layers**: [`Layer`](../../../../lib/types/interfaces/Layer.md)[]

Defined in: [src/core/three/scene-elements-setup.ts:216](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/core/three/scene-elements-setup.ts#L216)

A lista de camadas para determinar a visibilidade por tipo de equipamento e do terreno.

***

### newEquipmentData

> **newEquipmentData**: [`Equipment`](../../../../lib/types/interfaces/Equipment.md)[]

Defined in: [src/core/three/scene-elements-setup.ts:215](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/core/three/scene-elements-setup.ts#L215)

A nova lista de equipamentos a serem renderizados (já filtrada).

***

### scene

> **scene**: `Scene`

Defined in: [src/core/three/scene-elements-setup.ts:213](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/core/three/scene-elements-setup.ts#L213)

A cena Three.js.
