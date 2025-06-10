[**3D Terminal System API Documentation**](../../../README.md)

***

[3D Terminal System API Documentation](../../../README.md) / core/three/label-renderer-utils

# core/three/label-renderer-utils

## Example

```mermaid
  classDiagram
    class UpdateAnnotationPinsParams {
      +scene: THREE.Scene | null
      +labelRenderer: CSS2DRenderer | null
      +annotations: Annotation[]
      +equipmentData: Equipment[]
      +layers: Layer[]
      +existingPinsRef: React.MutableRefObject_CSS2DObject_Array_
    }
    class Annotation {
       +equipmentTag: string
       +text: string
       +createdAt: string
    }
    class Equipment {
       +tag: string
       +position: object
       +size: object
       +height: number
       +radius: number
       +type: string
    }
    class Layer {
       +id: string
       +isVisible: boolean
    }
    class ReactMutableRefObject_CSS2DObject_Array_ {
      current: CSS2DObject[]
    }
    UpdateAnnotationPinsParams ..> Annotation
    UpdateAnnotationPinsParams ..> Equipment
    UpdateAnnotationPinsParams ..> Layer
    UpdateAnnotationPinsParams ..> ReactMutableRefObject_CSS2DObject_Array_
    class updateAnnotationPins {

    }
    updateAnnotationPins ..> UpdateAnnotationPinsParams : receives
```

Exporta:
- `updateLabelRendererSize`: Atualiza o tamanho do CSS2DRenderer.
- `updateAnnotationPins`: Gerencia os pins de anotação na cena.

## Interfaces

- [UpdateAnnotationPinsParams](interfaces/UpdateAnnotationPinsParams.md)

## Functions

- [updateAnnotationPins](functions/updateAnnotationPins.md)
- [updateLabelRendererSize](functions/updateLabelRendererSize.md)
