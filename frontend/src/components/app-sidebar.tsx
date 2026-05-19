import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Library,
  Upload,
  ShieldCheck,
  KeyRound,
  Sparkles,
  ScrollText,
  BarChart3,
  Settings,
  BookOpen,
  Plug,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { getCurrentUser } from "@/lib/me-api";
import { queryKeys } from "@/lib/query-keys";
import { roleSummary } from "@/lib/api-mappers";

type NavItem = { title: string; url: string; icon: typeof LayoutDashboard; exact?: boolean };
const groups: { label: string; items: NavItem[] }[] = [
  {
    label: "总览",
    items: [{ title: "工作台", url: "/", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "知识资产",
    items: [
      { title: "知识库", url: "/library", icon: Library },
      { title: "提交入库", url: "/submit", icon: Upload },
      { title: "AI 问答", url: "/ai-chat", icon: Sparkles },
    ],
  },
  {
    label: "受控流转",
    items: [
      { title: "审核工作台", url: "/review", icon: ShieldCheck },
      { title: "授权申请", url: "/access", icon: KeyRound },
      { title: "审计日志", url: "/audit", icon: ScrollText },
    ],
  },
  {
    label: "运营与接入",
    items: [
      { title: "运营看板", url: "/operations", icon: BarChart3 },
      { title: "AI 接入", url: "/integrations", icon: Plug },
      { title: "系统设置", url: "/settings", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const currentPath = useRouterState({ select: (s) => s.location.pathname });
  const { data: currentUser } = useQuery({
    queryKey: queryKeys.me,
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000,
  });
  const isActive = (url: string, exact?: boolean) =>
    exact ? currentPath === url : currentPath === url || currentPath.startsWith(url + "/");
  const displayName = currentUser?.displayName ?? "李晓楠";
  const roleText = currentUser
    ? [roleSummary(currentUser.roles), currentUser.departmentName].filter(Boolean).join(" · ")
    : "知识管理员 · 售前咨询";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <BookOpen className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold">普华知识库</span>
            <span className="text-[11px] text-muted-foreground">受控知识中台 · v1.0</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((g) => (
          <SidebarGroup key={g.label}>
            <SidebarGroupLabel>{g.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url, item.exact)}
                      tooltip={item.title}
                    >
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="h-7 w-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-medium">
            {displayName.slice(0, 1)}
          </div>
          <div className="flex flex-col text-xs leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-medium text-sidebar-foreground">{displayName}</span>
            <span className="text-muted-foreground">{roleText}</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
