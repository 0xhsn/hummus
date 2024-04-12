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

const GET_POSTS = gql(/* GraphQL */ `
  query GetPosts {
    posts {
      id
      title
    }
  }
`);

const REGISTER_USER_MUTATION = gql`
  mutation RegisterUserMutation($options: UsernamePasswordInput!){
    register(options: $options) {
      errors {
        field
        message
      }
      user {
        username
      }
    }
  }
`

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
  confirm: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
}).refine((data) => data.password === data.confirm, {
  message: "Passwords don't match",
  path: ["confirm"], // path of error
});


export default function Page() {
  // const { loading, error, data } = useQuery(GET_POSTS);

  // const [, registerUser] = useMutation(REGISTER_USER_MUTATION);

  const [registerUser, { data, loading, error }] = useMutation(REGISTER_USER_MUTATION);

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
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    return registerUser({
      variables: {
        options: {
          username: values.username,
          password: values.password,
        }
      },
    });
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