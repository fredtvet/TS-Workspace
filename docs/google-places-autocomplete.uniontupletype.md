<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [google-places-autocomplete](./google-places-autocomplete.md) &gt; [UnionTupleType](./google-places-autocomplete.uniontupletype.md)

## UnionTupleType type

<b>Signature:</b>

```typescript
export declare type UnionTupleType<A extends any[]> = A extends {
    [n: number]: infer T;
} ? T : never;
```