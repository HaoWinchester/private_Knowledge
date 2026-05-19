import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Filter, Grid3x3, List, Plus, Search, SortDesc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { classificationColor, knowledgeItems, statusColor } from "@/lib/mock-data";
import { listKnowledgeItems } from "@/lib/knowledge-api";
import { confidentialityValues, mapKnowledgeCardToUi } from "@/lib/api-mappers";
import { queryKeys } from "@/lib/query-keys";
import type { KnowledgeStatus } from "@/lib/api-types";

export const Route = createFileRoute("/library")({
  component: Library,
  head: () => ({ meta: [{ title: "知识库 · 普华企业知识库" }] }),
});

const domains = ["全部", "售前咨询", "研发", "交付", "运维", "HR", "法务"];

function Library() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [q, setQ] = useState("");
  const [domain, setDomain] = useState("全部");
  const [classification, setClassification] = useState("全部密级");
  const [status, setStatus] = useState("all");
  const statusValue = status === "all" ? undefined : (status as KnowledgeStatus);
  const { data } = useQuery({
    queryKey: queryKeys.knowledge.list({ q, classification, status }),
    queryFn: () =>
      listKnowledgeItems({
        q,
        status: statusValue,
        confidentialityLevel:
          classification === "全部密级" ? undefined : confidentialityValues[classification],
      }),
  });
  const sourceItems = data?.items.map(mapKnowledgeCardToUi) ?? knowledgeItems;

  const filtered = sourceItems.filter((k) => {
    if (domain !== "全部" && k.domain !== domain) return false;
    if (q && !(k.title.includes(q) || k.summary.includes(q) || k.tags.join(",").includes(q)))
      return false;
    return true;
  });

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">知识库</h1>
          <p className="text-sm text-muted-foreground mt-1">
            按岗位、客户、项目阶段、技术栈、密级和生命周期检索受控知识。
          </p>
        </div>
        <Button asChild>
          <Link to="/submit">
            <Plus className="h-4 w-4 mr-1.5" />
            提交入库
          </Link>
        </Button>
      </div>

      {/* Filter bar */}
      <Card className="p-3 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="关键词 / 标签 / 客户 / 项目"
            className="pl-9 h-9"
          />
        </div>
        <Select value={domain} onValueChange={setDomain}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {domains.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={classification} onValueChange={setClassification}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["全部密级", "公开内部", "部门可见", "项目可见", "敏感", "严格受控"].map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="published">已发布</SelectItem>
            <SelectItem value="pending_review">待审核</SelectItem>
            <SelectItem value="rectification_required">整改中</SelectItem>
            <SelectItem value="archived">已过期</SelectItem>
          </SelectContent>
        </Select>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="h-4 w-4 mr-1.5" />
              高级筛选
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>高级筛选</SheetTitle>
              <SheetDescription>按多维度精确定位知识资产</SheetDescription>
            </SheetHeader>
            <div className="py-4 space-y-5">
              <div>
                <Label className="text-xs text-muted-foreground">业务主题</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {["客户调研", "架构实践", "项目复盘", "合同条款", "面试评估", "薪酬"].map((t) => (
                    <Label key={t} className="flex items-center gap-2 text-sm font-normal">
                      <Checkbox /> {t}
                    </Label>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <Label className="text-xs text-muted-foreground">项目阶段</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {["售前", "投标", "实施", "运维", "复盘"].map((t) => (
                    <Label key={t} className="flex items-center gap-2 text-sm font-normal">
                      <Checkbox /> {t}
                    </Label>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <Label className="text-xs text-muted-foreground">技术栈</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {["Java", "K8s", "Python", "向量库", "LLM", "信创"].map((t) => (
                    <Label key={t} className="flex items-center gap-2 text-sm font-normal">
                      <Checkbox /> {t}
                    </Label>
                  ))}
                </div>
              </div>
              <Button className="w-full">应用筛选</Button>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex-1" />
        <Button variant="ghost" size="sm" className="h-9">
          <SortDesc className="h-4 w-4 mr-1.5" />
          更新时间
        </Button>
        <div className="flex border rounded-md">
          <Button
            variant={view === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="h-9 w-9 rounded-r-none"
            onClick={() => setView("grid")}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "list" ? "secondary" : "ghost"}
            size="icon"
            className="h-9 w-9 rounded-l-none"
            onClick={() => setView("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <div className="text-xs text-muted-foreground">
        共 {filtered.length} 条结果 · 已按你的授权范围过滤
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((k) => (
            <Link key={k.id} to="/library/$id" params={{ id: k.id }}>
              <Card className="p-4 h-full hover:shadow-md hover:border-primary/30 transition cursor-pointer">
                <div className="flex items-start justify-between gap-2">
                  <Badge className={`text-[10px] ${classificationColor[k.classification]}`}>
                    {k.classification}
                  </Badge>
                  <Badge className={`text-[10px] ${statusColor[k.status]}`}>{k.status}</Badge>
                </div>
                <h3 className="mt-3 font-semibold text-sm leading-snug line-clamp-2">{k.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-3">{k.summary}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {k.tags.slice(0, 3).map((t) => (
                    <Badge key={t} variant="secondary" className="text-[10px] font-normal">
                      #{t}
                    </Badge>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>
                    {k.owner} · {k.version}
                  </span>
                  <span>
                    {k.views}浏览 · {k.citations}引用
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <ul className="divide-y">
            {filtered.map((k) => (
              <li key={k.id}>
                <Link
                  to="/library/$id"
                  params={{ id: k.id }}
                  className="flex items-center gap-4 p-4 hover:bg-accent/40"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">{k.title}</span>
                      <Badge className={`text-[10px] ${classificationColor[k.classification]}`}>
                        {k.classification}
                      </Badge>
                      <Badge className={`text-[10px] ${statusColor[k.status]}`}>{k.status}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 truncate">{k.summary}</div>
                  </div>
                  <div className="text-xs text-muted-foreground text-right shrink-0">
                    <div>{k.owner}</div>
                    <div>
                      {k.version} · {k.updatedAt}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
