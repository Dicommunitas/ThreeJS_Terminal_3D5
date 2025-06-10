[**3D Terminal System API Documentation**](../../../README.md)

***

[3D Terminal System API Documentation](../../../README.md) / [hooks/use-layer-manager](../README.md) / useLayerManager

# Function: useLayerManager()

> **useLayerManager**(`props`): [`UseLayerManagerReturn`](../interfaces/UseLayerManagerReturn.md)

Defined in: [src/hooks/use-layer-manager.ts:88](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-layer-manager.ts#L88)

Hook customizado para gerenciar o estado das camadas de visibilidade da cena e sua manipulação.
Inicializa as camadas com os dados de `initialLayers` e permite alternar a visibilidade
de cada camada, registrando a ação no histórico de comandos para suportar undo/redo.

## Parameters

### props

[`UseLayerManagerProps`](../interfaces/UseLayerManagerProps.md)

As props do hook, principalmente `executeCommand` para
                                    integração com o sistema de histórico.

## Returns

[`UseLayerManagerReturn`](../interfaces/UseLayerManagerReturn.md)

Um objeto contendo o estado atual das camadas e a função
                                 para alternar sua visibilidade.
