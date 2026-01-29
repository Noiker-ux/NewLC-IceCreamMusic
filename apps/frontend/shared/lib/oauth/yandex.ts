import z from 'zod';

// Вщято из документации OAuth yandex

export const tokensSchema = z.object({
	refresh_token: z.string(),
	access_token: z.string(),
	token_type: z.string(),
	expires_in: z.number(),
	scope: z.string().optional(),
});

export const accountSchema = z.object({
	id: z.string(),
	first_name: z.string(),
	last_name: z.string(),
	display_name: z.string(),
	default_email: z.string(),
	sex: z.string(),
	birthday: z.string(),
	default_avatar_id: z.string(),
	is_avatar_empty: z.boolean(),
	default_phone: z
		.object({
			id: z.number(),
			number: z.string(),
		})
		.optional(),
});
