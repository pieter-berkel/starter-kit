import { base } from "../lib/orpc";
import { pagesRouter } from "./pages";

export const router = base.router({
	pages: pagesRouter,
});
