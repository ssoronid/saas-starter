'use client';

import { useActionState as useReactActionState } from 'react';
import { ActionState } from '@/lib/auth';

type ServerAction = (
  state: ActionState,
  formData: FormData
) => Promise<ActionState>;

export function useFormAction(action: ServerAction) {
  const [state, dispatch, isPending] = useReactActionState<ActionState, FormData>(
    action,
    {}
  );

  return { state, dispatch, isPending };
}
