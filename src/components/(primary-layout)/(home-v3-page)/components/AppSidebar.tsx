'use client';

import NextImage from 'next/image';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { 
  Edit,
  Sparkles,
  Brain,
  CheckCheck,
  Languages,
  FileText,
  Megaphone,
  TrendingUp,
  Users,
  MoreHorizontal
} from "lucide-react";
import logo from "@assets/Logo (3)_1760613683127.png";

const menuItems = [
  { label: "Paraphrase", icon: Edit, href: "/paraphrase", testId: "sidebar-paraphrase" },
  { label: "Humanize", icon: Sparkles, href: "/humanize", testId: "sidebar-humanize" },
  { label: "Plagiarism Checker", icon: CheckCheck, href: "/plagiarism", testId: "sidebar-plagiarism" },
  { label: "AI Detector", icon: Brain, href: "/ai-detector", testId: "sidebar-ai-detector" },
  { label: "Admob", icon: FileText, href: "/admob", testId: "sidebar-admob" },
  { label: "Marketing Automation", icon: Megaphone, href: "/marketing", testId: "sidebar-marketing" },
  { label: "Translator", icon: Languages, href: "/translator", testId: "sidebar-translator" },
  { label: "AI Optimization", icon: TrendingUp, href: "/optimization", testId: "sidebar-optimization" },
  { label: "Community", icon: Users, href: "/community", testId: "sidebar-community" },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <NextImage
          src={logo}
          alt="Shothik AI"
          height={24}
          width={120}
          className="h-6 w-auto object-contain"
          data-testid="sidebar-logo"
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild data-testid={item.testId}>
                    <a href={item.href} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild data-testid="sidebar-more">
                  <a href="/more" className="flex items-center gap-3">
                    <MoreHorizontal className="h-4 w-4" />
                    <span>More</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
