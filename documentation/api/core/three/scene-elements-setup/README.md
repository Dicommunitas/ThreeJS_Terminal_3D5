[**3D Terminal System API Documentation**](../../../README.md)

***

[3D Terminal System API Documentation](../../../README.md) / core/three/scene-elements-setup

# core/three/scene-elements-setup

## Example

```mermaid
  graph TD;
    A[setupRenderPipeline] --> B{renderer: WebGLRenderer};
    A --> C{labelRenderer: CSS2DRenderer};
    A --> D{composer: EffectComposer};
    A --> E{outlinePass: OutlinePass};

    F[UpdateEquipmentMeshesParams] --> G[updateEquipmentMeshesInScene];
    class H[Equipment] --> F;
    class I[Layer] --> F;
    class J[ColorMode] --> F;

    classDef params fill:#DCDCDC,stroke:#333,stroke-width:2px,color:black;
    classDef func fill:#ADD8E6,stroke:#333,stroke-width:2px,color:black;
    classDef return fill:#90EE90,stroke:#333,stroke-width:2px,color:black;
    classDef type fill:#FFFFE0,stroke:#333,stroke-width:2px,color:black;

    class A func;
    class B,C,D,E return;
    class F params;
    class G func;
    class H,I,J type;
```

Exporta:
- `setupLighting`: Configura a iluminação da cena.
- `setupGroundPlane`: Configura o plano de chão.
- `setupRenderPipeline`: Inicializa os renderizadores e o pipeline de pós-processamento.
- `updateEquipmentMeshesInScene`: Atualiza dinamicamente os meshes dos equipamentos.

## Interfaces

- [UpdateEquipmentMeshesParams](interfaces/UpdateEquipmentMeshesParams.md)

## Functions

- [setupGroundPlane](functions/setupGroundPlane.md)
- [setupLighting](functions/setupLighting.md)
- [setupRenderPipeline](functions/setupRenderPipeline.md)
- [updateEquipmentMeshesInScene](functions/updateEquipmentMeshesInScene.md)
