"use client";

import React from "react";

export type BookingLifecycleStatus = "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

interface BookingTimelineProps {
  currentStatus: BookingLifecycleStatus;
  createdAt?: string;
  confirmedAt?: string;
  startedAt?: string;
  completedAt?: string;
}

interface StepItem {
  id: BookingLifecycleStatus;
  title: string;
  description: string;
}

const STEPS: StepItem[] = [
  {
    id: "PENDING",
    title: "Booking Requested",
    description: "Awaiting provider confirmation",
  },
  {
    id: "CONFIRMED",
    title: "Provider Confirmed",
    description: "Time slot locked & scheduled",
  },
  {
    id: "IN_PROGRESS",
    title: "Service In Progress",
    description: "Provider is actively fulfilling service",
  },
  {
    id: "COMPLETED",
    title: "Service Completed",
    description: "Work completed & payment released",
  },
];

export const BookingTimeline: React.FC<BookingTimelineProps> = ({
  currentStatus,
}) => {
  if (currentStatus === "CANCELLED") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-red-100 text-red-600 rounded-full mb-2 font-bold text-lg">
          ✕
        </div>
        <h4 className="text-base font-bold text-red-900">Booking Cancelled</h4>
        <p className="text-xs text-red-700 mt-1">
          This booking has been cancelled and cannot be further updated.
        </p>
      </div>
    );
  }

  const getStepState = (stepId: BookingLifecycleStatus) => {
    const order: BookingLifecycleStatus[] = ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED"];
    const currentIndex = order.indexOf(currentStatus);
    const stepIndex = order.indexOf(stepId);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider">
        Booking Lifecycle Timeline
      </h3>

      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-2">
        {STEPS.map((step, idx) => {
          const state = getStepState(step.id);
          const isLast = idx === STEPS.length - 1;

          return (
            <div key={step.id} className="flex-1 flex flex-row md:flex-col items-center w-full relative group">
              {!isLast && (
                <div
                  className={`hidden md:block absolute top-5 left-[50%] right-[-50%] h-0.5 z-0 transition-colors ${
                    state === "completed" ? "bg-emerald-500" : "bg-gray-200"
                  }`}
                />
              )}

              <div
                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm ${
                  state === "completed"
                    ? "bg-emerald-600 text-white shadow-emerald-200"
                    : state === "current"
                    ? "bg-indigo-600 text-white ring-4 ring-indigo-100 animate-pulse"
                    : "bg-gray-100 text-gray-400 border border-gray-200"
                }`}
              >
                {state === "completed" ? "✓" : idx + 1}
              </div>

              <div className="ml-4 md:ml-0 md:mt-3 text-left md:text-center">
                <p
                  className={`text-xs font-bold ${
                    state === "current"
                      ? "text-indigo-600"
                      : state === "completed"
                      ? "text-emerald-700"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5 max-w-[140px] leading-tight">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
