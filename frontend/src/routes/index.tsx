import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Database,
  FileWarning,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Upload,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { classificationColor, knowledgeItems, reviewTasks, statusColor } from "@/lib/mock-data";
import { listKnowledgeItems } from "@/lib/knowledge-api";
import { listIntakeRequests } from "@/lib/review-api";
import {
  confidentialityLabels,
  knowledgeStatusLabels,
  mapKnowledgeCardToUi,
  reviewGroupLabel,
} from "@/lib/api-mappers";
import { queryKeys } from "@/lib/query-keys";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [{ title: "工作台 · 普华企业知识库" }],
  }),
});

const kpis = [
  { label: "知识资产", value: "2,847", delta: "+42 本周", icon: Database, tint: "text-info" },
  {
    label: "待我审核",
    value: "12",
    delta: "3 高优先",
    icon: Clock,
    tint: "text-warning-foreground",
  },
  {
    label: "本周问答",
    value: "1,284",
    delta: "94% 命中引用",
    icon: Sparkles,
    tint: "text-chart-5",
  },
  {
    label: "拦截访问",
    value: "37",
    delta: "权限/密级",
    icon: ShieldAlert,
    tint: "text-destructive",
  },
];

function Dashboard() {
  const { data: knowledgeData } = useQuery({
    queryKey: queryKeys.knowledge.list({}),
    queryFn: () => listKnowledgeItems(),
  });
  const { data: reviewData } = useQuery({
    queryKey: queryKeys.review.requests("all"),
    queryFn: () => listIntakeRequests(),
  });
  const backendKnowledge = knowledgeData?.items.map(mapKnowledgeCardToUi) ?? [];
  const backendPending =
    reviewData?.items.map((request) => {
      const item = knowledgeData?.items.find(
        (knowledge) => knowledge.id === request.knowledgeItemId,
      );
      return {
        id: request.id,
        knowledgeId: request.knowledgeItemId,
        title: item?.title ?? request.knowledgeItemId,
        submitter: "后端提交",
        submittedAt: new Date(request.createdAt).toLocaleString("zh-CN"),
        reviewType: reviewGroupLabel(request.reviewGroup),
        reason: request.status === "precheck_flagged" ? "预检查需复核" : undefined,
        priority: request.reviewGroup === "security_admin" ? "高" : "中",
        classification: item
          ? confidentialityLabels[item.confidentialityLevel]
          : ("部门可见" as const),
      };
    }) ?? [];
  const pending = (backendPending.length > 0 ? backendPending : reviewTasks).slice(0, 3);
  const trending = (backendKnowledge.length > 0 ? backendKnowledge : knowledgeItems)
    .filter((k) => k.status === "已发布")
    .slice(0, 4);
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground">2026 年 5 月 18 日 · 周一</p>
          <h1 className="text-2xl font-semibold mt-1">早上好，李晓楠</h1>
          <p className="text-sm text-muted-foreground mt-1">
            你有 <span className="text-foreground font-medium">3 条高优先审核</span> 与{" "}
            <span className="text-foreground font-medium">2 条授权申请</span> 等待处理。
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/ai-chat">
              <Sparkles className="h-4 w-4 mr-1.5" />
              打开 AI 问答
            </Link>
          </Button>
          <Button asChild>
            <Link to="/submit">
              <Upload className="h-4 w-4 mr-1.5" />
              提交新知识
            </Link>
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Card key={k.label} className="relative overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{k.label}</span>
                <k.icon className={`h-4 w-4 ${k.tint}`} />
              </div>
              <div className="mt-3 text-2xl font-semibold tracking-tight">{k.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{k.delta}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pending reviews */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle className="text-base">待我审核</CardTitle>
              <CardDescription>知识管理员 / 安全管理员 / 领域专家</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/review">
                查看全部 <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="divide-y">
              {pending.map((t) => (
                <li key={t.id} className="py-3 flex items-center gap-3">
                  <div
                    className={`w-1.5 h-10 rounded-full ${t.priority === "高" ? "bg-destructive" : "bg-info"}`}
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      to="/library/$id"
                      params={{ id: t.knowledgeId }}
                      className="text-sm font-medium hover:underline truncate block"
                    >
                      {t.title}
                    </Link>
                    <div className="text-xs text-muted-foreground mt-0.5 flex flex-wrap items-center gap-x-2">
                      <span>{t.submitter}</span>·<span>{t.submittedAt}</span>·
                      <span>{t.reviewType}</span>
                      {t.reason && <span className="text-warning-foreground">· {t.reason}</span>}
                    </div>
                  </div>
                  <Badge className={classificationColor[t.classification]}>
                    {t.classification}
                  </Badge>
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/review">处理</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">快捷入口</CardTitle>
            <CardDescription>常用受控流转动作</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {[
              { label: "提交入库", to: "/submit", icon: Upload },
              { label: "审核中心", to: "/review", icon: CheckCircle2 },
              { label: "授权申请", to: "/access", icon: ShieldAlert },
              { label: "AI 问答", to: "/ai-chat", icon: Sparkles },
              { label: "审计日志", to: "/audit", icon: FileWarning },
              { label: "运营看板", to: "/operations", icon: TrendingUp },
            ].map((a) => (
              <Button key={a.label} variant="outline" className="h-auto justify-start py-3" asChild>
                <Link to={a.to}>
                  <a.icon className="h-4 w-4 mr-2" />
                  <span className="text-sm">{a.label}</span>
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Trending */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle className="text-base">本周热门 / 高复用知识</CardTitle>
              <CardDescription>按引用量与问答命中率排序</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/library">
                浏览知识库 <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {trending.map((k) => (
              <Link
                key={k.id}
                to="/library/$id"
                params={{ id: k.id }}
                className="block rounded-lg border bg-card hover:bg-accent/40 transition p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">{k.title}</div>
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {k.summary}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <Badge variant="outline" className="text-[10px] font-normal">
                        {k.domain}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] font-normal">
                        {k.topic}
                      </Badge>
                      <Badge className={`text-[10px] ${classificationColor[k.classification]}`}>
                        {k.classification}
                      </Badge>
                      <Badge className={`text-[10px] ${statusColor[k.status]}`}>{k.status}</Badge>
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground shrink-0">
                    <div>{k.views} 浏览</div>
                    <div>{k.citations} 引用</div>
                    <div className="text-warning-foreground">★ {k.rating}</div>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" /> 本周专家贡献榜
            </CardTitle>
            <CardDescription>新增、审核与复用合计</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "陈思远", dept: "研发", score: 142 },
              { name: "李晓楠", dept: "售前", score: 128 },
              { name: "高扬", dept: "交付", score: 96 },
              { name: "林珊", dept: "HR", score: 71 },
            ].map((u, i) => (
              <div key={u.name} className="flex items-center gap-3">
                <div
                  className={`h-7 w-7 rounded-md flex items-center justify-center text-xs font-semibold ${i === 0 ? "bg-warning/20 text-warning-foreground" : "bg-muted"}`}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{u.name}</div>
                  <div className="text-xs text-muted-foreground">{u.dept}</div>
                </div>
                <div className="text-sm font-semibold tabular-nums">{u.score}</div>
                <ArrowUpRight className="h-3.5 w-3.5 text-success" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
