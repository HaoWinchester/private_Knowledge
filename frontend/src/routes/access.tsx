import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, KeyRound, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { AccessRequest } from "@/lib/mock-data";
import {
  createAuthorizationRequest,
  listAuthorizationRequests,
  reviewAuthorizationRequest,
} from "@/lib/access-api";
import { authorizationStatusLabels } from "@/lib/api-mappers";
import { queryKeys } from "@/lib/query-keys";

export const Route = createFileRoute("/access")({
  component: Access,
  head: () => ({ meta: [{ title: "授权申请 · 普华企业知识库" }] }),
});

const statusBadge: Record<AccessRequest["status"], string> = {
  待审批: "bg-info/10 text-info",
  已通过: "bg-success/15 text-success",
  已拒绝: "bg-destructive/10 text-destructive",
};

function Access() {
  const queryClient = useQueryClient();
  const [targetKnowledgeId, setTargetKnowledgeId] = useState("K-2026-0156");
  const [businessContext, setBusinessContext] = useState("");
  const { data } = useQuery({
    queryKey: queryKeys.access.requests,
    queryFn: listAuthorizationRequests,
  });
  const list: AccessRequest[] =
    data?.items.map((request) => ({
      id: request.id,
      knowledgeId: request.knowledgeItemId,
      knowledgeTitle: request.knowledgeItemId,
      requester: "当前用户",
      requesterDept: "统一身份",
      reason: `申请权限：${request.requestedPermission}`,
      requestedAt: request.createdAt ? new Date(request.createdAt).toLocaleString("zh-CN") : "刚刚",
      status: authorizationStatusLabels[request.status],
      validUntil: request.expiresAt
        ? new Date(request.expiresAt).toLocaleDateString("zh-CN")
        : undefined,
    })) ?? [];
  const createMutation = useMutation({
    mutationFn: () =>
      createAuthorizationRequest({
        knowledgeItemId: targetKnowledgeId,
        requestedPermission: "view_content",
        businessContext: businessContext || "前端授权申请",
      }),
    onSuccess: async (request) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.access.requests });
      toast.success(`申请已提交，${request.id}`);
      setBusinessContext("");
    },
  });
  const reviewMutation = useMutation({
    mutationFn: ({ id, ok }: { id: string; ok: boolean }) =>
      reviewAuthorizationRequest(id, {
        decision: ok ? "approve" : "reject",
        reviewComment: ok ? "批准 90 天" : "拒绝访问申请",
        expiresAt: ok ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      }),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.access.requests });
      toast.success(variables.ok ? "已批准，授权 90 天" : "已拒绝，已通知申请人");
    },
  });

  const decide = (id: string, ok: boolean) => {
    reviewMutation.mutate({ id, ok });
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">授权申请</h1>
          <p className="text-sm text-muted-foreground mt-1">敏感与严格受控知识的访问授权审批中心</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <KeyRound className="h-4 w-4 mr-1.5" />
              我要申请访问
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>提交新的访问授权申请</DialogTitle>
              <DialogDescription>申请将路由至知识责任人 + 安全管理员审批</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>目标知识 ID 或标题</Label>
                <Input
                  value={targetKnowledgeId}
                  onChange={(e) => setTargetKnowledgeId(e.target.value)}
                  placeholder="K-2026-0156 或国网招标项目..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label>业务用途</Label>
                <Textarea
                  value={businessContext}
                  onChange={(e) => setBusinessContext(e.target.value)}
                  placeholder="说明客户、项目、引用场景与使用范围"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>有效期至</Label>
                <Input type="date" className="mt-1" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
                {createMutation.isPending ? "提交中..." : "提交"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="incoming">
        <TabsList>
          <TabsTrigger value="incoming">
            待我审批 ({list.filter((r) => r.status === "待审批").length})
          </TabsTrigger>
          <TabsTrigger value="mine">我发起的</TabsTrigger>
          <TabsTrigger value="rules">授权规则</TabsTrigger>
        </TabsList>

        <TabsContent value="incoming" className="mt-4 space-y-3">
          {list.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{r.knowledgeTitle}</span>
                    <Badge className={`text-[10px] ${statusBadge[r.status]}`}>{r.status}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {r.id} · 申请人 {r.requester} · {r.requesterDept} · {r.requestedAt}
                  </div>
                  <p className="text-sm mt-2">{r.reason}</p>
                  {r.validUntil && (
                    <div className="text-xs text-muted-foreground mt-1">
                      授权有效期至 {r.validUntil}
                    </div>
                  )}
                </div>
                {r.status === "待审批" && (
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="outline" onClick={() => decide(r.id, false)}>
                      <XCircle className="h-3.5 w-3.5 mr-1" />
                      拒绝
                    </Button>
                    <Button size="sm" onClick={() => decide(r.id, true)}>
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      批准 90 天
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {list.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                暂无授权申请。提交一条申请后会立即从后端队列显示在这里。
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="mine" className="mt-4">
          <Card>
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              你目前没有发起的访问申请。
              <div className="mt-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      提交访问申请
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>提交访问申请</DialogTitle>
                    </DialogHeader>
                    <Input
                      value={targetKnowledgeId}
                      onChange={(e) => setTargetKnowledgeId(e.target.value)}
                      placeholder="知识 ID"
                    />
                    <Textarea
                      value={businessContext}
                      onChange={(e) => setBusinessContext(e.target.value)}
                      placeholder="业务用途"
                    />
                    <DialogFooter>
                      <Button onClick={() => createMutation.mutate()}>提交</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">授权规则</CardTitle>
              <CardDescription>接入统一身份 + 知识库本地项目/密级/例外授权</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                { name: "公开内部", rule: "全员可见，无需申请" },
                { name: "部门可见", rule: "按统一身份的部门归属自动放行" },
                { name: "项目可见", rule: "按项目成员名单（本地维护）放行" },
                { name: "敏感", rule: "需要责任人审批；问答只返回脱敏片段；默认 90 天有效" },
                { name: "严格受控", rule: "需要责任人 + 安全管理员双重审批；显式审批后才能引用" },
              ].map((r) => (
                <div
                  key={r.name}
                  className="flex items-start justify-between gap-3 border rounded-md p-3"
                >
                  <div>
                    <div className="font-medium">{r.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{r.rule}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toast.message("规则编辑（演示）")}
                  >
                    编辑
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
