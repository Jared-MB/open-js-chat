"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/modules/auth/login";
import Link from "next/link";
import { useActionState } from "react";

export default function LoginPage() {
	const [state, dispatch, isLoading] = useActionState(login, undefined);

	return (
		<aside className="w-md border-r border-r-sidebar-border bg-sidebar p-12 flex justify-center items-center">
			<form action={dispatch} className="flex flex-col gap-6 w-full">
				<div className="flex flex-col items-center gap-2 text-center">
					<h1 className="text-2xl font-bold">Inicia sesión en tu cuenta</h1>
					<p className="text-balance text-sm text-muted-foreground">
						Ingresa tu correo electrónico para iniciar sesión en tu cuenta
					</p>
				</div>
				<div className="grid gap-6">
					<div className="grid gap-2">
						<Label htmlFor="email">Correo electrónico</Label>
						<Input
							id="email"
							type="email"
							name="email"
							placeholder="m@example.com"
							required
							disabled={isLoading}
						/>
					</div>
					<div className="grid gap-2">
						<div className="flex items-center">
							<Label htmlFor="password">Contraseña</Label>
							{/* <a
									href="#"
									className="ml-auto text-sm underline-offset-4 hover:underline"
								>
									Forgot your password?
								</a> */}
						</div>
						<Input
							id="password"
							name="password"
							type="password"
							required
							placeholder="* * * * * * * *"
							disabled={isLoading}
						/>
					</div>
					<Button type="submit" className="w-full" disabled={isLoading}>
						{!isLoading ? "Iniciar sesión" : "Iniciando sesión..."}
					</Button>
				</div>
				<div className="text-center text-sm">
					¿Aún no tienes una cuenta?{" "}
					<Link href="/register" className="underline underline-offset-4">
						Regístrate
					</Link>
				</div>
			</form>
		</aside>
	);
}
