[**3D Terminal System API Documentation**](../../../README.md)

***

[3D Terminal System API Documentation](../../../README.md) / [hooks/use-toast](../README.md) / useToast

# Function: useToast()

> **useToast**(): `object`

Defined in: [src/hooks/use-toast.ts:175](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/hooks/use-toast.ts#L175)

## Returns

`object`

### dismiss()

> **dismiss**: (`toastId?`) => `void`

#### Parameters

##### toastId?

`string`

#### Returns

`void`

### toast()

> **toast**: (`__namedParameters`) => `object`

#### Parameters

##### \_\_namedParameters

[`Toast`](../type-aliases/Toast.md)

#### Returns

`object`

##### dismiss()

> **dismiss**: () => `void`

###### Returns

`void`

##### id

> **id**: `string`

##### update()

> **update**: (`props`) => `void`

###### Parameters

###### props

[`ToasterToast`](../type-aliases/ToasterToast.md)

###### Returns

`void`

### toasts

> **toasts**: [`ToasterToast`](../type-aliases/ToasterToast.md)[]
