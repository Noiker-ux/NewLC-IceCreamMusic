'use client';
import { allCounty, sngAreasArray, TCountry } from '@/data/allCounty';
import { CheckboxGroup } from '@heroui/checkbox';
import { Input } from '@heroui/input';
import { Radio, RadioGroup } from '@heroui/radio';
import Image from 'next/image';
import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useFormContext } from 'react-hook-form';
import { VirtuosoGrid } from 'react-virtuoso';
import { TReleaseInsertForm } from 'shared/schema/release.schema';
import { gridComponents } from '@/utils/VirtuosoGrid';
import clsx from 'clsx';
import { IoMdClose } from 'react-icons/io';

const allAreasArray = allCounty.map((area) => {
	return area.countryEn;
});

export default function Countyes() {
	const [searchCountry, setSearchCountry] = useState<TCountry[]>(allCounty);
	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchCountry(() => {
			return allCounty.filter((country) =>
				country.countryRu.toLowerCase().includes(e.target.value.toLowerCase()),
			);
		});
	};

	const { watch, setValue, getValues } = useFormContext<TReleaseInsertForm>();
	const areas = watch('area');

	const [areaRadioValue, setAreaRadioValue] = useState<string>(() => {
		if (areas.negate) return 'allExcept';
		if (areas.data.includes('sng')) return 'sng';
		if (areas.data.includes('all')) return 'allCountry';
		return 'certain';
	});

	const handleRadioCheck = (value: string) => {
		if (value == 'allCountry') {
			setValue('area', { negate: false, data: ['all'] });
		}
		if (value == 'sng') {
			setValue('area', { negate: false, data: ['sng'] });
		}
		if (value == 'certain') {
			setValue('area', { negate: false, data: [] });
		}
		if (value == 'allExcept') {
			setValue('area', { negate: true, data: [] });
		}
	};

	return (
		<div className='bg-zinc-900 rounded-xl p-5 w-full'>
			<div className='flex gap-5 items-center'>
				<p className='font-extrabold whitespace-nowrap'>
					Страны распространения
				</p>
				<Input
					size='sm'
					variant='underlined'
					name='search'
					startContent={<MagnifyingGlassIcon className='h-4 w-4' />}
					endContent={
						<div className='text-tiny text-foreground-400'>
							{areas.data.includes('all')
								? allCounty.length
								: areas.data.includes('sng')
									? 9
									: areas.data.length}
							/{allCounty.length}
						</div>
					}
					onChange={handleSearch}
					className='pt-3  w-full'
					labelPlacement={'outside'}
					placeholder='Поиск'
					type='text'
					radius='sm'
				/>
			</div>
			<div className='grid grid-cols-5 gap-5'>
				<RadioGroup
					className='w-full mt-2'
					orientation='vertical'
					color='default'
					name='distributionCountryes'
					onChange={(e) => {
						handleRadioCheck(e.target.value);
						setAreaRadioValue(e.target.value);
					}}
					value={areaRadioValue}>
					<Radio value='allCountry'>Во всех странах</Radio>
					<Radio value='certain'>Только в определенных</Radio>
					<Radio value='allExcept'>Во всех кроме</Radio>
					<Radio value='sng'>В СНГ</Radio>
				</RadioGroup>

				<div className='col-span-4 py-3'>
					<div className='scrollbar overflow-hidden scrollbar-thumb-sky-700 scrollbar-track-sky-300 h-40 '>
						<CheckboxGroup
							value={
								areas.data.includes('all')
									? allAreasArray
									: areas.data.includes('sng')
										? sngAreasArray
										: areas.data
							}
							onChange={(value) => {
								setValue('area', { negate: areas.negate, data: value });
							}}>
							<div className='h-40'>
								<VirtuosoGrid
									style={{ height: '100%', width: '100%' }}
									totalCount={searchCountry.length}
									components={gridComponents}
									itemContent={(index) => (
										<div
											className={clsx(
												'flex justify-between flex-1 whitespace-nowrap h-10 items-center gap-3 p-3 cursor-pointer rounded-md hover:bg-zinc-700',
												(getValues('area.data').includes(
													searchCountry[index].countryEn,
												) ||
													getValues('area.data').includes('all') ||
													(getValues('area.data').includes('sng') &&
														sngAreasArray.includes(
															searchCountry[index].countryEn,
														))) &&
													'bg-zinc-800 ',
											)}
											onClick={() => {
												if (
													!getValues('area.data').includes('all') &&
													!getValues('area.data').includes('sng') &&
													!getValues('area.data').includes(
														searchCountry[index].countryEn,
													)
												) {
													setValue('area.data', [
														...getValues('area.data'),
														searchCountry[index].countryEn,
													]);
												}
											}}>
											<div className='flex gap-3'>
												<Image
													src={searchCountry[index].flag}
													width='20'
													height='18'
													className='w-7 h-4'
													alt={searchCountry[index].countryRu}
												/>
												<p className='text-xs'>
													{searchCountry[index].countryRu}
												</p>
											</div>
											{getValues('area.data').includes(
												searchCountry[index].countryEn,
											) && (
												<p
													onClick={(e) => {
														e.stopPropagation();
														setValue(
															'area.data',
															getValues('area.data').filter((c) => {
																return c != searchCountry[index].countryEn;
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
