[**3D Terminal System API Documentation**](../../../README.md)

***

[3D Terminal System API Documentation](../../../README.md) / [lib/types](../README.md) / ColorMode

# Type Alias: ColorMode

> **ColorMode** = `"Produto"` \| `"Estado Operacional"` \| `"Equipamento"`

Defined in: [src/lib/types.ts:165](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/lib/types.ts#L165)

Define os modos de colorização disponíveis para os equipamentos na cena 3D.
O usuário pode selecionar um desses modos para alterar a forma como os equipamentos são coloridos.

- **'Produto'**: Colore os equipamentos com base no produto que eles manipulam/contêm.
                 A cor é gerada proceduralmente a partir do código do produto.
- **'Estado Operacional'**: Colore os equipamentos com base em seu estado operacional atual
                            (e.g., 'operando', 'manutenção', 'em falha').
- **'Equipamento'**: Utiliza a cor base definida individualmente para cada equipamento
                     em seus dados (`Equipment.color`).
