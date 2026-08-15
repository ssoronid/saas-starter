'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleIcon, Loader2 } from 'lucide-react';
import { signIn, signUp } from './actions';
import { ActionState } from '@/lib/auth/middleware';

export function Login({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const priceId = searchParams.get('priceId');
  const inviteId = searchParams.get('inviteId');
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    mode === 'signin' ? signIn : signUp,
    { error: '' }
  );

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-muted/50 p-6 md:p-10">
      <div className="w-full max-w-4xl">
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form action={formAction} className="p-6 md:p-8">
              <input type="hidden" name="redirect" value={redirect || ''} />
              <input type="hidden" name="priceId" value={priceId || ''} />
              <input type="hidden" name="inviteId" value={inviteId || ''} />
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">
                    {mode === 'signin'
                      ? 'Sign in to your account'
                      : 'Create your account'}
                  </h1>
                  <p className="text-muted-foreground text-balance">
                    {mode === 'signin'
                      ? 'Enter your email below to sign in'
                      : 'Enter your email below to get started'}
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    defaultValue={state.email}
                    required
                    maxLength={50}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={
                      mode === 'signin' ? 'current-password' : 'new-password'
                    }
                    defaultValue={state.password}
                    required
                    minLength={8}
                    maxLength={100}
                  />
                </div>
                {state?.error && (
                  <p className="text-destructive text-sm">{state.error}</p>
                )}
                <Button type="submit" className="w-full" disabled={pending}>
                  {pending ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Loading...
                    </>
                  ) : mode === 'signin' ? (
                    'Sign in'
                  ) : (
                    'Sign up'
                  )}
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  {mode === 'signin'
                    ? 'New to our platform? '
                    : 'Already have an account? '}
                  <Link
                    href={`${mode === 'signin' ? '/sign-up' : '/sign-in'}${
                      redirect ? `?redirect=${redirect}` : ''
                    }${priceId ? `&priceId=${priceId}` : ''}`}
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    {mode === 'signin'
                      ? 'Create an account'
                      : 'Sign in to existing account'}
                  </Link>
                </div>
              </div>
            </form>
            <div className="relative hidden md:flex items-center justify-center bg-muted bg-gradient-to-br from-primary/20 via-muted to-muted">
              <CircleIcon className="h-32 w-32 text-primary/40" />
            </div>
          </CardContent>
        </Card>
        <div className="mt-4 text-center text-xs text-muted-foreground text-balance">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
}
