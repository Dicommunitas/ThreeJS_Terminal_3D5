[**3D Terminal System API Documentation**](../../README.md)

***

[3D Terminal System API Documentation](../../README.md) / hooks/useThreeCore

# hooks/useThreeCore

## Example

```mermaid
graph TD
    useThreeCore["useThreeCore (Hook)"]
    Props["UseThreeCoreProps"]
    Return["UseThreeCoreReturn"]
    Scene["THREE.Scene"]
    Camera["THREE.PerspectiveCamera"]
    MountElement["Elemento DOM (para aspect ratio)"]

    Props --> useThreeCore
    useThreeCore -- cria --> Scene
    useThreeCore -- cria e configura com base em --> MountElement
    useThreeCore -- cria e configura --> Camera
    useThreeCore -- retorna refs para --> Return
    Return -- contém ref para --> Scene
    Return -- contém ref para --> Camera

    Props -- define --> PInitialPos["initialCameraPosition"]
    Props -- define --> PMountRef["mountRef"]

    classDef hook fill:#lightblue,stroke:#333,stroke-width:2px;
    classDef type fill:#lightgoldenrodyellow,stroke:#333,stroke-width:2px;
    classDef obj3d fill:#lightgreen,stroke:#333,stroke-width:2px;
    classDef dom fill:#lightcoral,stroke:#333,stroke-width:2px;

    class useThreeCore hook;
    class Props,Return,PInitialPos,PMountRef type;
    class Scene,Camera obj3d;
    class MountElement dom;
```

## Interfaces

- [UseThreeCoreProps](interfaces/UseThreeCoreProps.md)
- [UseThreeCoreReturn](interfaces/UseThreeCoreReturn.md)

## Functions

- [useThreeCore](functions/useThreeCore.md)
