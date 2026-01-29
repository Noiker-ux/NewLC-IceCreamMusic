'use server';

import { createSDKConnection } from '@/shared/lib/config/sdk';
import { functional } from 'sdk';
import { TGetNewsByIdResponse } from 'sdk/lib/news/news.controller';

const connection = createSDKConnection({});

export async function action(id: string) {
	await functional.v1.news.deleteNews(connection, id);
}
