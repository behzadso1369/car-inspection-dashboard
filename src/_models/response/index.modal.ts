export interface DefaultResponse<T> {
  isSuccess: boolean;
  statusCode: number;
  totalRecords: number;
  message: string;
  data: T;
}
