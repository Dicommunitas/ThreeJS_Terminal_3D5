[**3D Terminal System API Documentation**](../../../../README.md)

***

[3D Terminal System API Documentation](../../../../README.md) / [core/three/label-renderer-utils](../README.md) / updateAnnotationPins

# Function: updateAnnotationPins()

> **updateAnnotationPins**(`params`): `void`

Defined in: [src/core/three/label-renderer-utils.ts:107](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/core/three/label-renderer-utils.ts#L107)

Atualiza os pins de anotação visíveis na cena 3D.
Remove pins antigos e cria/atualiza novos com base nos dados atuais e na visibilidade da camada de anotações.
Cada pin é um ícone SVG amarelo posicionado acima do equipamento correspondente.
O `labelRenderer.domElement.style.display` é ajustado com base na visibilidade da camada de anotações.

## Parameters

### params

[`UpdateAnnotationPinsParams`](../interfaces/UpdateAnnotationPinsParams.md)

Parâmetros para atualizar os pins.

## Returns

`void`
