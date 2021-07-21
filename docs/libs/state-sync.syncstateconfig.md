<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [state-sync](./state-sync.md) &gt; [SyncStateConfig](./state-sync.syncstateconfig.md)

## SyncStateConfig type

Configuration for synchronized state management. Provided by consumer application with token [SYNC\_STATE\_CONFIG](./state-sync.sync_state_config.md)

<b>Signature:</b>

```typescript
export declare type SyncStateConfig<TState> = {
    [key in keyof TState]: SyncStatePropConfig;
};
```
<b>References:</b> [SyncStatePropConfig](./state-sync.syncstatepropconfig.md)
