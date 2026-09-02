import React from "react";
import { BookingItem } from "./CustomerBookingsTable";

interface UpcomingAppointmentsProps {
  bookings: BookingItem[];
}

export const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({ bookings }) => {
  const upcoming = bookings.filter((b) => b.status === "PENDING" || b.status === "CONFIRMED");

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="text-base font-bold text-gray-900 mb-4">Upcoming Appointments</h3>
      {upcoming.length === 0 ? (
        <div className="text-center py-6 text-sm text-gray-400">
          No upcoming service appointments scheduled.
        </div>
      ) : (
        <div className="space-y-3">
          {upcoming.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-lg border border-indigo-100 bg-indigo-50/50 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                  📅
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{item.service?.name}</h4>
                  <p className="text-xs text-gray-500">
                    {item.service?.provider?.businessName || "Provider"} •{" "}
                    {new Date(item.scheduledAt).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-full">
                ${item.service?.price?.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
