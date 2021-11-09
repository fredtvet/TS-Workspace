<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [dynamic-forms](./dynamic-forms.md) &gt; [ControlFieldComponent](./dynamic-forms.controlfieldcomponent.md)

## ControlFieldComponent interface

Represents a control field component that displays a field used to set the control value.

<b>Signature:</b>

```typescript
export interface ControlFieldComponent<TValueType, TViewOptions extends object> extends ControlComponent<TValueType, TViewOptions> 
```
<b>Extends:</b> [ControlComponent](./dynamic-forms.controlcomponent.md)<!-- -->&lt;TValueType, TViewOptions&gt;

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [formControl](./dynamic-forms.controlfieldcomponent.formcontrol.md) | [GenericAbstractControl](./dynamic-forms.genericabstractcontrol.md)<!-- -->&lt;TValueType&gt; | The control accociated with the component |
|  [requiredSelector?](./dynamic-forms.controlfieldcomponent.requiredselector.md) | Immutable&lt;[AllowedFormStateSelector](./dynamic-forms.allowedformstateselector.md)<!-- -->&lt;boolean \| undefined, any, any&gt;&gt; | <i>(Optional)</i> Selector for the required status of the control. Use with [FormStateResolver](./dynamic-forms.formstateresolver.md) to retrieve observable value. |

## Methods

|  Method | Description |
|  --- | --- |
|  [resolveOptions$()](./dynamic-forms.controlfieldcomponent.resolveoptions_.md) | Resolve an observable for viewOptions values |
