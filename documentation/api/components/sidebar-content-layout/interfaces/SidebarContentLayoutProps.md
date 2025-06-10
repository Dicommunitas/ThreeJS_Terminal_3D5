[**3D Terminal System API Documentation**](../../../README.md)

***

[3D Terminal System API Documentation](../../../README.md) / [components/sidebar-content-layout](../README.md) / SidebarContentLayoutProps

# Interface: SidebarContentLayoutProps

Defined in: [src/components/sidebar-content-layout.tsx:114](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/sidebar-content-layout.tsx#L114)

Props para o componente SidebarContentLayout.
 SidebarContentLayoutProps

## Properties

### availableAreas

> **availableAreas**: `string`[]

Defined in: [src/components/sidebar-content-layout.tsx:122](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/sidebar-content-layout.tsx#L122)

Lista de áreas disponíveis para filtro.

***

### availableSistemas

> **availableSistemas**: `string`[]

Defined in: [src/components/sidebar-content-layout.tsx:119](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/sidebar-content-layout.tsx#L119)

Lista de sistemas disponíveis para filtro.

***

### cameraViewSystems

> **cameraViewSystems**: `string`[]

Defined in: [src/components/sidebar-content-layout.tsx:127](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/sidebar-content-layout.tsx#L127)

Lista de nomes de sistemas para o CameraControlsPanel.

***

### colorMode

> **colorMode**: [`ColorMode`](../../../lib/types/type-aliases/ColorMode.md)

Defined in: [src/components/sidebar-content-layout.tsx:123](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/sidebar-content-layout.tsx#L123)

O modo de colorização atual.

***

### layers

> **layers**: [`Layer`](../../../lib/types/interfaces/Layer.md)[]

Defined in: [src/components/sidebar-content-layout.tsx:125](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/sidebar-content-layout.tsx#L125)

Lista de camadas para o LayerManager.

***

### onColorModeChange()

> **onColorModeChange**: (`mode`) => `void`

Defined in: [src/components/sidebar-content-layout.tsx:124](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/sidebar-content-layout.tsx#L124)

Função para atualizar o modo de colorização.

#### Parameters

##### mode

[`ColorMode`](../../../lib/types/type-aliases/ColorMode.md)

#### Returns

`void`

***

### onFocusAndSelectSystem()

> **onFocusAndSelectSystem**: (`systemName`) => `void`

Defined in: [src/components/sidebar-content-layout.tsx:128](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/sidebar-content-layout.tsx#L128)

Callback para focar e selecionar um sistema.

#### Parameters

##### systemName

`string`

#### Returns

`void`

***

### onToggleLayer()

> **onToggleLayer**: (`layerId`) => `void`

Defined in: [src/components/sidebar-content-layout.tsx:126](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/sidebar-content-layout.tsx#L126)

Função para alternar a visibilidade de uma camada.

#### Parameters

##### layerId

`string`

#### Returns

`void`

***

### searchTerm

> **searchTerm**: `string`

Defined in: [src/components/sidebar-content-layout.tsx:115](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/sidebar-content-layout.tsx#L115)

O termo de busca textual atual.

***

### selectedArea

> **selectedArea**: `string`

Defined in: [src/components/sidebar-content-layout.tsx:120](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/sidebar-content-layout.tsx#L120)

A área selecionada para filtro.

***

### selectedSistema

> **selectedSistema**: `string`

Defined in: [src/components/sidebar-content-layout.tsx:117](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/sidebar-content-layout.tsx#L117)

O sistema selecionado para filtro.

***

### setSearchTerm()

> **setSearchTerm**: (`value`) => `void`

Defined in: [src/components/sidebar-content-layout.tsx:116](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/sidebar-content-layout.tsx#L116)

Função para atualizar o termo de busca.

#### Parameters

##### value

`string`

#### Returns

`void`

***

### setSelectedArea()

> **setSelectedArea**: (`value`) => `void`

Defined in: [src/components/sidebar-content-layout.tsx:121](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/sidebar-content-layout.tsx#L121)

Função para atualizar a área selecionada.

#### Parameters

##### value

`string`

#### Returns

`void`

***

### setSelectedSistema()

> **setSelectedSistema**: (`value`) => `void`

Defined in: [src/components/sidebar-content-layout.tsx:118](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/sidebar-content-layout.tsx#L118)

Função para atualizar o sistema selecionado.

#### Parameters

##### value

`string`

#### Returns

`void`
