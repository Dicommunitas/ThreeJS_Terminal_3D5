[**3D Terminal System API Documentation**](../../../README.md)

***

[3D Terminal System API Documentation](../../../README.md) / [hooks/use-equipment-renderer](../README.md) / UseEquipmentRendererProps

# Interface: UseEquipmentRendererProps

Defined in: [src/hooks/use-equipment-renderer.ts:69](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-equipment-renderer.ts#L69)

## Properties

### cameraRef

> **cameraRef**: `RefObject`\<`null` \| `PerspectiveCamera`\>

Defined in: [src/hooks/use-equipment-renderer.ts:71](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-equipment-renderer.ts#L71)

***

### colorMode

> **colorMode**: [`ColorMode`](../../../lib/types/type-aliases/ColorMode.md)

Defined in: [src/hooks/use-equipment-renderer.ts:77](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-equipment-renderer.ts#L77)

***

### controlsRef

> **controlsRef**: `RefObject`\<`null` \| `OrbitControls`\>

Defined in: [src/hooks/use-equipment-renderer.ts:72](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-equipment-renderer.ts#L72)

***

### createSingleEquipmentMesh()

> **createSingleEquipmentMesh**: (`item`) => `Object3D`

Defined in: [src/hooks/use-equipment-renderer.ts:78](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-equipment-renderer.ts#L78)

#### Parameters

##### item

[`Equipment`](../../../lib/types/interfaces/Equipment.md)

#### Returns

`Object3D`

***

### equipmentData

> **equipmentData**: [`Equipment`](../../../lib/types/interfaces/Equipment.md)[]

Defined in: [src/hooks/use-equipment-renderer.ts:75](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-equipment-renderer.ts#L75)

***

### groundMeshRef

> **groundMeshRef**: `RefObject`\<`null` \| `Mesh`\<`BufferGeometry`\<`NormalBufferAttributes`\>, `Material` \| `Material`[], `Object3DEventMap`\>\>

Defined in: [src/hooks/use-equipment-renderer.ts:79](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-equipment-renderer.ts#L79)

***

### isControlsReady

> **isControlsReady**: `boolean`

Defined in: [src/hooks/use-equipment-renderer.ts:74](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-equipment-renderer.ts#L74)

***

### isSceneReady

> **isSceneReady**: `boolean`

Defined in: [src/hooks/use-equipment-renderer.ts:73](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-equipment-renderer.ts#L73)

***

### layers

> **layers**: [`Layer`](../../../lib/types/interfaces/Layer.md)[]

Defined in: [src/hooks/use-equipment-renderer.ts:76](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-equipment-renderer.ts#L76)

***

### sceneRef

> **sceneRef**: `RefObject`\<`null` \| `Scene`\>

Defined in: [src/hooks/use-equipment-renderer.ts:70](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-equipment-renderer.ts#L70)
