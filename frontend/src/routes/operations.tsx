import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { TrendingUp, AlertTriangle, Users, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getOperationsSummary } from "@/lib/operations-api";
import { createQualitySignal } from "@/lib/quality-api";
import { queryKeys } from "@/lib/query-keys";

export const Route = createFileRoute("/operations")({
  component: Operations,
  head: () => ({ meta: [{ title: "运营看板 · 普华企业知识库" }] }),
});

function Operations() {
  const { data: summary } = useQuery({
    queryKey: queryKeys.operations.summary,
    queryFn: getOperationsSummary,
  });
  const lifecycleMutation = useMutation({
    mutationFn: (knowledgeItemId: string) =>
      createQualitySignal({ knowledgeItemId, signalType: "lifecycle_review", value: "requested" }),
    onSuccess: () => toast.success("已通过后端记录生命周期复核动作"),
  });
  const kpis = [
    {
      label: "本月新增",
      value: summary?.newKnowledgeCount ?? 0,
      delta: "后端实时",
      icon: BookOpen,
      tint: "text-info",
    },
    {
      label: "本月复用次数",
      value: summary?.reuseCount ?? 0,
      delta: "质量信号驱动",
      icon: TrendingUp,
      tint: "text-success",
    },
    {
      label: "即将过期",
      value: summary?.expiringCount ?? 0,
      delta: "30 天内",
      icon: AlertTriangle,
      tint: "text-warning-foreground",
    },
    {
      label: "活跃专家",
      value: summary?.activeExpertCount ?? 0,
      delta: "贡献统计",
      icon: Users,
      tint: "text-chart-5",
    },
  ];
  const qualityTotal = Math.max(
    1,
    summary?.qualityDistribution.reduce((total, row) => total + row.count, 0) ?? 1,
  );
  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">知识运营看板</h1>
        <p className="text-sm text-muted-foreground mt-1">
          新增、热门、过期、质量分布、薄弱领域与专家贡献
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{k.label}</span>
                <k.icon className={`h-4 w-4 ${k.tint}`} />
              </div>
              <div className="mt-3 text-2xl font-semibold">{k.value.toLocaleString()}</div>
              <div className="mt-1 text-xs text-muted-foreground">{k.delta}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">质量评分分布</CardTitle>
            <CardDescription>按 1-5 星分布</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(summary?.qualityDistribution ?? []).map((r) => {
              const percent = Math.round((r.count / qualityTotal) * 100);
              return (
                <div key={r.label} className="flex items-center gap-3 text-sm">
                  <span className="w-16">{r.label}</span>
                  <Progress value={percent} className="flex-1 h-2" />
                  <span className="w-20 text-right text-muted-foreground tabular-nums">
                    {r.count} ({percent}%)
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">薄弱领域</CardTitle>
            <CardDescription>低覆盖、低评分或缺少专家</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(summary?.weakAreas ?? []).map((w) => (
              <div key={w.businessTheme} className="flex items-center gap-3 border rounded-md p-3">
                <div className="flex-1">
                  <div className="text-sm font-medium">{w.businessTheme}</div>
                  <div className="text-xs text-muted-foreground">
                    {w.suggestedAction ?? "建议补齐知识资产"}
                  </div>
                </div>
                <Badge
                  variant={w.issueCount >= 2 ? "destructive" : "secondary"}
                  className="text-[10px]"
                >
                  {w.issueCount} 项风险
                </Badge>
                <Button size="sm" variant="outline" onClick={() => toast.success("已派发整改任务")}>
                  指派
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">即将过期（30 天内）</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr>
                  <th className="text-left p-2 font-medium">知识标题</th>
                  <th className="text-left p-2 font-medium">责任人</th>
                  <th className="text-left p-2 font-medium">到期</th>
                  <th className="text-left p-2 font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {(summary?.expiringItems ?? []).map((r) => (
                  <tr key={r.knowledgeItemId}>
                    <td className="p-2">{r.title}</td>
                    <td className="p-2">后端责任人</td>
                    <td className="p-2 text-warning-foreground">{r.validUntil}</td>
                    <td className="p-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => lifecycleMutation.mutate(r.knowledgeItemId)}
                      >
                        发起复核
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => lifecycleMutation.mutate(r.knowledgeItemId)}
                      >
                        延期
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
