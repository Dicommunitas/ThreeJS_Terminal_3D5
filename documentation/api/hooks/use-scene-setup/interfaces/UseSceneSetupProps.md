[**3D Terminal System API Documentation**](../../../README.md)

***

[3D Terminal System API Documentation](../../../README.md) / [hooks/use-scene-setup](../README.md) / UseSceneSetupProps

# Interface: UseSceneSetupProps

Defined in: [src/hooks/use-scene-setup.ts:117](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-scene-setup.ts#L117)

Props para o hook orquestrador da configuração da cena.
 UseSceneSetupProps

## Properties

### initialCameraLookAt

> **initialCameraLookAt**: `object`

Defined in: [src/hooks/use-scene-setup.ts:120](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-scene-setup.ts#L120)

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

Defined in: [src/hooks/use-scene-setup.ts:119](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-scene-setup.ts#L119)

Posição inicial da câmera.

#### x

> **x**: `number`

#### y

> **y**: `number`

#### z

> **z**: `number`

***

### mountRef

> **mountRef**: `RefObject`\<`HTMLDivElement`\>

Defined in: [src/hooks/use-scene-setup.ts:118](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-scene-setup.ts#L118)

Ref para o elemento DOM contêiner da cena.

***

### onCameraChange()

> **onCameraChange**: (`cameraState`, `actionDescription?`) => `void`

Defined in: [src/hooks/use-scene-setup.ts:121](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-scene-setup.ts#L121)

Callback para quando o estado da câmera muda.

#### Parameters

##### cameraState

[`CameraState`](../../../lib/types/interfaces/CameraState.md)

##### actionDescription?

`string`

#### Returns

`void`
