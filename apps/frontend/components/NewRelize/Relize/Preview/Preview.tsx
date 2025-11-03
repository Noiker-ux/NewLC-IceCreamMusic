import { FileUpload } from '@/components/Files/FileUpload/FileUpload';

export type TPreview = {
	preview?: string;
};

export default function Preview({ preview }: TPreview) {
	return (
		<div className=' bg-zinc-900 p-5 rounded-xl'>
			<p className='relative z-10 mb-1 font-extrabold text-lg'>
				Обложка проекта
			</p>
			<FileUpload name='preview' showImage={preview} />
		</div>
	);
}
