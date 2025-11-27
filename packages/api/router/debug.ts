import z from "zod";
import { procedure } from "../lib/orpc";

export const debugRouter = {
  one: procedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .handler(({ input }) => {
      return `Hello, ${input.name}!`;
    }),
};
