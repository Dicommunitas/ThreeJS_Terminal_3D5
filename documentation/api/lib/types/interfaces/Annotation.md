[**3D Terminal System API Documentation**](../../../README.md)

***

[3D Terminal System API Documentation](../../../README.md) / [lib/types](../README.md) / Annotation

# Interface: Annotation

Defined in: [src/lib/types.ts:147](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/lib/types.ts#L147)

Representa uma anotação textual associada a um equipamento específico.
Cada equipamento pode ter no máximo uma anotação.

 Annotation

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/lib/types.ts:150](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/lib/types.ts#L150)

Data e hora em formato string ISO 8601 (e.g., "2023-10-27T10:30:00.000Z")
                               indicando quando a anotação foi criada ou atualizada pela última vez.

***

### equipmentTag

> **equipmentTag**: `string`

Defined in: [src/lib/types.ts:148](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/lib/types.ts#L148)

A tag do equipamento ao qual esta anotação está vinculada.
                                 Serve como chave estrangeira para o objeto `Equipment`.

***

### text

> **text**: `string`

Defined in: [src/lib/types.ts:149](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/lib/types.ts#L149)

O conteúdo textual da anotação.
