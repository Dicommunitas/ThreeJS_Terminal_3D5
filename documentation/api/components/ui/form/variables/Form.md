[**3D Terminal System API Documentation**](../../../../README.md)

***

[3D Terminal System API Documentation](../../../../README.md) / [components/ui/form](../README.md) / Form

# Variable: Form()

> `const` **Form**: \<`TFieldValues`, `TContext`, `TTransformedValues`\>(`props`) => `Element` = `FormProvider`

Defined in: [src/components/ui/form.tsx:53](https://github.com/Dicommunitas/ThreeJS_Terminal_3D/blob/6861c3fedb296b50971bbc544df59a09f35d0238/src/components/ui/form.tsx#L53)

Componente provedor que propaga os métodos `useForm` para todos os componentes filhos
através da API de Contexto do React. Para ser usado com `useFormContext`.

A provider component that propagates the `useForm` methods to all children components via [React Context](https://reactjs.org/docs/context.html) API. To be used with useFormContext.

## Type Parameters

### TFieldValues

`TFieldValues` *extends* `FieldValues`

### TContext

`TContext` = `any`

### TTransformedValues

`TTransformedValues` = `TFieldValues`

## Parameters

### props

`FormProviderProps`\<`TFieldValues`, `TContext`, `TTransformedValues`\>

all useForm methods

## Returns

`Element`

## Remarks

[API](https://react-hook-form.com/docs/useformcontext) • [Demo](https://codesandbox.io/s/react-hook-form-v7-form-context-ytudi)

## Example

```tsx
function App() {
  const methods = useForm();
  const onSubmit = data => console.log(data);

  return (
    <FormProvider {...methods} >
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <NestedInput />
        <input type="submit" />
      </form>
    </FormProvider>
  );
}

 function NestedInput() {
  const { register } = useFormContext(); // retrieve all hook methods
  return <input {...register("test")} />;
}
```

## Template

Tipos dos valores do formulário.

## Template

Tipo do contexto.

## Template

Tipos dos valores transformados do formulário.

## Param

Todos os métodos de `useForm`.

## Returns

## Remarks

[API](https://react-hook-form.com/docs/useformcontext) • [Demo](https://codesandbox.io/s/react-hook-form-v7-form-context-ytudi)

Exemplo de Uso:
```tsx
function App() {
  const methods = useForm();
  const onSubmit = data => console.log(data);

  return (
    <FormProvider {...methods} >
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <NestedInput />
        <input type="submit" />
      </form>
    </FormProvider>
  );
}

 function NestedInput() {
  const { register } = `useFormContext`(); // retrieve all hook methods
  return <input {...register("test")} />;
}
```
