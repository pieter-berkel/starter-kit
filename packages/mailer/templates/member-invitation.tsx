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

type MemberInvitationEmailProps = {
  organizationName: string;
  invitedByUsername: string;
  invitedByEmail: string;
  inviteLink: string;
};

const MemberInvitationEmail = ({
  organizationName,
  invitedByUsername,
  invitedByEmail,
  inviteLink,
}: MemberInvitationEmailProps) => {
  const baseURL = getBaseURL();

  return (
    <Html lang="en">
      <Head>
        <title>You've been invited to join {organizationName}</title>
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
            <Text className="my-6 text-base">Hello,</Text>
            <Text className="my-6 text-base">
              <strong>{invitedByUsername}</strong> ({invitedByEmail}) has invited you to join{" "}
              <strong>{organizationName}</strong> on Starter Kit.
            </Text>
            <Button
              className="inline-flex h-8 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 font-semibold text-sm text-white shadow-xs"
              href={inviteLink}
            >
              Accept Invitation
            </Button>

            <Text className="my-6 text-base">
              If you did not expect this invitation, you can safely ignore this email.
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

MemberInvitationEmail.PreviewProps = {
  organizationName: "Acme Inc.",
  invitedByUsername: "John Doe",
  invitedByEmail: "john.doe@example.com",
  inviteLink: `${getBaseURL()}/accept-invitation`,
} satisfies MemberInvitationEmailProps;

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

export default MemberInvitationEmail;
