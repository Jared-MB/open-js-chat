import { SidebarTrigger } from "@/components/ui/sidebar";
import { unstable_ViewTransition as ViewTransition } from "react";

export default function WelcomePage() {
	return (
		<ViewTransition>
			<div className="h-dvh w-full">
				<div className="p-4 h-20 block md:hidden">
					<SidebarTrigger />
				</div>
				<main className="grid place-content-center max-w-sm md:max-w-full w-full mx-auto h-full">
					<h1 className="text-4xl font-bold">Bienvenido a OpenJS Chat</h1>
					<p className="text-xl mt-2">
						Este es un chat de prueba para probar la aplicación de{" "}
						<strong className="hover:underline">OpenJS Chat</strong>
					</p>
				</main>
			</div>
		</ViewTransition>
	);
}
