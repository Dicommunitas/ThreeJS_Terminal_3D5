[**3D Terminal System API Documentation**](../../../README.md)

***

[3D Terminal System API Documentation](../../../README.md) / [hooks/useThreeRenderers](../README.md) / useThreeRenderers

# Function: useThreeRenderers()

> **useThreeRenderers**(`props`): [`UseThreeRenderersReturn`](../interfaces/UseThreeRenderersReturn.md)

Defined in: [src/hooks/useThreeRenderers.ts:108](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/useThreeRenderers.ts#L108)

Configura os renderizadores Three.js (WebGL, CSS2D) e o pipeline de pós-processamento (EffectComposer, OutlinePass).
Gerencia a anexação ao DOM e eventos de contexto WebGL.

## Parameters

### props

[`UseThreeRenderersProps`](../interfaces/UseThreeRenderersProps.md)

Propriedades para a configuração dos renderizadores.

## Returns

[`UseThreeRenderersReturn`](../interfaces/UseThreeRenderersReturn.md)

Refs para os renderizadores, composer, outline pass, e flag de prontidão.
