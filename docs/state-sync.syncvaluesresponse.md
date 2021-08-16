<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [state-sync](./state-sync.md) &gt; [SyncValuesResponse](./state-sync.syncvaluesresponse.md)

## SyncValuesResponse type

Response data for single state values

<b>Signature:</b>

```typescript
export declare type SyncValuesResponse<TState> = {
    [key in keyof TState]: unknown;
};
```

## Remarks

Keys should correspond to prop configs with type 'value' in [SyncStatePropConfig](./state-sync.syncstatepropconfig.md)
