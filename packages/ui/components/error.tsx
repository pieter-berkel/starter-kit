import { cn } from "@workspace/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

function ErrorState({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"flex min-w-0 flex-1 flex-col items-center justify-center gap-6 text-balance rounded-lg p-8 text-center md:p-16",
				className,
			)}
			data-slot="error"
			{...props}
		/>
	);
}

function ErrorHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"flex max-w-md flex-col items-center gap-3 text-center",
				className,
			)}
			data-slot="error-header"
			{...props}
		/>
	);
}

const errorMediaVariants = cva(
	"mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default: "bg-transparent",
				icon: "flex size-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive [&_svg:not([class*='size-'])]:size-6",
				danger:
					"flex size-10 shrink-0 items-center justify-center rounded-lg bg-destructive text-destructive-foreground [&_svg:not([class*='size-'])]:size-6",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

function ErrorMedia({
	className,
	variant = "default",
	...props
}: React.ComponentProps<"div"> & VariantProps<typeof errorMediaVariants>) {
	return (
		<div
			className={cn(errorMediaVariants({ variant, className }))}
			data-slot="error-icon"
			data-variant={variant}
			{...props}
		/>
	);
}

function ErrorTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn("font-medium text-lg tracking-tight", className)}
			data-slot="error-title"
			{...props}
		/>
	);
}

function ErrorDescription({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<div
			className={cn(
				"text-muted-foreground text-sm/relaxed [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
				className,
			)}
			data-slot="error-description"
			{...props}
		/>
	);
}

function ErrorContent({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"flex w-full min-w-0 max-w-sm flex-col items-center gap-4 text-balance text-sm",
				className,
			)}
			data-slot="error-content"
			{...props}
		/>
	);
}

export {
	ErrorState,
	ErrorHeader,
	ErrorTitle,
	ErrorDescription,
	ErrorContent,
	ErrorMedia,
};
