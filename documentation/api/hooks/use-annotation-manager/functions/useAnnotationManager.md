[**3D Terminal System API Documentation**](../../../README.md)

***

[3D Terminal System API Documentation](../../../README.md) / [hooks/use-annotation-manager](../README.md) / useAnnotationManager

# Function: useAnnotationManager()

> **useAnnotationManager**(`props`): [`UseAnnotationManagerReturn`](../interfaces/UseAnnotationManagerReturn.md)

Defined in: [src/hooks/use-annotation-manager.ts:110](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-annotation-manager.ts#L110)

Hook customizado para gerenciar anotações textuais associadas a equipamentos.
Atua como uma fachada para o `annotationRepository`, gerenciando o estado do diálogo de edição
e sincronizando o estado local de anotações com o repositório.

## Parameters

### props

[`UseAnnotationManagerProps`](../interfaces/UseAnnotationManagerProps.md)

Propriedades de configuração para o hook.

## Returns

[`UseAnnotationManagerReturn`](../interfaces/UseAnnotationManagerReturn.md)

Um objeto contendo o estado das anotações e funções para manipulá-las.
