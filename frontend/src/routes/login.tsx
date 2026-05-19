import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { BookOpen, KeyRound, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { login, saveAuthSession } from "@/lib/auth-api";
import { queryKeys } from "@/lib/query-keys";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "登录 · 普华企业知识库" }] }),
});

const quickLogin = {
  email: "admin@puhua.local",
  password: "Puhua@2026",
};

function LoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: async (response) => {
      saveAuthSession(response);
      await queryClient.invalidateQueries({ queryKey: queryKeys.me });
      toast.success(`欢迎回来，${response.user.displayName}`);
      await navigate({ to: "/" });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "登录失败");
    },
  });

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginMutation.mutate({ email, password });
  };

  const signInQuickly = () => {
    setEmail(quickLogin.email);
    setPassword(quickLogin.password);
    loginMutation.mutate(quickLogin);
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-[0.9fr_1.1fr] bg-background">
      <section className="border-r bg-sidebar px-6 py-8 lg:px-10 flex flex-col">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold">普华知识库</div>
            <div className="text-xs text-muted-foreground">受控知识中台</div>
          </div>
        </div>

        <div className="mt-16 max-w-md">
          <Badge variant="outline" className="mb-4">
            Private Knowledge Flow
          </Badge>
          <h1 className="text-3xl font-semibold leading-tight">统一身份进入受控知识工作台</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            登录后将按你的角色、部门和项目权限加载知识、审核、授权与审计数据。
          </p>
        </div>

        <div className="mt-auto grid gap-3 text-sm">
          {[
            "登录态写入本地会话 token，业务数据仍全部来自后端数据库。",
            "严格受控知识默认只展示元数据，授权后才能进入复用流程。",
            "所有提交、问答、授权动作都会进入审计记录。",
          ].map((item) => (
            <div key={item} className="flex gap-2 text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-success" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex items-center justify-center px-5 py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <LockKeyhole className="h-5 w-5" />
              登录
            </CardTitle>
            <CardDescription>使用已注册邮箱进入企业知识库。</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={submit}>
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="pl-9"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="pl-9"
                    autoComplete="current-password"
                    minLength={8}
                    required
                  />
                </div>
              </div>
              <Button className="w-full" type="submit" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "登录中..." : "登录工作台"}
              </Button>
            </form>

            <div className="mt-5 rounded-md border bg-muted/30 p-3 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-medium">本地快速登录账号</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    仅用于本地试点调试，账号已写入 SQLite。
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={signInQuickly}
                  disabled={loginMutation.isPending}
                >
                  一键登录
                </Button>
              </div>
              <div className="mt-3 grid gap-1.5 text-xs">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">账号</span>
                  <code className="rounded bg-background px-2 py-1 font-mono">
                    {quickLogin.email}
                  </code>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">密码</span>
                  <code className="rounded bg-background px-2 py-1 font-mono">
                    {quickLogin.password}
                  </code>
                </div>
              </div>
            </div>

            <div className="mt-5 text-center text-sm text-muted-foreground">
              还没有账号？
              <Link to="/register" className="ml-1 text-primary hover:underline">
                创建账号
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
