<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [state-model](./state-model.md) &gt; [\_modifyModelWithForeigns](./state-model._modifymodelwithforeigns.md)

## \_modifyModelWithForeigns() function

Add or update a model and any foreign relationships set on the provided model value according to [ModelStateConfig](./state-model.modelstateconfig.md)

<b>Signature:</b>

```typescript
export declare function _modifyModelWithForeigns<TState extends {}>(state: Immutable<TState>, stateProp: Immutable<Prop<TState>>, entity: Immutable<UnknownState>, entityFn: (entity: Immutable<{}>, stateSlice: ImmutableArray<{}>) => ImmutableArray<{}>): Immutable<Partial<TState>>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  state | Immutable&lt;TState&gt; | State containing model and foregin data |
|  stateProp | Immutable&lt;Prop&lt;TState&gt;&gt; | Model state property of the model |
|  entity | Immutable&lt;UnknownState&gt; | The model value with optional foreign props |
|  entityFn | (entity: Immutable&lt;{}&gt;, stateSlice: ImmutableArray&lt;{}&gt;) =&gt; ImmutableArray&lt;{}&gt; | A modifier function to add or update the model. |

<b>Returns:</b>

Immutable&lt;Partial&lt;TState&gt;&gt;

State with model and foreigns added or updated.
