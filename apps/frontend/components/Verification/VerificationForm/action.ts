'use server';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { functional } from 'sdk';
import { TVerification } from 'sdk/lib/verification/verification.controller';

const connection = createSDKConnection({});

export async function action(data: TVerification) {
	functional.v1.verification.registerVerifiactionTicket(connection, {
		data: {
			...data,
			birthDate: new Date(data.birthDate).toISOString(),
			getDate: new Date(data.getDate).toISOString(),
		},
	});
}
