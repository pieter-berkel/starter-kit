"use client";

import type { Auth } from "@workspace/auth";
import { authClient } from "@workspace/auth/client";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";
import { UAParser } from "ua-parser-js";

export const SessionsCard = ({
  sessions,
  activeSessionId,
}: {
  sessions: Auth["$Infer"]["Session"]["session"][];
  activeSessionId: string;
}) => {
  const router = useRouter();

  const revokeSession = useCallback(
    async (token: string) => {
      await authClient.revokeSession(
        {
          token,
        },
        {
          onError: ({ error }) => {
            toast.error(error.message || "Something went wrong");
          },
          onSuccess: () => {
            toast.success("Session revoked");
            router.refresh();
          },
        }
      );
    },
    [router]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active sessions</CardTitle>
        <CardDescription>Manage your active sessions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>OS</TableHead>
              <TableHead>Last active</TableHead>
              <TableHead>IP address</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>
                  {session.userAgent ? UAParser(session.userAgent).os.name : "Unknown"}
                </TableCell>
                <TableCell>
                  {session.id === activeSessionId
                    ? "Now"
                    : new Intl.DateTimeFormat("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(session.updatedAt)}
                </TableCell>
                <TableCell>{session.ipAddress}</TableCell>
                <TableCell className="text-right">
                  <Button
                    disabled={session.id === activeSessionId}
                    onClick={() => revokeSession(session.token)}
                    size="sm"
                    variant="outline"
                  >
                    Revoke
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
