export enum ResultStatus {
  Error,
  Cancelled,
  Success,
}

export interface SuccessResult<R> {
  status: ResultStatus.Success;
  value: R;
}

export interface ErrorResult {
  status: ResultStatus.Error;
  error: string;
}

export interface CancelledResult {
  status: ResultStatus.Cancelled;
}

export type Result<T> = SuccessResult<T> | ErrorResult | CancelledResult;
