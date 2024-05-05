import { useMeQuery } from '@/gql/graphql';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useIsAuth = () => {
  const { data, loading } = useMeQuery();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !data?.me) {
      router.replace('/login?next=' + pathname.slice(1));
    }
  }, [loading, data, router]);
}