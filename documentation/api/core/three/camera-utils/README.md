[**3D Terminal System API Documentation**](../../../README.md)

***

[3D Terminal System API Documentation](../../../README.md) / core/three/camera-utils

# core/three/camera-utils

## Example

```mermaid
  classDiagram
    class calculateViewForMeshes_params {
      +meshes: THREE.Object3D[]
      +camera: THREE.PerspectiveCamera
    }
    class calculateViewForMeshes_return {
      +default: SystemView
      +topDown: SystemView
      +isometric: SystemView
    }
    class SystemView {
      +position: Point3D
      +lookAt: Point3D
    }
    class calculateViewForMeshes {
    }
    calculateViewForMeshes ..> calculateViewForMeshes_params : receives
    calculateViewForMeshes ..> calculateViewForMeshes_return : returns or null
```

## Functions

- [calculateViewForMeshes](functions/calculateViewForMeshes.md)
