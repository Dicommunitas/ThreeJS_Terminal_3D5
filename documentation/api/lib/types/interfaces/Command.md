[**3D Terminal System API Documentation**](../../../README.md)

***

[3D Terminal System API Documentation](../../../README.md) / [lib/types](../README.md) / Command

# Interface: Command

Defined in: [src/lib/types.ts:128](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/lib/types.ts#L128)

Representa um comando executável e reversível para o sistema de Undo/Redo.
Cada ação do usuário que pode ser desfeita (e.g., mover a câmera, alternar visibilidade de camada,
selecionar equipamento) deve ser encapsulada como um `Command`.

 Command

## Properties

### description

> **description**: `string`

Defined in: [src/lib/types.ts:133](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/lib/types.ts#L133)

Descrição textual do comando, usada para logging ou exibição na UI (e.g., em toasts de undo/redo).

***

### execute()

> **execute**: () => `void`

Defined in: [src/lib/types.ts:131](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/lib/types.ts#L131)

Função que realiza a ação do comando.

#### Returns

`void`

***

### id

> **id**: `string`

Defined in: [src/lib/types.ts:129](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/lib/types.ts#L129)

Identificador único do comando, geralmente incluindo um timestamp para unicidade.

***

### type

> **type**: `"CAMERA_MOVE"` \| `"LAYER_VISIBILITY"` \| `"EQUIPMENT_SELECT"`

Defined in: [src/lib/types.ts:130](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/lib/types.ts#L130)

Tipo do comando, para categorização.

***

### undo()

> **undo**: () => `void`

Defined in: [src/lib/types.ts:132](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/lib/types.ts#L132)

Função que reverte a ação do comando, restaurando o estado anterior.

#### Returns

`void`
