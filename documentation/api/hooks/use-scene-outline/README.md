[**3D Terminal System API Documentation**](../../README.md)

***

[3D Terminal System API Documentation](../../README.md) / hooks/use-scene-outline

# hooks/use-scene-outline

## Example

```mermaid
  classDiagram
    class UseSceneOutlineProps {
      +outlinePassRef: RefObject_OutlinePass_
      +equipmentMeshesRef: RefObject_Object3D_Array_
      +selectedEquipmentTags: string[] | undefined
      +hoveredEquipmentTag: string | null | undefined
      +isSceneReady: boolean
    }
    class RefObject_OutlinePass_ {
      current: OutlinePass | null
    }
    class RefObject_Object3D_Array_ {
      current: THREE.Object3D[] | null
    }
    class useSceneOutline {

    }
    class postprocessing_utils_module {
      +updateOutlineEffect()
    }
    useSceneOutline ..> postprocessing_utils_module : uses updateOutlineEffect
    UseSceneOutlineProps --> RefObject_OutlinePass_
    UseSceneOutlineProps --> RefObject_Object3D_Array_
```

## Interfaces

- [UseSceneOutlineProps](interfaces/UseSceneOutlineProps.md)

## Functions

- [useSceneOutline](functions/useSceneOutline.md)
