import { flow, Instance, toGenerator, types } from "mobx-state-tree";
import { Cancel, Err, FlowReturn, Ok } from "./types";

const { model, optional, enumeration, string, maybe } = types;

export function randomHex(): string {
  return ((Math.random() * 0xffffff) << 0).toString(16);
}

export const RequestState = enumeration(["ready", "loading", "done", "failed"]);

export const Request = model({
  state: optional(RequestState, "ready"),
  error: maybe(string),
  id: optional(string, randomHex()),
})
  .views(self => ({
    get ready() {
      return self.state === "ready";
    },
    get loading() {
      return self.state === "loading";
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

    function request<R, Args extends unknown[]>(
      cb: (...args: Args) => Promise<R>,
    ): (...args: Args) => Promise<FlowReturn<Ok<R>> | Err | Cancel> {
      return flow(function* (...args: Args) {
        try {
          reset();
          const id = self.id;
          self.state = "loading";
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
      request,
      reset,
    };
  });

export type Request = Instance<typeof Request>;
