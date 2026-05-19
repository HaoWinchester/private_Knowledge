import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  BookmarkPlus,
  Clock,
  Copy,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Flag,
  GitBranch,
  Link2,
  MessageSquare,
  Pencil,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Star,
  ThumbsDown,
  ThumbsUp,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  classificationColor,
  knowledgeItems,
  statusColor,
  type KnowledgeItem,
} from "@/lib/mock-data";
import { createKnowledgeVersion, getKnowledgeItem } from "@/lib/knowledge-api";
import { createQualitySignal } from "@/lib/quality-api";
import { createAuthorizationRequest } from "@/lib/access-api";
import { mapKnowledgeCardToUi } from "@/lib/api-mappers";
import { queryKeys } from "@/lib/query-keys";

export const Route = createFileRoute("/library/$id")({
  component: KnowledgeDetail,
  notFoundComponent: () => (
    <div className="p-8 text-center text-sm text-muted-foreground">
      未找到该知识条目。
      <Link to="/library" className="text-primary underline ml-1">
        返回知识库
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-8 text-sm text-destructive">{error.message}</div>
  ),
});

function KnowledgeDetail() {
  const queryClient = useQueryClient();
  const { id } = Route.useParams();
  const { data: detail } = useQuery({
    queryKey: queryKeys.knowledge.detail(id),
    queryFn: () => getKnowledgeItem(id),
  });
  const fallback = knowledgeItems.find((k) => k.id === id);
  const item: KnowledgeItem | undefined = detail ? mapKnowledgeCardToUi(detail) : fallback;
  const [redacted, setRedacted] = useState(true);
  const [accessReason, setAccessReason] = useState("");
  const [versionSummary, setVersionSummary] = useState("");
  const [versionSource, setVersionSource] = useState("");
  const qualityMutation = useMutation({
    mutationFn: (body: { signalType: string; value?: string; comment?: string }) =>
      createQualitySignal({ knowledgeItemId: id, ...body }),
    onSuccess: () => toast.success("反馈已写入后端质量信号"),
  });
  const accessMutation = useMutation({
    mutationFn: () =>
      createAuthorizationRequest({
        knowledgeItemId: id,
        requestedPermission: "view_content",
        businessContext: accessReason || "知识详情页访问申请",
      }),
    onSuccess: () => {
      toast.success("访问申请已提交，审批中心可见");
      setAccessReason("");
      void queryClient.invalidateQueries({ queryKey: queryKeys.access.requests });
    },
  });
  const versionMutation = useMutation({
    mutationFn: () =>
      createKnowledgeVersion(id, {
        changeSummary: versionSummary || "前端详情页提交新版本",
        source: {
          sourceType: "link_reference",
          displayName: versionSource || "前端提交的新版本来源",
          uri: versionSource || undefined,
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.knowledge.detail(id) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.review.requests("all") });
      toast.success("新版本已提交审核");
      setVersionSummary("");
      setVersionSource("");
    },
  });
  if (!item) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        正在加载知识详情，若仍无结果请返回知识库。
        <Link to="/library" className="text-primary underline ml-1">
          返回知识库
        </Link>
      </div>
    );
  }
  const versions = detail?.versions ?? [];
  const restricted = item.classification === "严格受控";

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto space-y-5">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link to="/library">
            <ArrowLeft className="h-4 w-4 mr-1" />
            知识库
          </Link>
        </Button>
        <span>/</span>
        <span>{item.domain}</span>
        <span>/</span>
        <span className="text-foreground truncate">{item.title}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={classificationColor[item.classification]}>
              {item.classification}
            </Badge>
            <Badge className={statusColor[item.status]}>{item.status}</Badge>
            <Badge variant="outline" className="text-[10px]">
              {item.version}
            </Badge>
            <span className="text-xs text-muted-foreground">ID {item.id}</span>
          </div>
          <h1 className="mt-3 text-2xl font-semibold leading-tight">{item.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{item.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => qualityMutation.mutate({ signalType: "favorite", value: "true" })}
          >
            <BookmarkPlus className="h-4 w-4 mr-1" />
            收藏
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                分享 / 引用
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>分享与引用</DialogTitle>
                <DialogDescription>
                  分享将记录到审计日志，并在对方授权范围内可见。
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">引用链接（带版本号）</Label>
                  <div className="flex gap-2 mt-1">
                    <Input readOnly value={`puhua.kb://${item.id}@${item.version}`} />
                    <Button variant="outline" size="icon" onClick={() => toast.success("已复制")}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">指定共享对象（部门 / 项目 / 人员）</Label>
                  <Input placeholder="例如：售前咨询部、智慧能源项目组" className="mt-1" />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => toast.success("已发送分享，审计记录已生成")}>
                  确认分享
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            size="sm"
            onClick={() => qualityMutation.mutate({ signalType: "export", value: "pdf" })}
          >
            <Download className="h-4 w-4 mr-1" />
            导出
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Pencil className="h-4 w-4 mr-1" />
                提交新版本
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>提交新版本</DialogTitle>
                <DialogDescription>新版本会进入同一套后端审核队列。</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">变更说明</Label>
                  <Textarea
                    value={versionSummary}
                    onChange={(e) => setVersionSummary(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">来源链接或来源名称</Label>
                  <Input
                    value={versionSource}
                    onChange={(e) => setVersionSource(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => versionMutation.mutate()}
                  disabled={versionMutation.isPending}
                >
                  {versionMutation.isPending ? "提交中..." : "提交审核"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Restricted banner */}
      {restricted && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="p-4 flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-medium text-sm">严格受控知识</div>
              <p className="text-xs text-muted-foreground mt-1">
                默认仅展示元数据。如需查看脱敏片段或在问答中引用，请提交授权申请，由项目负责人 +
                安全管理员 双重审批。
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="destructive">
                  申请访问
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>访问授权申请</DialogTitle>
                  <DialogDescription>
                    {item.title} · {item.classification}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">业务用途</Label>
                    <Textarea
                      value={accessReason}
                      onChange={(e) => setAccessReason(e.target.value)}
                      placeholder="请说明引用场景、客户、项目和使用范围…"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">有效期</Label>
                    <Input type="date" className="mt-1" />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => accessMutation.mutate()}
                    disabled={accessMutation.isPending}
                  >
                    {accessMutation.isPending ? "提交中..." : "提交申请"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        {/* Main content */}
        <div className="space-y-5">
          <Tabs defaultValue="content">
            <TabsList>
              <TabsTrigger value="content">正文</TabsTrigger>
              <TabsTrigger value="versions">版本 ({versions.length || 1})</TabsTrigger>
              <TabsTrigger value="citations">引用 ({item.citations})</TabsTrigger>
              <TabsTrigger value="discussion">讨论 (8)</TabsTrigger>
            </TabsList>
            <TabsContent value="content" className="mt-4">
              <Card>
                <CardContent className="p-6 prose prose-sm max-w-none">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b">
                    <div className="text-xs text-muted-foreground">
                      最新生效版本 · 由 {item.owner} 维护
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setRedacted(!redacted)}>
                      {redacted ? (
                        <>
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          显示完整内容
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3.5 w-3.5 mr-1" />
                          脱敏视图
                        </>
                      )}
                    </Button>
                  </div>
                  <h3 className="text-sm font-semibold">1. 适用范围</h3>
                  <p className="text-sm">
                    {item.scope}。仅在授权项目与岗位范围内复用，禁止用于外部场景。
                  </p>
                  <h3 className="text-sm font-semibold mt-4">2. 核心内容摘要</h3>
                  <p className="text-sm">{detail?.contentPreview ?? item.summary}</p>
                  <h3 className="text-sm font-semibold mt-4">3. 关键章节</h3>
                  <ul className="text-sm space-y-1">
                    <li>· 背景与目标</li>
                    <li>
                      · 关键流程节点与责任矩阵{" "}
                      {redacted && (
                        <Badge variant="outline" className="ml-2 text-[10px]">
                          已脱敏
                        </Badge>
                      )}
                    </li>
                    <li>
                      · 风险清单与缓解措施{" "}
                      {redacted && (
                        <Badge variant="outline" className="ml-2 text-[10px]">
                          已脱敏
                        </Badge>
                      )}
                    </li>
                    <li>· 模板与样例</li>
                    <li>· 复用注意事项</li>
                  </ul>
                  <h3 className="text-sm font-semibold mt-4">4. 引用来源</h3>
                  <p className="text-sm flex items-center gap-1.5">
                    <Link2 className="h-3.5 w-3.5" />
                    {item.source}
                  </p>
                </CardContent>
              </Card>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-muted-foreground">这条知识对你有帮助吗？</div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => qualityMutation.mutate({ signalType: "useful", value: "yes" })}
                  >
                    <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                    有用
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      qualityMutation.mutate({ signalType: "needs_improvement", value: "true" })
                    }
                  >
                    <ThumbsDown className="h-3.5 w-3.5 mr-1" />
                    需改进
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      qualityMutation.mutate({ signalType: "security_report", value: "review" })
                    }
                  >
                    <Flag className="h-3.5 w-3.5 mr-1" />
                    上报
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="versions" className="mt-4">
              <Card>
                <ul className="divide-y">
                  {(versions.length
                    ? versions.map((version) => ({
                        v: `v${version.versionNumber}`,
                        date: new Date(version.createdAt).toLocaleDateString("zh-CN"),
                        author: item.owner,
                        note: version.changeSummary ?? "版本变更",
                        active: version.effectiveStatus === "effective",
                      }))
                    : [
                        {
                          v: item.version,
                          date: item.updatedAt,
                          author: item.owner,
                          note: "当前生效版本",
                          active: true,
                        },
                      ]
                  ).map((v) => (
                    <li key={v.v} className="p-4 flex items-center gap-3">
                      <GitBranch className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{v.v}</span>
                          {v.active && (
                            <Badge className="bg-success/15 text-success text-[10px]">当前</Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {v.author} · {v.date}
                        </div>
                        <div className="text-xs mt-1">{v.note}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast.message(`正在打开 ${v.v} 历史快照`)}
                      >
                        查看
                      </Button>
                      {!v.active && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.success(`已对比 ${v.v} 与当前版本`)}
                        >
                          对比
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              </Card>
            </TabsContent>

            <TabsContent value="citations" className="mt-4">
              <Card>
                <CardContent className="p-4 space-y-3">
                  {[
                    "智慧能源平台-售前方案 v4.1",
                    "国网项目客户答疑话术",
                    "Agent 平台-方案生成提示词集",
                  ].map((c) => (
                    <div key={c} className="flex items-center gap-3 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1">{c}</span>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="discussion" className="mt-4">
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-xs font-medium">
                      高
                    </div>
                    <div className="flex-1">
                      <div className="text-xs">
                        <b>高扬</b> · 2 天前
                      </div>
                      <p className="text-sm mt-1">
                        第 3 节风险清单建议补充信创替换场景，最近几个项目都遇到了。
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex gap-2">
                    <Textarea placeholder="发表评论或@专家…" className="min-h-[80px]" />
                  </div>
                  <div className="flex justify-end">
                    <Button size="sm" onClick={() => toast.success("评论已发布")}>
                      <MessageSquare className="h-3.5 w-3.5 mr-1" />
                      发布
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">元数据</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2.5">
              <Row
                label="责任人"
                value={
                  <span className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    {item.owner}
                  </span>
                }
              />
              <Row label="提交人" value={item.submitter} />
              <Row label="所属部门" value={item.department} />
              <Row label="岗位方向" value={item.domain} />
              <Row label="业务主题" value={item.topic} />
              {item.customer && <Row label="客户" value={item.customer} />}
              {item.project && <Row label="项目" value={item.project} />}
              <Row label="发布时间" value={item.publishedAt || "—"} />
              <Row
                label="有效期至"
                value={
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {item.expiresAt || "永久"}
                  </span>
                }
              />
              <Row label="来源" value={<span className="text-xs">{item.source}</span>} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                访问与审计
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">本月浏览</span>
                <span className="font-medium tabular-nums">{item.views}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">被引用</span>
                <span className="font-medium tabular-nums">{item.citations}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">用户评分</span>
                <span className="font-medium flex items-center gap-1">
                  <Star className="h-3 w-3 fill-warning text-warning" />
                  {item.rating || "—"}
                </span>
              </div>
              <Separator className="my-2" />
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/audit">查看审计记录</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">标签</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-1.5">
              {item.tags.map((t) => (
                <Badge key={t} variant="secondary" className="font-normal">
                  #{t}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-muted-foreground text-xs pt-0.5">{label}</span>
      <span className="text-sm text-right">{value}</span>
    </div>
  );
}
