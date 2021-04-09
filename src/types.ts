export enum ResultStatus {
  Ok,
}

export type AsyncFn<T, Args extends unknown[]> = (...args: Args) => Promise<T>;

export type Result<R> = [value: R, stale: boolean];
