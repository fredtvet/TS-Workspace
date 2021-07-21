<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [model-data-table](./model-data-table.md) &gt; [ModelPropertyColDef](./model-data-table.modelpropertycoldef.md)

## ModelPropertyColDef interface

Defines a column for a property on a state model

<b>Signature:</b>

```typescript
export interface ModelPropertyColDef<TModel> 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [boolean?](./model-data-table.modelpropertycoldef.boolean.md) | boolean | <i>(Optional)</i> Set to true if the property represents a boolean value. The column will render a select with "ja" or "nei" |
|  [editable?](./model-data-table.modelpropertycoldef.editable.md) | boolean | <i>(Optional)</i> Set to true if the property should be editable |
|  [valueGetter?](./model-data-table.modelpropertycoldef.valuegetter.md) | (model: Immutable&lt;TModel&gt;) =&gt; unknown | <i>(Optional)</i> |
