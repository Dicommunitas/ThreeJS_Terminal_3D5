[**3D Terminal System API Documentation**](../../../README.md)

***

[3D Terminal System API Documentation](../../../README.md) / [hooks/use-mouse-interaction](../README.md) / UseMouseInteractionManagerProps

# Interface: UseMouseInteractionManagerProps

Defined in: [src/hooks/use-mouse-interaction.ts:53](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-mouse-interaction.ts#L53)

## Properties

### cameraRef

> **cameraRef**: `RefObject`\<`null` \| `PerspectiveCamera`\>

Defined in: [src/hooks/use-mouse-interaction.ts:55](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-mouse-interaction.ts#L55)

***

### equipmentMeshesRef

> **equipmentMeshesRef**: `RefObject`\<`null` \| `Object3D`\<`Object3DEventMap`\>[]\>

Defined in: [src/hooks/use-mouse-interaction.ts:56](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-mouse-interaction.ts#L56)

***

### isSceneReady

> **isSceneReady**: `boolean`

Defined in: [src/hooks/use-mouse-interaction.ts:57](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-mouse-interaction.ts#L57)

***

### mountRef

> **mountRef**: `RefObject`\<`null` \| `HTMLDivElement`\>

Defined in: [src/hooks/use-mouse-interaction.ts:54](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-mouse-interaction.ts#L54)

***

### onSelectEquipment()

> **onSelectEquipment**: (`tag`, `isMultiSelectModifierPressed`) => `void`

Defined in: [src/hooks/use-mouse-interaction.ts:58](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-mouse-interaction.ts#L58)

#### Parameters

##### tag

`null` | `string`

##### isMultiSelectModifierPressed

`boolean`

#### Returns

`void`

***

### setHoveredEquipmentTag()

> **setHoveredEquipmentTag**: (`tag`) => `void`

Defined in: [src/hooks/use-mouse-interaction.ts:59](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-mouse-interaction.ts#L59)

#### Parameters

##### tag

`null` | `string`

#### Returns

`void`
