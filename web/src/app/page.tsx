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
import { ChevronDown, Ellipsis, Loader2, SquarePen } from "lucide-react";
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
import { AlertCircle } from "lucide-react";
import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { format } from "date-fns";

interface Post {
  creator: any;
  id: number;
  title: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

const formatDateTime = (timestamp: string) => {
  const date = new Date(Number(timestamp));
  return !isNaN(date.getTime())
    ? format(date, "yyyy-MM-dd HH:mm:ss")
    : "Invalid date";
};

export default function Home() {
  const client = useApolloClient();
  const { setTheme } = useTheme();

  const [logout, { reset, loading: logoutLoading }] = useLogoutUserMutation();
  const { data, loading } = useMeQuery();
  const {
    data: postsData,
    loading: loadingPosts,
    fetchMore,
  } = useGetPostsQuery({
    variables: {
      limit: 8,
      cursor: null as null | string,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
  });

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

  const handleLoadMore = () => {
    fetchMore({
      variables: {
        cursor:
          postsData?.posts.posts[postsData.posts.posts.length - 1].createdAt,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;

        return {
          ...prev,
          posts: {
            ...prev.posts,
            posts: [...prev.posts.posts, ...fetchMoreResult.posts.posts],
            hasMore: fetchMoreResult.posts.hasMore, // Directly use hasMore from the backend
          },
        };
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
          <NavigationMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

  return (
    <main className="flex flex-col items-center justify-between">
      <div className="w-full font-mono text-sm p-5 flex justify-end items-center">
        {body}
      </div>
      <div className="font-mono flex flex-wrap justify-center">
        {postsData && postsData.posts.posts.length > 0 ? (
          postsData.posts.posts.map((post: Post) => (
            <Card className="w-[350px] m-4" key={post.title}>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>
                  <p>@{post.creator.username}</p>
                  <p>{formatDateTime(post.createdAt)} </p>
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
        ) : (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error fetching posts</AlertTitle>
            <AlertDescription>
              Query failed or no posts available.
            </AlertDescription>
          </Alert>
        )}
      </div>
      {postsData && postsData.posts.hasMore ? (
        <Button
          className="m-3"
          variant="outline"
          size="icon"
          onClick={handleLoadMore}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      ) : (
        <Ellipsis className="mb-3 text-gray-300" />
      )}
    </main>
  );
}
