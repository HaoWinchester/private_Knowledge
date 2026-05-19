import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { Building2, Mail, ShieldCheck, UserRound, UsersRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { register, saveAuthSession, type RegisterPayload } from "@/lib/auth-api";
import { queryKeys } from "@/lib/query-keys";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
  head: () => ({ meta: [{ title: "注册 · 普华企业知识库" }] }),
});

const roleOptions: Array<{ label: string; value: RegisterPayload["role"] }> = [
  { label: "普通员工", value: "employee" },
  { label: "知识管理员", value: "knowledge_admin" },
  { label: "领域专家", value: "domain_expert" },
  { label: "安全管理员", value: "security_admin" },
];

function RegisterPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<RegisterPayload>({
    email: "",
    password: "",
    displayName: "",
    departmentName: "",
    role: "employee",
  });
  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: async (response) => {
      saveAuthSession(response);
      await queryClient.invalidateQueries({ queryKey: queryKeys.me });
      toast.success(`账号已创建，${response.user.displayName}`);
      await navigate({ to: "/" });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "注册失败");
    },
  });

  const update = (key: keyof RegisterPayload, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    registerMutation.mutate(form);
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-[1.08fr_0.92fr] bg-background">
      <section className="flex items-center justify-center px-5 py-10">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <UserRound className="h-5 w-5" />
              创建账号
            </CardTitle>
            <CardDescription>
              账号会写入本地 SQLite 认证数据，创建后直接进入工作台。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={submit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="displayName">姓名</Label>
                  <Input
                    id="displayName"
                    value={form.displayName}
                    onChange={(event) => update("displayName", event.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departmentName">部门</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="departmentName"
                      value={form.departmentName}
                      onChange={(event) => update("departmentName", event.target.value)}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(event) => update("email", event.target.value)}
                    className="pl-9"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">密码</Label>
                  <Input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(event) => update("password", event.target.value)}
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>角色</Label>
                  <Select
                    value={form.role}
                    onValueChange={(value) => update("role", value as RegisterPayload["role"])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button className="w-full" type="submit" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? "创建中..." : "创建并进入工作台"}
              </Button>
            </form>

            <div className="mt-5 text-center text-sm text-muted-foreground">
              已有账号？
              <Link to="/login" className="ml-1 text-primary hover:underline">
                返回登录
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="border-l bg-sidebar px-6 py-8 lg:px-10 flex flex-col">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <UsersRound className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold">身份与权限</div>
            <div className="text-xs text-muted-foreground">角色决定默认可见范围</div>
          </div>
        </div>

        <div className="mt-16 max-w-md">
          <h1 className="text-3xl font-semibold leading-tight">先建身份，再进入知识流转</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            注册信息会成为当前用户上下文，审核、授权、提交记录会按这个身份写入后端接口。
          </p>
        </div>

        <div className="mt-auto space-y-3 text-sm">
          {roleOptions.map((role) => (
            <div
              key={role.value}
              className="flex items-center justify-between rounded-md border bg-card px-3 py-2"
            >
              <span>{role.label}</span>
              <ShieldCheck className="h-4 w-4 text-success" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
