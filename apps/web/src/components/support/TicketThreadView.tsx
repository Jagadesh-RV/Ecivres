"use client";

import React, { useState } from "react";
import { TicketStatusBadge } from "./TicketStatusBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export interface TicketThreadMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  createdAt: string;
}

export interface TicketThread {
  id: string;
  subject: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  priority: string;
  messages: TicketThreadMessage[];
  createdAt: string;
}

interface TicketThreadViewProps {
  ticket: TicketThread;
  currentUserId: string;
  onSendMessage: (message: string) => Promise<void>;
  onStatusChange?: (newStatus: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED") => Promise<void>;
  isAdmin?: boolean;
}

export function TicketThreadView({ ticket, currentUserId, onSendMessage, onStatusChange, isAdmin }: TicketThreadViewProps) {
  const [reply, setReply] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;

    try {
      setIsSending(true);
      await onSendMessage(reply);
      setReply("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-card border rounded-2xl p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold">{ticket.subject}</h3>
            <TicketStatusBadge status={ticket.status} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">Ticket ID: #{ticket.id} • Created {new Date(ticket.createdAt).toLocaleDateString()}</p>
        </div>

        {isAdmin && onStatusChange && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Status:</span>
            <select
              value={ticket.status}
              onChange={(e) => onStatusChange(e.target.value as any)}
              className="h-8 px-2 rounded-md border text-xs bg-background"
            >
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>
        )}
      </div>

      {/* Message Thread */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {ticket.messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-muted-foreground">{msg.senderName}</span>
                <span className="text-[10px] text-muted-foreground">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div
                className={`p-3.5 rounded-2xl max-w-[85%] text-sm ${
                  isMe
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-muted text-foreground rounded-tl-none"
                }`}
              >
                {msg.message}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reply Input */}
      {ticket.status !== "CLOSED" ? (
        <form onSubmit={handleSend} className="space-y-3 pt-4 border-t">
          <Textarea
            rows={3}
            placeholder="Type your response here..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isSending}>
              {isSending ? "Sending..." : "Send Response"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="p-3 text-center text-xs text-muted-foreground bg-muted/40 rounded-xl">
          This ticket is marked as closed.
        </div>
      )}
    </div>
  );
}
