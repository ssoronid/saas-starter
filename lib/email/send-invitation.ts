import 'server-only';

import { Resend } from 'resend';

export type SendInvitationResult =
  | { ok: true }
  | { ok: false; reason: 'missing_api_key' | 'send_failed'; message?: string };

export async function sendTeamInvitationEmail(params: {
  to: string;
  teamName: string;
  role: string;
  inviteId: number;
}): Promise<SendInvitationResult> {
  // The Vercel Resend integration injects RESEND_API_KEY; a store-flow attach
  // may prefix it. Email stays optional — absent key means invitations are
  // saved but not sent.
  const apiKey = process.env.RESEND_API_KEY ?? process.env.STORAGE_RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, reason: 'missing_api_key' };
  }

  const baseUrl = (process.env.BASE_URL ?? 'http://localhost:3000').replace(
    /\/$/,
    ''
  );
  const signupUrl = `${baseUrl}/sign-up?inviteId=${params.inviteId}`;
  const from =
    process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: `You're invited to join ${params.teamName}`,
    html: `<p>You've been invited to join <strong>${escapeHtml(
      params.teamName
    )}</strong> as a <strong>${escapeHtml(params.role)}</strong>.</p>
<p><a href="${signupUrl}">Create your account to accept the invitation</a></p>
<p>If the link does not work, copy and paste this URL into your browser:<br>${escapeHtml(
      signupUrl
    )}</p>`
  });

  if (error) {
    console.error('[sendTeamInvitationEmail]', error);
    return {
      ok: false,
      reason: 'send_failed',
      message: error.message
    };
  }

  return { ok: true };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
