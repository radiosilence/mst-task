# mst-task

A simple, strongly typed, library for wrapping async tasks, using MobX-state-tree

## Example

```ts
import { flow, types } from "mobx-state-tree";
import { taskFrom } from "mst-task";

// This would be your API request
export async function getPotato(id: string): Promise<{ id: string, name: string }> {
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
      // execute will have the correct types for your original arguments of `getPotato`
      const result = yield* self.requests.get.execute(id);
      if (result.cancelled) return; // make sure it is latest request (debouncing)
      if (result.failed) throw new Error(result.error); // handle error
      self.potato = result.value; // we know it is success.
      // `result.value` will have correct type of `{ id: string, name: string }`
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
