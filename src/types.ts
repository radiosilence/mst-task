export enum ResponseStatus {
  Error,
  Cancelled,
  Success,
}

export interface SuccessResponse<R> {
  status: ResponseStatus.Success;
  value: R;
}

export interface ErrorResponse {
  status: ResponseStatus.Error;
  error: string;
}

export interface CancelledResponse {
  status: ResponseStatus.Cancelled;
}

export type Response<T> =
  | SuccessResponse<T>
  | ErrorResponse
  | CancelledResponse;
