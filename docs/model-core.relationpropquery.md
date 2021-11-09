<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [model-core](./model-core.md) &gt; [RelationPropQuery](./model-core.relationpropquery.md)

## RelationPropQuery type

<b>Signature:</b>

```typescript
export declare type RelationPropQuery<TState, TModel extends StateModels<TState>, TProp> = NestedIncludeQuery<TState, ModelForeignByForeignProp<TModel, TProp>> | NestedIncludeQuery<TState, ModelChildByChildProp<TModel, TProp>>;
```
<b>References:</b> [StateModels](./model-core.statemodels.md)<!-- -->, [NestedIncludeQuery](./model-core.nestedincludequery.md)<!-- -->, [ModelForeignByForeignProp](./model-core.modelforeignbyforeignprop.md)<!-- -->, [ModelChildByChildProp](./model-core.modelchildbychildprop.md)
