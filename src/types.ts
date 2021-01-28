export enum ResultStatus {
  Err,
  Cancel,
  Ok,
}

// export class Result {
//   status?: ResultStatus;

//   unwrap() {
//     return this.expect("response was not a success");
//   }
//   expect(error: string) {
//     throw new Error(error);
//   }
// }

export class Ok<R> {
  status: ResultStatus.Ok = ResultStatus.Ok;
  value: R;

  constructor(value: R) {
    this.value = value;
  }

  unwrap() {
    return this.value;
  }
}

export class Err<T = Error | string> {
  status: ResultStatus.Err = ResultStatus.Err;
  error: T;

  constructor(err: T) {
    this.error = err;
  }
}

export class Cancel {
  status: ResultStatus.Cancel = ResultStatus.Cancel;
}

// export interface Ok<R> {
//   status: ResultStatus.Success;
//   value: R;
// }

// export interface Err {
//   status: ResultStatus.Error;
//   error: string;
// }

// export interface Cancel {
//   status: ResultStatus.Cancelled;
// }

export type Result<T> = Ok<T> | Err | Cancel;

export type FlowReturn<R> = R extends Promise<infer T> ? T : R;
