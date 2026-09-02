"use client";

import React from "react";
import { Badge } from "../ui/badge";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface CustomerNotificationsListProps {
  notifications: NotificationItem[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
}

export const CustomerNotificationsList: React.FC<CustomerNotificationsListProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-base font-bold text-gray-900">Notification Center</h3>
          {unreadCount > 0 && <Badge label={`${unreadCount} Unread`} variant="warning" size="sm" />}
        </div>
        {unreadCount > 0 && onMarkAllAsRead && (
          <button
            onClick={onMarkAllAsRead}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="p-8 text-center text-gray-500 text-sm">
          No notifications yet. You will be notified when your bookings change status.
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`p-4 flex items-start justify-between transition-colors ${
                !item.isRead ? "bg-indigo-50/40" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    !item.isRead ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  🔔
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                  <p className="text-xs text-gray-600 mt-0.5">{item.message}</p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {!item.isRead && onMarkAsRead && (
                <button
                  onClick={() => onMarkAsRead(item.id)}
                  className="text-xs font-semibold text-indigo-600 hover:underline"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
