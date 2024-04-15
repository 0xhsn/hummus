"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useQuery, gql, useMutation } from '@apollo/client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { NextPageContext } from 'next';
import { useChangePasswordMutation } from "@/gql/graphql"

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
  const token = searchParams.get('token');
  const router = useRouter();

  const [changePassword, { data, loading, error }] =
    useChangePasswordMutation();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
    },
  })

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    const response = await changePassword({
      variables: {
        token: token as string,
        newPassword: values.newPassword,
      },
      refetchQueries: [{ query: GET_ME }],
    });

    const errors = response.data?.changePassword.errors;
    console.log(errors);
    if (errors) {
      errors.forEach((err) => {
        const fieldName = err.field as FormFields;
        form.setError(fieldName, {
          type: err.field,
          message: err.message,
        });
      });
    } else if (response.data?.changePassword.user) {
      router.push("/");
    }
  }

  return (
    <main className="flex flex-col items-center justify-between p-24">
  <div className="z-10 w-full max-w-xl items-center justify-between font-mono text-sm">
    <h1 className="text-4xl mb-10">Change Password</h1>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter new password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Change</Button>
      </form>
    </Form>
  </div>
</main>
  )
}


Page.getInitialProps = async (ctx: NextPageContext) => {
  const { token } = ctx.query;
  return { token: token as string };
}