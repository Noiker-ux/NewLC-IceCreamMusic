'use server'

import { TActionResult } from '@/components/Account/actionGetPersonalData';
import { createSDKConnection } from '@/shared/lib/config/sdk'
import { functional } from 'sdk'


const connection = createSDKConnection({});

export async function resetPassword(token: string, newPassword: string): Promise<TActionResult<null>> {
  const result = await functional.v1.auth.reset.resetPassword(connection, {token, password: newPassword}).catch((e)=>`${e.message}`)

  if (typeof result === 'string') {
    return {
      success: false as const,
      error: result,
    }
  }

  return {
    success: true as const,
    data: null,
  }
}