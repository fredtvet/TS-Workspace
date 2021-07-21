<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [form-sheet](./form-sheet.md) &gt; [FormSheetViewConfig](./form-sheet.formsheetviewconfig.md)

## FormSheetViewConfig interface

Represents configuration for opening a form with [FormService](./form-sheet.formservice.md)

<b>Signature:</b>

```typescript
export interface FormSheetViewConfig<TForm extends object, TFormState extends object | null = null, TFormConfig = DynamicForm<TForm, TFormState>, TResult = Immutable<TForm>> 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [customFormComponent?](./form-sheet.formsheetviewconfig.customformcomponent.md) | Type&lt;FormComponent&lt;TFormConfig, TForm, TFormState, TResult&gt;&gt; | <i>(Optional)</i> The form component that should be rendered. |
|  [formConfig](./form-sheet.formsheetviewconfig.formconfig.md) | TFormConfig | The form config passed to the provided form component |
|  [fullScreen?](./form-sheet.formsheetviewconfig.fullscreen.md) | boolean | <i>(Optional)</i> Set to true to enable full screen forms on mobile. Defaults to true |
|  [navConfig](./form-sheet.formsheetviewconfig.navconfig.md) | [FormSheetNavConfig](./form-sheet.formsheetnavconfig.md) | Configuration for the top navigation bar on bottom sheet |
|  [useRouting?](./form-sheet.formsheetviewconfig.userouting.md) | boolean | <i>(Optional)</i> Enable to append a query param to the route when opened, making the form a part of the browser history. Default is true |
