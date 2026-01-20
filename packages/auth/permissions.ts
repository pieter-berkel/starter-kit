import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultRoles as systemDefaultRoles,
  defaultStatements as systemDefaultStatements,
} from "better-auth/plugins/admin/access";
import {
  defaultRoles as organizationDefaultRoles,
  defaultStatements as organizationDefaultStatements,
} from "better-auth/plugins/organization/access";

export const permissions = {
  ...systemDefaultStatements,
  ...organizationDefaultStatements,
  page: ["create", "update", "delete"],
} as const;

export type Permissions = typeof permissions;

export const ac = createAccessControl(permissions);

export const systemRoles = {
  user: ac.newRole({
    ...systemDefaultRoles.user.statements,
  }),
  admin: ac.newRole({
    ...systemDefaultRoles.admin.statements,
    page: ["create", "update", "delete"],
  }),
};

export const organizationRoles = {
  member: ac.newRole({
    ...organizationDefaultRoles.member.statements,
  }),
  admin: ac.newRole({
    ...organizationDefaultRoles.admin.statements,
  }),
  owner: ac.newRole({
    ...organizationDefaultRoles.owner.statements,
  }),
};
