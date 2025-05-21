import { unstable_ViewTransition as ViewTransition } from "react";

export default function MainPage() {
	return (
		<ViewTransition>
			<main className="grid place-content-center max-w-sm md:max-w-full w-full mx-auto h-full">
				<h1 className="text-4xl font-bold">Bienvenido a OpenJS Chat</h1>
				<p className="text-xl mt-2">
					Conecte con tus amigos y chatea con ellos en tiempo real.
				</p>
			</main>
		</ViewTransition>
	);
}
