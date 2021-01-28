export enum ResultStatus {
  Error,
  Cancelled,
  Success,
}

export interface Ok<R> {
  status: ResultStatus.Success;
  value: R;
}

export interface Error {
  status: ResultStatus.Error;
  error: string;
}

export interface Cancel {
  status: ResultStatus.Cancelled;
}

export type Result<T> = Ok<T> | Error | Cancel;

export type FlowReturn<R> = R extends Promise<infer T> ? T : R;
