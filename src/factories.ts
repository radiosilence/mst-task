import { toGenerator, types } from "mobx-state-tree";
import { Config, Task } from "./models";
import { AsyncFn } from "./types";

export function taskFrom<T, Args extends unknown[]>(cb: AsyncFn<T, Args>) {
  return types.optional(
    Task.actions(self => ({
      execute: (...args: Args) =>
        toGenerator(self.task<Args, T, typeof cb>(cb)(...args)),
      executeCustom: (config: Config, ...args: Args) =>
        toGenerator(self.task<Args, T, typeof cb>(cb, config)(...args)),
    })),
    {},
  );
}
