export interface ApiResponseStructure<T> {
  code: number;
  message: string;
  data?: T;
}