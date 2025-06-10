[**3D Terminal System API Documentation**](../../../README.md)

***

[3D Terminal System API Documentation](../../../README.md) / [hooks/use-annotation-manager](../README.md) / UseAnnotationManagerProps

# Interface: UseAnnotationManagerProps

Defined in: [src/hooks/use-annotation-manager.ts:74](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-annotation-manager.ts#L74)

Props para o hook `useAnnotationManager`.
 UseAnnotationManagerProps

## Properties

### initialAnnotations?

> `optional` **initialAnnotations**: [`Annotation`](../../../lib/types/interfaces/Annotation.md)[]

Defined in: [src/hooks/use-annotation-manager.ts:75](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-annotation-manager.ts#L75)

Lista inicial opcional de anotações. Pode ser usada para uma
                                                 inicialização única do repositório se ele estiver vazio e este array contiver dados.
                                                 No entanto, o `annotationRepository` é geralmente auto-inicializável.
