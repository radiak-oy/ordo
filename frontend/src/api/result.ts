export type Result<T = void> =
  | { ok: true; value: T }
  | { ok: false; errorMessage: string };
