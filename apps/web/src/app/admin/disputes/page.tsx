"use client";

import React, { useEffect, useState } from "react";
import { client } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth-store";
import { TicketStatusBadge } from "@/components/support/TicketStatusBadge";
import { TicketThreadView, TicketThread } from "@/components/support/TicketThreadView";
import { ShieldAlert } from "lucide-react";

export default function AdminDisputesPage() {
  const { user } = useAuthStore();
  const [tickets, setTickets] = useState<TicketThread[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketThread | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const res = await client.get("/tickets/admin/all");
      setTickets(res.data || []);
      if (res.data?.length > 0 && !selectedTicket) {
        setSelectedTicket(res.data[0]);
      }
    } catch (err) {
      console.error("Failed to load admin disputes", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSendMessage = async (message: string) => {
    if (!selectedTicket) return;
    const res = await client.patch(`/tickets/${selectedTicket.id}`, { message });
    setSelectedTicket(res.data);
    fetchTickets();
  };

  const handleStatusChange = async (status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED") => {
    if (!selectedTicket) return;
    const res = await client.patch(`/tickets/${selectedTicket.id}`, { status });
    setSelectedTicket(res.data);
    fetchTickets();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-gray-900">Disputes & Support Ticket Moderation</h2>
        <p className="text-xs text-gray-500 mt-1">Review user disputes, manage ticket status, and resolve financial or booking conflicts.</p>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-card border rounded-2xl p-8 text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center mx-auto text-red-600">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-lg">No Pending Disputes</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">There are currently no active support tickets or open user disputes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Active Queue ({tickets.length})</h3>
            <div className="space-y-2">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedTicket?.id === t.id
                      ? "border-red-600 bg-red-50/50 shadow-xs"
                      : "bg-card hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-medium text-sm truncate">{t.subject}</span>
                    <TicketStatusBadge status={t.status} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="uppercase text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">{t.priority}</span>
                    <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedTicket ? (
              <TicketThreadView
                ticket={selectedTicket}
                currentUserId={user?.id || ""}
                onSendMessage={handleSendMessage}
                onStatusChange={handleStatusChange}
                isAdmin={true}
              />
            ) : (
              <div className="bg-card border rounded-2xl p-12 text-center text-muted-foreground">
                Select a ticket from the left column to view and resolve.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
