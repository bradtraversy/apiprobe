export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export interface ApiRequest {
  id: string;
  name: string;
  method: HttpMethod;
  url: string;
  headers: Record<string, string>;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  duration: number;
  size: number;
}

export interface RequestHistory {
  id: string;
  request: ApiRequest;
  response: ApiResponse;
  timestamp: Date;
}

export interface Environment {
  id: string;
  name: string;
  variables: Record<string, string>;
} 