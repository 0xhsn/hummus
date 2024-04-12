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
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
  confirm: z.string(),
}).refine((data) => data.password === data.confirm, {
  message: "Passwords don't match",
  path: ["confirm"], // path of error
});

type FormFields = keyof z.infer<typeof formSchema>;

export default function Page() {

  const [registerUser, { data, loading, error }] = useRegisterUserMutation();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      confirm: ""
    },
  })
 
  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    const response = await registerUser({
      variables: {
        options: {
          username: values.username,
          password: values.password,
        }
      },
      refetchQueries: [{ query: GET_ME }],
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