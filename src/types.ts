export enum ResultStatus {
  Err,
  Cancel,
  Ok,
}

export class Ok<R> {
  status: ResultStatus.Ok = ResultStatus.Ok;
  value: R;

  constructor(value: R) {
    this.value = value;
  }

  ok: true = true;
  cancelled: false = false;
  failed: false = false;
}

export class Err<T = Error | string> {
  status: ResultStatus.Err = ResultStatus.Err;
  error: T;

  constructor(err: T) {
    this.error = err;
  }

  ok: false = false;
  cancelled: false = false;
  failed: true = true;
}

export class Cancel {
  status: ResultStatus.Cancel = ResultStatus.Cancel;

  ok: false = false;
  cancelled: true = true;
  failed: false = false;
}

export type Result<T> = Ok<T> | Err | Cancel;

export type FlowReturn<R> = R extends Promise<infer T> ? T : R;
