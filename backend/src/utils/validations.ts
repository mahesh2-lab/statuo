import { z } from "zod";
import { validateTargetUrl } from "./ssrf";

export const registerJobValidation = z.object({
  name: z.string().min(1, "Name is required").max(120, "Name cannot exceed 120 characters"),
  url: z
    .string()
    .url("Valid URL is required")
    .refine((url) => {
      const check = validateTargetUrl(url);
      return check.valid;
    }, {
      message: "Target URL failed security validation (SSRF restriction / invalid protocol)",
    }),
  description: z.string().max(500).optional().default(""),
  method: z
    .enum(["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"])
    .default("GET")
    .optional(),
  token: z.string().max(2000).optional(),
  interval: z.number().int().min(5, "Interval must be at least 5 seconds"),
  retryCount: z.number().int().nonnegative().max(10).optional().default(5),
  retryInterval: z
    .number()
    .int()
    .positive("Retry interval must be a positive number")
    .optional()
    .default(60),
  nextRetryAt: z.number().int().positive().optional().default(5),
  timeoutSeconds: z.number().int().min(1).max(120).optional().default(10),
  isActive: z.boolean().optional().default(true),
});

export type RegisterJobInput = z.infer<typeof registerJobValidation>;

export const updateJobValidation = registerJobValidation.partial();
export type UpdateJobInput = z.infer<typeof updateJobValidation>;
