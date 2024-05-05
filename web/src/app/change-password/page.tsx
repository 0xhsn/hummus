"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { gql } from "@apollo/client";
import { useRouter, useSearchParams, notFound } from "next/navigation";
import { NextPageContext } from "next";
import { useChangePasswordMutation } from "@/gql/graphql";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const formSchema = z.object({
  newPassword: z.string(),
});

const GET_ME = gql`
  query Me {
    me {
      id
      username
    }
  }
`;

type FormFields = keyof z.infer<typeof formSchema>;

export default function Page() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const uuidFormat =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      token as string
    );
  const router = useRouter();
  const [tokenErr, setTokenErr] = useState(false);

  const [changePassword] = useChangePasswordMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await changePassword({
      variables: {
        token: token as string,
        newPassword: values.newPassword,
      },
      refetchQueries: [{ query: GET_ME }],
    });

    const errors = response.data?.changePassword.errors;

    if (errors) {
      errors.forEach((err) => {
        const fieldName = err.field as FormFields;
        form.setError(fieldName, {
          type: err.field,
          message: err.message,
        });
        if (err.field == "token") {
          setTokenErr(true);
        }
      });
    } else if (response.data?.changePassword.user) {
      router.push("/");
    }
  };

  if (!token || !uuidFormat) {
    notFound();
  }

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl mb-10">Change Password</h1>
        {tokenErr ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Your token has expired. Please initiate a new request.
            </AlertDescription>
          </Alert>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Change</Button>
            </form>
          </Form>
        )}
      </div>
    </main>
  );
}

Page.getInitialProps = async (ctx: NextPageContext) => {
  const { token } = ctx.query;
  return { token: token as string };
};
