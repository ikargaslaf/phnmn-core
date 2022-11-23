export class ValidationError extends Error {
  code?: string;
  statusCode?: number;
}
