import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { UsersDiagram } from "./users-diagram";

export default function AuthLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<div className="w-dvw grid grid-cols-[auto_1fr]">
			{children}
			<div className="relative">
				<FlickeringGrid className="absolute inset-0 z-0 [mask-image:radial-gradient(80dvw_circle_at_center,transparent,white)]" />
				<main className="grid place-content-center max-w-sm md:max-w-full w-full mx-auto h-full gap-6">
					<div>
						<h1 className="text-4xl font-bold">Bienvenido a OpenJS Chat</h1>
						<p className="text-xl mt-2">
							Conecte con tus amigos y chatea con ellos en tiempo real.
						</p>
					</div>
					<UsersDiagram />
				</main>
			</div>
		</div>
	);
}
