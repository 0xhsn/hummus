'use client';

import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';
import {
  useLogoutUserMutation,
  useMeQuery,
} from '@/gql/graphql';
import { gql, useApolloClient } from '@apollo/client';
import { Loader2, SquarePen } from 'lucide-react';
import * as React from 'react';
import {
  MoonIcon,
  SunIcon,
} from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

export default function Nav() {
  const client = useApolloClient();
  const { setTheme } = useTheme();

  const [logout, { loading: logoutLoading }] = useLogoutUserMutation();
  const router = useRouter();

  const { data, loading } = useMeQuery();

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
            <Link href="/" passHref>
              <Button variant="ghost" className="text-xl">
                @{data.me.username}
              </Button>
            </Link>
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
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button
              onClick={async () => {
                await handleLogout();
                router.replace('/');
              }}
              variant="outline"
            >
              {logoutLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Logout'
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
                  <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

  return (
    <div className="w-full font-mono text-sm p-5 flex justify-end items-center">
      {body}
    </div>
  );
}
