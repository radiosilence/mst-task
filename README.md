# mst-task

A simple library for wrapping async tasks, using MobX-state-tree

## Example

```ts
import { flow, types } from "mobx-state-tree";
import { isCancelled, isError, unwrap, taskFrom } from "mst-task";

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
    potato: types.maybe(Potato),
  })
  .volatile(() => ({
    requests: {
      get: taskFrom(getPotato).create();
    }
  }))
  .actions(self => {
    const fetchPotatoById = flow(function* (id: string) {
      const result = yield* self.requests.get.execute(id);
      if (isCancelled(result)) return; // make sure it is latest request (debouncing)
      if (isError(result)) throw new Error(result.error); // handle error
      self.potato = result.unwrap(); // we know it is success
    });

    return {
      fetchPotatoByI$d,
    };
  });
```

Component

```tsx
export const PotatoDisplay = observer<{ id: string }>(({ id }) => {
  const { potatoStore } = useStores();
  const {
    potato,
    requests: { get: { inProgress, error } },
  } = potatoStore;

  useEffect(() => {
    potatoStore.fetchPotatoById(id);
  }, [id]);

  if (inProgress) {
    return <Spinner />;
  }

  if (error) {
    return <span className="error">Error inProgress potato: {error}</span>;
  }

  return (
    <span>
      Potato #{potato.id}: {potato.name}
    </span>
  );
});
```
