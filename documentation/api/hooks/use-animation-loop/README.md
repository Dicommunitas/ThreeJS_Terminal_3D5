[**3D Terminal System API Documentation**](../../README.md)

***

[3D Terminal System API Documentation](../../README.md) / hooks/use-animation-loop

# hooks/use-animation-loop

## Param

Propriedades para configurar o loop de animação.

Diagrama de Fluxo do useAnimationLoop:
```mermaid
sequenceDiagram
    participant ComponentePai as Comp. (ex: ThreeScene)
    participant useAnimationLoop as Hook
    participant Navegador
    participant OrbitControls
    participant EffectComposer
    participant CSS2DRenderer

    ComponentePai ->>+ useAnimationLoop: Chama com refs e isSceneReady=true
    useAnimationLoop ->> Navegador: requestAnimationFrame(animate)
    Navegador -->> useAnimationLoop: Chama animate()
    loop Cada Quadro
        useAnimationLoop ->> OrbitControls: controls.update() (se habilitado)
        useAnimationLoop ->> ComponentePai: onFrameUpdate() (callback opcional)
        useAnimationLoop ->> EffectComposer: composer.render()
        useAnimationLoop ->> CSS2DRenderer: labelRenderer.render()
        useAnimationLoop ->> Navegador: requestAnimationFrame(animate)
    end
    Note right of ComponentePai: Quando desmontado ou isSceneReady=false
    useAnimationLoop ->> Navegador: cancelAnimationFrame()
```

## Interfaces

- [UseAnimationLoopProps](interfaces/UseAnimationLoopProps.md)

## Functions

- [useAnimationLoop](functions/useAnimationLoop.md)
