import { TReleaseUpsert } from 'shared/schema/release.schema';
import { Checkbox } from '@heroui/checkbox';
import { useFormContext } from 'react-hook-form';
export default function AdditionalParams() {
	const { register } = useFormContext<TReleaseUpsert>();

	return (
		<div className='bg-zinc-900 rounded-xl p-5 w-full'>
			<p className='mb-1 font-extrabold text-lg'>Дополнительные настройки</p>
			<Checkbox
				className='mt-1'
				color='default'
				{...register('earlyStartInRussia')}>
				Ранний старт в России
			</Checkbox>
			<p className='mt-1 max-w-lg text-sm text-foreground-400'>
				Релиз откроется в России на день раньше всех остальных стран. Это
				позволит избежать раннего открытия релиза на других территориях из-за
				разницы в часовых поясах.
			</p>
			<Checkbox
				className='mt-1'
				color='default'
				{...register('realTimeDelivery')}>
				Доставка в реальном времени
			</Checkbox>
			<p className='mt-1 max-w-lg text-sm text-foreground-400'>
				Релиз будет доставлен на площадки сразу после прохождения модерации.
			</p>
		</div>
	);
}
