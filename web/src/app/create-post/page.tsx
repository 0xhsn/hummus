'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCreatePostMutation } from '../../gql/graphql';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { useIsAuth } from '@/utils/useIsAuth';

const formSchema = z.object({
  title: z.string(),
  text: z.string(),
});

export default function Page() {
  useIsAuth();
  const [createPost] = useCreatePostMutation();
  const router = useRouter();
  
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      text: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createPost({
      variables: {
        input: {
          title: values.title,
          text: values.text,
        }
      },
      update: (cache) => {
        cache.evict({ fieldName: 'posts:{}' });
      },
    });
    router.push('/');
  };

  return (
    <main className="flex flex-col items-center justify-between p-10">
      <div className="z-10 w-full max-w-xl items-center justify-between font-mono text-sm">
        <h1 className="text-7xl mb-10">Post</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="what's happening?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="details..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">post</Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
