'use client';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Button } from '@heroui/button';
import RelizecCard from '../../RelizesCard';
import { TGetReleaseListResponse } from 'sdk/lib/release/release.controller';
import { Primitive } from 'sdk';
import actionPatchTicketStatus from './actionPatchTicketStatus';
import { Toaster, toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Tooltip } from '@heroui/tooltip';
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from '@heroui/modal';
import { Textarea } from '@heroui/input';
import { SubmitHandler, useForm } from 'react-hook-form';
import { handleChangeStatus } from './handleChangeStatus.func';
import ApprovedRelease from './ApprovedRelease';
import RejectedRelease from './RejectedRelease';

export default function RelizesItemAdmin({
	release,
}: {
	release: Primitive<TGetReleaseListResponse['data'][number]>;
}) {
	return (
		<>
			<div className='flex gap-3 bg-zinc-900 justify-end p-5 w-fit ml-auto -mb-2 rounded-t-xl'>
				<Toaster />
				<ApprovedRelease id={release.id} />
				<RejectedRelease id={release.id} />
			</div>
			<RelizecCard release={release} />
		</>
	);
}
