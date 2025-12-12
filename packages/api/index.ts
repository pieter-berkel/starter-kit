import type { InferRouterInputs, InferRouterOutputs } from "@orpc/server";
import type { router } from "./router";

export { router } from "./router";

type RouterInputs = InferRouterInputs<typeof router>;
type RouterOutputs = InferRouterOutputs<typeof router>;

export type { RouterInputs, RouterOutputs };
