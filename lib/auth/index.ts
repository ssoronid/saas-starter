// Auth contract — app code always imports from here, never from session.ts directly.
// Swap this file (via an auth-* extension) to change providers without touching the app.
export {
  hashPassword,
  comparePasswords,
  getSession,
  setSession,
  signToken,
  verifyToken,
} from './session';

export { validatedAction, validatedActionWithUser, withTeam } from './middleware';
export type { ActionState } from './middleware';
