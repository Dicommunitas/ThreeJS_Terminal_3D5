[**3D Terminal System API Documentation**](../../../README.md)

***

[3D Terminal System API Documentation](../../../README.md) / core/repository/memory-repository

# core/repository/memory-repository

## See

 - documentation/api/core/data/initial-data/README.md Para os dados iniciais de equipamentos e camadas.
 - documentation/api/lib/types/README.md#Equipment Para a interface de Equipamento.
 - documentation/api/lib/types/README.md#Annotation Para a interface de Anotação.

Diagrama de Estrutura do Repositório em Memória:
```mermaid
classDiagram
    class RepositorioMemoria {
        -equipmentStore: Map_string_Equipment_
        -annotationStore: Map_string_Annotation_
        -isInitialized: boolean
        +initializeRepository() void
    }
    class RepositorioEquipamentos {
        +getEquipmentByTag(tag: string): Equipment | undefined
        +getAllEquipment(): Equipment[]
        +addEquipment(equipment: Equipment): Equipment
        +updateEquipment(tag: string, updates: Partial_Equipment_): Equipment | undefined
        +deleteEquipment(tag: string): boolean
        +_resetAndLoadInitialData(): void
    }
    class RepositorioAnotacoes {
        +getAnnotationByEquipmentTag(equipmentTag: string): Annotation | undefined
        +getAllAnnotations(): Annotation[]
        +addOrUpdateAnnotation(annotation: Annotation): Annotation
        +deleteAnnotation(equipmentTag: string): boolean
        +initializeAnnotations(annotations: Annotation[]): void
    }
    class DadosIniciais {
        +initialEquipment: Equipment[]
        +initialAnnotations: Annotation[]
    }

    RepositorioMemoria --|> DadosIniciais : carrega dados de
    RepositorioMemoria o-- RepositorioEquipamentos : expõe
    RepositorioMemoria o-- RepositorioAnotacoes : expõe

    note for RepositorioMemoria "Módulo auto-inicializável."
    note for RepositorioEquipamentos "Gerencia o CRUD de Equipamentos."
    note for RepositorioAnotacoes "Gerencia o CRUD de Anotações."
```

## Variables

- [annotationRepository](variables/annotationRepository.md)
- [equipmentRepository](variables/equipmentRepository.md)
