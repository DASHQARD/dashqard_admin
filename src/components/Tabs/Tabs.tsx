'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/libs';

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]',
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        'inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-full border border-transparent px-4 py-1 text-sm font-bold whitespace-nowrap text-foreground transition-[color,box-shadow] focus-visible:border-ring focus-visible:outline-1 focus-visible:outline-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-gray-200 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm dark:text-muted-foreground dark:data-[state=active]:border-gray-600 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
        className
      )}
      {...props}
    >
      <svg
        width="15"
        height="15"
        fill="none"
        viewBox="0 0 15 15"
        className="text-current"
        aria-hidden
      >
        <path
          d="M3.333 11.767v.9m0 0v.9m0-.9h.9m-.9 0h-.9M8.6 2c.427 3.358 1.754 5.428 5.4 6-3.46.543-4.953 2.485-5.4 6-.447-3.515-1.94-5.457-5.4-6 3.46-.543 4.953-2.485 5.4-6zM2.8 1c.165 1.004.768 1.63 1.8 1.8-1.032.17-1.635.796-1.8 1.8-.165-1.004-.768-1.63-1.8-1.8 1.004-.165 1.63-.768 1.8-1.8z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {props.children}
    </TabsPrimitive.Trigger>
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
