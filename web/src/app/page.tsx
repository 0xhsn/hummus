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
import { Skeleton } from "@/components/ui/skeleton"
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import Link from "next/link";
import { useMeQuery } from "@/gql/graphql";

export default function Home() {
  const { data, loading } = useMeQuery();

  let body = null;

  if (loading) {
    body = (
      <>
      <Skeleton className="h-[30px] w-[90px] rounded-xl mr-2" />
      <Skeleton className="h-[30px] w-[90px] rounded-xl" />
      </>);
  } else if (!data?.me) {
    body = (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/login" passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Login
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/register" passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Register
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
  } else {
    body = (
      <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem className="text-xl">
        @{data.me.username}
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/" passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Logout
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
    );
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full font-mono text-sm p-5 flex justify-end items-center">
        {body}
      </div>
    </main>
  );
}
