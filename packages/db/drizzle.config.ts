import type { Config } from "drizzle-kit";

const config: Config = {
	dialect: "postgresql",
	schema: "./schema",
	out: "./migrations",
	dbCredentials: {
		url: process.env.DATABASE_URL as string,
	},
};

export default config;
