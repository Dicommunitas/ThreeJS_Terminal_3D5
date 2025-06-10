[**3D Terminal System API Documentation**](../../../README.md)

***

[3D Terminal System API Documentation](../../../README.md) / [hooks/use-scene-outline](../README.md) / UseSceneOutlineProps

# Interface: UseSceneOutlineProps

Defined in: [src/hooks/use-scene-outline.ts:56](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-scene-outline.ts#L56)

Props para o hook useSceneOutline.
 UseSceneOutlineProps

## Properties

### equipmentMeshesRef

> **equipmentMeshesRef**: `RefObject`\<`Object3D`\<`Object3DEventMap`\>[]\>

Defined in: [src/hooks/use-scene-outline.ts:58](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-scene-outline.ts#L58)

Ref para o array de meshes de equipamentos na cena.

***

### hoveredEquipmentTag

> **hoveredEquipmentTag**: `undefined` \| `null` \| `string`

Defined in: [src/hooks/use-scene-outline.ts:60](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-scene-outline.ts#L60)

Tag do equipamento atualmente em hover.

***

### isSceneReady

> **isSceneReady**: `boolean`

Defined in: [src/hooks/use-scene-outline.ts:61](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-scene-outline.ts#L61)

Flag indicando se a cena 3D está pronta.

***

### outlinePassRef

> **outlinePassRef**: `RefObject`\<`null` \| `OutlinePass`\>

Defined in: [src/hooks/use-scene-outline.ts:57](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-scene-outline.ts#L57)

Ref para a instância do OutlinePass.

***

### selectedEquipmentTags

> **selectedEquipmentTags**: `undefined` \| `string`[]

Defined in: [src/hooks/use-scene-outline.ts:59](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-scene-outline.ts#L59)

Array de tags dos equipamentos selecionados.
