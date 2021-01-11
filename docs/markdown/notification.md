<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [notification](./notification.md)

## notification package

A library for sending optimistic http requests.

## Remarks

The library ensures that http requests are executed sequentially and http errors handled correctly.

## Classes

|  Class | Description |
|  --- | --- |
|  [HttpQueuer](./notification.httpqueuer.md) | Class responsible for queuing and dispatching http requests ([OptimisticHttpRequest](./notification.optimistichttprequest.md)<!-- -->) Requires initalization by consumer. |
|  [OptimisticHttpModule](./notification.optimistichttpmodule.md) | Responsible for providing core injectables. Should only be imported in root. |

## Interfaces

|  Interface | Description |
|  --- | --- |
|  [FormDataEntry](./notification.formdataentry.md) | Describes an object thats used to represent an entry in a form data class. |
|  [HttpErrorAction](./notification.httperroraction.md) | Represents the action dispatched when there are http errors returned from optimistic requests. Triggers the  action. |
|  [HttpQueueShiftAction](./notification.httpqueueshiftaction.md) | Represents an action used to remove the first request in queue |
|  [OptimisticHttpAction](./notification.optimistichttpaction.md) | Represents an action used to make an optimistic http request. |
|  [OptimisticHttpErrorAction](./notification.optimistichttperroraction.md) | Represents an action that occurs when there are http errors occuring on optimistic requests. |
|  [OptimisticHttpRequest](./notification.optimistichttprequest.md) | Describes an object used to make optimistic http requests. |
|  [OptimisticStateSelector](./notification.optimisticstateselector.md) | Represents an object used to select what state is optimistic. Provided with the token [OPTIMISTIC\_STATE\_SELECTOR](./notification.optimistic_state_selector.md) |
|  [QueuedCommand](./notification.queuedcommand.md) |  |
|  [StateRequestQueue](./notification.staterequestqueue.md) | Represents a slice of state containing the request queue |

## Variables

|  Variable | Description |
|  --- | --- |
|  [BASE\_API\_URL](./notification.base_api_url.md) |  |
|  [HttpErrorAction](./notification.httperroraction.md) |  |
|  [HttpQueueShiftAction](./notification.httpqueueshiftaction.md) |  |
|  [OPTIMISTIC\_STATE\_SELECTOR](./notification.optimistic_state_selector.md) |  |
|  [OptimisticHttpAction](./notification.optimistichttpaction.md) |  |
|  [OptimisticHttpErrorAction](./notification.optimistichttperroraction.md) |  |
