[**3D Terminal System API Documentation**](../../README.md)

***

[3D Terminal System API Documentation](../../README.md) / hooks/use-annotation-manager

# hooks/use-annotation-manager

## See

 - ../../core/repository/memory-repository/README.md#annotationRepository Para a fonte de dados das anotações.
 - ../../core/repository/memory-repository/README.md#equipmentRepository Para obter dados de equipamentos (e.g., nome para toasts).
 - ../../lib/types/README.md#Annotation Para a interface de Anotação.
 - ../../lib/types/README.md#Equipment Para a interface de Equipamento.

## Param

Propriedades de configuração para o hook (atualmente, `initialAnnotations` é opcional e usado para uma potencial inicialização única do repositório, embora o repositório seja auto-inicializável).

## Example

// Diagrama de Interação do useAnnotationManager:
```mermaid
graph TD
    A[Componente UI (ex: InfoPanel)] -- chama --> B(handleOpenAnnotationDialog)
    B -- define estados --> DialogState["isAnnotationDialogOpen, editingAnnotation, annotationTargetEquipment"]

    C[Componente UI (ex: AnnotationDialog)] -- no submit --> D(handleSaveAnnotation)

    subgraph useAnnotationManager [Hook useAnnotationManager]
        direction LR
        D -- chama --> E[annotationRepository.addOrUpdateAnnotation]
        E -- retorna --> D{Anotação Salva}
        D -- chama --> F[refreshAnnotationsFromRepo]
        F -- chama --> G[annotationRepository.getAllAnnotations]
        G -- retorna --> H[setAnnotationsState (Estado React)]
        H -- atualiza --> I[annotations (Estado React)]
        D -- chama --> J[toast]
        DialogState
    end

    I -- usado por --> A
    DialogState -- usado por --> C

   classDef hook fill:#lightblue,stroke:#333,stroke-width:2px;
   classDef state fill:#lightgoldenrodyellow,stroke:#333,stroke-width:2px;
   classDef func fill:#lightgreen,stroke:#333,stroke-width:2px;
   classDef repo fill:#lightcoral,stroke:#333,stroke-width:2px;
   classDef ui fill:#peachpuff,stroke:#333,stroke-width:2px;

   class A,C ui;
   class B,D,F,J func;
   class E,G repo;
   class DialogState,H,I state;
   class useAnnotationManager hook;
```

## Interfaces

- [UseAnnotationManagerProps](interfaces/UseAnnotationManagerProps.md)
- [UseAnnotationManagerReturn](interfaces/UseAnnotationManagerReturn.md)

## Functions

- [useAnnotationManager](functions/useAnnotationManager.md)
