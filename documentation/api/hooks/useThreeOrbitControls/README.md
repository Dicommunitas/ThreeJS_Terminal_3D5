[**3D Terminal System API Documentation**](../../README.md)

***

[3D Terminal System API Documentation](../../README.md) / hooks/useThreeOrbitControls

# hooks/useThreeOrbitControls

## Example

```mermaid
sequenceDiagram
    participant Usuário
    participant ThreeScene as Componente React
    participant useThreeOrbitControls as Hook
    participant OrbitControls as Módulo Three.js

    ThreeScene ->>+ useThreeOrbitControls: Chama com cameraRef, rendererRef, etc.
    Note right of useThreeOrbitControls: renderersReady = true?
    useThreeOrbitControls ->>+ OrbitControls: import('OrbitControls.js')
    OrbitControls -->>- useThreeOrbitControls: Módulo carregado
    useThreeOrbitControls -->> OrbitControls: new OrbitControls(camera, renderer.domElement)
    useThreeOrbitControls -->> OrbitControls: Configura (enableDamping, target, mouseButtons)
    useThreeOrbitControls -->> OrbitControls: addEventListener('end', handleEnd)
    useThreeOrbitControls -->> ThreeScene: Retorna controlsRef, isControlsReady = true
    activate Usuário
    Usuário ->> OrbitControls: Interage com a câmera (arrasta mouse)
    OrbitControls -->> OrbitControls: Atualiza posição/rotação da câmera
    Usuário ->> OrbitControls: Solta o botão do mouse
    deactivate Usuário
    OrbitControls -->> useThreeOrbitControls: Dispara evento 'end'
    useThreeOrbitControls ->> ThreeScene: Chama onCameraChange(novoEstado)
    Note right of ThreeScene: Atualiza estado da câmera da aplicação
```

## Interfaces

- [UseThreeOrbitControlsProps](interfaces/UseThreeOrbitControlsProps.md)
- [UseThreeOrbitControlsReturn](interfaces/UseThreeOrbitControlsReturn.md)

## Functions

- [useThreeOrbitControls](functions/useThreeOrbitControls.md)
