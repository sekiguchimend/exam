"use client";
import React from 'react';
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import Link from 'next/link';

const components: { title: string; href: string; description: string }[] = [
  {
    title: "東京大学",
    href: "/toudai",
    description: "東京大学を志望する方のコミュニティー。赤門目指して頑張ろう！",
  },
  {
    title: "京都大学",
    href: "/kyouto",
    description: "京都大学を志望する方のコミュニティー。奇人を目指して頑張ろう！",
  },
  {
    title: "東京工業大学",
    href: "/toukou",
    description: "東工大を志望する方のコミュニティー。数学病を目指して頑張ろう！",
  },
  {
    title: "一橋大学",
    href: "/hitotubasi",
    description: "一橋大学を志望する方のコミュニティー。可愛い女子目指して頑張ろう！",
  },
  {
    title: "早稲田大学",
    href: "/waseda",
    description: "早稲田大学を志望する方のコミュニティー。最高のキャンパスライフ目指して頑張ろう！",
  },
  {
    title: "慶応義塾大学",
    href: "/keiou",
    description: "慶応大学を志望する方のコミュニティー。就活無双を目指して頑張ろう！",
  },
];

export const Header = () => {
  const { setTheme } = useTheme();
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div>
      <div className="flex items-center">

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

      </div>
      <Link href="/" passHref>
        <div className="mx-auto text-4xl font-serif underline mt-4 cursor-pointer text-center">
          <h2>逆転合格コミュニティー</h2>
        </div>
      </Link>

      <div className="py-8 px-8 flex items-center justify-between">

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>How to use ?</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <Link href="/">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            アプリ化の推奨
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            当サイトはアプリ化に対応しています。ホーム画面に当サイト
                            を追加することで簡単に使うことができます。10秒で簡単にアプリ化する方法
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </Link>
                  </li>
                  <ListItem href="/docs" title="料金の支払い方法">
                    通常の塾と同じように指定の口座に振り込むだけです
                  </ListItem>
                  <ListItem href="/docs/installation" title="パソコン使用の推奨">
                    スマホ画面も対応していますがパソコンでの使用を推奨する理由
                  </ListItem>
                  <ListItem href="/docs/primitives/typography" title="オフ会の開催">
                    テスト後などのタイミングで要望があればオフ会を開催します
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>University</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
                        

          </NavigationMenuItem>
          <NavigationMenuItem>
  <Link href="page" passHref>
    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
      Documentation
    </NavigationMenuLink>
  </Link>
</NavigationMenuItem>

          </NavigationMenuList>

        </NavigationMenu>
      </div>

      <div style={{ position: 'absolute', top: '0', right: '0' }}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </div>
    </div>
  );
};

export default Header;

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
  title: string;
  href: string;
}

const ListItem = React.forwardRef<React.ElementRef<"a">, ListItemProps>(
  ({ className, title, children, href, ...props }, ref) => {
    return (
      <li>
        <Link href={href} passHref>
          <NavigationMenuLink asChild>
            <a
              ref={ref}
              className={cn(
                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                className
              )}
              {...props}
            >
              <div className="text-sm font-medium leading-none">{title}</div>
              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                {children}
              </p>
            </a>
          </NavigationMenuLink>
        </Link>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";