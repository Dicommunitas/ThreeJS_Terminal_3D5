[**3D Terminal System API Documentation**](../../README.md)

***

[3D Terminal System API Documentation](../../README.md) / hooks/use-camera-manager

# hooks/use-camera-manager

## See

 - ../../lib/types/README.md#CameraState Para a interface do estado da câmera.
 - ../../lib/types/README.md#Command Para a interface de comando (usada com `executeCommand`).
 - ../../lib/types/README.md#TargetSystemInfo Para a interface de informações do sistema alvo.

## Param

Propriedades para o hook, incluindo `executeCommand` para integração com histórico.

## Example

// Diagrama de Interação e Estado do useCameraManager:
```mermaid
graph LR
    A[Terminal3DPage] -- chama --> B(handleSetCameraViewForSystem)
    B -- atualiza --> C{targetSystemToFrame};
    C -- atualiza --> D{focusedSystemNameUI};
    C -- atualiza --> E{currentViewIndexUI};
    A -- passa targetSystemToFrame --> F[ThreeScene]

    F -- anima câmera e ao final chama --> G(onSystemFramed)
    G -- limpa --> C;
    F -- em interações manuais, chama --> H(handleCameraChangeFromScene)

    H -- cria comando --> I{Comando}
    H -- chama --> J(executeCommand)
    J -- executa e salva --> I

    subgraph useCameraManager [Hook useCameraManager]
        direction LR
        B
        G
        H
        C
        D
        E
        K[currentCameraState (Estado React)]
        L[lastCommittedCameraStateForUndoRef (Ref)]
    end

    I -- no execute/undo --> M{setCurrentCameraState}
    M -- atualiza --> K
    K -- usado por --> F

   classDef hook fill:#lightblue,stroke:#333,stroke-width:2px;
   classDef state fill:#lightgoldenrodyellow,stroke:#333,stroke-width:2px;
   classDef func fill:#lightgreen,stroke:#333,stroke-width:2px;
   classDef comp fill:#lightcoral,stroke:#333,stroke-width:2px;

   class A,F comp;
   class B,G,H,J,M func;
   class C,D,E,K,L,I state;
   class useCameraManager hook;
```

## Interfaces

- [UseCameraManagerProps](interfaces/UseCameraManagerProps.md)
- [UseCameraManagerReturn](interfaces/UseCameraManagerReturn.md)

## Variables

- [defaultInitialCameraLookAt](variables/defaultInitialCameraLookAt.md)
- [defaultInitialCameraPosition](variables/defaultInitialCameraPosition.md)

## Functions

- [useCameraManager](functions/useCameraManager.md)
