[**3D Terminal System API Documentation**](../../../README.md)

***

[3D Terminal System API Documentation](../../../README.md) / [components/three-scene](../README.md) / ThreeSceneProps

# Interface: ThreeSceneProps

Defined in: [src/components/three-scene.tsx:138](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/three-scene.tsx#L138)

Props para o componente ThreeScene.
 ThreeSceneProps

## Properties

### allEquipmentData

> **allEquipmentData**: [`Equipment`](../../../lib/types/interfaces/Equipment.md)[]

Defined in: [src/components/three-scene.tsx:140](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/three-scene.tsx#L140)

Lista completa de todos os equipamentos, para contexto (e.g., anotações).

***

### annotations

> **annotations**: [`Annotation`](../../../lib/types/interfaces/Annotation.md)[]

Defined in: [src/components/three-scene.tsx:142](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/three-scene.tsx#L142)

Lista de anotações a serem exibidas.

***

### cameraState

> **cameraState**: `undefined` \| [`CameraState`](../../../lib/types/interfaces/CameraState.md)

Defined in: [src/components/three-scene.tsx:147](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/three-scene.tsx#L147)

O estado atual da câmera (posição, lookAt) gerenciado externamente. Pode ser indefinido durante a inicialização.

***

### colorMode

> **colorMode**: [`ColorMode`](../../../lib/types/type-aliases/ColorMode.md)

Defined in: [src/components/three-scene.tsx:151](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/three-scene.tsx#L151)

O modo de colorização atual para os equipamentos.

***

### equipment

> **equipment**: [`Equipment`](../../../lib/types/interfaces/Equipment.md)[]

Defined in: [src/components/three-scene.tsx:139](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/three-scene.tsx#L139)

Lista de equipamentos filtrados a serem renderizados na cena.

***

### hoveredEquipmentTag

> **hoveredEquipmentTag**: `undefined` \| `null` \| `string`

Defined in: [src/components/three-scene.tsx:145](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/three-scene.tsx#L145)

Tag do equipamento atualmente sob o cursor.

***

### initialCameraLookAt

> **initialCameraLookAt**: `object`

Defined in: [src/components/three-scene.tsx:150](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/three-scene.tsx#L150)

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

Defined in: [src/components/three-scene.tsx:149](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/three-scene.tsx#L149)

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

Defined in: [src/components/three-scene.tsx:141](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/three-scene.tsx#L141)

Configuração das camadas de visibilidade.

***

### onCameraChange()

> **onCameraChange**: (`cameraState`, `actionDescription?`) => `void`

Defined in: [src/components/three-scene.tsx:148](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/three-scene.tsx#L148)

Callback para quando o estado da câmera muda, com uma descrição opcional da ação.

#### Parameters

##### cameraState

[`CameraState`](../../../lib/types/interfaces/CameraState.md)

##### actionDescription?

`string`

#### Returns

`void`

***

### onSelectEquipment()

> **onSelectEquipment**: (`tag`, `isMultiSelectModifierPressed`) => `void`

Defined in: [src/components/three-scene.tsx:144](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/three-scene.tsx#L144)

Callback para quando um equipamento é selecionado/deselecionado.

#### Parameters

##### tag

`null` | `string`

##### isMultiSelectModifierPressed

`boolean`

#### Returns

`void`

***

### onSystemFramed()

> **onSystemFramed**: () => `void`

Defined in: [src/components/three-scene.tsx:153](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/three-scene.tsx#L153)

Callback chamado após a câmera terminar de enquadrar um sistema.

#### Returns

`void`

***

### selectedEquipmentTags

> **selectedEquipmentTags**: `undefined` \| `string`[]

Defined in: [src/components/three-scene.tsx:143](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/three-scene.tsx#L143)

Tags dos equipamentos atualmente selecionados.

***

### setHoveredEquipmentTag()

> **setHoveredEquipmentTag**: (`tag`) => `void`

Defined in: [src/components/three-scene.tsx:146](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/three-scene.tsx#L146)

Callback para definir o equipamento em hover.

#### Parameters

##### tag

`null` | `string`

#### Returns

`void`

***

### targetSystemToFrame

> **targetSystemToFrame**: `null` \| [`TargetSystemInfo`](../../../lib/types/interfaces/TargetSystemInfo.md)

Defined in: [src/components/three-scene.tsx:152](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/three-scene.tsx#L152)

O sistema que deve ser enquadrado pela câmera (se houver), incluindo o índice da visão.
