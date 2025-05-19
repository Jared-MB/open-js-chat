"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

export function Navigation() {
	return (
		<nav className="border rounded-lg p-2 flex items-center gap-1 w-fit">
			<NavLink href="/profile">General</NavLink>
			<NavLink href="/profile/contact-requests">Solicitudes de amistad</NavLink>
		</nav>
	);
}

function NavLink({
	children,
	href,
}: { children: React.ReactNode; href: string }) {
	const pathname = usePathname();

	const isActive = pathname === href;

	return (
		<Button asChild variant="ghost" className="relative">
			<Link href={href}>
				{children}
				{isActive && (
					<motion.span
						layoutId="nav-link"
						className="bg-primary h-[2px] w-full rounded-full absolute bottom-0"
					/>
				)}
			</Link>
		</Button>
	);
}
