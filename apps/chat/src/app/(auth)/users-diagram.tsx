"use client";

import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { cn } from "@/lib/utils";
import { LucideMessagesSquare, User } from "lucide-react";
import { useRef } from "react";

const Circle = ({ className, ref, children }: React.ComponentProps<"div">) => {
	return (
		<div
			ref={ref}
			className={cn(
				"z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
				className,
			)}
		>
			{children}
		</div>
	);
};

export function UsersDiagram() {
	const containerRef = useRef<HTMLDivElement>(null);
	const mainUserRef = useRef<HTMLDivElement>(null);
	const user2Ref = useRef<HTMLDivElement>(null);
	const user3Ref = useRef<HTMLDivElement>(null);
	const user4Ref = useRef<HTMLDivElement>(null);
	const user5Ref = useRef<HTMLDivElement>(null);
	const user6Ref = useRef<HTMLDivElement>(null);
	const user7Ref = useRef<HTMLDivElement>(null);
	const groupRef = useRef<HTMLDivElement>(null);

	return (
		<div
			ref={containerRef}
			className="relative flex w-full max-w-[500px] items-center justify-center overflow-hidden p-10"
		>
			<div className="flex size-full flex-col items-stretch justify-between gap-10">
				<div className="grid grid-cols-4 place-items-center gap-10">
					<Circle ref={mainUserRef} className="col-span-4">
						<User />
					</Circle>
					<Circle ref={user2Ref}>
						<User />
					</Circle>
					<Circle ref={user3Ref}>
						<User />
					</Circle>
					<Circle ref={groupRef}>
						<LucideMessagesSquare />
					</Circle>
					<Circle ref={user4Ref}>
						<User />
					</Circle>
					<div className="flex justify-between col-span-4 w-full">
						<Circle ref={user5Ref}>
							<User />
						</Circle>
						<Circle ref={user6Ref}>
							<User />
						</Circle>
						<Circle ref={user7Ref}>
							<User />
						</Circle>
					</div>
				</div>
			</div>
			{/* Main user */}
			<AnimatedBeam
				containerRef={containerRef}
				fromRef={mainUserRef}
				toRef={user2Ref}
			/>
			<AnimatedBeam
				containerRef={containerRef}
				fromRef={mainUserRef}
				toRef={user3Ref}
			/>
			<AnimatedBeam
				containerRef={containerRef}
				fromRef={mainUserRef}
				toRef={groupRef}
			/>
			<AnimatedBeam
				containerRef={containerRef}
				fromRef={groupRef}
				toRef={user4Ref}
			/>
			<AnimatedBeam
				containerRef={containerRef}
				fromRef={groupRef}
				toRef={user6Ref}
			/>
			<AnimatedBeam
				containerRef={containerRef}
				fromRef={groupRef}
				toRef={user7Ref}
				curvature={-75}
			/>
			<AnimatedBeam
				containerRef={containerRef}
				curvature={-75}
				fromRef={user3Ref}
				toRef={user5Ref}
			/>
			<AnimatedBeam
				containerRef={containerRef}
				fromRef={user7Ref}
				toRef={user4Ref}
			/>
		</div>
	);
}
