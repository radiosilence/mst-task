import { Cancel, Error, Ok, Result, ResultStatus } from "./types";

export function isError<T>(response: Result<T>): response is Error {
  return response.status === ResultStatus.Error;
}

export function isCancelled<T>(response: Result<T>): response is Cancel {
  return response.status === ResultStatus.Cancelled;
}

export function isSuccess<T>(response: Result<T>): response is Ok<T> {
  return response.status === ResultStatus.Success;
}

export function unwrapUnsafe<T>(response: Result<T>) {
  return expect(response, "response was not a success");
}

export function expect<T>(response: Result<T>, error: string) {
  if (response.status !== ResultStatus.Success) {
    throw new Error(error);
  }
  return response.value;
}

export function unwrap<T>({ value }: Ok<T>) {
  return value;
}
