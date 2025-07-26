import NewRelizeForm from '@/components/NewRelize/NewRelizeForm';

export default function NewRelizePage() {
	return (
		<div className='max-w-7xl'>
			<p className='text-3xl font-extrabold mb-5'>Новый релиз</p>
			<NewRelizeForm />
		</div>
	);
}
