<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [dynamic-forms](./dynamic-forms.md) &gt; [DynamicControlGroup](./dynamic-forms.dynamiccontrolgroup.md)

## DynamicControlGroup interface

Describes a group of controls that make up an object in the form model

<b>Signature:</b>

```typescript
export interface DynamicControlGroup<TValueType extends object, TFormState extends object | null = null> extends DynamicAbstractGroup<TValueType, TFormState> 
```
<b>Extends:</b> [DynamicAbstractGroup](./dynamic-forms.dynamicabstractgroup.md)<!-- -->&lt;TValueType, TFormState&gt;

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [controlGroupComponent?](./dynamic-forms.dynamiccontrolgroup.controlgroupcomponent.md) | Type&lt;DynamicAbstractGroupComponent&lt;[DynamicControlGroup](./dynamic-forms.dynamiccontrolgroup.md)<!-- -->&lt;TValueType, TFormState&gt;&gt;&gt; | <i>(Optional)</i> A custom control group component for displaying the group |
|  [label?](./dynamic-forms.dynamiccontrolgroup.label.md) | string | <i>(Optional)</i> A visual label displayed above the group on the rendered form |
