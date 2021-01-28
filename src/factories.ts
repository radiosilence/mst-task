import { Request } from "./models";

export function createRequest<T, Args extends unknown[]>(
  cb: (...args: Args) => Promise<T>,
) {
  return Request.actions(self => ({ execute: self.request(cb) }));
}
