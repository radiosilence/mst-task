# mst-request

A simple library for wrapping requests, using MobX-state-tree

## Example

```ts
import { flow, types } from "mobx-state-tree";
import Request, { isCancelled, isError, unwrap, Request } from "mst-request";
import { PotatoAPI } from "./apis/potato";

export const PotatoRequest = Request.named("PotatoRequest")
  .props({ params: types.model({ page: types.number }) })
  .actions(self => ({
    execute: self.request((id: string) => PotatoAPI.getPotato(id, self.params)),
  }));

export const Potato = types.model({
  id: types.identifier,
  name: types.string,
});

export const PotatoStore = types
  .model("PotatoStore", {
    request: types.optional(PotatoRequest, { params: { page: 1 } }),
    potato: types.maybe(Potato),
  })
  .actions(self => {
    const fetchPotatoById = flow(function* (id: string) {
      const response = yield* self.request.execute(id);
      // Unsafe, but skips typecheck
      const { id, name } = unwrapUnsafe(response);

      // Handling nicely
      if (isCancelled(response)) return; // make sure it is latest request (debouncing)
      if (isError(response)) return; // handle error
      self.potato = unwrap(response); // we know it is success

      console.log(response);
      console.log(self.request.failed);
    });

    return {
      fetchPotatoById,
    };
  });
```

Component

```tsx
export const PotatoDisplay = observer(() => {
  const { potatoStore } = useStores();
  const {
    potato,
    req: { loading, error },
  } = potatoStore;

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <span className="error">Error loading potato: {error}</span>;
  }

  return (
    <span>
      Potato #{potato.id}: {potato.name}
    </span>
  );
});
```
