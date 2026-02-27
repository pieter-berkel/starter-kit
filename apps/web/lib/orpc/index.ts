import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import type { router } from "@workspace/api";

declare global {
	var $client: RouterClient<typeof router> | undefined;
}

const link = new RPCLink({
	url: () => {
		if (typeof window === "undefined") {
			throw new Error("RPCLink is not allowed on the server side.");
		}

		return `${process.env.NEXT_PUBLIC_APP_URL}/rpc`;
	},
	headers: async () => {
		if (typeof window !== "undefined") {
			return {};
		}

		const { headers } = await import("next/headers");
		return await headers();
	},
});

export const client: RouterClient<typeof router> =
	globalThis.$client ?? createORPCClient(link);
export const orpc = createTanstackQueryUtils(client);
