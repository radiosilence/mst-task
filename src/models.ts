import { flow, Instance, toGenerator, types } from "mobx-state-tree";
import { Cancel, Err, Ok, Result } from "./types";

const { model, optional, enumeration, string, maybe } = types;

export function randomHex(): string {
  return ((Math.random() * 0xffffff) << 0).toString(16);
}

export const TaskState = enumeration(["ready", "inProgress", "done", "failed"]);

export const Task = model({
  state: optional(TaskState, "ready"),
  error: maybe(string),
  id: optional(string, randomHex()),
})
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
      self.id = randomHex();
      self.error = undefined;
    }

    function task<R, Args extends unknown[]>(
      cb: (...args: Args) => Promise<R>,
    ): (...args: Args) => Promise<Result<R>> {
      return flow(function* (...args: Args) {
        try {
          reset();
          const id = self.id;
          self.state = "inProgress";
          const value = yield* toGenerator(cb(...args));
          if (self.id !== id) {
            return new Cancel();
          }
          self.state = "done";
          return new Ok(value);
        } catch (error) {
          self.error = `${error}`;
          self.state = "failed";
          return new Err(error);
        }
      });
    }

    return {
      task,
      reset,
    };
  });

export type Task = Instance<typeof Task>;
