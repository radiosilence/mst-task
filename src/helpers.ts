import { Cancel, Err, Ok, Result, ResultStatus } from "./types";

export function isError<T>(result: Result<T>): result is Err {
  return result.status === ResultStatus.Error;
}

export function isCancelled<T>(result: Result<T>): result is Cancel {
  return result.status === ResultStatus.Cancelled;
}

export function isSuccess<T>(result: Result<T>): result is Ok<T> {
  return result.status === ResultStatus.Success;
}
