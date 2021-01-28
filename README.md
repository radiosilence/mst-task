# mst-request

A simple library for wrapping requests, using MobX-state-tree

## Example

```ts
import { flow, types } from "mobx-state-tree";
import { isCancelled, isError, unwrap, Request } from "mst-request";

// This would be your API request
export async function getPotato(id: string) {
  return Promise.resolve({ id, name: "Jeremy" });
}

export const Potato = types.model({
  id: types.identifier,
  name: types.string,
});

export const PotatoStore = types
  .model("PotatoStore", {
    request: createRequest(getPotato),
    ///
    potato: types.maybe(Potato),
  })
  .actions(self => {
    const fetchPotatoById = flow(function* (id: string) {
      const result = yield* self.request.execute(id);
      if (isCancelled(result)) return; // make sure it is latest request (debouncing)
      if (isError(result)) return; // handle error
      self.potato = result.unwrap(); // we know it is success

      console.log(result);
      console.log(self.request.failed);
    });

    return {
      fetchPotatoById,
    };
  });
```

Component

```tsx
export const PotatoDisplay = observer<{ id: string }>(({ id }) => {
  const { potatoStore } = useStores();
  const {
    potato,
    request: { loading, error },
  } = potatoStore;

  useEffect(() => {
    potatoStore.fetchPotatoById(id);
  }, [id]);

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
