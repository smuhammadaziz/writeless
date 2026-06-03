import type { ApiResponse } from "@writeless/types";

export type { ApiResponse };

export interface HealthPayload {
  status: string;
  timestamp: Date;
}
