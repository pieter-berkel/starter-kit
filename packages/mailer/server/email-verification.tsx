import EmailVerificationEmail, {
	type EmailVerificationEmailProps,
} from "../templates/email-verification";
import { send } from "../lib/send";

export const sendEmailVerificationEmail = async ({
	to,
	...args
}: EmailVerificationEmailProps & { to: string }) => {
	const hostname = "pieterberkel.nl";

	await send({
		to,
		from: `noreply@${hostname}`,
		subject: "Verify your email address",
		react: <EmailVerificationEmail {...args} />,
	});
};
