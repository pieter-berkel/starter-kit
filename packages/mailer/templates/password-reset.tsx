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

type PasswordResetEmailProps = {
  link: string;
  name: string;
};

const PasswordResetEmail = ({ link, name }: PasswordResetEmailProps) => {
  const baseURL = getBaseURL();

  return (
    <Html lang="en">
      <Head>
        <title>Reset your password</title>
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
              We received a request to reset your password for your Starter Kit account. Please
              click the button below to reset your password.
            </Text>
            <Button
              className="inline-flex h-8 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 font-semibold text-sm text-white shadow-xs"
              href={link}
            >
              Reset Password
            </Button>

            <Text className="my-6 text-base">
              If you did not request a password reset, please ignore this email. Your password will
              remain unchanged.
            </Text>
            <Text className="my-6 text-base">
              This link will expire in 1 hour for security reasons.
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

PasswordResetEmail.PreviewProps = {
  link: `${getBaseURL()}/reset-password`,
  name: "John Doe",
} satisfies PasswordResetEmailProps;

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

export default PasswordResetEmail;
