"use client";

import { useI18n } from "@/lib/i18n";
import { useAdmin } from "@/contexts/admin-context";
import { Bell, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LanguageSwitcherAdmin } from "../common/language-switcher-admin";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const { t } = useI18n();
  const { adminInfo, logout } = useAdmin();

  // Get initials from admin name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="fixed top-0 left-0 right-0 lg:left-64 z-40 bg-card border-b border-border lg:h-[99px] flex items-center px-6 lg:px-8">
      <div className="flex items-center justify-between w-full gap-4">
        {/* Logo và Title - Desktop */}
        <div className="hidden md:flex items-center gap-4 flex-1">
          <div>
            <h1 className="text-xl font-bold text-foreground line-clamp-1">
              {title}
            </h1>
          </div>
        </div>

        {/* Title only - Mobile */}
        <div className="md:hidden flex items-center gap-3 flex-1">
          <h1 className="text-lg font-bold text-foreground line-clamp-1">
            {title}
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <LanguageSwitcherAdmin />
          <Button variant="ghost" size="icon" className="relative h-9 w-9">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
          </Button>

          {/* Admin Profile Dropdown */}
          {adminInfo && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(adminInfo.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {adminInfo.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      @{adminInfo.username}
                    </p>
                    {adminInfo.email && (
                      <p className="text-xs leading-none text-muted-foreground">
                        {adminInfo.email}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
