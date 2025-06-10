[**3D Terminal System API Documentation**](../../README.md)

***

[3D Terminal System API Documentation](../../README.md) / hooks/use-filter-manager

# hooks/use-filter-manager

## Example

```mermaid
  classDiagram
    class UseFilterManagerProps {
      +allEquipment: Equipment[]
    }
    class UseFilterManagerReturn {
      +searchTerm: string
      +setSearchTerm(value: string): void
      +selectedSistema: string
      +setSelectedSistema(value: string): void
      +selectedArea: string
      +setSelectedArea(value: string): void
      +availableSistemas: string[]
      +availableAreas: string[]
      +filteredEquipment: Equipment[]
    }
    class Equipment {
      +tag: string
      +name: string
      +type: string
      +sistema?: string
      +area?: string
    }
    class equipment_filter_module {
      +getFilteredEquipment(allEquipment: Equipment[], criteria: EquipmentFilterCriteria): Equipment[]
    }
    class EquipmentFilterCriteria {
    }
    UseFilterManagerProps ..> Equipment
    UseFilterManagerReturn ..> Equipment
    class useFilterManager {
      -searchTerm: string
      -selectedSistema: string
      -selectedArea: string
      +setSearchTerm()
      +setSelectedSistema()
      +setSelectedArea()
    }
    useFilterManager --|> UseFilterManagerReturn : returns
    useFilterManager ..> equipment_filter_module : uses getFilteredEquipment
    equipment_filter_module ..> EquipmentFilterCriteria : uses
```

## Interfaces

- [UseFilterManagerProps](interfaces/UseFilterManagerProps.md)
- [UseFilterManagerReturn](interfaces/UseFilterManagerReturn.md)

## Functions

- [useFilterManager](functions/useFilterManager.md)
