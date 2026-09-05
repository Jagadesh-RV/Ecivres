"use client";

import React, { useEffect, useState } from "react";
import { client } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { TicketStatusBadge } from "@/components/support/TicketStatusBadge";
import { CreateTicketModal } from "@/components/support/CreateTicketModal";
import { TicketThreadView, TicketThread } from "@/components/support/TicketThreadView";
import { LifeBuoy, PlusCircle } from "lucide-react";

export default function ProviderSupportPage() {
  const { user } = useAuthStore();
  const [tickets, setTickets] = useState<TicketThread[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketThread | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const res = await client.get("/tickets/my-tickets");
      setTickets(res.data || []);
      if (res.data?.length > 0 && !selectedTicket) {
        setSelectedTicket(res.data[0]);
      }
    } catch (err) {
      console.error("Failed to load provider support tickets", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = async (data: any) => {
    const res = await client.post("/tickets", data);
    fetchTickets();
    setSelectedTicket(res.data);
  };

  const handleSendMessage = async (message: string) => {
    if (!selectedTicket) return;
    const res = await client.patch(`/tickets/${selectedTicket.id}`, { message });
    setSelectedTicket(res.data);
    fetchTickets();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Provider Partner Support & Appeals</h2>
          <p className="text-xs text-muted-foreground mt-1">Submit inquiries about payout disputes, booking issues, or account status.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
          <PlusCircle className="h-4 w-4" /> Create Partner Ticket
        </Button>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-card border rounded-2xl p-8 text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center mx-auto text-indigo-600">
            <LifeBuoy className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-lg">No Active Partner Tickets</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">Have a dispute regarding payouts, ratings, or client bookings? Submit a ticket to partner support.</p>
          <Button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">Open Ticket</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Support Cases</h3>
            <div className="space-y-2">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedTicket?.id === t.id
                      ? "border-indigo-600 bg-indigo-50/50 shadow-xs"
                      : "bg-card hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-medium text-sm truncate">{t.subject}</span>
                    <TicketStatusBadge status={t.status} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{t.messages.length} update(s)</span>
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
              />
            ) : (
              <div className="bg-card border rounded-2xl p-12 text-center text-muted-foreground">
                Select a ticket from the left to view message history.
              </div>
            )}
          </div>
        </div>
      )}

      <CreateTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTicket}
      />
    </div>
  );
}
