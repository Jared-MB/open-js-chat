import { SidebarTrigger } from "./ui/sidebar";

export function OutletHeader({ children }: { children: React.ReactNode }) {
	return (
		<header className="flex items-center p-4 border-b h-20 w-full">
			{children}
			<SidebarTrigger className="inline-flex md:hidden" />
		</header>
	);
}
