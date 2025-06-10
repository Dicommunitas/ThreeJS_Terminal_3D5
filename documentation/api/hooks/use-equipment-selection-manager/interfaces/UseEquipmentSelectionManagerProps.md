[**3D Terminal System API Documentation**](../../../README.md)

***

[3D Terminal System API Documentation](../../../README.md) / [hooks/use-equipment-selection-manager](../README.md) / UseEquipmentSelectionManagerProps

# Interface: UseEquipmentSelectionManagerProps

Defined in: [src/hooks/use-equipment-selection-manager.ts:53](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-equipment-selection-manager.ts#L53)

Props para o hook `useEquipmentSelectionManager`.
 UseEquipmentSelectionManagerProps

## Properties

### equipmentData

> **equipmentData**: [`Equipment`](../../../lib/types/interfaces/Equipment.md)[]

Defined in: [src/hooks/use-equipment-selection-manager.ts:54](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-equipment-selection-manager.ts#L54)

Lista completa de todos os equipamentos. Usada para buscar nomes
                                      de equipamentos para mensagens de feedback (toasts).

***

### executeCommand()

> **executeCommand**: (`command`) => `void`

Defined in: [src/hooks/use-equipment-selection-manager.ts:55](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-equipment-selection-manager.ts#L55)

Função para executar comandos (e.g., seleção de equipamento)
                                                       e adicioná-los ao histórico de undo/redo.

#### Parameters

##### command

[`Command`](../../../lib/types/interfaces/Command.md)

#### Returns

`void`
