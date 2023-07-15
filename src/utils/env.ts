import { z } from "zod";

export const envSchema = z.object({
  VITE_API_URL: z.string().url(),
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
export const env = envSchema.parse(import.meta.env);
