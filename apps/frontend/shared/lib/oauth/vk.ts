import z from 'zod';

// Взято из документации OAuth VKID

export const tokensSchema = z.object({
	refresh_token: z.string(),
	access_token: z.string(),
	id_token: z.string(),
	token_type: z.string(),
	expires_in: z.number(),
	user_id: z.number(),
	state: z.string(),
	scope: z.string(),
});

export const accountSchema = z.object({
	user: z.object({
		user_id: z.string(),
		first_name: z.string(),
		last_name: z.string(),
		avatar: z.string(),
		email: z.string(),
		sex: z.number(),
		verified: z.boolean(),
		birthday: z.string(),
		phone: z.string().optional(),
	}),
});
