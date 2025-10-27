'use client';
import { CheckboxGroup } from '@heroui/checkbox';
import { Input } from '@heroui/input';
import { Radio, RadioGroup } from '@heroui/radio';
import Image from 'next/image';
import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { allPlatforms, TPlatfrom } from '@/data/allPlatforms';
import { VirtuosoGrid } from 'react-virtuoso';
import { gridComponents } from '@/utils/VirtuosoGrid';
import { TReleaseUpsert } from 'shared/schema/release.schema';
import { useFormContext } from 'react-hook-form';
import { IoMdClose } from 'react-icons/io';
import clsx from 'clsx';

const allPlatformsArray = allPlatforms.map((platform) => {
	return platform.name;
});

export default function Platforms() {
	const [searchPlatforms, setSearchPlatforms] =
		useState<TPlatfrom[]>(allPlatforms);
	const handleSearchPlatform = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchPlatforms(() => {
			return allPlatforms.filter((platform) => {
				return platform.name
					.toLowerCase()
					.includes(e.target.value.toLowerCase());
			});
		});
	};

	const { watch, setValue, getValues } = useFormContext<TReleaseUpsert>();
	const platformsWatch = watch('platforms');

	return (
		<div className='bg-zinc-900 p-5 rounded-xl w-full'>
			<div className='grid grid-cols-5 items-center'>
				<p className='font-extrabold whitespace-nowrap'>Площадки</p>
				<Input
					size='sm'
					variant='underlined'
					name='searchPlatforms'
					startContent={<MagnifyingGlassIcon className='h-4 w-4' />}
					endContent={
						<div className='text-tiny text-foreground-400'>
							21/{allPlatforms.length}
						</div>
					}
					className='pt-3 col-span-4  w-full'
					labelPlacement={'outside'}
					onChange={handleSearchPlatform}
					placeholder='Поиск'
					type='text'
					radius='sm'
				/>
			</div>
			<div className='grid grid-cols-5 gap-5'>
				<RadioGroup
					className='col-span-1 mt-2'
					orientation='vertical'
					name='distributionPlatforms'
					color='default'
					onChange={(e) => {
						setValue(
							'platforms',
							e.target.value === 'allPlatforms' ? ['all'] : [],
						);
					}}
					value={platformsWatch?.includes('all') ? 'allPlatforms' : 'some'}
					defaultValue='allPlatforms'>
					<Radio value='allPlatforms'>На всех площадках</Radio>
					<Radio value='some'>Только на некоторых</Radio>
				</RadioGroup>
				<div className='col-span-4 py-3'>
					<div className='scrollbar overflow-hidden scrollbar-thumb-sky-700 scrollbar-track-sky-300 h-40 '>
						<CheckboxGroup
							value={
								platformsWatch?.includes('all')
									? allPlatformsArray
									: platformsWatch
							}
							onValueChange={(e) => {
								setValue('platforms', e);
							}}>
							<div className='h-40'>
								<VirtuosoGrid
									style={{ height: '100%', width: '100%' }}
									totalCount={searchPlatforms.length}
									components={gridComponents}
									itemContent={(index) => (
										<div
											className={clsx(
												'flex justify-between flex-1 whitespace-nowrap h-10 items-center gap-3 p-3 cursor-pointer rounded-md hover:bg-zinc-700',
												getValues('platforms')?.includes('all') &&
													'bg-zinc-800 ',
												getValues('platforms')?.includes(
													searchPlatforms[index].name,
												) && 'bg-zinc-800 ',
											)}
											onClick={() => {
												if (
													!getValues('platforms')?.includes('all') &&
													!getValues('platforms')?.includes(
														searchPlatforms[index].name,
													)
												) {
													setValue('platforms', [
														...(getValues('platforms') ?? []),
														searchPlatforms[index].name,
													]);
												}
											}}>
											<div className='flex gap-3 '>
												<Image
													src={searchPlatforms[index].icon}
													width='25'
													height='25'
													className='w-5 h-5'
													alt={searchPlatforms[index].name}
												/>
												<p className='text-xs'>{searchPlatforms[index].name}</p>
											</div>
											{platformsWatch?.includes(
												searchPlatforms[index].name,
											) && (
												<p
													onClick={(e) => {
														e.stopPropagation();
														setValue(
															'platforms',
															getValues('platforms')?.filter((p) => {
																return p != searchPlatforms[index].name;
															}),
														);
													}}>
													<IoMdClose />
												</p>
											)}
										</div>
									)}
								/>
							</div>
						</CheckboxGroup>
					</div>
				</div>
			</div>
		</div>
	);
}
