[**3D Terminal System API Documentation**](../../../README.md)

***

[3D Terminal System API Documentation](../../../README.md) / [lib/types](../README.md) / Equipment

# Interface: Equipment

Defined in: [src/lib/types.ts:33](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/lib/types.ts#L33)

Representa um equipamento na cena 3D. Contém todas as propriedades
necessárias para sua renderização, identificação e manipulação de estado.

 Equipment

## Properties

### area?

> `optional` **area**: `string`

Defined in: [src/lib/types.ts:38](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/lib/types.ts#L38)

A área física ou lógica onde o equipamento está localizado (e.g., "Área 31", "Área de Processo"). Opcional.

***

### color

> **color**: `string`

Defined in: [src/lib/types.ts:46](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/lib/types.ts#L46)

Cor base do equipamento em formato hexadecimal (e.g., '#78909C'). Usada no modo de colorização 'Equipamento'.

***

### details?

> `optional` **details**: `string`

Defined in: [src/lib/types.ts:47](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/lib/types.ts#L47)

Detalhes textuais adicionais sobre o equipamento. Exibido no `InfoPanel`. Opcional.

***

### height?

> `optional` **height**: `number`

Defined in: [src/lib/types.ts:45](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/lib/types.ts#L45)

Altura para equipamentos com geometria cilíndrica (e.g., 'Tank', 'Crane'). Para 'Pipe', representa o comprimento. Opcional se `size` for usado.

***

### name

> **name**: `string`

Defined in: [src/lib/types.ts:35](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/lib/types.ts#L35)

Nome legível do equipamento para exibição na UI (e.g., "Main Office", "Storage Tank Alpha").

***

### operationalState?

> `optional` **operationalState**: `string`

Defined in: [src/lib/types.ts:39](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/lib/types.ts#L39)

Estado operacional atual do equipamento (e.g., 'operando', 'manutenção', 'em falha', 'não operando', 'Não aplicável').
                                       Usado para colorização e informação. Opcional.

***

### position

> **position**: `object`

Defined in: [src/lib/types.ts:41](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/lib/types.ts#L41)

Coordenadas (x, y, z) do centro geométrico do equipamento no espaço da cena.

#### x

> **x**: `number`

#### y

> **y**: `number`

#### z

> **z**: `number`

***

### product?

> `optional` **product**: `string`

Defined in: [src/lib/types.ts:40](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/lib/types.ts#L40)

Produto atualmente associado ou processado pelo equipamento (e.g., "70H", "660", "Não aplicável").
                              Usado para colorização e informação. Opcional.

***

### radius?

> `optional` **radius**: `number`

Defined in: [src/lib/types.ts:44](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/lib/types.ts#L44)

Raio para equipamentos com geometria cilíndrica (e.g., 'Tank', 'Pipe') ou esférica (e.g., 'Valve'). Opcional se `size` for usado.

***

### rotation?

> `optional` **rotation**: `object`

Defined in: [src/lib/types.ts:42](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/lib/types.ts#L42)

Rotação do equipamento em radianos nos eixos x, y, z. Opcional.

#### x

> **x**: `number`

#### y

> **y**: `number`

#### z

> **z**: `number`

***

### sistema?

> `optional` **sistema**: `string`

Defined in: [src/lib/types.ts:37](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/lib/types.ts#L37)

O sistema operacional ou funcional ao qual o equipamento pertence (e.g., "GA", "ODB"). Opcional.

***

### size?

> `optional` **size**: `object`

Defined in: [src/lib/types.ts:43](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/lib/types.ts#L43)

Dimensões (largura, altura, profundidade) para equipamentos com geometria de caixa (e.g., 'Building', 'Crane'). Opcional se `radius` e `height` forem usados.

#### depth

> **depth**: `number`

#### height

> **height**: `number`

#### width

> **width**: `number`

***

### tag

> **tag**: `string`

Defined in: [src/lib/types.ts:34](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/lib/types.ts#L34)

Identificador único e imutável do equipamento (e.g., "bldg-01", "tank-alpha"). Usado como chave.

***

### type

> **type**: `"Building"` \| `"Crane"` \| `"Tank"` \| `"Terrain"` \| `"Pipe"` \| `"Valve"`

Defined in: [src/lib/types.ts:36](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/lib/types.ts#L36)

Categoria do equipamento, influencia sua geometria e interações.
          'Terrain' é um tipo especial para o plano de chão.
