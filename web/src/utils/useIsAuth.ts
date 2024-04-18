import { useMeQuery } from "@/gql/graphql";
import { useRouter } from "next/navigation";
import { useEffect } from 'react';

export const useIsAuth = () => {
  const { data, loading } = useMeQuery();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !data?.me) {
      router.replace('/login');
    }
  }, [loading, data, router]);
}