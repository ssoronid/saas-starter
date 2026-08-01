'use server';

import { withTeam } from '@/lib/auth';

// This build ships without a payments provider. The actions stay exported so
// existing forms keep compiling, and they no-op instead of failing at runtime.

export const checkoutAction = withTeam(async () => {
  console.warn('checkoutAction called, but this project has no payments provider.');
});

export const customerPortalAction = withTeam(async () => {
  console.warn('customerPortalAction called, but this project has no payments provider.');
});
