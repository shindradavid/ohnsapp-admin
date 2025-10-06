export class APIError extends Error {
  status: number | null;
  details: any;

  constructor(message: string, status: number | null = null, details: any = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.details = details;
  }
}
