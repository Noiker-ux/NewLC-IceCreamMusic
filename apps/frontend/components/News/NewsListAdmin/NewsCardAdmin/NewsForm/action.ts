'use server';

import { createSDKConnection } from '@/shared/lib/config/sdk';
import { functional } from 'sdk';
import { TGetNewsByIdResponse } from 'sdk/lib/news/news.controller';

const connection = createSDKConnection({
    
});

export async function action(ark: TGetNewsByIdResponse) {
	console.log({
		title: ark.data.title,
		content: ark.data.content,
		preview: ark.data.preview?.length
			? ark.data.preview[0].type.split('/')[1]
			: ' ',
	});
	// await functional.v1.news.createNews(connection, {
	// 	data: {
	// 		title: ark.data.title,
	// 		content: ark.data.content,
	// 		preview: ark.data.preview?.length
	// 			? ark.data.preview[0].type.split('/')[1]
	// 			: 'png',
	// 	},
	// });
}
