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
import { useLogoutUserMutation, useMeQuery } from "@/gql/graphql";
import { gql, useApolloClient } from "@apollo/client";
import { Loader2 } from "lucide-react";

export default function Home() {
  const client = useApolloClient();
  const [logout, { reset, loading: logoutLoading }] = useLogoutUserMutation();
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

  const body = !data || loading ? (
    <Loader2 className="h-4 w-4 animate-spin" />
  ) : data.me ? (
    // User is logged in
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem className="mr-2 text-lg">@{data.me.username}</NavigationMenuItem>
        <NavigationMenuItem>
          <Button onClick={handleLogout} variant="outline">
            {logoutLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Logout"}
          </Button>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ) : (
    // User is not logged in
    <NavigationMenu>
      <NavigationMenuList>
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
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full font-mono text-sm p-5 flex justify-end items-center">
        {body}
      </div>
    </main>
  );
}
