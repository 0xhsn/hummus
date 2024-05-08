'use client';

import React, { Suspense } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLoginUserMutation } from '../../gql/graphql';
import { useRouter, useSearchParams } from 'next/navigation';
import { gql } from '@apollo/client';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

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
  return (
    <Suspense fallback={<Skeleton />}>
      <Login />
    </Suspense>
  );
}

function Login() {
  const [loginUser] = useLoginUserMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nxt = searchParams.get('next');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await loginUser({
      variables: {
        usernameOrEmail: values.usernameOrEmail,
        password: values.password,
      },
      update: (cache, { data }) => {
        cache.writeQuery({
          query: GET_ME,
          data: {
            me: data?.login.user,
          },
        });
      }
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
      if (typeof nxt === 'string') {
        router.push(nxt);
      } else {
        router.push('/');
      }
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
                    <Link href="/forgot-password" className="flex justify-end">
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
