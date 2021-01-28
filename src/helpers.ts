import {
  CancelledResponse,
  ErrorResponse,
  Response,
  ResponseStatus,
  SuccessResponse,
} from "./types";

export function isError<T>(response: Response<T>): response is ErrorResponse {
  return response.status === ResponseStatus.Error;
}

export function isCancelled<T>(
  response: Response<T>,
): response is CancelledResponse {
  return response.status === ResponseStatus.Cancelled;
}

export function isSuccess<T>(
  response: Response<T>,
): response is SuccessResponse<T> {
  return response.status === ResponseStatus.Success;
}

export function unwrapUnsafe<T>(response: Response<T>) {
  return expect(response, "response was not a success");
}

export function expect<T>(response: Response<T>, error: string) {
  if (response.status !== ResponseStatus.Success) {
    throw new Error(error);
  }
  return response.value;
}

export function unwrap<T>({ value }: SuccessResponse<T>) {
  return value;
}
