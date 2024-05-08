'use client';

import { usePostQuery } from '@/gql/graphql';

export default function Page({ params }: { params: { id: string } }) {
  const { data } = usePostQuery({
    variables: {
      id: parseInt(params.id),
    },
  });
  
  return (
    <main className="flex flex-col items-center justify-between font-mono p-10">
      <h1 className="text-2xl font-bold text-center mt-4">
        {data?.post?.title}
      </h1>
      <span className="text-sm text-center mt-2 text-gray-400">
        @{data?.post?.creator?.username}
      </span>
      <p className="text-md text-start mt-2">{data?.post?.text}</p>
    </main>
  );
}
