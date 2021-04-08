export enum ResultStatus {
  Ok,
}

export type AsyncFn<T, Args extends unknown[]> = (...args: Args) => Promise<T>;

export type Result<R> = [value: R, stale: boolean];

// export class Result<R> {
//   value: R;
//   stale: boolean;

//   constructor(value: R, stale: boolean) {
//     this.value = value;
//     this.stale = stale;
//   }

//   ok: true = true;
// }
