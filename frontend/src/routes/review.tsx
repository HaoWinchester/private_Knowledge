import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, ChevronRight, Filter, XCircle, RefreshCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { classificationColor, type ReviewTask } from "@/lib/ui-models";
import { listKnowledgeItems } from "@/lib/knowledge-api";
import { listIntakeRequests, reviewIntakeRequest } from "@/lib/review-api";
import { confidentialityLabels, reviewGroupLabel } from "@/lib/api-mappers";
import { queryKeys } from "@/lib/query-keys";

export const Route = createFileRoute("/review")({
  component: ReviewPage,
  head: () => ({ meta: [{ title: "审核工作台 · 普华企业知识库" }] }),
});

function ReviewPage() {
  const queryClient = useQueryClient();
  const { data: requestsData } = useQuery({
    queryKey: queryKeys.review.requests("all"),
    queryFn: () => listIntakeRequests(),
  });
  const { data: knowledgeData } = useQuery({
    queryKey: queryKeys.knowledge.list({}),
    queryFn: () => listKnowledgeItems(),
  });
  const tasks: ReviewTask[] = useMemo(
    () =>
      requestsData?.items.map((request) => {
        const item = knowledgeData?.items.find(
          (knowledge) => knowledge.id === request.knowledgeItemId,
        );
        const classification = item
          ? confidentialityLabels[item.confidentialityLevel]
          : ("部门可见" as const);
        return {
          id: request.id,
          knowledgeId: request.knowledgeItemId,
          title: item?.title ?? request.knowledgeItemId,
          submitter: "后端提交",
          submittedAt: new Date(request.createdAt).toLocaleString("zh-CN"),
          reviewer: "你",
          priority: request.reviewGroup === "security_admin" ? "高" : "中",
          classification,
          reviewType: reviewGroupLabel(request.reviewGroup),
          reason: request.status === "precheck_flagged" ? "预检查需复核" : undefined,
          status: request.status,
        };
      }) ?? [],
    [knowledgeData?.items, requestsData?.items],
  );
  const [selected, setSelected] = useState(tasks[0]?.id ?? "");
  useEffect(() => {
    if (!tasks.find((item) => item.id === selected)) {
      setSelected(tasks[0]?.id ?? "");
    }
  }, [selected, tasks]);
  const task = tasks.find((t) => t.id === selected) ?? tasks[0];
  const [decision, setDecision] = useState<"approve" | "reject" | "fix" | null>(null);
  const reviewMutation = useMutation({
    mutationFn: () =>
      reviewIntakeRequest(task.id, {
        decision:
          decision === "approve"
            ? "approve"
            : decision === "fix"
              ? "request_rectification"
              : "reject",
        comments: "前端审核工作台提交",
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.review.requests("all") });
      await queryClient.invalidateQueries({ queryKey: queryKeys.knowledge.all });
      const map = { approve: "已通过并发布", reject: "已驳回", fix: "已要求整改" };
      toast.success(`${task.id} · ${decision ? map[decision] : "已处理"}，审计记录已生成`);
      setDecision(null);
    },
  });

  const submit = () => {
    if (!decision) return toast.error("请先选择审核结论");
    reviewMutation.mutate();
  };

  if (!task) {
    return <div className="p-6 lg:p-8">暂无待审核任务</div>;
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">审核工作台</h1>
          <p className="text-sm text-muted-foreground mt-1">
            待我审核的入库申请、整改任务与下架请求
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1.5" />
            筛选
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success("已刷新")}>
            <RefreshCcw className="h-4 w-4 mr-1.5" />
            刷新
          </Button>
        </div>
      </div>

      <Tabs defaultValue="mine">
        <TabsList>
          <TabsTrigger value="mine">
            待我审核 ({tasks.filter((t) => t.reviewer === "你").length})
          </TabsTrigger>
          <TabsTrigger value="all">全部进行中</TabsTrigger>
          <TabsTrigger value="done">已完成</TabsTrigger>
          <TabsTrigger value="cc">抄送我</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4">
        <Card className="p-0 overflow-hidden">
          <ul className="divide-y max-h-[700px] overflow-auto">
            {tasks.map((t) => (
              <li
                key={t.id}
                onClick={() => setSelected(t.id)}
                className={`p-3 cursor-pointer hover:bg-accent/40 ${selected === t.id ? "bg-accent/60 border-l-2 border-primary" : ""}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">{t.id}</span>
                  <Badge
                    variant={t.priority === "高" ? "destructive" : "secondary"}
                    className="text-[10px]"
                  >
                    {t.priority}优先
                  </Badge>
                </div>
                <div className="text-sm font-medium mt-1 truncate">{t.title}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {t.submitter} · {t.submittedAt}
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <Badge className={`text-[10px] ${classificationColor[t.classification]}`}>
                    {t.classification}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {t.reviewType}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs text-muted-foreground">
                  {task.id} · {task.reviewType}
                </div>
                <CardTitle className="text-lg mt-1">{task.title}</CardTitle>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <Badge className={classificationColor[task.classification]}>
                    {task.classification}
                  </Badge>
                  <span className="text-muted-foreground">
                    提交人 {task.submitter} · {task.submittedAt}
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/library/$id" params={{ id: task.knowledgeId }}>
                  打开知识 <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            {task.reason && (
              <div className="p-3 rounded-md bg-warning/10 border border-warning/30 text-sm">
                <b>预检查提示：</b> {task.reason}
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold mb-2">审核清单</h3>
              <ul className="space-y-1.5 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" /> 元数据完整、责任人明确
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" /> 来源可追溯
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-warning-foreground" /> 密级与适用范围一致性
                  — 请人工复核
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-warning-foreground" />{" "}
                  是否包含敏感信息或客户机密 — 请人工复核
                </li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-semibold mb-2">内容预览</h3>
              <div className="text-sm text-muted-foreground border rounded-md p-4 max-h-[260px] overflow-auto">
                <p>1. 适用范围 …</p>
                <p className="mt-2">
                  2. 核心评估维度：专业能力、产品 sense、AI 实战经验、跨团队协作…
                </p>
                <p className="mt-2">
                  3. 追问清单：请描述一个你主导的 AI 产品 0→1 项目，难点与权衡…
                </p>
                <p className="mt-2">4. 典型反例：候选人混淆模型能力与产品需求的常见话术…</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-semibold mb-2">审核结论</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "approve", label: "通过并发布", icon: CheckCircle2, color: "success" },
                  { id: "fix", label: "要求整改", icon: RefreshCcw, color: "warning" },
                  { id: "reject", label: "驳回", icon: XCircle, color: "destructive" },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDecision(d.id as "approve" | "reject" | "fix")}
                    className={`border rounded-lg p-3 text-sm flex items-center gap-2 hover:bg-accent/40 ${decision === d.id ? "border-primary bg-accent/60" : ""}`}
                  >
                    <d.icon className={`h-4 w-4 text-${d.color}`} />
                    {d.label}
                  </button>
                ))}
              </div>

              {decision && (
                <div className="mt-4 space-y-3">
                  {decision !== "approve" && (
                    <div>
                      <Label>原因 *</Label>
                      <Select defaultValue="meta">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="meta">元数据缺失或不准确</SelectItem>
                          <SelectItem value="dup">与现有知识重复</SelectItem>
                          <SelectItem value="sec">含敏感或机密信息</SelectItem>
                          <SelectItem value="quality">质量不达标</SelectItem>
                          <SelectItem value="scope">适用范围不清</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div>
                    <Label>审核意见</Label>
                    <Textarea
                      placeholder="向提交人说明意见、需要补充的内容或下一步动作…"
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <div className="border-t p-4 flex items-center justify-between bg-muted/30">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setSelected(tasks[(tasks.indexOf(task) - 1 + tasks.length) % tasks.length].id)
              }
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              上一条
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => toast.success("已暂存意见")}>
                暂存
              </Button>
              <Button onClick={submit} disabled={reviewMutation.isPending}>
                {reviewMutation.isPending ? "提交中..." : "提交审核结果"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
