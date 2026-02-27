import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

export default function NotFound() {
	return (
		<main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
			<div className="text-center">
				<p className="font-semibold text-base text-primary">404</p>
				<h1 className="mt-4 text-balance font-semibold text-5xl tracking-tight sm:text-7xl">
					Pagina niet gevonden
				</h1>
				<p className="mt-6 text-pretty font-medium text-lg text-muted-foreground sm:text-xl/8">
					Sorry, we kunnen de pagina die je zoekt niet vinden.
				</p>
				<div className="mt-10 flex items-center justify-center gap-x-6">
					<Button nativeButton={false} render={<Link href="/" />} size="lg">
						Terug naar home
					</Button>
					<Button
						nativeButton={false}
						render={<Link href="/contact" />}
						size="lg"
						variant="ghost"
					>
						Contact opnemen met ondersteuning{" "}
						<span aria-hidden="true">&rarr;</span>
					</Button>
				</div>
			</div>
		</main>
	);
}
