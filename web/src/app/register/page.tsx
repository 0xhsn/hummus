'use client'
 
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
 
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { gql } from '@apollo/client';
import { useRegisterUserMutation } from '../../gql/graphql';
import { useRouter } from 'next/navigation'

const GET_ME = gql`
  query Me {
    me {
      id
      username
    }
  }
`;

const formSchema = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string(),
  confirm: z.string(),
}).refine((data) => data.password === data.confirm, {
  message: 'Passwords don\'t match',
  path: ['confirm'],
});

type FormFields = keyof z.infer<typeof formSchema>;

export default function Page() {

  const [registerUser] = useRegisterUserMutation();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirm: ''
    },
  })
 
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await registerUser({
      variables: {
        options: {
          username: values.username,
          email: values.email,
          password: values.password,
        }
      },
      update: (cache, { data }) => {
        cache.writeQuery({
          query: GET_ME,
          data: {
            me: data?.register.user
          }
        })
      }
    });
    
    const errors = response.data?.register.errors;
    if (errors){
      errors.forEach(err => {
        const fieldName = err.field as FormFields;
        form.setError(fieldName, {
          type: err.field,
          message: err.message,
        })
      })
    }
    else if (response.data?.register.user) {
      router.push('/');
    }
  }
  
  return (
<main className="flex flex-col items-center justify-between p-24">
  <div className="z-10 w-full max-w-xl items-center justify-between font-mono text-sm">
    <h1 className="text-7xl mb-10">Register</h1>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter Email" {...field} />
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
                <Input type="password" placeholder="Enter Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Confirm Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Register</Button>
      </form>
    </Form>
  </div>
</main>
  )
}