[**3D Terminal System API Documentation**](../../../README.md)

***

[3D Terminal System API Documentation](../../../README.md) / [hooks/useCameraManager](../README.md) / UseCameraManagerReturn

# Interface: UseCameraManagerReturn

Defined in: [src/hooks/useCameraManager.ts:103](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/useCameraManager.ts#L103)

Retorno do hook `useCameraManager`.
 UseCameraManagerReturn

## Properties

### currentCameraState

> **currentCameraState**: [`CameraState`](../../../lib/types/interfaces/CameraState.md)

Defined in: [src/hooks/useCameraManager.ts:104](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/useCameraManager.ts#L104)

O estado atual da câmera (posição e ponto de observação).

***

### currentViewIndexUI

> **currentViewIndexUI**: `number`

Defined in: [src/hooks/useCameraManager.ts:107](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/useCameraManager.ts#L107)

O índice da visão atual para o sistema focado (para UI).

***

### defaultInitialCameraLookAt

> **defaultInitialCameraLookAt**: `object`

Defined in: [src/hooks/useCameraManager.ts:112](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/useCameraManager.ts#L112)

Exporta o ponto de observação inicial padrão da câmera.

#### x

> **x**: `number`

#### y

> **y**: `number`

#### z

> **z**: `number`

***

### defaultInitialCameraPosition

> **defaultInitialCameraPosition**: `object`

Defined in: [src/hooks/useCameraManager.ts:111](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/useCameraManager.ts#L111)

Exporta a posição inicial padrão da câmera.

#### x

> **x**: `number`

#### y

> **y**: `number`

#### z

> **z**: `number`

***

### focusedSystemNameUI

> **focusedSystemNameUI**: `null` \| `string`

Defined in: [src/hooks/useCameraManager.ts:106](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/useCameraManager.ts#L106)

O nome do sistema atualmente focado (para UI, pode persistir mesmo após `targetSystemToFrame` ser limpo).

***

### handleCameraChangeFromScene()

> **handleCameraChangeFromScene**: (`newSceneCameraState`, `actionDescription?`) => `void`

Defined in: [src/hooks/useCameraManager.ts:109](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/useCameraManager.ts#L109)

Manipula mudanças de câmera provenientes da cena 3D (e.g., OrbitControls) e as registra no histórico.

#### Parameters

##### newSceneCameraState

[`CameraState`](../../../lib/types/interfaces/CameraState.md)

##### actionDescription?

`string`

#### Returns

`void`

***

### handleSetCameraViewForSystem()

> **handleSetCameraViewForSystem**: (`systemName`) => `void`

Defined in: [src/hooks/useCameraManager.ts:108](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/useCameraManager.ts#L108)

Função para definir o sistema alvo e o índice da visão para a câmera enquadrar.

#### Parameters

##### systemName

`string`

#### Returns

`void`

***

### onSystemFramed()

> **onSystemFramed**: () => `void`

Defined in: [src/hooks/useCameraManager.ts:110](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/useCameraManager.ts#L110)

Callback para ser chamado pela `ThreeScene` após o enquadramento do sistema ser concluído.

#### Returns

`void`

***

### targetSystemToFrame

> **targetSystemToFrame**: `null` \| [`TargetSystemInfo`](../../../lib/types/interfaces/TargetSystemInfo.md)

Defined in: [src/hooks/useCameraManager.ts:105](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/useCameraManager.ts#L105)

O sistema alvo e o índice da visão para a câmera enquadrar. Null se nenhum foco ativo.
