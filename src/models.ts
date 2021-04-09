import { flow, toGenerator, toGeneratorFunction, types } from "mobx-state-tree";
import { AsyncFn, Result } from "./types";

const { enumeration, model, optional, frozen } = types;

export function randomHex(): string {
  return ((Math.random() * 0xffffff) << 0).toString(16);
}

export const TaskState = enumeration(["ready", "inProgress", "done", "failed"]);

const Task = model("Task")
  .props({
    state: optional(TaskState, "ready"),
    error: frozen(),
  })
  .volatile(() => ({
    executionId: randomHex(),
  }))
  .views(self => ({
    get ready() {
      return self.state === "ready";
    },
    get inProgress() {
      return self.state === "inProgress";
    },
    get success() {
      return self.state === "done";
    },
    get failed() {
      return self.state === "failed";
    },
  }))
  .actions(self => {
    function reset() {
      self.state = "ready";
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
          self.state = "inProgress";
          const value = yield* toGenerator(cb(...args));
          if (self.executionId !== executionId) {
            return [value, true] as Result<Value>;
          }
          self.state = "done";
          return [value, false] as Result<Value>;
        } catch (error) {
          self.state = "failed";
          self.error = error;
          throw error;
        }
      }),
    ),
  }));
}
