import type { HealthPayload } from "../../types";

export function getHealthStatus(): HealthPayload {
  return {
    status: "All good",
    timestamp: new Date(),
  };
}
