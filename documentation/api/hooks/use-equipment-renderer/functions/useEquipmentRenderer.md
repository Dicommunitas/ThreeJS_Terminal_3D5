[**3D Terminal System API Documentation**](../../../README.md)

***

[3D Terminal System API Documentation](../../../README.md) / [hooks/use-equipment-renderer](../README.md) / useEquipmentRenderer

# Function: useEquipmentRenderer()

> **useEquipmentRenderer**(`props`): `RefObject`\<`Object3D`\<`Object3DEventMap`\>[]\>

Defined in: [src/hooks/use-equipment-renderer.ts:91](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-equipment-renderer.ts#L91)

Hook customizado para gerenciar a renderização (criação, atualização, remoção)
dos meshes de equipamentos na cena Three.js.

## Parameters

### props

[`UseEquipmentRendererProps`](../interfaces/UseEquipmentRendererProps.md)

As props do hook.

## Returns

`RefObject`\<`Object3D`\<`Object3DEventMap`\>[]\>

Ref para a lista de meshes de equipamentos atualmente na cena.
         Este ref é gerenciado internamente pelo hook mas retornado para que outros hooks
         (e.g., para raycasting) possam acessá-lo.
