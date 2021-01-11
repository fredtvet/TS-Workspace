<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [optimistic-http](./optimistic-http.md)

## optimistic-http package

A library for sending optimistic http requests.

## Remarks

The library ensures that http requests are executed sequentially and http errors handled correctly.

## Classes

|  Class | Description |
|  --- | --- |
|  [HttpQueuer](./optimistic-http.httpqueuer.md) | Class responsible for queuing and dispatching http requests ([OptimisticHttpRequest](./optimistic-http.optimistichttprequest.md)<!-- -->) Requires initalization by consumer. |
|  [OptimisticHttpModule](./optimistic-http.optimistichttpmodule.md) | Responsible for providing core injectables. Should only be imported in root. |

## Interfaces

|  Interface | Description |
|  --- | --- |
|  [FormDataEntry](./optimistic-http.formdataentry.md) | Describes an object thats used to represent an entry in a form data class. |
|  [HttpErrorAction](./optimistic-http.httperroraction.md) | Represents the action dispatched when there are http errors returned from optimistic requests. Triggers the  action. |
|  [HttpQueueShiftAction](./optimistic-http.httpqueueshiftaction.md) | Represents an action used to remove the first request in queue |
|  [OptimisticHttpAction](./optimistic-http.optimistichttpaction.md) | Represents an action used to make an optimistic http request. |
|  [OptimisticHttpErrorAction](./optimistic-http.optimistichttperroraction.md) | Represents an action that occurs when there are http errors occuring on optimistic requests. |
|  [OptimisticHttpRequest](./optimistic-http.optimistichttprequest.md) | Describes an object used to make optimistic http requests. |
|  [OptimisticStateSelector](./optimistic-http.optimisticstateselector.md) | Represents an object used to select what state is optimistic. Provided with the token [OPTIMISTIC\_STATE\_SELECTOR](./optimistic-http.optimistic_state_selector.md) |
|  [QueuedCommand](./optimistic-http.queuedcommand.md) |  |
|  [StateRequestQueue](./optimistic-http.staterequestqueue.md) | Represents a slice of state containing the request queue |

## Variables

|  Variable | Description |
|  --- | --- |
|  [BASE\_API\_URL](./optimistic-http.base_api_url.md) |  |
|  [HttpErrorAction](./optimistic-http.httperroraction.md) |  |
|  [HttpQueueShiftAction](./optimistic-http.httpqueueshiftaction.md) |  |
|  [OPTIMISTIC\_STATE\_SELECTOR](./optimistic-http.optimistic_state_selector.md) |  |
|  [OptimisticHttpAction](./optimistic-http.optimistichttpaction.md) |  |
|  [OptimisticHttpErrorAction](./optimistic-http.optimistichttperroraction.md) |  |
