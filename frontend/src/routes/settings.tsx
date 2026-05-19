import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/settings")({
  component: Settings,
  head: () => ({ meta: [{ title: "系统设置 · 普华企业知识库" }] }),
});

function Settings() {
  return (
    <div className="p-6 lg:p-8 max-w-[1000px] mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">系统设置</h1>
        <p className="text-sm text-muted-foreground mt-1">个人偏好、组织配置、密级策略与留存策略</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">个人</TabsTrigger>
          <TabsTrigger value="org">组织与身份</TabsTrigger>
          <TabsTrigger value="policy">密级策略</TabsTrigger>
          <TabsTrigger value="retention">留存与备份</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">个人信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>姓名</Label>
                  <Input defaultValue="李晓楠" className="mt-1" />
                </div>
                <div>
                  <Label>邮箱</Label>
                  <Input defaultValue="li.xiaonan@puhua.cn" className="mt-1" />
                </div>
                <div>
                  <Label>部门</Label>
                  <Input readOnly defaultValue="售前咨询部" className="mt-1 bg-muted/40" />
                </div>
                <div>
                  <Label>角色</Label>
                  <Input readOnly defaultValue="知识管理员" className="mt-1 bg-muted/40" />
                </div>
              </div>
              <Button onClick={() => toast.success("已保存")}>保存</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">通知偏好</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {["待审核提醒", "授权申请提醒", "我的知识被引用", "周度运营简报"].map((n) => (
                <div key={n} className="flex items-center justify-between">
                  <span className="text-sm">{n}</span>
                  <Switch defaultChecked onCheckedChange={() => toast.success("已更新")} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="org" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">统一身份接入</CardTitle>
              <CardDescription>
                用户、部门、角色来自企业统一身份；项目/密级/例外授权由知识库本地维护
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between border rounded-md p-3">
                <div>
                  <div className="font-medium">企业 SSO（OIDC）</div>
                  <div className="text-xs text-muted-foreground">
                    已连接 · 同步 1,284 名员工 · 32 个部门
                  </div>
                </div>
                <Badge className="bg-success/15 text-success">已启用</Badge>
              </div>
              <Button variant="outline" onClick={() => toast.success("身份同步已触发")}>
                立即同步
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policy" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">密级与脱敏策略</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { k: "客户名称识别 → 自动脱敏", on: true },
                { k: "合同条款 → 默认严格受控", on: true },
                { k: "源代码 → 禁止 AI 训练", on: true },
                { k: "薪酬数据 → 仅 HR + Manager", on: true },
              ].map((s) => (
                <div
                  key={s.k}
                  className="flex items-center justify-between border rounded-md p-3 text-sm"
                >
                  <span>{s.k}</span>
                  <Switch
                    defaultChecked={s.on}
                    onCheckedChange={() => toast.success("策略已更新")}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retention" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">留存与备份</CardTitle>
              <CardDescription>审计、审批、访问与调用记录至少留存 3 年</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>审计记录留存</Label>
                  <Input defaultValue="36 个月" className="mt-1" />
                </div>
                <div>
                  <Label>历史版本留存</Label>
                  <Input defaultValue="归档后 36 个月" className="mt-1" />
                </div>
                <div>
                  <Label>备份频率</Label>
                  <Input defaultValue="每日 02:00" className="mt-1" />
                </div>
                <div>
                  <Label>异常告警接收人</Label>
                  <Input defaultValue="ops@puhua.cn" className="mt-1" />
                </div>
              </div>
              <Button onClick={() => toast.success("已保存")}>保存</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
