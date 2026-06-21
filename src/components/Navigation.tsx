"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckSquare, LayoutDashboard, Settings, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import clsx from "clsx";
import { useEffect, useState } from "react";

const navItems = [
  { name: "Today", href: "/", icon: CheckSquare },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed bottom-0 w-full md:w-64 md:h-screen bg-white dark:bg-neutral-900 border-t md:border-t-0 md:border-r border-neutral-200 dark:border-neutral-800 p-4 flex md:flex-col justify-between z-50">
      <div className="flex w-full md:flex-col gap-2 justify-around md:justify-start">
        <div className="hidden md:flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold">
            H
          </div>
          <span className="font-bold text-xl dark:text-white">Habits</span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 p-3 rounded-xl transition-colors",
                isActive
                  ? "bg-neutral-100 dark:bg-neutral-800 text-emerald-600 dark:text-emerald-400 font-medium"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              <Icon size={24} />
              <span className="hidden md:block">{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="hidden md:block">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex w-full items-center gap-3 p-3 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
        >
          {mounted && theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
          <span>{mounted && theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>
    </nav>
  );
}
