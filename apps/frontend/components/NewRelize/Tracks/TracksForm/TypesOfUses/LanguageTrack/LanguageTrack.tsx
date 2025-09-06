import { isoLangs } from '@/data/allLanguage';
import { TReleaseInsertForm } from '@/schema/release.schema';
import { Select, SelectItem } from '@heroui/select';
import { Controller, useFormContext } from 'react-hook-form';

export default function LanguageTrack({ trackIndex }: { trackIndex: number }) {
	const { control } = useFormContext<TReleaseInsertForm>();
	return (
		<div>
			<p className='font-bold'>Язык трека</p>
			<p className='max-w-xl mt-1 text-sm text-foreground-400'>
				Укажите язык, на котором исполняется трек, если трек без вокальной
				партии в списке выберите «Без слов»
			</p>
			<Controller
				control={control}
				name={`tracks.${trackIndex}.language`}
				render={({ field: { ref, onChange, value } }) => (
					<Select
						label='Язык метаданных'
						labelPlacement={'outside'}
						placeholder='Выберите язык'
						isRequired
						className='w-1/2 pt-3'
						ref={ref}
						onChange={onChange}
						selectedKeys={[value]}>
						<>
							<SelectItem key={'Без слов'} textValue='Без слов'>
								Без слов
							</SelectItem>
							{isoLangs.map((language) => (
								<SelectItem
									className='capitalize'
									key={language.name}
									textValue={language.name}>
									{language.nativeName}
								</SelectItem>
							))}
						</>
					</Select>
				)}
			/>
		</div>
	);
}
