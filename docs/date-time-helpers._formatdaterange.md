<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [date-time-helpers](./date-time-helpers.md) &gt; [\_formatDateRange](./date-time-helpers._formatdaterange.md)

## \_formatDateRange() function

Formats a range of dates to a readable format

<b>Signature:</b>

```typescript
export declare function _formatDateRange(range: Immutable<DateRange>, formatFn: (d: unknown) => string): string | null;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  range | Immutable&lt;[DateRange](./date-time-helpers.daterange.md)<!-- -->&gt; | The range of dates to format |
|  formatFn | (d: unknown) =&gt; string | Formats the individual dates |

<b>Returns:</b>

string \| null

A string representation of the date range.
