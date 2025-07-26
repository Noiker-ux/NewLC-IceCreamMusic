'use server';
import { TSignUpClientSchema } from '@/schema/signup.schema';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { functional } from 'sdk';

const connection = createSDKConnection({});

export async function actionRegister(data: TSignUpClientSchema) {
	functional.v1.auth.signup.credentialsSignUp(connection, {
		name: data.name,
		email: data.email,
		password: data.password,
	});
}
