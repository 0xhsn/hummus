'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  VoteMutation,
  useDeletePostMutation,
  useGetPostsQuery,
  useMeQuery,
  useVoteMutation,
} from '@/gql/graphql';
import { ApolloCache, gql } from '@apollo/client';
import { ChevronDown, Ellipsis } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import * as React from 'react';
import {
  PlusCircledIcon,
  MinusCircledIcon,
  OpenInNewWindowIcon,
  TrashIcon,
} from '@radix-ui/react-icons';

import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';


const formatDateTime = (timestamp: string) => {
  const date = new Date(Number(timestamp));
  return !isNaN(date.getTime())
    ? format(date, 'yyyy-MM-dd HH:mm:ss')
    : 'Invalid date';
};

export default function Home() {
  const [vote] = useVoteMutation();

  const { data } = useMeQuery();
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
  });

  const [deletePost] = useDeletePostMutation();

  const handleLoadMore = () => {
    fetchMore({
      variables: {
        cursor:
          postsData?.posts.posts[postsData.posts.posts.length - 1].createdAt,
      }
    });
  };

  const updateAfterVote = (
    value: number,
    postId: number,
    cache: ApolloCache<VoteMutation>
  ) => {
    const data = cache.readFragment<{
      id: number;
      points: number;
      voteStatus: number | null;
    }>({
      id: 'Post:' + postId,
      fragment: gql`
        fragment _ on Post {
          id
          points
          voteStatus
        }
      `,
    });
  
    if (data) {
      if (data.voteStatus === value) {
        return;
      }
      const newPoints =
        (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
      cache.writeFragment({
        id: 'Post:' + postId,
        fragment: gql`
          fragment __ on Post {
            points
            voteStatus
          }
        `,
        data: { points: newPoints, voteStatus: value },
      });
    }
  };

  const handleVote = async (postId: number, value: number) => {
    await vote({
      variables: { value, postId },
      update: (cache) => updateAfterVote(value, postId, cache),
    });
  };

  const handleDelete = async (postId: number) => {
    await deletePost({
      variables: { id: postId },
      update: (cache) => {
        cache.evict({ id: 'Post:' + postId });
      }
    });
  };

  const loggedIn = data?.me;

  return (
    <div className="flex flex-col items-center justify-between">
      <div className="font-mono flex flex-wrap justify-center">
        {postsData && postsData.posts.posts.length > 0 ? (
          postsData.posts.posts.map((post: { __typename?: 'Post' | undefined; id: number; title: string; text: string; createdAt: string; updatedAt: string; points: number; voteStatus?: number | null | undefined; creator: { __typename?: 'User' | undefined; id: number; username: string; }; }) => (
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
                  className={`mr-2 ${post.voteStatus === 1 ? 'text-green-400' : ''} hover:text-green-400`}
                  onClick={() => handleVote(post.id, 1)}
                  disabled={!loggedIn}
                >
                  <PlusCircledIcon />
                </Button>
                <span className="mr-2 text-sm">{post.points}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleVote(post.id, -1)}
                  className={`mr-2 ${post.voteStatus === -1 ? 'text-red-400' : ''} hover:text-red-400`}
                  disabled={!loggedIn}
                >
                  <MinusCircledIcon />
                </Button>
                <Link
                  href="/post/[id]"
                  as={`/post/${post.id}`}
                  className="ml-auto"
                >
                  <Button variant="outline" size="sm">
                    <OpenInNewWindowIcon />
                  </Button>
                </Link>
                {data?.me?.id === post.creator.id && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="ml-2 hover:text-red-400">
                        <TrashIcon />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your post and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(post.id)}
                          className="hover:bg-red-400"
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
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
        <Ellipsis className="mb-3 text-gray-300 dark:opacity-50" />
      )}
    </div>
  );
}
