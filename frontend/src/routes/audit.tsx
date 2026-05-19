import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Download, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listAuditEvents } from "@/lib/audit-api";
import { auditEventTypeLabels, auditResultLabels } from "@/lib/api-mappers";
import { queryKeys } from "@/lib/query-keys";

export const Route = createFileRoute("/audit")({
  component: Audit,
  head: () => ({ meta: [{ title: "审计日志 · 普华企业知识库" }] }),
});

const resultColor = {
  成功: "bg-success/15 text-success",
  拒绝: "bg-destructive/10 text-destructive",
  降级: "bg-warning/15 text-warning-foreground",
} as const;

function Audit() {
  const [q, setQ] = useState("");
  const [action, setAction] = useState("all");
  const { data } = useQuery({
    queryKey: queryKeys.audit.events({ q, action }),
    queryFn: listAuditEvents,
  });
  const sourceEvents =
    data?.items.map((event) => ({
      id: event.id,
      time: new Date(event.createdAt).toLocaleString("zh-CN"),
      actor: event.actorUserId ?? event.applicationId ?? "系统",
      action: auditEventTypeLabels[event.eventType] ?? event.eventType,
      target: event.knowledgeItemId ?? event.applicationId ?? "-",
      context: event.operationContext ?? event.reason ?? `留存至 ${event.retentionUntil}`,
      result: auditResultLabels[event.result],
    })) ?? [];
  const filtered = sourceEvents.filter((event) => {
    const matchesText = q
      ? `${event.actor}${event.target}${event.context}${event.action}`.includes(q)
      : true;
    const matchesAction = action === "all" ? true : event.action.includes(action);
    return matchesText && matchesAction;
  });
  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">审计日志</h1>
          <p className="text-sm text-muted-foreground mt-1">
            提交、审核、访问、引用、导出、上层应用调用与拒绝事件 · 至少留存 3 年
          </p>
        </div>
        <Button variant="outline" onClick={() => toast.success("已导出 CSV")}>
          <Download className="h-4 w-4 mr-1.5" />
          导出
        </Button>
      </div>

      <Card className="p-3 flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="用户 / 知识 ID / 操作上下文…"
            className="pl-9 h-9"
          />
        </div>
        <Select value={action} onValueChange={setAction}>
          <SelectTrigger className="w-[130px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部操作</SelectItem>
            <SelectItem value="检索">浏览/检索</SelectItem>
            <SelectItem value="引用">引用</SelectItem>
            <SelectItem value="导出">导出/下载</SelectItem>
            <SelectItem value="知识服务">上层应用调用</SelectItem>
            <SelectItem value="拒绝">访问拒绝</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="7d">
          <SelectTrigger className="w-[120px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1d">最近 1 天</SelectItem>
            <SelectItem value="7d">最近 7 天</SelectItem>
            <SelectItem value="30d">最近 30 天</SelectItem>
            <SelectItem value="all">全部</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="h-9">
          <Filter className="h-4 w-4 mr-1.5" />
          更多
        </Button>
      </Card>

      <Card className="overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="min-w-[860px] w-full text-sm">
            <thead className="bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="text-left p-3 font-medium">事件 ID</th>
                <th className="text-left p-3 font-medium">时间</th>
                <th className="text-left p-3 font-medium">操作者</th>
                <th className="text-left p-3 font-medium">操作</th>
                <th className="text-left p-3 font-medium">对象</th>
                <th className="text-left p-3 font-medium">上下文</th>
                <th className="text-left p-3 font-medium">结果</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((e) => (
                <tr key={e.id} className="hover:bg-accent/30">
                  <td className="p-3 text-xs text-muted-foreground tabular-nums">{e.id}</td>
                  <td className="p-3 text-xs tabular-nums">{e.time}</td>
                  <td className="p-3">{e.actor}</td>
                  <td className="p-3">{e.action}</td>
                  <td className="p-3 font-mono text-xs">{e.target}</td>
                  <td className="p-3 text-xs text-muted-foreground">{e.context}</td>
                  <td className="p-3">
                    <Badge className={`text-[10px] ${resultColor[e.result]}`}>{e.result}</Badge>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-sm text-muted-foreground">
                    数据库中暂无匹配的审计事件。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="text-xs text-muted-foreground text-center">
        显示 {filtered.length} 条后端审计事件 ·{" "}
        <button
          className="text-primary hover:underline"
          onClick={() => toast.message("已刷新当前页")}
        >
          刷新
        </button>
      </div>
    </div>
  );
}
