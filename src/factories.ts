import { toGenerator, types } from "mobx-state-tree";
import { Task } from "./models";
import { TaskFn } from "./types";

export function taskFrom<T, Args extends unknown[]>(cb: TaskFn<T, Args>) {
  return types.optional(
    Task.actions(self => ({
      execute: (...args: Args) =>
        toGenerator(self.task<Args, T, typeof cb>(cb)(...args)),
    })),
    {},
  );
}
