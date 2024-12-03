import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
	return <main className="w-full min-h-screen font-sans">{children}</main>;
}
