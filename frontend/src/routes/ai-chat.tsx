import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowUp, FileText, Lock, Send, ShieldAlert, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import type { AIMessage } from "@/lib/mock-data";
import { answerQuestion } from "@/lib/qa-api";
import { createAuthorizationRequest } from "@/lib/access-api";
import { queryKnowledgeService } from "@/lib/integrations-api";
import { USE_GOVERNED_SERVICE } from "@/lib/api-config";
import { queryKeys } from "@/lib/query-keys";

export const Route = createFileRoute("/ai-chat")({
  component: AIChat,
  head: () => ({ meta: [{ title: "AI 问答 · 普华企业知识库" }] }),
});

const initial: AIMessage[] = [
  {
    role: "user",
    content: "国网项目的付款节奏是什么？合同里关键违约条款有哪些？",
  },
  {
    role: "assistant",
    content:
      "你查询的内容涉及【严格受控】知识。系统已识别相关知识条目，但根据当前授权策略，我无法直接返回合同条款全文。\n\n你可以提交访问授权申请，由项目负责人和安全管理员审批后，系统将以脱敏片段形式提供答案。",
    blocked: {
      reason: "严格受控知识 · 缺少显式审批",
      requestable: true,
      knowledgeId: "K-2026-0156",
    },
    citations: [
      {
        id: "K-2026-0156",
        title: "国网招标项目合同条款定稿",
        version: "v1.0",
        scope: "项目负责人、法务、CFO",
      },
    ],
  },
  {
    role: "user",
    content: "那帮我总结一下央企客户售前调研要关注哪些维度。",
  },
  {
    role: "assistant",
    content:
      "基于你授权范围内的知识，央企客户售前调研建议覆盖以下 6 个维度：\n\n1. 客户背景与组织架构（集团/二级单位、决策链）\n2. 现有 IT 系统与信创替换计划\n3. 采购流程（招投标节奏、合规要求）\n4. 关键决策人与影响人画像\n5. 历史合作伙伴与服务商关系\n6. 数据合规与安全等保要求\n\n以上来源为已发布、授权范围内的最新生效版本，建议结合具体客户进一步细化。",
    citations: [
      {
        id: "K-2026-0142",
        title: "央企集团客户售前调研框架",
        version: "v3.2",
        scope: "售前、客户经理、方案架构师",
      },
      {
        id: "K-2026-0119",
        title: "金融客户私有化部署交付复盘",
        version: "v1.1（脱敏片段）",
        scope: "交付、售前、研发",
      },
    ],
  },
];

function AIChat() {
  const queryClient = useQueryClient();
  const [msgs, setMsgs] = useState<AIMessage[]>(initial);
  const [input, setInput] = useState("");
  const accessMutation = useMutation({
    mutationFn: (knowledgeId: string) =>
      createAuthorizationRequest({
        knowledgeItemId: knowledgeId,
        requestedPermission: "view_content",
        businessContext: "AI 问答页严格受控内容访问",
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.access.requests });
      toast.success("访问申请已提交到授权审批中心");
    },
  });
  const qaMutation = useMutation({
    mutationFn: (question: string) =>
      USE_GOVERNED_SERVICE
        ? queryKnowledgeService({
            applicationId: "pilot-agent",
            requesterUserId: "frontend-user",
            requestType: "qa",
            businessContext: "frontend-ai-chat",
            input: question,
          })
        : answerQuestion(question),
    onSuccess: (response) => {
      const answer =
        "answer" in response
          ? response.answer
          : (response.output ?? response.deniedReason ?? "未返回答案");
      const strictBlocked =
        response.status === "denied" ||
        answer.includes("严格受控") ||
        response.reviewCue?.includes("严格受控");
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          content: answer,
          blocked: strictBlocked
            ? {
                reason: response.reviewCue ?? "严格受控知识 · 缺少显式审批",
                requestable: true,
                knowledgeId: response.citations[0]?.knowledgeItemId,
              }
            : undefined,
          citations: response.citations.map((citation) => ({
            id: citation.knowledgeItemId,
            title: citation.knowledgeItemId,
            version: citation.knowledgeVersionId,
            scope: citation.citationType,
          })),
        },
      ]);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "问答请求失败");
    },
  });

  const send = () => {
    if (!input.trim()) return;
    setMsgs((m) => [...m, { role: "user", content: input }]);
    const q = input;
    setInput("");
    qaMutation.mutate(q);
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r p-3 hidden lg:block">
        <Button className="w-full" variant="outline" onClick={() => setMsgs([])}>
          <Sparkles className="h-4 w-4 mr-1.5" />
          新会话
        </Button>
        <div className="mt-4 text-xs text-muted-foreground px-2">最近会话</div>
        <div className="mt-2 space-y-1">
          {["央企售前调研维度", "K8s 灾备方案", "面试评估框架更新", "金融项目复盘要点"].map(
            (c, i) => (
              <button
                key={c}
                onClick={() => toast.message("已切换会话")}
                className={`w-full text-left text-sm p-2 rounded hover:bg-accent/40 truncate ${i === 0 ? "bg-accent/60" : ""}`}
              >
                {c}
              </button>
            ),
          )}
        </div>
        <Separator className="my-4" />
        <div className="text-xs text-muted-foreground px-2 mb-2">引用范围</div>
        <div className="space-y-2 text-xs">
          {[
            { label: "公开内部 · 全部", on: true },
            { label: "部门可见 · 售前咨询", on: true },
            { label: "项目可见 · 智慧能源", on: true },
            { label: "敏感（脱敏）", on: false },
            { label: "严格受控", on: false },
          ].map((s) => (
            <label key={s.label} className="flex items-center gap-2">
              <input type="checkbox" defaultChecked={s.on} />
              {s.label}
            </label>
          ))}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-auto">
          <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
            {msgs.length === 0 && (
              <div className="text-center text-muted-foreground py-20">
                <Sparkles className="h-8 w-8 mx-auto mb-3" />
                <div className="text-sm">基于受控企业知识的可信问答 · 始终返回引用来源</div>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xl mx-auto">
                  {[
                    "客户A 类似项目我们做过什么？",
                    "K8s 在内网环境部署的踩坑清单",
                    "面试 AI 产品经理应该问什么？",
                    "近 1 年金融客户交付复盘要点",
                  ].map((q) => (
                    <Button
                      key={q}
                      variant="outline"
                      size="sm"
                      className="justify-start h-auto py-2 text-left"
                      onClick={() => setInput(q)}
                    >
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
                <div
                  className={`max-w-[85%] ${m.role === "user" ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2.5 text-sm" : "space-y-3"}`}
                >
                  {m.role === "assistant" && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Sparkles className="h-3.5 w-3.5" /> 知识助手 · 已应用你的授权过滤
                    </div>
                  )}
                  <div
                    className={
                      m.role === "assistant"
                        ? "text-sm whitespace-pre-wrap leading-relaxed"
                        : "whitespace-pre-wrap"
                    }
                  >
                    {m.content}
                  </div>

                  {m.blocked && (
                    <Card className="border-destructive/40 bg-destructive/5">
                      <CardContent className="p-3 flex items-start gap-3">
                        <Lock className="h-4 w-4 text-destructive mt-0.5" />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{m.blocked.reason}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            仅向你展示了元数据，正文已被授权策略屏蔽。
                          </div>
                        </div>
                        {m.blocked.knowledgeId && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => accessMutation.mutate(m.blocked?.knowledgeId ?? "")}
                          >
                            申请访问
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {m.citations && m.citations.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <ShieldAlert className="h-3 w-3" /> 引用 {m.citations.length} 条授权来源
                      </div>
                      {m.citations.map((c) => (
                        <Link key={c.id} to="/library/$id" params={{ id: c.id }}>
                          <Card className="p-3 hover:bg-accent/40 transition">
                            <div className="flex items-center gap-2 text-sm">
                              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="font-medium truncate">{c.title}</span>
                              <Badge variant="outline" className="text-[10px]">
                                {c.version}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {c.id} · 适用范围：{c.scope}
                            </div>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="border-t bg-card/60 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="向企业知识库提问… 系统将仅引用你授权范围内的内容并记录调用审计"
                className="pr-24 min-h-[64px] resize-none"
              />
              <Button
                size="sm"
                className="absolute right-2 bottom-2"
                onClick={send}
                disabled={qaMutation.isPending}
              >
                <Send className="h-3.5 w-3.5 mr-1" />
                {qaMutation.isPending ? "检索中" : "发送"}
                <ArrowUp className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
            <div className="text-[11px] text-muted-foreground mt-2 text-center">
              所有问答与引用都会写入审计日志 · 严格受控知识需经审批后方可引用
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
