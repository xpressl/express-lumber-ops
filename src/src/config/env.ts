/** Server-side environment variable access with runtime validation */
export function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/** Non-throwing env access for optional variables */
export function getOptionalEnv(key: string): string | undefined {
  return process.env[key] || undefined;
}

export const env = {
  DATABASE_URL: () => getEnvVar("DATABASE_URL"),
  REDIS_URL: () => getEnvVar("REDIS_URL", "redis://localhost:6379"),
  NEXTAUTH_URL: () => getEnvVar("NEXTAUTH_URL", "http://localhost:3000"),
  NEXTAUTH_SECRET: () => getEnvVar("NEXTAUTH_SECRET"),
  APP_URL: () => getEnvVar("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  S3_ENDPOINT: () => getOptionalEnv("S3_ENDPOINT"),
  S3_ACCESS_KEY: () => getOptionalEnv("S3_ACCESS_KEY"),
  S3_SECRET_KEY: () => getOptionalEnv("S3_SECRET_KEY"),
  S3_BUCKET: () => getEnvVar("S3_BUCKET", "express-lumber-ops"),
  TWILIO_ACCOUNT_SID: () => getOptionalEnv("TWILIO_ACCOUNT_SID"),
  TWILIO_AUTH_TOKEN: () => getOptionalEnv("TWILIO_AUTH_TOKEN"),
  TWILIO_PHONE_NUMBER: () => getOptionalEnv("TWILIO_PHONE_NUMBER"),
  RESEND_API_KEY: () => getOptionalEnv("RESEND_API_KEY"),
  RESEND_FROM_EMAIL: () => getEnvVar("RESEND_FROM_EMAIL", "ops@expresslumber.com"),
  ANTHROPIC_API_KEY: () => getOptionalEnv("ANTHROPIC_API_KEY"),
} as const;
