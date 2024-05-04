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
  GetPostsQuery,
  VoteMutation,
  useGetPostsQuery,
  useLogoutUserMutation,
  useMeQuery,
  useVoteMutation,
} from "@/gql/graphql";
import { ApolloCache, gql, useApolloClient } from "@apollo/client";
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
import {
  MoonIcon,
  SunIcon,
  PlusCircledIcon,
  MinusCircledIcon,
  OpenInNewWindowIcon,
} from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { format } from "date-fns";

interface Post {
  id: number;
  points: number;
  title: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: number;
    username: string;
  };
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
  const [vote] = useVoteMutation();

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
    // fetchPolicy: "no-cache",
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

  const handleVote = async (postId: number, value: number) => {
    await vote({
      variables: { postId, value },
    });
  };

  return (
    <div className="flex flex-col items-center justify-between">
      <div className="font-mono flex flex-wrap justify-center">
        {postsData && postsData.posts.posts.length > 0 ? (
          postsData.posts.posts.map((post: Post) => (
            <Card className="w-[350px] m-4" key={post.title}>
              <CardHeader>
                <CardDescription>
                  <p>@{post.creator.username}</p>
                  <p>{formatDateTime(post.createdAt)} </p>
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm">{post.text}</CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() => handleVote(post.id, 1)}
                >
                  <PlusCircledIcon />
                </Button>
                <span className="mr-2 text-sm">{post.points}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleVote(post.id, -1)}
                >
                  <MinusCircledIcon />
                </Button>
                <Link href="/post/[id]" as={`/post/${post.id}`} className="ml-auto">
                  <Button variant="outline" size="sm" >
                    <OpenInNewWindowIcon />
                  </Button>
                </Link>
              </CardFooter>
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
    </div>
  );
}
