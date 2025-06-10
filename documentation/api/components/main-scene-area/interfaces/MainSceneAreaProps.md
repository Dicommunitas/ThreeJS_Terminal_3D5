[**3D Terminal System API Documentation**](../../../README.md)

***

[3D Terminal System API Documentation](../../../README.md) / [components/main-scene-area](../README.md) / MainSceneAreaProps

# Interface: MainSceneAreaProps

Defined in: [src/components/main-scene-area.tsx:117](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/main-scene-area.tsx#L117)

Props para o componente MainSceneArea.
Estas props são, em grande parte, repassadas para `ThreeScene` e `InfoPanel`.

 MainSceneAreaProps

## Properties

### allEquipmentData

> **allEquipmentData**: [`Equipment`](../../../lib/types/interfaces/Equipment.md)[]

Defined in: [src/components/main-scene-area.tsx:119](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/main-scene-area.tsx#L119)

Lista completa de todos os equipamentos, para contexto (e.g., anotações no `ThreeScene`).

***

### annotations

> **annotations**: [`Annotation`](../../../lib/types/interfaces/Annotation.md)[]

Defined in: [src/components/main-scene-area.tsx:121](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/main-scene-area.tsx#L121)

Lista de anotações a serem exibidas.

***

### availableOperationalStatesList

> **availableOperationalStatesList**: `string`[]

Defined in: [src/components/main-scene-area.tsx:138](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/main-scene-area.tsx#L138)

Lista de estados operacionais disponíveis.

***

### availableProductsList

> **availableProductsList**: `string`[]

Defined in: [src/components/main-scene-area.tsx:140](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/main-scene-area.tsx#L140)

Lista de produtos disponíveis.

***

### cameraState

> **cameraState**: `undefined` \| [`CameraState`](../../../lib/types/interfaces/CameraState.md)

Defined in: [src/components/main-scene-area.tsx:126](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/main-scene-area.tsx#L126)

O estado atual da câmera (posição, lookAt).

***

### colorMode

> **colorMode**: [`ColorMode`](../../../lib/types/type-aliases/ColorMode.md)

Defined in: [src/components/main-scene-area.tsx:130](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/main-scene-area.tsx#L130)

O modo de colorização atual para os equipamentos.

***

### equipment

> **equipment**: [`Equipment`](../../../lib/types/interfaces/Equipment.md)[]

Defined in: [src/components/main-scene-area.tsx:118](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/main-scene-area.tsx#L118)

Lista de equipamentos filtrados a serem renderizados na cena.

***

### equipmentAnnotation

> **equipmentAnnotation**: `null` \| [`Annotation`](../../../lib/types/interfaces/Annotation.md)

Defined in: [src/components/main-scene-area.tsx:134](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/main-scene-area.tsx#L134)

Anotação do equipamento único selecionado (para InfoPanel).

***

### hoveredEquipmentTag

> **hoveredEquipmentTag**: `null` \| `string`

Defined in: [src/components/main-scene-area.tsx:124](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/main-scene-area.tsx#L124)

Tag do equipamento atualmente sob o cursor.

***

### initialCameraLookAt

> **initialCameraLookAt**: `object`

Defined in: [src/components/main-scene-area.tsx:129](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/main-scene-area.tsx#L129)

Ponto de observação (lookAt) inicial da câmera.

#### x

> **x**: `number`

#### y

> **y**: `number`

#### z

> **z**: `number`

***

### initialCameraPosition

> **initialCameraPosition**: `object`

Defined in: [src/components/main-scene-area.tsx:128](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/main-scene-area.tsx#L128)

Posição inicial da câmera.

#### x

> **x**: `number`

#### y

> **y**: `number`

#### z

> **z**: `number`

***

### layers

> **layers**: [`Layer`](../../../lib/types/interfaces/Layer.md)[]

Defined in: [src/components/main-scene-area.tsx:120](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/main-scene-area.tsx#L120)

Configuração das camadas de visibilidade.

***

### onCameraChange()

> **onCameraChange**: (`cameraState`) => `void`

Defined in: [src/components/main-scene-area.tsx:127](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/main-scene-area.tsx#L127)

Callback para quando o estado da câmera muda devido à interação do usuário na cena.

#### Parameters

##### cameraState

[`CameraState`](../../../lib/types/interfaces/CameraState.md)

#### Returns

`void`

***

### onDeleteAnnotation()

> **onDeleteAnnotation**: (`equipmentTag`) => `void`

Defined in: [src/components/main-scene-area.tsx:136](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/main-scene-area.tsx#L136)

Callback para excluir uma anotação.

#### Parameters

##### equipmentTag

`string`

#### Returns

`void`

***

### onOpenAnnotationDialog()

> **onOpenAnnotationDialog**: () => `void`

Defined in: [src/components/main-scene-area.tsx:135](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/main-scene-area.tsx#L135)

Callback para abrir o diálogo de anotação.

#### Returns

`void`

***

### onOperationalStateChange()

> **onOperationalStateChange**: (`equipmentTag`, `newState`) => `void`

Defined in: [src/components/main-scene-area.tsx:137](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/main-scene-area.tsx#L137)

Callback para alterar o estado operacional de um equipamento.

#### Parameters

##### equipmentTag

`string`

##### newState

`string`

#### Returns

`void`

***

### onProductChange()

> **onProductChange**: (`equipmentTag`, `newProduct`) => `void`

Defined in: [src/components/main-scene-area.tsx:139](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/main-scene-area.tsx#L139)

Callback para alterar o produto de um equipamento.

#### Parameters

##### equipmentTag

`string`

##### newProduct

`string`

#### Returns

`void`

***

### onSelectEquipment()

> **onSelectEquipment**: (`tag`, `isMultiSelect`) => `void`

Defined in: [src/components/main-scene-area.tsx:123](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/main-scene-area.tsx#L123)

Callback para quando um equipamento é selecionado/deselecionado.

#### Parameters

##### tag

`null` | `string`

##### isMultiSelect

`boolean`

#### Returns

`void`

***

### onSystemFramed()

> **onSystemFramed**: () => `void`

Defined in: [src/components/main-scene-area.tsx:132](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/main-scene-area.tsx#L132)

Callback chamado após a câmera terminar de enquadrar um sistema.

#### Returns

`void`

***

### selectedEquipmentDetails

> **selectedEquipmentDetails**: `null` \| [`Equipment`](../../../lib/types/interfaces/Equipment.md)

Defined in: [src/components/main-scene-area.tsx:133](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/main-scene-area.tsx#L133)

Detalhes do equipamento único selecionado (para InfoPanel).

***

### selectedEquipmentTags

> **selectedEquipmentTags**: `string`[]

Defined in: [src/components/main-scene-area.tsx:122](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/main-scene-area.tsx#L122)

Tags dos equipamentos atualmente selecionados.

***

### setHoveredEquipmentTag()

> **setHoveredEquipmentTag**: (`tag`) => `void`

Defined in: [src/components/main-scene-area.tsx:125](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/main-scene-area.tsx#L125)

Callback para definir o equipamento em hover.

#### Parameters

##### tag

`null` | `string`

#### Returns

`void`

***

### targetSystemToFrame

> **targetSystemToFrame**: `null` \| [`TargetSystemInfo`](../../../lib/types/interfaces/TargetSystemInfo.md)

Defined in: [src/components/main-scene-area.tsx:131](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/main-scene-area.tsx#L131)

Informações sobre o sistema e visão a serem enquadrados pela câmera (se houver).
