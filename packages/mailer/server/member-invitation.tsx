import MemberInvitationEmail, {
	type MemberInvitationEmailProps,
} from "../templates/member-invitation";
import { send } from "../lib/send";

export const sendMemberInvitationEmail = async ({
	to,
	...args
}: MemberInvitationEmailProps & { to: string }) => {
	const hostname = "pieterberkel.nl";

	await send({
		to,
		from: `noreply@${hostname}`,
		subject: `You've been invited to join ${args.organizationName}`,
		react: <MemberInvitationEmail {...args} />,
	});
};
