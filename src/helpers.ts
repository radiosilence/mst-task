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

export function isSuccess<T>(
  response: Response<T>,
): response is SuccessResponse<T> {
  return response.status === ResponseStatus.Success;
}

export function isCancelled<T>(
  response: Response<T>,
): response is CancelledResponse {
  return response.status === ResponseStatus.Cancelled;
}
