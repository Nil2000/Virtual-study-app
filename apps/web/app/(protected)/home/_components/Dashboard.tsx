"use client";

import { use, useEffect, useState } from "react";
import { Calendar, Clock, Users } from "lucide-react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@repo/ui/components/avatar";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
	Tooltip,
} from "@repo/ui/index";

// Mock data for upcoming sessions
const upcomingSessions = [
	{
		id: 1,
		title: "Math Study",
		time: "2023-11-15T14:00:00",
		duration: 25,
		participants: [
			{ name: "Alice", avatar: "/placeholder.svg?height=32&width=32" },
			{ name: "Bob", avatar: "/placeholder.svg?height=32&width=32" },
			{ name: "Charlie", avatar: "/placeholder.svg?height=32&width=32" },
		],
	},
	{
		id: 2,
		title: "Group Project",
		time: "2023-11-16T10:30:00",
		duration: 50,
		participants: [
			{ name: "David", avatar: "/placeholder.svg?height=32&width=32" },
			{ name: "Eve", avatar: "/placeholder.svg?height=32&width=32" },
			{ name: "Frank", avatar: "/placeholder.svg?height=32&width=32" },
			{ name: "Grace", avatar: "/placeholder.svg?height=32&width=32" },
		],
	},
	{
		id: 3,
		title: "Language Practice",
		time: "2023-11-17T16:00:00",
		duration: 25,
		participants: [
			{ name: "Henry", avatar: "/placeholder.svg?height=32&width=32" },
			{ name: "Ivy", avatar: "/placeholder.svg?height=32&width=32" },
		],
	},
	{
		id: 4,
		title: "Physics Review",
		time: "2023-11-18T09:00:00",
		duration: 40,
		participants: [
			{ name: "Jack", avatar: "/placeholder.svg?height=32&width=32" },
			{ name: "Kate", avatar: "/placeholder.svg?height=32&width=32" },
			{ name: "Liam", avatar: "/placeholder.svg?height=32&width=32" },
		],
	},
	{
		id: 5,
		title: "Literature Discussion",
		time: "2023-11-19T15:00:00",
		duration: 60,
		participants: [
			{ name: "Mia", avatar: "/placeholder.svg?height=32&width=32" },
			{ name: "Noah", avatar: "/placeholder.svg?height=32&width=32" },
			{ name: "Olivia", avatar: "/placeholder.svg?height=32&width=32" },
			{ name: "Peter", avatar: "/placeholder.svg?height=32&width=32" },
			{ name: "Quinn", avatar: "/placeholder.svg?height=32&width=32" },
			{ name: "Rachel", avatar: "/placeholder.svg?height=32&width=32" },
			{ name: "Sam", avatar: "/placeholder.svg?height=32&width=32" },
		],
	},
];

// Mock data for progress tracking
const progressData = {
	totalSessions: 42,
	averageDaily: 2.5,
	averageWeekly: 17.5,
	weeklyData: [
		{ day: "Mon", sessions: 3, totalTime: 90 },
		{ day: "Tue", sessions: 4, totalTime: 120 },
		{ day: "Wed", sessions: 2, totalTime: 60 },
		{ day: "Thu", sessions: 5, totalTime: 150 },
		{ day: "Fri", sessions: 3, totalTime: 90 },
		{ day: "Sat", sessions: 2, totalTime: 60 },
		{ day: "Sun", sessions: 1, totalTime: 30 },
	],
};

export default function Dashboard() {
	const [activeTab, setActiveTab] = useState("upcoming");

	return (
		<div className="px-2 xl:w-[1000px] max-w-full font-sans">
			<h1 className="text-3xl font-bold mb-6">Study Dashboard</h1>

			<div className="flex space-x-2 mb-4">
				<Badge
					variant={activeTab === "upcoming" ? "default" : "outline"}
					className="cursor-pointer"
					onClick={() => setActiveTab("upcoming")}
				>
					Upcoming Sessions
				</Badge>
				<Badge
					variant={activeTab === "progress" ? "default" : "outline"}
					className="cursor-pointer"
					onClick={() => setActiveTab("progress")}
				>
					Progress Tracking
				</Badge>
			</div>

			{activeTab === "upcoming" && (
				<Card>
					<CardHeader>
						<CardTitle>Upcoming Sessions</CardTitle>
					</CardHeader>
					<CardContent>
						<ScrollArea className="h-[400px] pr-4">
							<div className="space-y-4">
								{upcomingSessions.map((session) => (
									<Card key={session.id}>
										<CardContent className="p-4">
											<div className="flex justify-between items-start mb-2">
												<h3 className="text-lg font-semibold">
													{session.title}
												</h3>
												<Badge variant="outline">
													<Calendar className="w-3 h-3 mr-1" />
													{new Date(session.time).toLocaleDateString()}
												</Badge>
											</div>
											<div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
												<div className="flex items-center">
													<Clock className="w-4 h-4 mr-1" />
													{new Date(session.time).toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit",
													})}
												</div>
												<div className="flex items-center">
													<Clock className="w-4 h-4 mr-1" />
													{session.duration} min
												</div>
												<div className="flex items-center">
													<Users className="w-4 h-4 mr-1" />
													{session.participants.length} participants
												</div>
											</div>
											<div className="flex items-center">
												<div className="flex -space-x-2 mr-2">
													{session.participants
														.slice(0, 5)
														.map((participant, index) => (
															<Avatar
																key={index}
																className="w-8 h-8 border-2 border-background"
															>
																<AvatarImage
																	src={participant.avatar!}
																	alt={participant.name}
																/>
																<AvatarFallback>
																	{participant.name.charAt(0)}
																</AvatarFallback>
															</Avatar>
														))}
												</div>
												{session.participants.length > 5 && (
													<Badge
														variant="secondary"
														className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium"
													>
														+{session.participants.length - 5}
													</Badge>
												)}
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</ScrollArea>
					</CardContent>
				</Card>
			)}

			{activeTab === "progress" && (
				<Card>
					<CardHeader>
						<CardTitle>Progress Tracking</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
							<div className="text-center">
								<h3 className="text-lg font-semibold">Total Sessions</h3>
								<p className="text-3xl font-bold">
									{progressData.totalSessions}
								</p>
							</div>
							<div className="text-center">
								<h3 className="text-lg font-semibold">Avg. Daily Sessions</h3>
								<p className="text-3xl font-bold">
									{progressData.averageDaily}
								</p>
							</div>
							<div className="text-center">
								<h3 className="text-lg font-semibold">Avg. Weekly Sessions</h3>
								<p className="text-3xl font-bold">
									{progressData.averageWeekly}
								</p>
							</div>
						</div>
						<div className="space-y-6">
							<div>
								<h3 className="text-lg font-semibold mb-2">
									Number of Sessions (Last 7 Days)
								</h3>
								<div className="h-[300px]">
									<ResponsiveContainer width="100%" height="100%">
										<BarChart data={progressData.weeklyData} accessibilityLayer>
											<XAxis dataKey="day" />
											<YAxis />
											<Tooltip
												content={({ active, payload, label }) => {
													if (active && payload && payload.length) {
														return (
															<div className="rounded-lg border bg-background p-2 shadow-sm">
																<div className="grid grid-cols-2 gap-2">
																	<div className="flex flex-col">
																		<span className="text-[0.70rem] uppercase text-muted-foreground">
																			Day
																		</span>
																		<span className="font-bold text-muted-foreground">
																			{label}
																		</span>
																	</div>
																	<div className="flex flex-col">
																		<span className="text-[0.70rem] uppercase text-muted-foreground">
																			Sessions
																		</span>
																		<span className="font-bold">
																			{payload[0]!.value}
																		</span>
																	</div>
																</div>
															</div>
														);
													}
													return null;
												}}
											/>
											<Bar
												dataKey="sessions"
												fill="hsl(var(--foreground))"
												radius={4}
											/>
										</BarChart>
									</ResponsiveContainer>
								</div>
							</div>
							<div>
								<h3 className="text-lg font-semibold mb-2">
									Total Study Time (Last 7 Days)
								</h3>
								<div className="h-[300px]">
									<ResponsiveContainer width="100%" height="100%">
										<AreaChart data={progressData.weeklyData}>
											<XAxis dataKey="day" />
											<YAxis />
											<Tooltip
												content={({ active, payload, label }) => {
													if (active && payload && payload.length) {
														return (
															<div className="rounded-lg border bg-background p-2 shadow-sm">
																<div className="grid grid-cols-2 gap-2">
																	<div className="flex flex-col">
																		<span className="text-[0.70rem] uppercase text-muted-foreground">
																			Day
																		</span>
																		<span className="font-bold text-muted-foreground">
																			{label}
																		</span>
																	</div>
																	<div className="flex flex-col">
																		<span className="text-[0.70rem] uppercase text-muted-foreground">
																			Total Time (min)
																		</span>
																		<span className="font-bold">
																			{payload[0]!.value}
																		</span>
																	</div>
																</div>
															</div>
														);
													}
													return null;
												}}
											/>
											<defs>
												<linearGradient
													id="fillDesktop"
													x1="0"
													y1="0"
													x2="0"
													y2="1"
												>
													<stop
														offset="5%"
														stopColor="hsl(var(--primary))"
														stopOpacity={0.8}
													/>
													<stop
														offset="95%"
														stopColor="hsl(var(--primary))"
														stopOpacity={0.1}
													/>
												</linearGradient>
											</defs>
											<Area
												type="monotone"
												dataKey="totalTime"
												stroke="hsl(var(--primary))"
												fill="url(#fillDesktop)"
												fillOpacity={0.2}
											/>
										</AreaChart>
									</ResponsiveContainer>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
