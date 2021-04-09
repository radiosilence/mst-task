import { flow, toGenerator, toGeneratorFunction, types } from "mobx-state-tree";

export type AsyncFn<T, Args extends unknown[]> = (...args: Args) => Promise<T>;

export type Result<R> = [value: R, stale: boolean];

const { model, optional, frozen, number } = types;

export function randomHex(): string {
  return ((Math.random() * 0xffffff) << 0).toString(16);
}

enum TaskState {
  Ready,
  InProgress,
  Done,
  Failed,
}

const Task = model("Task")
  .props({
    state: optional(number, TaskState.Ready),
    error: frozen(),
  })
  .volatile(() => ({
    executionId: randomHex(),
  }))
  .views(self => ({
    get ready() {
      return self.state === TaskState.Ready;
    },
    get inProgress() {
      return self.state === TaskState.InProgress;
    },
    get success() {
      return self.state === TaskState.Done;
    },
    get failed() {
      return self.state === TaskState.Failed;
    },
  }))
  .actions(self => {
    function reset() {
      self.state = TaskState.Ready;
      self.executionId = randomHex();
    }

    return {
      reset,
    };
  });

export function taskFrom<Value, Args extends unknown[]>(
  cb: AsyncFn<Value, Args>,
) {
  return Task.actions(self => ({
    execute: toGeneratorFunction(
      flow(function* (...args: Args) {
        try {
          self.reset();
          const executionId = self.executionId;
          self.state = TaskState.InProgress;
          const value = yield* toGenerator(cb(...args));
          self.state = TaskState.Done;
          return [value, self.executionId !== executionId] as Result<Value>;
        } catch (error) {
          self.state = TaskState.Failed;
          self.error = error;
          throw error;
        }
      }),
    ),
  }));
}
