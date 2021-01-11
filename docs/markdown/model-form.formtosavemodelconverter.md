<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [model-form](./model-form.md) &gt; [FormToSaveModelConverter](./model-form.formtosavemodelconverter.md)

## FormToSaveModelConverter type

Represents a function that converts a model form input to a state action

<b>Signature:</b>

```typescript
export declare type FormToSaveModelConverter<TForm extends {}, TState extends {}, TAction extends StateAction> = (input: ModelFormToSaveModelInput<TForm, TState>) => TAction;
```
<b>References:</b> [ModelFormToSaveModelInput](./model-form.modelformtosavemodelinput.md)
