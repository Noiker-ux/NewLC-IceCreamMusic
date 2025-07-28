import { use } from 'react';
import { actionGetPersonalData, TActionResult } from './actionGetPersonalData';
import ChangePassword from './ChangePassword/ChangePassword';
import DeleteAccount from './DeleteAccount/DeleteAccount';
import PersonalDataProps from './PersonalData/PersonalData';
import SocialData from './SocialData/SocialData';
import { TGetMeResponse } from 'sdk/lib/user/user.controller';

export default function Account() {
	const AccountData = use(actionGetPersonalData());

	return (
		<>
			{AccountData.data && (
				<>
					<PersonalDataProps PersonalDataProps={AccountData.data} />
					<SocialData />
					<ChangePassword />
					<DeleteAccount />
				</>
			)}
		</>
	);
}
