"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLoginUserMutation, useMeQuery } from "../../gql/graphql";
import { useRouter } from "next/navigation";
import { useQuery, gql } from "@apollo/client";
import Link from "next/link";

const GET_ME = gql`
  query Me {
    me {
      id
      username
    }
  }
`;

const formSchema = z.object({
  usernameOrEmail: z.string(),
  password: z.string(),
});

type FormFields = keyof z.infer<typeof formSchema>;

export default function Page() {
  const [loginUser, { data, loading, error }] = useLoginUserMutation();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    const response = await loginUser({
      variables: {
        usernameOrEmail: values.usernameOrEmail,
        password: values.password,
      },
      refetchQueries: [{ query: GET_ME }],
    });

    const errors = response.data?.login.errors;
    if (errors) {
      errors.forEach((err) => {
        const fieldName = err.field as FormFields;
        form.setError(fieldName, {
          type: err.field,
          message: err.message,
        });
      });
    } else if (response.data?.login.user) {
      router.push("/");
    }
  };

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-xl items-center justify-between font-mono text-sm">
        <h1 className="text-7xl mb-10">Login</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="usernameOrEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username or Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Username or Email" {...field} />
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
                    <Input
                      type="password"
                      placeholder="Enter Password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    <Link
                      href="/forgot-password"
                      className="flex justify-end"
                    >
                      Forgot Password?
                    </Link>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Login</Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
