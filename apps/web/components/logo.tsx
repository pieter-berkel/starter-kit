import Image from "next/image";
import type { ComponentProps } from "react";

import logo from "@/public/starter-kit-logo.svg";

export const Logo = (
	props: Omit<ComponentProps<typeof Image>, "src" | "alt">,
) => {
	return <Image alt="Starter Kit" src={logo} {...props} />;
};
