import { toGenerator, types } from "mobx-state-tree";
import { Task } from "./models";

export function taskFrom<T, Args extends unknown[]>(
  cb: (...args: Args) => Promise<T>,
) {
  return types.optional(
    Task.actions(self => ({
      execute: (...args: Args) => toGenerator(self.task(cb)(...args)),
    })),
    {},
  );
}
