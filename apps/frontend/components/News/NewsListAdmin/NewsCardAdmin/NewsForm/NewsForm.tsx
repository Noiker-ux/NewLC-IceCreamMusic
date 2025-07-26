'use client';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@heroui/button';
import { Input, Textarea } from '@heroui/input';
import { Tooltip } from '@heroui/tooltip';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TGetNewsByIdResponse } from 'sdk/lib/news/news.controller';
import { action } from './action';

export default function NewsForm() {
	const methods = useForm<TGetNewsByIdResponse>({});

	const onSubmit: SubmitHandler<TGetNewsByIdResponse> = (data) => {
		action(data);
	};

	return (
		<form
			className='max-w-7xl flex flex-col gap-3  bg-zinc-900 rounded-xl'
			onSubmit={methods.handleSubmit(onSubmit)}>
			<input type='file' {...methods.register('data.preview')} />
			<Input
				placeholder='Введите название новости'
				label={'Название новости'}
				labelPlacement={'outside'}
				size={'md'}
				type='text'
				{...methods.register('data.title')}
			/>
			<Textarea
				placeholder='Введите основной текст новости'
				isClearable
				label={
					<div className='flex items-center relative gap-1 right-0 z-50'>
						<p className='text-md'>Текст новости</p>
						<Tooltip
							size='md'
							content={
								<div className='max-w-xs p-3'>
									<p>
										Внимание! Для оформления основного текста новости следует
										использовать Markdown разметку.
									</p>
									<br />
									<Link href='/' className='underline pt-5 text-indigo-400'>
										Документация Markdown
									</Link>
								</div>
							}>
							<InformationCircleIcon
								width={18}
								className='hover:text-indigo-400'
							/>
						</Tooltip>
					</div>
				}
				labelPlacement={'outside'}
				{...methods.register('data.content')}
			/>
			<div className='flex justify-center'>
				<Button className='bg-indigo-700' type='submit'>
					Сохранить
				</Button>
			</div>
		</form>
	);
}
