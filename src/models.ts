import { flow, Instance, toGenerator, types } from "mobx-state-tree";
import { AsyncFn, Cancel, Err, Ok } from "./types";

const { model, optional, enumeration, string, maybe } = types;

export function randomHex(): string {
  return ((Math.random() * 0xffffff) << 0).toString(16);
}

export interface Config {
  silent?: boolean;
  debounced?: boolean;
}

export const TaskState = enumeration(["ready", "inProgress", "done", "failed"]);

export const Task = model({
  state: optional(TaskState, "ready"),
  error: maybe(string),
  executionId: optional(string, randomHex()),
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
      self.executionId = randomHex();
      self.error = undefined;
    }

    function task<
      Args extends unknown[],
      Value,
      F extends AsyncFn<Value, Args>
    >(cb: F, config: Config = {}) {
      return flow(function* (...args: Args) {
        const { silent = false, debounced = true } = config;
        try {
          reset();
          const executionId = self.executionId;
          if (!silent) self.state = "inProgress";
          const value = yield* toGenerator(cb(...args));
          if (debounced && self.executionId !== executionId) {
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
