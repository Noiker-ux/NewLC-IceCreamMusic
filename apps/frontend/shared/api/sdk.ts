import type { AppRouter } from '@/shared/api/server';
import { createTRPCClient, httpBatchLink } from '@trpc/client';

export function createClient() {
	return (tags: string[]) =>
		createTRPCClient<AppRouter>({
			links: [
				httpBatchLink({
					url: process.env.API_URL!,
					fetch: async (input, init) =>
						fetch(input, { ...init, next: { revalidate: 5, tags } }),
				}),
			],
		});
}
