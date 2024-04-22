"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import {
  useGetPostsQuery,
  useLogoutUserMutation,
  useMeQuery,
} from "@/gql/graphql";
import { gql, useApolloClient } from "@apollo/client";
import { Loader2, SquarePen } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react"

import dayjs from "dayjs";

interface Post {
  id: number;
  title: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

interface GetPostsQuery {
  posts: Post[];
}

export default function Home() {
  const client = useApolloClient();
  const [logout, { reset, loading: logoutLoading }] = useLogoutUserMutation();
  const { data, loading } = useMeQuery();
  const { data: postsData, loading: loadingPosts } = useGetPostsQuery({
    variables: {
      limit: 10,
    },
  });

  console.log("posts", postsData);
  const handleLogout = () => {
    logout({
      onCompleted: () => {
        client.writeQuery({
          query: gql`
            query Me {
              me {
                id
                username
              }
            }
          `,
          data: { me: null },
        });
      },
    });
  };

  const body =
    !data || loading ? (
      <Loader2 className="h-4 w-4 animate-spin" />
    ) : data.me ? (
      // User is logged in
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/create-post" passHref>
              <Button variant="ghost">
                <SquarePen />
              </Button>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button variant="ghost" className="text-xl">
              @{data.me.username}
            </Button>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button onClick={handleLogout} variant="outline">
              {logoutLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Logout"
              )}
            </Button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    ) : (
      // User is not logged in
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/create-post" passHref>
              <Button variant="ghost">
                <SquarePen />
              </Button>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/login" passHref>
              <Button variant="ghost">Login</Button>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/register" passHref>
              <Button variant="ghost">Register</Button>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

  return (
    <main className="flex flex-col items-center justify-between">
      <div className="w-full font-mono text-sm p-5 flex justify-end items-center">
        {body}
      </div>
      <div className="font-mono">
        {postsData && postsData.posts.length > 0 ? (
          postsData.posts.map((post: Post) => (
            <Card className="w-[350px] mb-4" key={post.title}>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>
                  {dayjs(post.createdAt, "YYYY-MM-DD HH:mm:ss.SSSSSS").format(
                    "YYYY-MM-DD HH:mm:ss"
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>{post.text}</CardContent>
            </Card>
          ))
        ) : !postsData && loadingPosts ? (
          <div className="flex flex-col justify-between space-y-6">
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-[350px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[350px]" />
                <Skeleton className="h-4 w-[350px]" />
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-[350px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[350px]" />
                <Skeleton className="h-4 w-[350px]" />
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-[350px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[350px]" />
                <Skeleton className="h-4 w-[350px]" />
              </div>
            </div>
          </div>
        ) : true && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error fetching posts</AlertTitle>
            <AlertDescription>
              Query failed or no posts available.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </main>
  );
}
