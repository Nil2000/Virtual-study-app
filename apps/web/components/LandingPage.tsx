"use client";

import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { Users, Clock, Video } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import WordPullUp from "@repo/ui/components/word-pull-up";
import { cn } from "@repo/ui/utils";
import AnimatedGridPattern from "@repo/ui/components/animated-grid-pattern";
import { AnimatedGroup } from "@repo/ui/components/animated-group";
import { InfiniteSlider } from "@repo/ui/components/infinite-slider";
import Navbar from "./Navbar";
import { redirect, useRouter } from "next/navigation";

export default function LandingPage() {
	const [mounted, setMounted] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [isFeaturesVisible, setIsFeaturesVisible] = useState(false);
	const featuresRef = useRef<HTMLElement | null>(null);
	const router = useRouter();

	useEffect(() => {
		setMounted(true);

		const handleScroll = () => {
			if (featuresRef.current) {
				const sectionTop = featuresRef.current.getBoundingClientRect().top;
				const scrollTrigger = window.innerHeight * 1; // Trigger when 80% of the section is in view

				if (sectionTop < scrollTrigger) {
					setIsFeaturesVisible(true);
					window.removeEventListener("scroll", handleScroll); // Remove listener after triggering
				}
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<div className="flex flex-col min-h-screen">
			<Navbar />
			<main className="flex-1 flex flex-col justify-center">
				<section className="w-full py-24 md:py-36 lg:py-56 xl:py-64 flex justify-center relative">
					<div className="z-10 container px-4 md:px-6 ">
						<div className="flex flex-col items-center space-y-4 text-center">
							<div className="space-y-2">
								<WordPullUp
									className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none font-sans"
									words="Study Together, Achieve More"
								/>
								<p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 font-poppins">
									Join virtual study groups, stay motivated, and reach your
									academic goals with StudyTogether.
								</p>
							</div>
							<div className="space-x-4 font-poppins">
								<Button
									size={"lg"}
									onClick={() => {
										router.push("/auth/signin");
									}}
								>
									Get Started
								</Button>
								<Button
									variant="outline"
									size={"lg"}
									onClick={() => {
										router.push("/auth/signin");
									}}
								>
									Learn More
								</Button>
							</div>
						</div>
					</div>
					<AnimatedGridPattern
						numSquares={30}
						maxOpacity={0.1}
						duration={3}
						repeatDelay={1}
						className={cn(
							"[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
							"inset-x-0 inset-y-[10%] h-[80%] skew-y-12"
						)}
					/>
				</section>
				<section
					id="features"
					ref={featuresRef}
					className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800 flex justify-center"
				>
					<div className="container px-4 md:px-6 ">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 font-sans text-black">
							Key Features
						</h2>
						{isFeaturesVisible && (
							<AnimatedGroup
								className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 font-poppins"
								preset="scale"
							>
								<Card>
									<CardContent className="flex flex-col items-center space-y-4 p-6">
										<Users className="h-12 w-12 text-primary" />
										<h3 className="text-2xl font-bold text-center">
											Virtual Study Rooms
										</h3>
										<p className="text-center text-gray-500 dark:text-gray-400">
											Join or create study rooms for different subjects and
											topics.
										</p>
									</CardContent>
								</Card>
								<Card>
									<CardContent className="flex flex-col items-center space-y-4 p-6">
										<Clock className="h-12 w-12 text-primary" />
										<h3 className="text-2xl font-bold text-center">
											Pomodoro Timer
										</h3>
										<p className="text-center text-gray-500 dark:text-gray-400">
											Stay focused with built-in Pomodoro timers for effective
											study sessions.
										</p>
									</CardContent>
								</Card>
								<Card>
									<CardContent className="flex flex-col items-center space-y-4 p-6">
										<Video className="h-12 w-12 text-primary" />
										<h3 className="text-2xl font-bold text-center">
											Video Conferencing
										</h3>
										<p className="text-center text-gray-500 dark:text-gray-400">
											Collaborate with peers through integrated video chat
											features.
										</p>
									</CardContent>
								</Card>
							</AnimatedGroup>
						)}
					</div>
				</section>
				<section
					id="testimonials"
					className="w-full py-12 md:py-24 lg:py-32 flex justify-center"
				>
					<div className="container px-4 md:px-6">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 font-sans">
							What Our Users Say
						</h2>
						<InfiniteSlider
							className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 font-poppins"
							duration={60}
							gap={24}
						>
							<Card className="w-[400px]">
								<CardContent className="p-6">
									<p className="text-gray-500 dark:text-gray-400 mb-4">
										"StudyTogether has transformed my study habits. I'm more
										productive and motivated than ever!"
									</p>
									<p className="font-semibold">
										- Sarah K., University Student
									</p>
								</CardContent>
							</Card>
							<Card className="w-[400px]">
								<CardContent className="p-6">
									<p className="text-gray-500 dark:text-gray-400 mb-4">
										"The virtual study rooms are fantastic. It's like having a
										study group available 24/7."
									</p>
									<p className="font-semibold">- Mike T., High School Senior</p>
								</CardContent>
							</Card>
							<Card className="w-[400px]">
								<CardContent className="p-6">
									<p className="text-gray-500 dark:text-gray-400 mb-4">
										"I love the Pomodoro timer feature. It keeps me focused and
										helps me manage my study time effectively."
									</p>
									<p className="font-semibold">- Emily R., Graduate Student</p>
								</CardContent>
							</Card>
							<Card className="w-[400px]">
								<CardContent className="p-6">
									<p className="text-gray-500 dark:text-gray-400 mb-4">
										"StudyTogether has transformed my study habits. I'm more
										productive and motivated than ever!"
									</p>
									<p className="font-semibold">
										- Sarah K., University Student
									</p>
								</CardContent>
							</Card>
							<Card className="w-[400px]">
								<CardContent className="p-6">
									<p className="text-gray-500 dark:text-gray-400 mb-4">
										"I love the Pomodoro timer feature. It keeps me focused and
										helps me manage my study time effectively."
									</p>
									<p className="font-semibold">- Emily R., Graduate Student</p>
								</CardContent>
							</Card>
						</InfiniteSlider>
					</div>
				</section>
				<section
					id="cta"
					className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground flex justify-center"
				>
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center space-y-4 text-center">
							<div className="space-y-2">
								<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-sans">
									Ready to Study Smarter?
								</h2>
								<p className="mx-auto max-w-[600px] text-primary-foreground/90 md:text-xl font-poppins">
									Join StudyTogether today and experience the power of
									collaborative learning.
								</p>
							</div>
							<Button
								className="bg-background text-primary hover:bg-background/90 font-poppins"
								size={"lg"}
								onClick={() => {
									router.push("/auth/signup");
								}}
							>
								Sign Up Now
							</Button>
						</div>
					</div>
				</section>
			</main>
			<footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t font-poppins">
				<p className="text-xs text-gray-500 dark:text-gray-400">
					© 2024 StudyTogether. All rights reserved.
				</p>
				<nav className="sm:ml-auto flex gap-4 sm:gap-6">
					<Link className="text-xs hover:underline underline-offset-4" href="#">
						Terms of Service
					</Link>
					<Link className="text-xs hover:underline underline-offset-4" href="#">
						Privacy
					</Link>
				</nav>
			</footer>
		</div>
	);
}
