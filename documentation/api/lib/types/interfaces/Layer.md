[**3D Terminal System API Documentation**](../../../README.md)

***

[3D Terminal System API Documentation](../../../README.md) / [lib/types](../README.md) / Layer

# Interface: Layer

Defined in: [src/lib/types.ts:66](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/lib/types.ts#L66)

Representa uma camada de visualização na interface do usuário.
Camadas permitem ao usuário controlar a visibilidade de grupos de equipamentos
ou outros elementos da cena (como anotações ou o terreno).

 Layer

## Properties

### equipmentType

> **equipmentType**: `"Building"` \| `"Crane"` \| `"Tank"` \| `"Terrain"` \| `"Pipe"` \| `"Valve"` \| `"All"` \| `"Annotations"`

Defined in: [src/lib/types.ts:69](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/lib/types.ts#L69)

O tipo de elemento que esta camada controla.
          - `Equipment['type']`: Controla equipamentos de um tipo específico (e.g., 'Building', 'Tank').
          - `'All'`: Potencialmente para controlar todos os equipamentos (uso específico a ser definido).
          - `'Annotations'`: Controla a visibilidade dos pins de anotação.
          - `'Terrain'`: Controla a visibilidade do plano de chão.

***

### id

> **id**: `string`

Defined in: [src/lib/types.ts:67](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/lib/types.ts#L67)

Identificador único da camada (e.g., 'layer-tanks', 'layer-annotations').

***

### isVisible

> **isVisible**: `boolean`

Defined in: [src/lib/types.ts:70](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/lib/types.ts#L70)

Indica se a camada (e os elementos que ela controla) está atualmente visível.

***

### name

> **name**: `string`

Defined in: [src/lib/types.ts:68](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/lib/types.ts#L68)

Nome legível da camada para exibição na UI (e.g., "Tanques", "Anotações").
