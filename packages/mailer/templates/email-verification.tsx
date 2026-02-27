import {
	Body,
	Button,
	Container,
	Font,
	Head,
	Html,
	Img,
	pixelBasedPreset,
	Tailwind,
	Text,
} from "@react-email/components";
import { send } from "..";
import { getBaseURL } from "../lib/utils";

type EmailVerificationEmailProps = {
	link: string;
	name: string;
};

const EmailVerificationEmail = ({
	link,
	name,
}: EmailVerificationEmailProps) => {
	const baseURL = getBaseURL();

	return (
		<Html lang="en">
			<Head>
				<title>Verify your email address</title>
				<Font
					fallbackFontFamily="sans-serif"
					fontFamily="Inter"
					fontStyle="normal"
					fontWeight="100 900"
					webFont={{
						url: "https://fonts.gstatic.com/s/inter/v20/UcCo3FwrK3iLTcviYwYZ8UA3.woff2",
						format: "woff2",
					}}
				/>
			</Head>
			<Tailwind
				config={{
					presets: [pixelBasedPreset],
					theme: { extend: { colors: { primary: "#7F22FF" } } },
				}}
			>
				<Body className="bg-gray-100 py-2.5">
					<Container className="max-w-[600px] bg-white p-12">
						<Img
							alt="Starter Kit Logo"
							className="h-auto w-10"
							height={34}
							src={`${baseURL}/starter-kit-logo.svg`}
							width={40}
						/>
						<Text className="my-6 text-base">Hello {name},</Text>
						<Text className="my-6 text-base">
							Thank you for signing up for Starter Kit. Please click the button
							below to verify your email address.
						</Text>
						<Button
							className="inline-flex h-8 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 font-semibold text-sm text-white shadow-xs"
							href={link}
						>
							Verify Email
						</Button>

						<Text className="my-6 text-base">
							If you did not sign up for Starter Kit, please ignore this email.
						</Text>
						<Text className="my-6 text-base">
							Best regards,
							<br />
							The Starter Kit Team
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

EmailVerificationEmail.PreviewProps = {
	link: `${getBaseURL()}/verify-email`,
	name: "John Doe",
} satisfies EmailVerificationEmailProps;

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

export default EmailVerificationEmail;
