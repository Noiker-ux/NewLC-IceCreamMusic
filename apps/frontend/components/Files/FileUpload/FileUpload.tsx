'use client';

import { cn } from '@/utils/cn';
import { IconUpload } from '@tabler/icons-react';
import clsx from 'clsx';
import { motion } from 'motion/react';
import Image from 'next/image';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { fileSchema } from '@/schema/shared.schema';
import { useFormContext } from 'react-hook-form';

const mainVariant = {
	initial: {
		x: 0,
		y: 0,
	},
	animate: {
		x: 20,
		y: -20,
		opacity: 0.9,
	},
};

const secondaryVariant = {
	initial: {
		opacity: 0,
	},
	animate: {
		opacity: 1,
	},
};

export const FileUpload = ({
	showImage,
	alternative,
	name,
}: {
	showImage?: boolean;
	alternative?: boolean;
	name: string;
}) => {
	const previewInputRef = useRef<HTMLInputElement>(null);

	const { formState, setValue, getValues } = useFormContext();

	const [file, setFile] = useState<File | undefined>(() => {
		const result = fileSchema.safeParse(getValues(name));
		if (!result.success) {
			return undefined;
		}
		return result.data;
	});

	const fileUrl = useMemo(() => {
		if (!file) return;
		return URL.createObjectURL(file);
	}, [file]);

	const handleFileChange = useCallback(
		(newFiles: File[]) => {
			const newFile = newFiles.at(0);
			setFile(newFile);
			setValue(name, newFiles.at(0));
		},
		[name, setValue],
	);

	const handleClick = () => {
		previewInputRef.current?.click();
	};

	const { getRootProps, isDragActive } = useDropzone({
		multiple: false,
		noClick: true,
		onDrop: handleFileChange,
		onDropRejected: (error) => {
			console.error(error);
		},
	});

	return (
		<div className='w-full' {...getRootProps()}>
			<motion.div
				whileHover='animate'
				className=' group/file block rounded-lg  w-full relative '>
				<>{formState.errors[name] && formState.errors[name]?.message}</>
				{showImage && fileUrl && (
					<Image
						src={fileUrl}
						alt={'Файл'}
						width={50}
						height={50}
						unoptimized={true}
						className='w-full aspect-square object-cover rounded-xl'
					/>
				)}
				<input
					id={`file-upload-handle-${name}`}
					type='file'
					className='hidden'
					ref={previewInputRef}
					onChange={(e) =>
						e.target.files && handleFileChange(Array.from(e.target.files))
					}
					name={name}
				/>
				<div className='flex flex-col items-center justify-center'>
					<div className={clsx('relative w-full   mx-auto')}>
						{/* Серая подложка */}
						{!fileUrl && !alternative && (
							<motion.div
								layoutId='file-upload'
								variants={mainVariant}
								transition={{
									type: 'spring',
									stiffness: 300,
									damping: 20,
								}}
								className={cn(
									'relative group-hover/file:shadow-2xl z-20 bg-white dark:bg-neutral-800 flex items-center justify-center  mt-4 w-full aspect-square  mx-auto rounded-lg',
									'shadow-[0px_10px_50px_rgba(0,0,0,0.1)]',
								)}>
								{isDragActive ? (
									<motion.p
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										className='text-neutral-600 flex flex-col items-center'>
										Drop it
										<IconUpload className='h-4 w-4 text-neutral-600 dark:text-neutral-400' />
									</motion.p>
								) : (
									<IconUpload className='h-4 w-4 text-neutral-600 dark:text-neutral-300' />
								)}
							</motion.div>
						)}
						{/* Область голубая */}
						{!fileUrl && !alternative && (
							<motion.div
								variants={secondaryVariant}
								onClick={handleClick}
								className={clsx(
									'absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center aspect-square  mt-4 w-full  mx-auto rounded-lg',
								)}></motion.div>
						)}

						{!alternative && (
							<>
								<p
									onClick={handleClick}
									className='cursor-pointer relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-sm mt-2 hover:underline'>
									Загрузить файл
								</p>
							</>
						)}
					</div>
				</div>
			</motion.div>
		</div>
	);
};
