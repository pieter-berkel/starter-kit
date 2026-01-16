import { adminClient, apiKeyClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { ac, organizationRoles, systemRoles } from "./permissions";

export const authClient = createAuthClient({
  plugins: [
    adminClient({
      ac,
      roles: systemRoles,
    }),
    organizationClient({
      ac,
      roles: organizationRoles,
    }),
    apiKeyClient(),
  ],
});
