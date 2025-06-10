[**3D Terminal System API Documentation**](../../../../README.md)

***

[3D Terminal System API Documentation](../../../../README.md) / [core/repository/memory-repository](../README.md) / equipmentRepository

# Variable: equipmentRepository

> `const` **equipmentRepository**: `object`

Defined in: [src/core/repository/memory-repository.ts:90](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/core/repository/memory-repository.ts#L90)

Objeto repositório para gerenciar dados de `Equipment`.

## Type declaration

### addEquipment()

> **addEquipment**: (`equipment`) => [`Equipment`](../../../../lib/types/interfaces/Equipment.md)

Adiciona um novo equipamento. Se um equipamento com a mesma tag já existir,
ele será atualizado em vez de adicionar um novo.

#### Parameters

##### equipment

[`Equipment`](../../../../lib/types/interfaces/Equipment.md)

O objeto do equipamento a ser adicionado.

#### Returns

[`Equipment`](../../../../lib/types/interfaces/Equipment.md)

O equipamento adicionado (ou atualizado, uma cópia).

### deleteEquipment()

> **deleteEquipment**: (`tag`) => `boolean`

Exclui um equipamento pela sua tag.

#### Parameters

##### tag

`string`

A tag do equipamento a ser excluído.

#### Returns

`boolean`

True se o equipamento foi excluído com sucesso, false caso contrário.

### getAllEquipment()

> **getAllEquipment**: () => [`Equipment`](../../../../lib/types/interfaces/Equipment.md)[]

Obtém todos os equipamentos.

#### Returns

[`Equipment`](../../../../lib/types/interfaces/Equipment.md)[]

Um array com todos os equipamentos (cópias).

### getEquipmentByTag()

> **getEquipmentByTag**: (`tag`) => `undefined` \| [`Equipment`](../../../../lib/types/interfaces/Equipment.md)

Obtém um equipamento pela sua tag.

#### Parameters

##### tag

`string`

A tag do equipamento.

#### Returns

`undefined` \| [`Equipment`](../../../../lib/types/interfaces/Equipment.md)

O objeto do equipamento (uma cópia), ou undefined se não encontrado.

### updateEquipment()

> **updateEquipment**: (`tag`, `updates`) => `undefined` \| [`Equipment`](../../../../lib/types/interfaces/Equipment.md)

Atualiza um equipamento existente.

#### Parameters

##### tag

`string`

A tag do equipamento a ser atualizado.

##### updates

`Partial`\<[`Equipment`](../../../../lib/types/interfaces/Equipment.md)\>

Um objeto com as propriedades do equipamento a serem atualizadas.
                                     A propriedade `tag` não pode ser alterada por este método.

#### Returns

`undefined` \| [`Equipment`](../../../../lib/types/interfaces/Equipment.md)

O equipamento atualizado (uma cópia), ou undefined se não encontrado.
