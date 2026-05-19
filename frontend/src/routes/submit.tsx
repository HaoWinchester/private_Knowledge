import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Folder,
  Link2,
  Mic,
  PenLine,
  Upload as UploadIcon,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createKnowledgeSubmission } from "@/lib/knowledge-api";
import { mapSubmitFormToPayload } from "@/lib/api-mappers";
import { queryKeys } from "@/lib/query-keys";

export const Route = createFileRoute("/submit")({
  component: Submit,
  head: () => ({ meta: [{ title: "提交入库 · 普华企业知识库" }] }),
});

const sourceTypes = [
  { id: "doc", label: "文档", icon: FileText, desc: "Word / PDF / Markdown" },
  { id: "note", label: "笔记", icon: PenLine, desc: "调研、走访、内部笔记" },
  { id: "meeting", label: "会议纪要", icon: Mic, desc: "周会、客户会议" },
  { id: "project", label: "项目资料", icon: Folder, desc: "复盘、方案、交付物" },
  { id: "link", label: "链接引用", icon: Link2, desc: "外部 / 内部 URL" },
  { id: "form", label: "结构化表单", icon: FileText, desc: "面试评估、调研问卷" },
];

function Submit() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [classification, setClassification] = useState("dept");
  const [tags, setTags] = useState<string[]>(["售前", "客户调研"]);
  const [tagInput, setTagInput] = useState("");
  const submitMutation = useMutation({
    mutationFn: createKnowledgeSubmission,
    onSuccess: async (request) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.review.requests("all") });
      await queryClient.invalidateQueries({ queryKey: queryKeys.knowledge.all });
      toast.success(`入库申请已提交 · ${request.id} 已路由至审核`);
      setTimeout(() => navigate({ to: "/review" }), 500);
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = mapSubmitFormToPayload(new FormData(e.currentTarget), tags);
    submitMutation.mutate(payload);
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">提交入库</h1>
        <p className="text-sm text-muted-foreground mt-1">
          所有提交都将经过预检查与人工审核，发布后将形成可追溯、可版本化的知识卡片。
        </p>
      </div>

      <Tabs defaultValue="new">
        <TabsList>
          <TabsTrigger value="new">新建入库</TabsTrigger>
          <TabsTrigger value="drafts">我的草稿 (3)</TabsTrigger>
          <TabsTrigger value="bind">业务动作绑定</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="mt-5">
          <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
            <input
              type="hidden"
              name="confidentialityLevel"
              value={
                {
                  open: "公开内部",
                  dept: "部门可见",
                  proj: "项目可见",
                  sens: "敏感",
                  strict: "严格受控",
                }[classification] ?? "部门可见"
              }
            />
            <div className="space-y-5">
              {/* Step 1: source */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className="text-xs bg-primary text-primary-foreground rounded h-5 w-5 flex items-center justify-center">
                      1
                    </span>{" "}
                    选择来源类型
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {sourceTypes.map((s) => (
                      <label key={s.id} className="cursor-pointer">
                        <input
                          type="radio"
                          name="sourceLabel"
                          value={s.label}
                          defaultChecked={s.id === "doc"}
                          className="peer sr-only"
                        />
                        <div className="border rounded-lg p-3 hover:bg-accent/40 peer-checked:border-primary peer-checked:bg-accent/60 transition">
                          <s.icon className="h-4 w-4 mb-1.5" />
                          <div className="text-sm font-medium">{s.label}</div>
                          <div className="text-[11px] text-muted-foreground">{s.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div
                    className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/40 cursor-pointer"
                    onClick={() => toast.message("选择文件中…（演示）")}
                  >
                    <UploadIcon className="h-6 w-6 mx-auto text-muted-foreground" />
                    <div className="text-sm mt-2">
                      拖拽文件至此处，或<span className="text-primary"> 点击选择</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      支持 Word / PDF / Markdown / 链接，单个 ≤ 50MB
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step 2: metadata */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className="text-xs bg-primary text-primary-foreground rounded h-5 w-5 flex items-center justify-center">
                      2
                    </span>{" "}
                    必填元数据
                  </CardTitle>
                  <CardDescription>这些信息将驱动后续审核路由、检索过滤与生命周期</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>知识标题 *</Label>
                    <Input
                      name="title"
                      required
                      placeholder="例如：央企集团客户售前调研框架 v3.2"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>摘要 *</Label>
                    <Textarea
                      name="summary"
                      required
                      placeholder="一句话概述知识的核心内容、适用场景与受众"
                      className="mt-1 min-h-[80px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>责任人 *</Label>
                      <Input
                        name="responsibleUserId"
                        required
                        defaultValue="user-knowledge-admin"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>提交人</Label>
                      <Input readOnly defaultValue="李晓楠（你）" className="mt-1 bg-muted/40" />
                    </div>
                    <div>
                      <Label>岗位方向 *</Label>
                      <Select defaultValue="售前">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="售前">售前咨询</SelectItem>
                          <SelectItem value="研发">研发</SelectItem>
                          <SelectItem value="交付">交付</SelectItem>
                          <SelectItem value="运维">运维</SelectItem>
                          <SelectItem value="HR">HR</SelectItem>
                          <SelectItem value="法务">法务</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>业务主题 *</Label>
                      <Input
                        name="businessTheme"
                        required
                        placeholder="客户调研 / 架构实践 / …"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>客户 / 行业</Label>
                      <Input
                        name="customerOrProject"
                        placeholder="国家电网 / 金融 / 央企"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>关联项目</Label>
                      <Input placeholder="智慧能源平台" className="mt-1" />
                    </div>
                    <div>
                      <Label>适用范围 *</Label>
                      <Input
                        name="applicableScope"
                        required
                        placeholder="售前 / 客户经理 / 架构师"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>有效期至</Label>
                      <Input
                        name="validUntil"
                        type="date"
                        defaultValue="2027-05-18"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>建议标签</Label>
                    <div className="mt-1 flex flex-wrap gap-1.5 border rounded-md p-2 min-h-[40px]">
                      {tags.map((t) => (
                        <Badge key={t} variant="secondary" className="gap-1">
                          #{t}
                          <button
                            type="button"
                            onClick={() => setTags(tags.filter((x) => x !== t))}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                      <input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && tagInput.trim()) {
                            e.preventDefault();
                            setTags([...tags, tagInput.trim()]);
                            setTagInput("");
                          }
                        }}
                        placeholder="输入后回车添加…"
                        className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step 3: classification */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className="text-xs bg-primary text-primary-foreground rounded h-5 w-5 flex items-center justify-center">
                      3
                    </span>{" "}
                    密级与受控策略
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={classification}
                    onValueChange={setClassification}
                    className="space-y-2"
                  >
                    {[
                      { id: "open", title: "公开内部", desc: "全员可见，可被检索、问答、引用" },
                      { id: "dept", title: "部门可见", desc: "限定部门成员，问答时返回完整内容" },
                      { id: "proj", title: "项目可见", desc: "限定项目成员，按项目授权过滤" },
                      { id: "sens", title: "敏感", desc: "需审批，问答时返回脱敏片段" },
                      {
                        id: "strict",
                        title: "严格受控",
                        desc: "默认仅元数据，显式审批后才返回脱敏片段",
                      },
                    ].map((c) => (
                      <Label
                        key={c.id}
                        htmlFor={c.id}
                        className="flex items-start gap-3 border rounded-lg p-3 cursor-pointer hover:bg-accent/40 has-[:checked]:border-primary has-[:checked]:bg-accent/60"
                      >
                        <RadioGroupItem value={c.id} id={c.id} className="mt-0.5" />
                        <div>
                          <div className="font-medium text-sm">{c.title}</div>
                          <div className="text-xs text-muted-foreground">{c.desc}</div>
                        </div>
                      </Label>
                    ))}
                  </RadioGroup>
                  {(classification === "sens" || classification === "strict") && (
                    <div className="mt-3 p-3 rounded-md bg-warning/10 border border-warning/30 text-xs flex gap-2">
                      <AlertCircle className="h-4 w-4 text-warning-foreground shrink-0" />
                      <span>系统将自动启用脱敏与审批流程，并通知安全管理员复核。</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Side panel */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">入库预检查</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <Check ok>必填元数据完整</Check>
                  <Check ok>未检测到与现有知识重复</Check>
                  <Check warn>检测到 2 处疑似客户名称，建议复核</Check>
                  <Check ok>来源可追溯</Check>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">审核路由预测</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary" /> 知识管理员：李晓楠
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-info" /> 领域专家：王志远
                  </div>
                  {(classification === "sens" || classification === "strict") && (
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-destructive" /> 安全管理员：周静
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="text-xs text-muted-foreground">预计审核时长：1 个工作日内</div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-2 sticky top-20">
                <Button type="submit" size="lg" disabled={submitMutation.isPending}>
                  {submitMutation.isPending ? "提交中..." : "提交入库申请"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => toast.success("已保存为草稿")}
                >
                  保存草稿
                </Button>
                <Button type="button" variant="ghost" onClick={() => navigate({ to: "/library" })}>
                  取消
                </Button>
              </div>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="drafts" className="mt-5">
          <Card>
            <ul className="divide-y">
              {[
                { title: "Q2 售前竞争分析（草稿）", updated: "2026-05-16 16:20" },
                { title: "Agent 平台压测报告", updated: "2026-05-14 11:02" },
                { title: "新员工入职手册补充", updated: "2026-05-10 09:30" },
              ].map((d) => (
                <li key={d.title} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{d.title}</div>
                    <div className="text-xs text-muted-foreground">上次编辑 {d.updated}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      继续编辑
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => toast.success("草稿已删除")}>
                      删除
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="bind" className="mt-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">业务动作绑定入库</CardTitle>
              <CardDescription>
                项目复盘、售前归档、交付复盘、招聘评估等业务动作自动触发入库
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { name: "项目复盘 → 入库", desc: "项目结束触发复盘模板，复盘归档自动生成知识" },
                { name: "售前归档 → 入库", desc: "售前阶段结束后，方案与调研材料自动入库" },
                { name: "交付复盘 → 入库", desc: "交付完成后自动汇总踩坑清单与改进建议" },
                { name: "招聘评估 → 入库", desc: "面试评估表单完成后自动沉淀岗位画像" },
              ].map((t) => (
                <Card key={t.name} className="p-4">
                  <div className="font-medium text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{t.desc}</div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3"
                    onClick={() => toast.success(`${t.name} 已启用`)}
                  >
                    启用
                  </Button>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Check({
  ok,
  warn,
  children,
}: {
  ok?: boolean;
  warn?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      {ok && <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />}
      {warn && <AlertCircle className="h-4 w-4 text-warning-foreground shrink-0 mt-0.5" />}
      <span className={warn ? "text-warning-foreground" : ""}>{children}</span>
    </div>
  );
}
