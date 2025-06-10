[**3D Terminal System API Documentation**](../../../README.md)

***

[3D Terminal System API Documentation](../../../README.md) / [hooks/use-scene-setup](../README.md) / UseSceneSetupReturn

# Interface: UseSceneSetupReturn

Defined in: [src/hooks/use-scene-setup.ts:139](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-scene-setup.ts#L139)

Valor de retorno do hook orquestrador da configuração da cena.
Agrega refs e flags de prontidão dos hooks especializados.
 UseSceneSetupReturn

## Properties

### cameraRef

> **cameraRef**: `RefObject`\<`null` \| `PerspectiveCamera`\>

Defined in: [src/hooks/use-scene-setup.ts:141](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-scene-setup.ts#L141)

Ref para a câmera perspectiva.

***

### composerRef

> **composerRef**: `RefObject`\<`null` \| `EffectComposer`\>

Defined in: [src/hooks/use-scene-setup.ts:145](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-scene-setup.ts#L145)

Ref para o EffectComposer (pós-processamento).

***

### controlsRef

> **controlsRef**: `RefObject`\<`null` \| `OrbitControls`\>

Defined in: [src/hooks/use-scene-setup.ts:144](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-scene-setup.ts#L144)

Ref para os OrbitControls.

***

### groundMeshRef

> **groundMeshRef**: `RefObject`\<`null` \| `Mesh`\<`BufferGeometry`\<`NormalBufferAttributes`\>, `Material` \| `Material`[], `Object3DEventMap`\>\>

Defined in: [src/hooks/use-scene-setup.ts:147](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-scene-setup.ts#L147)

Ref para a malha do plano de chão.

***

### isControlsReady

> **isControlsReady**: `boolean`

Defined in: [src/hooks/use-scene-setup.ts:149](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-scene-setup.ts#L149)

Flag que indica se os OrbitControls estão prontos (carregamento dinâmico).

***

### isSceneReady

> **isSceneReady**: `boolean`

Defined in: [src/hooks/use-scene-setup.ts:148](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-scene-setup.ts#L148)

Flag que indica se os componentes principais da cena (núcleo, renderizadores, elementos) estão prontos.

***

### labelRendererRef

> **labelRendererRef**: `RefObject`\<`null` \| `CSS2DRenderer`\>

Defined in: [src/hooks/use-scene-setup.ts:143](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-scene-setup.ts#L143)

Ref para o renderizador CSS2D (para rótulos).

***

### outlinePassRef

> **outlinePassRef**: `RefObject`\<`null` \| `OutlinePass`\>

Defined in: [src/hooks/use-scene-setup.ts:146](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-scene-setup.ts#L146)

Ref para o OutlinePass (efeito de contorno).

***

### rendererRef

> **rendererRef**: `RefObject`\<`null` \| `WebGLRenderer`\>

Defined in: [src/hooks/use-scene-setup.ts:142](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-scene-setup.ts#L142)

Ref para o renderizador WebGL.

***

### sceneRef

> **sceneRef**: `RefObject`\<`null` \| `Scene`\>

Defined in: [src/hooks/use-scene-setup.ts:140](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-scene-setup.ts#L140)

Ref para a cena Three.js.
