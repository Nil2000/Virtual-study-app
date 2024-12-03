"use client";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarGroupLabel,
	SidebarGroupContent,
	SidebarMenuItem,
	SidebarMenuButton,
} from "@repo/ui/components/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
	BookOpen,
	ChevronDown,
	ChevronUp,
	ChevronsUpDown,
	Clock3,
	History,
	LogOut,
	Send,
	User,
	User2,
	Video,
} from "lucide-react";
import {
	Avatar,
	AvatarImage,
	AvatarFallback,
} from "@repo/ui/components/avatar";
import Link from "next/link";
import { TbPremiumRights } from "react-icons/tb";
import { signOut, useSession } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
const items = [
	{
		title: "Pomodoro session",
		url: "/pomodoro",
		icon: Clock3,
	},
	{
		title: "Video session",
		url: "/video",
		icon: Video,
	},
	{
		title: "Feedback",
		url: "/feedback",
		icon: Send,
	},
];

const paymentSection = [
	{
		title: "Buy Premium",
		url: "#",
		icon: TbPremiumRights,
	},
	{
		title: "Payment History",
		url: "#",
		icon: History,
	},
];

export function AppSidebar({ session }: { session: Session | null }) {
	return (
		<Sidebar className="font-sans">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton className="py-5 hover:bg-transparent">
							<BookOpen className="h-6 w-6" />
							<span className="ml-2 text-2xl font-bold">StudyTogether</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Application</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild className="text-base py-5">
										<Link href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupLabel>Payments</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{paymentSection.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild className="text-base py-5">
										<Link href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SessionProvider>
					<Footer session={session} />
				</SessionProvider>
			</SidebarFooter>
		</Sidebar>
	);
}

const Footer = ({ session }: { session: Session | null }) => {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton className="flex flex-row py-7">
							<Avatar>
								<AvatarImage src={session?.user?.image!} />
								<AvatarFallback>
									<User2 />
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-col w-[130px]">
								<span className="font-bold">{session?.user?.name}</span>
								<span className="text-xs text-foreground text-ellipsis overflow-hidden">
									{session?.user?.email}
								</span>
							</div>
							<ChevronsUpDown className="ml-auto" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						side="top"
						className="w-[--radix-popper-anchor-width] font-sans"
					>
						<DropdownMenuItem>
							<User />
							<span>Profile</span>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => {
								signOut();
							}}
						>
							<LogOut />
							<span>Sign out</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
};
