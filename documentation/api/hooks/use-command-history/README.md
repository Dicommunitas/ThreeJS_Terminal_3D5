[**3D Terminal System API Documentation**](../../README.md)

***

[3D Terminal System API Documentation](../../README.md) / hooks/use-command-history

# hooks/use-command-history

## Example

```mermaid
  classDiagram
    class UseCommandHistoryReturn {
      +executeCommand(command: Command): void
      +undo(): void
      +redo(): void
      +canUndo: boolean
      +canRedo: boolean
      +commandHistory: Command[]
    }
    class Command {
      +id: string
      +type: string
      +description: string
      +execute(): void
      +undo(): void
    }
    UseCommandHistoryReturn ..> Command : manages array of
    class useCommandHistory {
      -state: CommandHistoryState
      +executeCommand()
      +undo()
      +redo()
    }
    useCommandHistory --|> UseCommandHistoryReturn : returns
```

## Interfaces

- [CommandHistoryState](interfaces/CommandHistoryState.md)
- [UseCommandHistoryReturn](interfaces/UseCommandHistoryReturn.md)

## Functions

- [useCommandHistory](functions/useCommandHistory.md)
