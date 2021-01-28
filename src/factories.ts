import { toGenerator, types } from "mobx-state-tree";
import { Request } from "./models";

export function createRequest<T, Args extends unknown[]>(
  cb: (...args: Args) => Promise<T>,
) {
  return types.optional(
    Request.actions(self => ({
      execute: (...args: Args) => toGenerator(self.request(cb)(...args)),
    })),
    {},
  );
}
