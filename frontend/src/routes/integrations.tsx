import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plug, Copy, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  getApplicationPolicies,
  listApplications,
  rotateApplicationKey,
  updateApplicationPolicies,
} from "@/lib/integrations-api";
import { API_BASE_URL } from "@/lib/api-config";
import { queryKeys } from "@/lib/query-keys";

export const Route = createFileRoute("/integrations")({
  component: Integrations,
  head: () => ({ meta: [{ title: "AI 接入 · 普华企业知识库" }] }),
});

function Integrations() {
  const queryClient = useQueryClient();
  const [show, setShow] = useState(false);
  const [maskedKey, setMaskedKey] = useState("pk_live_••••••••••••••••a3f2");
  const { data: appData } = useQuery({
    queryKey: queryKeys.integrations.applications,
    queryFn: listApplications,
  });
  const { data: policies } = useQuery({
    queryKey: queryKeys.integrations.policies,
    queryFn: getApplicationPolicies,
  });
  const rotateMutation = useMutation({
    mutationFn: rotateApplicationKey,
    onSuccess: (response) => {
      setMaskedKey(response.maskedKey);
      toast.success("已重置 Key，旧 Key 立即失效");
    },
  });
  const policyMutation = useMutation({
    mutationFn: updateApplicationPolicies,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.integrations.policies });
      toast.success("策略已更新到后端");
    },
  });
  const registeredApps = appData?.items ?? [];
  const policyRows = [
    { key: "prohibitTraining", label: "禁止高敏知识进入模型训练集" },
    { key: "sensitiveOnlyDesensitized", label: "敏感知识仅返回脱敏片段" },
    { key: "strictRequiresApproval", label: "严格受控知识需显式审批后才返回" },
    { key: "forceAudit", label: "所有调用强制写入审计" },
  ] as const;
  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">AI 应用接入</h1>
        <p className="text-sm text-muted-foreground mt-1">
          受控知识服务统一接入：权限过滤 · 引用溯源 · 调用审计
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Plug className="h-4 w-4" />
            知识服务接入端点
          </CardTitle>
          <CardDescription>所有上层 AI 应用代表用户调用该端点，系统按用户身份过滤</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs">Endpoint</Label>
            <div className="flex gap-2 mt-1">
              <Input readOnly value={`${API_BASE_URL}/api/v1/knowledge/query`} />
              <Button variant="outline" size="icon" onClick={() => toast.success("已复制")}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <Label className="text-xs">API Key（仅展示一次）</Label>
            <div className="flex gap-2 mt-1">
              <Input readOnly type={show ? "text" : "password"} value={maskedKey} />
              <Button variant="outline" size="icon" onClick={() => setShow(!show)}>
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  rotateMutation.mutate(registeredApps[0]?.applicationId ?? "pilot-agent")
                }
                disabled={rotateMutation.isPending}
              >
                重置
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">已注册的上层应用</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr>
                <th className="text-left p-2 font-medium">应用名</th>
                <th className="text-left p-2 font-medium">状态</th>
                <th className="text-left p-2 font-medium">本月调用</th>
                <th className="text-left p-2 font-medium">拒绝</th>
                <th className="text-left p-2 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {registeredApps.map((a) => (
                <tr key={a.applicationId}>
                  <td className="p-2 font-medium">
                    {a.name}{" "}
                    {a.pilot && (
                      <Badge className="ml-1 text-[10px] bg-info/10 text-info">试点</Badge>
                    )}
                  </td>
                  <td className="p-2">
                    <Badge
                      className={
                        a.status === "connected"
                          ? "bg-success/15 text-success text-[10px]"
                          : "bg-muted text-muted-foreground text-[10px]"
                      }
                    >
                      {a.status === "connected" ? "已接入" : "待接入"}
                    </Badge>
                  </td>
                  <td className="p-2 tabular-nums">{a.monthlyCalls.toLocaleString()}</td>
                  <td className="p-2 tabular-nums text-destructive">
                    {a.deniedCalls.toLocaleString()}
                  </td>
                  <td className="p-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast.message("打开应用详情")}
                    >
                      查看
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => rotateMutation.mutate(a.applicationId)}
                    >
                      密钥
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">全局策略</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {policyRows.map((s) => (
            <div key={s.key} className="flex items-center justify-between border rounded-md p-3">
              <span>{s.label}</span>
              <Switch
                checked={policies?.[s.key] ?? true}
                onCheckedChange={(checked) => policyMutation.mutate({ [s.key]: checked })}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
