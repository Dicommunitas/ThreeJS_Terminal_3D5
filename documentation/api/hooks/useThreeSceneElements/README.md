[**3D Terminal System API Documentation**](../../README.md)

***

[3D Terminal System API Documentation](../../README.md) / hooks/useThreeSceneElements

# hooks/useThreeSceneElements

## See

 - documentation/api/core/three/scene-elements-setup/README.md#setupLighting Para a função de configuração da iluminação.
 - documentation/api/core/three/scene-elements-setup/README.md#setupGroundPlane Para a função de configuração do plano de chão.

Diagrama de Funcionalidade do useThreeSceneElements:
```mermaid
graph TD
    useThreeSceneElements["useThreeSceneElements (Hook)"]
    Props["UseThreeSceneElementsProps"]
    Return["UseThreeSceneElementsReturn"]
    SceneRef_Prop["sceneRef (da Cena Principal)"]
    CoreReady_Flag["coreReady (flag)"]
    Utils_Module["scene-elements-setup Utilities"]
    Lighting_Elements["Iluminação (Ambient, Hemisphere, Directional)"]
    GroundPlane_Mesh["Plano de Chão (THREE.Mesh)"]

    Props -- define --> SceneRef_Prop
    Props -- define --> CoreReady_Flag
    Props --> useThreeSceneElements

    useThreeSceneElements -- verifica --> CoreReady_Flag
    useThreeSceneElements -- usa --> SceneRef_Prop
    useThreeSceneElements -- chama --> Utils_Module
    Utils_Module -- adiciona à cena --> Lighting_Elements
    Utils_Module -- cria e adiciona à cena --> GroundPlane_Mesh

    useThreeSceneElements -- retorna ref para --> Return
    Return -- contém ref para --> GroundPlane_Mesh

    classDef hook fill:#lightblue,stroke:#333,stroke-width:2px;
    classDef type fill:#lightgoldenrodyellow,stroke:#333,stroke-width:2px;
    classDef obj3d fill:#lightgreen,stroke:#333,stroke-width:2px;
    classDef util fill:#lightcoral,stroke:#333,stroke-width:2px;
    classDef flag fill:#lightpink,stroke:#333,stroke-width:2px;

    class useThreeSceneElements hook;
    class Props,Return,SceneRef_Prop type;
    class CoreReady_Flag flag;
    class Lighting_Elements,GroundPlane_Mesh obj3d;
    class Utils_Module util;
```

## Interfaces

- [UseThreeSceneElementsProps](interfaces/UseThreeSceneElementsProps.md)
- [UseThreeSceneElementsReturn](interfaces/UseThreeSceneElementsReturn.md)

## Functions

- [useThreeSceneElements](functions/useThreeSceneElements.md)
