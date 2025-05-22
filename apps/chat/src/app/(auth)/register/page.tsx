"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register } from "@/modules/auth/register";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

export default function RegisterPage() {
	const [state, dispatch, isLoading] = useActionState(register, undefined);

	useEffect(() => {
		if (state?.error) {
			toast.error(state.error);
		}
	}, [state]);

	return (
		<aside className="w-md border-r border-r-sidebar-border bg-sidebar p-12 flex justify-center items-center">
			<form action={dispatch} className="flex flex-col gap-6 w-full">
				<div className="flex flex-col items-center gap-2 text-center">
					<h1 className="text-2xl font-bold">Crear una cuenta</h1>
					<p className="text-balance text-sm text-muted-foreground">
						Completa tus datos para crear una cuenta
					</p>
				</div>
				<div className="grid gap-6">
					<div className="grid gap-2">
						<Label htmlFor="email">Correo electrónico</Label>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="m@example.com"
							disabled={isLoading}
							required
							defaultValue={state?.fields?.email?.value.toString()}
						/>
						{state?.fields?.email.message && (
							<p className="text-red-500 text-sm">
								{state.fields.email.message}
							</p>
						)}
					</div>
					<div className="grid gap-2">
						<Label htmlFor="name">Nombre</Label>
						<Input
							id="name"
							name="name"
							type="name"
							placeholder="username"
							required
							disabled={isLoading}
							defaultValue={state?.fields?.name?.value.toString()}
						/>
					</div>
					<div className="grid gap-2">
						<div className="flex items-center">
							<Label htmlFor="password">Contraseña</Label>
						</div>
						<Input
							id="password"
							name="password"
							type="password"
							required
							placeholder="* * * * * * * *"
							disabled={isLoading}
							defaultValue={state?.fields?.password?.value.toString()}
						/>
						{state?.fields?.password.message && (
							<p className="text-red-500 text-sm">
								{state.fields.password.message}
							</p>
						)}
					</div>
					<div className="grid gap-2">
						<div className="flex items-center">
							<Label htmlFor="confirmPassword">Confirmar contraseña</Label>
						</div>
						<Input
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							required
							placeholder="* * * * * * * *"
							disabled={isLoading}
							defaultValue={state?.fields?.confirmPassword?.value.toString()}
						/>
						{state?.fields?.confirmPassword.message && (
							<p className="text-red-500 text-sm">
								{state.fields.confirmPassword.message}
							</p>
						)}
					</div>
					<Button type="submit" className="w-full" disabled={isLoading}>
						{!isLoading ? "Crear cuenta" : "Creando cuenta..."}
					</Button>
				</div>
				<div className="text-center text-sm">
					¿Ya tienes una cuenta?{" "}
					<Link href="/login" className="underline underline-offset-4">
						Inicia sesión
					</Link>
				</div>
			</form>
		</aside>
	);
}
