[**3D Terminal System API Documentation**](../../README.md)

***

[3D Terminal System API Documentation](../../README.md) / hooks/useThreeResize

# hooks/useThreeResize

## Param

Objeto contendo refs para os elementos Three.js que precisam ser redimensionados e uma flag de prontidão.

## Example

```mermaid
graph TD
    useThreeResize["useThreeResize (Hook)"]
    Props["UseThreeResizeProps"]
    MountElement["Elemento DOM (mountRef)"]
    ResizeObserver_API["ResizeObserver API"]
    Camera["Câmera (cameraRef)"]
    Renderer["WebGLRenderer (rendererRef)"]
    LabelRenderer["CSS2DRenderer (labelRendererRef)"]
    Composer["EffectComposer (composerRef)"]
    OutlinePass["OutlinePass (outlinePassRef)"]
    ReadyFlag["ready (flag)"]

    Props -- define --> MountElement
    Props -- define --> Camera
    Props -- define --> Renderer
    Props -- define --> LabelRenderer
    Props -- define --> Composer
    Props -- define --> OutlinePass
    Props -- define --> ReadyFlag
    Props --> useThreeResize

    useThreeResize -- verifica --> ReadyFlag
    useThreeResize -- observa --> MountElement
    MountElement -- dispara evento de redimensionamento --> ResizeObserver_API
    ResizeObserver_API -- chama callback --> useThreeResize

    subgraph "Callback de Redimensionamento (handleResize)"
        direction LR
        Callback["handleResize"] -- atualiza --> Camera
        Callback -- atualiza --> Renderer
        Callback -- atualiza --> LabelRenderer
        Callback -- atualiza --> Composer
        Callback -- atualiza --> OutlinePass
    end

    useThreeResize -- executa na montagem e quando 'ready' muda --> Callback

    classDef hook fill:#lightblue,stroke:#333,stroke-width:2px;
    classDef type fill:#lightgoldenrodyellow,stroke:#333,stroke-width:2px;
    classDef obj3d fill:#lightgreen,stroke:#333,stroke-width:2px;
    classDef dom fill:#lightcoral,stroke:#333,stroke-width:2px;
    classDef api fill:#lightsalmon,stroke:#333,stroke-width:2px;
    classDef flag fill:#lightpink,stroke:#333,stroke-width:2px;

    class useThreeResize hook;
    class Props type;
    class Camera,Renderer,LabelRenderer,Composer,OutlinePass obj3d;
    class MountElement dom;
    class ResizeObserver_API api;
    class ReadyFlag flag;
```

## Interfaces

- [UseThreeResizeProps](interfaces/UseThreeResizeProps.md)

## Functions

- [useThreeResize](functions/useThreeResize.md)
