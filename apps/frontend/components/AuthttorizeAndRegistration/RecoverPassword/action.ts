'use server'

import { TActionResult } from '@/components/Account/actionGetPersonalData'
import PasswordRecovery from '@/emails/PasswordRecover'
import { createSDKConnection } from '@/shared/lib/config/sdk'
import { createSMTPClient } from '@/utils/createSMTPClient'
import { render } from '@react-email/render'
import { functional } from 'sdk'

const connection = createSDKConnection({})

export async function requestRecoveryToken(email: string): Promise<TActionResult<null>> {
  const result = await functional.api.v1.auth.recover.requestPasswordRecovery(connection, {email}).catch((e)=>`${e.message}`);

  if(typeof result ==='string'){
    return {
      success: false as const,
      error: result
    }
  }

  const transport = await createSMTPClient().catch(()=>null);

  if(!transport){
    return {
      success: false as const,
      error: 'Почтовый сервис не доступен'
    }
  }

  const mailResult = await transport.sendMail({
    from: 'info@icecreammusic.net',
    to: email,
    subject: 'Восстановление пароля к учетной записи',
    html: await render(PasswordRecovery({link: `${process.env.NEXT_PUBLIC_DOMAIN}/auth/reset/${encodeURI(result.emailToken)}`}))
  }).catch(()=>null)

  if(!mailResult){
    return {
      success: false as const,
      error: 'Не удалось отправить письмо'
    }
  }

  return {
    success: true as const,
    data: null
  }
}