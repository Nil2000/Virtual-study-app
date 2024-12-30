/**
 * List of public routes.
 * @type {string[]}
 */
export const publicRoutes: string[] = [
  "/auth/verify-email",
  "/video",
  "/video-session/abc-123-def",
];

/**
 * List of authenticated routes.
 * These routes will redirect to the settings page if the user is not authenticated.
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/signin",
  "/auth/signup",
  "/auth/error",
  "/auth/reset",
  "/auth/reset-password",
];

/**
 * Prefix for all authentication routes.
 * @type {string}
 */
export const authPrefix = "/api/auth";

/**
 * The default redirect route.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/home";
