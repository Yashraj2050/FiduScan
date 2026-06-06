
import axios, { AxiosInstance, AxiosError } from "axios";
import { APIError, AuthenticationError, ValidationError, RateLimitError } from "./errors";

export interface ClientConfig {
  apiKey?: string;
  bearerToken?: string;
  baseUrl?: string;
}

export class Client {
  private axiosInstance: AxiosInstance;

  constructor(config: ClientConfig) {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (config.apiKey) {
      headers["X-API-Key"] = config.apiKey;
    } else if (config.bearerToken) {
      headers["Authorization"] = `Bearer ${config.bearerToken}`;
    } else {
      throw new Error("Must provide apiKey or bearerToken");
    }

    this.axiosInstance = axios.create({
      baseURL: config.baseUrl || "https://api.fiduscan.io/v1",
      headers,
    });
  }

  async request<T>(method: string, path: string, data?: any, isMultipart = false): Promise<T> {
    try {
      const headers: Record<string, string> = {};
      if (isMultipart) {
        headers["Content-Type"] = "multipart/form-data";
      }
      const response = await this.axiosInstance.request({
        method,
        url: path,
        data,
        headers,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        this.handleError(error.response);
      }
      throw error;
    }
  }

  private handleError(response: any): never {
    const status = response.status;
    const data = response.data;
    const message = data?.detail || response.statusText;

    if (status === 401 || status === 403) {
      throw new AuthenticationError(message, status, data);
    } else if (status === 422) {
      throw new ValidationError(message, status, data);
    } else if (status === 429) {
      throw new RateLimitError(message, status, data);
    } else {
      throw new APIError(message, status, data);
    }
  }
}
