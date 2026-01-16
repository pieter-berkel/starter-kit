import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultRoles as systemDefaultRoles,
  defaultStatements as systemDefaultStatements,
} from "better-auth/plugins/admin/access";
import {
  defaultRoles as organizationDefaultRoles,
  defaultStatements as organizationDefaultStatements,
} from "better-auth/plugins/organization/access";

export const statement = {
  ...systemDefaultStatements,
  ...organizationDefaultStatements,
  project: ["create", "share", "update", "delete"],
} as const;

export type Statement = typeof statement;

export const ac = createAccessControl(statement);

export const systemRoles = {
  user: ac.newRole({
    ...systemDefaultRoles.user.statements,
    project: ["create"],
  }),
  admin: ac.newRole({
    ...systemDefaultRoles.admin.statements,
    project: ["create", "update"],
  }),
};

export const organizationRoles = {
  member: ac.newRole({
    ...organizationDefaultRoles.member.statements,
    project: ["create"],
  }),
  admin: ac.newRole({
    ...organizationDefaultRoles.admin.statements,
    project: ["create", "update"],
  }),
  owner: ac.newRole({
    ...organizationDefaultRoles.owner.statements,
    project: ["create", "update", "delete"],
  }),
};
