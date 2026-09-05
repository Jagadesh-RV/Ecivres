"use client";

import React, { useEffect, useState } from "react";
import { client } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { TicketStatusBadge } from "@/components/support/TicketStatusBadge";
import { CreateTicketModal } from "@/components/support/CreateTicketModal";
import { TicketThreadView, TicketThread } from "@/components/support/TicketThreadView";
import { LifeBuoy, PlusCircle, MessageSquare } from "lucide-react";

export default function CustomerSupportPage() {
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
      console.error("Failed to load tickets", err);
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
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Customer Support & Dispute Center</h2>
          <p className="text-xs text-muted-foreground mt-1">Get 24/7 help with your bookings, payments, and account inquiries.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <PlusCircle className="h-4 w-4" /> Open Support Ticket
        </Button>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-card border rounded-2xl p-8 text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
            <LifeBuoy className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-lg">No Support Tickets Found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">Have questions or facing an issue with a service provider? Open a support ticket below.</p>
          <Button onClick={() => setIsModalOpen(true)}>Create First Ticket</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Your Tickets</h3>
            <div className="space-y-2">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedTicket?.id === t.id
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "bg-card hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-medium text-sm truncate">{t.subject}</span>
                    <TicketStatusBadge status={t.status} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{t.messages.length} message(s)</span>
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
                Select a ticket from the left to view conversation details.
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
