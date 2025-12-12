import { procedure } from "../lib/orpc";
import { pagesRouter } from "./pages";

export const router = procedure.router({
  pages: pagesRouter,
});
