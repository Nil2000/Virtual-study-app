import { SidebarProvider } from "@repo/ui/components/sidebar";
import { AppSidebar } from "./_components/AppSidebar";
import ProtectedNavbar from "./_components/ProtectedNavbar";
import { auth } from "@lib/auth";
import { SessionProvider } from "next-auth/react";

export default async function layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();
	return (
		<SidebarProvider>
			<AppSidebar session={session} />
			<main className="w-full">
				<ProtectedNavbar />
				<SessionProvider session={session}>
					<div className="w-full px-2">{children}</div>
				</SessionProvider>
			</main>
		</SidebarProvider>
	);
}
