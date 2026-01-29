import ChangePassword from '@/components/Account/ChangePassword/ChangePassword';
import DeleteAccount from '@/components/Account/DeleteAccount/DeleteAccount';
import PersonalData from '@/components/Account/PersonalData/PersonalData';
import SocialData from '@/components/Account/SocialData/SocialData';

export default function ProfillePage() {
	return (
		<div className='divide-y divide-white/5'>
			<PersonalData />
			<SocialData />
			<ChangePassword />
			<DeleteAccount />
		</div>
	);
}
