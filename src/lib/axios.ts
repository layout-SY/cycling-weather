import axios, { AxiosError } from "axios";

export interface ApiErrorPayload {
  code: string | number;
  message: string;
  status?: number;
  data?: unknown;
}

export class ApiError extends Error {
  code: string | number;
  status?: number;
  data?: unknown;

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = "ApiError";
    this.code = payload.code;
    this.status = payload.status;
    this.data = payload.data;
  }
}

type ErrorExtractor = (data: unknown) => ApiErrorPayload | null;

interface AxiosInstanceOptions {
  timeout?: number;
  errorExtractor?: ErrorExtractor;
  data?: unknown;
}

export const AxiosInstance = (
  baseURL: string,
  options: AxiosInstanceOptions = {},
  method?: "POST"
) => {
  const instance = axios.create({
    baseURL,
    timeout: options.timeout ?? 15_000,
    method,
    data: options.data,
  });

  instance.interceptors.response.use(
    (response) => {
      // const extractor = options.errorExtractor;
      // if (extractor) {
      //   const payload = extractor(response.data);
      //   if (payload) {
      //     throw new ApiError(payload);
      //   }
      // }
      return response;
    },
    (error: AxiosError) => {
      if (error.response) {
        throw new ApiError({
          code: error.response.status,
          message: error.message,
          status: error.response.status,
          data: error.response.data,
        });
      }
      throw error;
    }
  );

  return instance;
};
