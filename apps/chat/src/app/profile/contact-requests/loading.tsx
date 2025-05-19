import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, X } from "lucide-react";

export default function ContactsRequestsLoadingPage() {
	return (
		<main className="py-6 divide-y">
			{Array.from({ length: 4 }).map((_, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
				<div key={index} className="py-1">
					<article className="flex items-center justify-between px-6 py-3 hover:bg-muted rounded-md transition-colors duration-200">
						<div className="flex items-center gap-6">
							<Avatar>
								<AvatarFallback />
							</Avatar>
							<div className="flex flex-col gap-2">
								<h2 className="font-semibold">
									<Skeleton className="h-4 w-20 rounded-full" />
								</h2>
								<span className="text-sm text-foreground opacity-80">
									<Skeleton className="h-3 w-32 rounded-full" />
								</span>
							</div>
						</div>
						<div className="flex gap-4">
							<Button variant="outline" size="icon">
								<X className="h-4 w-4" />
							</Button>
							<Button size="icon">
								<Check className="h-4 w-4" />
							</Button>
						</div>
					</article>
				</div>
			))}
		</main>
	);
}
