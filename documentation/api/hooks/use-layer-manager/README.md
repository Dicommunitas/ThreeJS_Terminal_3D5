[**3D Terminal System API Documentation**](../../README.md)

***

[3D Terminal System API Documentation](../../README.md) / hooks/use-layer-manager

# hooks/use-layer-manager

## Example

```mermaid
  classDiagram
    class UseLayerManagerProps {
      +executeCommand(command: Command): void
    }
    class UseLayerManagerReturn {
      +layers: Layer[]
      +handleToggleLayer(layerId: string): void
    }
    class Command {
      +id: string
      +type: string
      +description: string
      +execute(): void
      +undo(): void
    }
    class Layer {
      +id: string
      +name: string
      +equipmentType: string
      +isVisible: boolean
    }
    UseLayerManagerProps ..> Command
    UseLayerManagerReturn ..> Layer
    class useLayerManager {
      -layers: Layer[]
      +handleToggleLayer()
    }
    useLayerManager --|> UseLayerManagerReturn : returns
    useLayerManager ..> Command : uses (via executeCommand)
    useLayerManager ..> initialLayers_data : initializes with
    class initialLayers_data {
    }
```

## Interfaces

- [UseLayerManagerProps](interfaces/UseLayerManagerProps.md)
- [UseLayerManagerReturn](interfaces/UseLayerManagerReturn.md)

## Functions

- [useLayerManager](functions/useLayerManager.md)
