import type { InferRouterInputs, InferRouterOutputs } from "@orpc/server";
import type { router } from "./root";

export { router } from "./root";

type RouterInputs = InferRouterInputs<typeof router>;
type RouterOutputs = InferRouterOutputs<typeof router>;

export type { RouterInputs, RouterOutputs };
