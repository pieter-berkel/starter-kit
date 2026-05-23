import PasswordResetEmail, {
	type PasswordResetEmailProps,
} from "../templates/password-reset";
import { send } from "../lib/send";

export const sendPasswordResetEmail = async ({
	to,
	...args
}: PasswordResetEmailProps & { to: string }) => {
	const hostname = "pieterberkel.nl";

	await send({
		to,
		from: `noreply@${hostname}`,
		subject: "Reset your password",
		react: <PasswordResetEmail {...args} />,
	});
};
