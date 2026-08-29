"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsApi, Notification } from "@/lib/api/notifications";
import { Bell, Check } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

export function NotificationBell() {
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationsApi.getNotifications,
    refetchInterval: 10000, // Poll every 10 seconds for real-time feel
  });

  const readMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => {
      toast.error("Failed to mark notification as read");
    },
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full" />}>
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-1 rounded-full bg-red-600 text-white border-2 border-background text-[10px] font-bold">
            {unreadCount}
          </Badge>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-bold text-sm">Notifications</span>
          {unreadCount > 0 && (
            <span className="text-xs text-muted-foreground font-medium">
              {unreadCount} unread
            </span>
          )}
        </div>
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No notifications yet
          </div>
        ) : (
          notifications.map((n) => (
            <DropdownMenuItem
              key={n.id}
              onClick={() => !n.isRead && readMutation.mutate(n.id)}
              className={`p-4 flex flex-col gap-1 items-start cursor-pointer border-b last:border-0 ${
                !n.isRead ? "bg-muted/40 hover:bg-muted" : "hover:bg-muted/40"
              }`}
            >
              <div className="flex w-full items-start justify-between gap-2">
                <span className={`text-sm ${!n.isRead ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                  {n.title}
                </span>
                {!n.isRead && (
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                )}
              </div>
              <p className="text-xs text-muted-foreground text-left">{n.body}</p>
              <span className="text-[10px] text-muted-foreground/80 mt-1">
                {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
              </span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
