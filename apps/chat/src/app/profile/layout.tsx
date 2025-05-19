import { OutletHeader } from "@/components/outlet-header";
import { Navigation } from "./navigation";

export default function ProfileLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<div className="w-full">
			<OutletHeader>
				<h2 className="font-semibold text-2xl">Perfil</h2>
			</OutletHeader>
			<div className="w-full p-16">
				<Navigation />
				{children}
			</div>
		</div>
	);
}
