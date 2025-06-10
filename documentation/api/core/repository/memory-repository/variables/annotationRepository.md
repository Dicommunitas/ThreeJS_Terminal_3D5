[**3D Terminal System API Documentation**](../../../../README.md)

***

[3D Terminal System API Documentation](../../../../README.md) / [core/repository/memory-repository](../README.md) / annotationRepository

# Variable: annotationRepository

> `const` **annotationRepository**: `object`

Defined in: [src/core/repository/memory-repository.ts:167](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/core/repository/memory-repository.ts#L167)

Objeto repositório para gerenciar dados de `Annotation`.

## Type declaration

### addOrUpdateAnnotation()

> **addOrUpdateAnnotation**: (`annotation`) => [`Annotation`](../../../../lib/types/interfaces/Annotation.md)

Adiciona uma nova anotação ou atualiza uma existente se já houver uma para a mesma `equipmentTag`.

#### Parameters

##### annotation

[`Annotation`](../../../../lib/types/interfaces/Annotation.md)

O objeto da anotação a ser adicionado/atualizado.

#### Returns

[`Annotation`](../../../../lib/types/interfaces/Annotation.md)

A anotação adicionada/atualizada (uma cópia).

### deleteAnnotation()

> **deleteAnnotation**: (`equipmentTag`) => `boolean`

Exclui uma anotação pela tag do equipamento associado.

#### Parameters

##### equipmentTag

`string`

A tag do equipamento cuja anotação será excluída.

#### Returns

`boolean`

True se a anotação foi excluída com sucesso, false caso contrário.

### getAllAnnotations()

> **getAllAnnotations**: () => [`Annotation`](../../../../lib/types/interfaces/Annotation.md)[]

Obtém todas as anotações.

#### Returns

[`Annotation`](../../../../lib/types/interfaces/Annotation.md)[]

Um array com todas as anotações (cópias).

### getAnnotationByEquipmentTag()

> **getAnnotationByEquipmentTag**: (`equipmentTag`) => `undefined` \| [`Annotation`](../../../../lib/types/interfaces/Annotation.md)

Obtém uma anotação pela tag do equipamento associado.

#### Parameters

##### equipmentTag

`string`

A tag do equipamento.

#### Returns

`undefined` \| [`Annotation`](../../../../lib/types/interfaces/Annotation.md)

A anotação (uma cópia), ou undefined se não encontrada.

### initializeAnnotations()

> **initializeAnnotations**: (`annotations`) => `void`

Inicializa explicitamente as anotações no repositório.
Limpa quaisquer anotações existentes e popula com as fornecidas.

#### Parameters

##### annotations

[`Annotation`](../../../../lib/types/interfaces/Annotation.md)[]

Um array de anotações para inicializar o repositório.

#### Returns

`void`
