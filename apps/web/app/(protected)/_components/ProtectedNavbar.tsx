"use client";
import ThemeSwtichButton from "@components/ThemeSwtichButton";
import { SidebarTrigger } from "@repo/ui/components/sidebar";
import { Separator } from "@repo/ui/components/separator";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ProtectedNavbar() {
  const pathname = usePathname();
  const pathToName: { [key: string]: string } = {
    "/": "Home",
    "/pomodoro": "Pomodoro session",
    "/video": "Video session",
    "/feedback": "Feedback",
  };
  return (
    <div className="w-full py-2 px-2 flex flex-row items-center justify-between">
      <div className="flex flex-row items-center space-x-4 h-8 font-sans">
        <SidebarTrigger className="p-5" />
        <Separator orientation="vertical" className="w-[1px]" />
        <div>{pathToName[pathname]}</div>
      </div>
      <ThemeSwtichButton />
    </div>
  );
}
