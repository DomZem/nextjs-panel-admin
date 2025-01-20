"use client";

import { loginSchema } from "~/common/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { GalleryVerticalEnd } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { cn } from "~/lib/utils";
import Link from "next/link";
import { type z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export const LoginForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const login = api.auth.login.useMutation();

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    const response = await login.mutateAsync({
      email: data.email,
      password: data.password,
    });

    if (response.status === "success") {
      router.push("/admin");
      return;
    }

    if (response.code === "EMAIL_NOT_FOUND") {
      form.setError("email", {
        type: "manual",
        message: response.message,
      });
      return;
    }

    if (response.code === "INVALID_PASSWORD") {
      form.setError("password", {
        type: "manual",
        message: response.message,
      });
      return;
    }
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <div className="flex flex-col items-center gap-2">
        <a href="#" className="flex flex-col items-center gap-2 font-medium">
          <div className="flex h-8 w-8 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-6" />
          </div>
          <span className="sr-only">Brand Name</span>
        </a>
        <h1 className="text-xl font-bold">Welcome to Brand Name</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="anakin.skywalker@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={login.isPending}>
            Login
          </Button>
        </form>
      </Form>

      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or
        </span>
      </div>

      <Button variant="outline" className="w-full" asChild>
        <Link href="/signup">Register</Link>
      </Button>
    </div>
  );
};
