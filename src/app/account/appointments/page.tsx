"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  Timestamp,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import {
  Appointment,
  AppointmentStatus,
  AppointmentType,
  AvailabilitySettings,
} from "@/lib/firebase-types";

const statusColors: Record<AppointmentStatus, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/50",
  completed: "bg-green-500/20 text-green-400 border-green-500/50",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/50",
  rescheduled: "bg-purple-500/20 text-purple-400 border-purple-500/50",
};

const typeLabels: Record<AppointmentType, string> = {
  consultation: "Consultation",
  fitting: "Fitting",
  pickup: "Pickup",
  "fabric-dropoff": "Fabric Drop-off",
};

const typeDescriptions: Record<AppointmentType, string> = {
  consultation: "Discuss your style ideas and get expert recommendations",
  fitting: "Try on your outfit and make any necessary adjustments",
  pickup: "Collect your completed order from the studio",
  "fabric-dropoff": "Bring your fabric for a sew-only order",
};

const defaultAvailability: AvailabilitySettings = {
  workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
  workingHours: { start: "10:00", end: "18:00" },
  slotDuration: 30,
  blockedDates: [],
  blockedTimeSlots: [],
};

export default function CustomerAppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySettings>(defaultAvailability);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Booking form
  const [bookingType, setBookingType] = useState<AppointmentType>("consultation");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");

  // Cancel/Reschedule state
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!user?.phone) return;

    // Fetch appointments
    const appointmentsQuery = query(
      collection(db, "appointments"),
      where("userPhone", "==", user.phone),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(appointmentsQuery, (snapshot) => {
      const appointmentsData = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Appointment;
      });
      setAppointments(appointmentsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.phone]);

  // Fetch availability settings with real-time updates
  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, "settings", "main"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.availability) {
          // Merge with defaults to ensure all fields exist
          setAvailability({
            ...defaultAvailability,
            ...data.availability,
            blockedTimeSlots: data.availability.blockedTimeSlots || [],
          });
        }
      }
    });

    return () => unsubSettings();
  }, []);

  // Fetch all appointments for checking booked slots
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    // Fetch all non-cancelled appointments to check for booked slots
    const allAppointmentsQuery = query(
      collection(db, "appointments"),
      where("status", "in", ["pending", "confirmed", "rescheduled"])
    );

    const unsubAllAppointments = onSnapshot(allAppointmentsQuery, (snapshot) => {
      const appointmentsData = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Appointment[];
      setAllAppointments(appointmentsData);
    });

    return () => unsubAllAppointments();
  }, []);

  const generateTimeSlots = () => {
    const slots: string[] = [];
    const [startHour, startMin] = availability.workingHours.start.split(":").map(Number);
    const [endHour, endMin] = availability.workingHours.end.split(":").map(Number);
    const duration = availability.slotDuration;

    let currentTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    while (currentTime < endTime) {
      const hours = Math.floor(currentTime / 60);
      const mins = currentTime % 60;
      slots.push(`${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`);
      currentTime += duration;
    }

    return slots;
  };

  // Check if a specific time slot is blocked by admin on a given date
  const isTimeSlotBlocked = (dateStr: string, timeSlot: string) => {
    const blockedSlots = availability.blockedTimeSlots || [];
    const slotTime = parseInt(timeSlot.replace(":", ""));

    return blockedSlots.some((blocked) => {
      if (blocked.date !== dateStr) return false;

      const blockStart = parseInt(blocked.startTime.replace(":", ""));
      const blockEnd = parseInt(blocked.endTime.replace(":", ""));

      // Check if the time slot falls within the blocked period
      return slotTime >= blockStart && slotTime < blockEnd;
    });
  };

  // Check if a time slot is already booked by someone
  const isTimeSlotBooked = (dateStr: string, timeSlot: string, excludeAppointmentId?: string) => {
    return allAppointments.some((apt) => {
      if (excludeAppointmentId && apt.id === excludeAppointmentId) return false;
      return apt.date === dateStr && apt.timeSlot === timeSlot;
    });
  };

  // Check if a time slot is unavailable (blocked OR booked)
  const isTimeSlotUnavailable = (dateStr: string, timeSlot: string, excludeAppointmentId?: string) => {
    return isTimeSlotBlocked(dateStr, timeSlot) || isTimeSlotBooked(dateStr, timeSlot, excludeAppointmentId);
  };

  // Get available time slots for a given date (excluding blocked and booked slots)
  const getAvailableTimeSlots = (dateStr: string, excludeAppointmentId?: string) => {
    const allSlots = generateTimeSlots();
    return allSlots.filter((slot) => !isTimeSlotUnavailable(dateStr, slot, excludeAppointmentId));
  };

  const isDateAvailable = (dateStr: string) => {
    const date = new Date(dateStr);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();

    // Check if it's a working day
    if (!availability.workingDays.includes(dayName)) return false;

    // Check if it's blocked
    if (availability.blockedDates.includes(dateStr)) return false;

    return true;
  };

  const handleBookAppointment = async () => {
    if (!user?.phone || !bookingDate || !bookingTime) return;

    setSaving(true);
    try {
      await addDoc(collection(db, "appointments"), {
        userId: user.id,
        userPhone: user.phone,
        userName: user.name || null,
        type: bookingType,
        date: bookingDate,
        timeSlot: bookingTime,
        status: "pending",
        notes: bookingNotes || null,
        createdBy: "customer",
        createdAt: Timestamp.now(),
      });

      setShowBookingModal(false);
      setBookingType("consultation");
      setBookingDate("");
      setBookingTime("");
      setBookingNotes("");
    } catch (error) {
      console.error("Error booking appointment:", error);
    } finally {
      setSaving(false);
    }
  };

  const formatDateDisplay = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-NG", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const upcomingAppointments = appointments.filter(
    (a) => new Date(a.date) >= new Date() && !["cancelled", "completed"].includes(a.status)
  );
  const pastAppointments = appointments.filter(
    (a) => new Date(a.date) < new Date() || ["cancelled", "completed"].includes(a.status)
  );

  const canModifyAppointment = (apt: Appointment) => {
    // Can only cancel/reschedule pending or confirmed appointments
    return ["pending", "confirmed"].includes(apt.status);
  };

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;

    setActionLoading(true);
    try {
      await updateDoc(doc(db, "appointments", selectedAppointment.id), {
        status: "cancelled",
        updatedAt: Timestamp.now(),
      });
      setShowCancelConfirm(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRescheduleAppointment = async () => {
    if (!selectedAppointment || !rescheduleDate || !rescheduleTime) return;

    setActionLoading(true);
    try {
      await updateDoc(doc(db, "appointments", selectedAppointment.id), {
        date: rescheduleDate,
        timeSlot: rescheduleTime,
        status: "pending", // Reset to pending for admin review
        updatedAt: Timestamp.now(),
      });
      setShowRescheduleModal(false);
      setSelectedAppointment(null);
      setRescheduleDate("");
      setRescheduleTime("");
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const openRescheduleModal = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setRescheduleDate(apt.date);
    setRescheduleTime(apt.timeSlot);
    setShowRescheduleModal(true);
  };

  const openCancelConfirm = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setShowCancelConfirm(true);
  };

  // Generate minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
              Appointments
            </h1>
            <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
              Schedule and manage your appointments
            </p>
          </div>
          <button
            onClick={() => setShowBookingModal(true)}
            className="bg-[#c9a962] text-[#0a0a0a] px-4 py-2 text-sm font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors"
          >
            Book Appointment
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-[#888888]">Loading appointments...</div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-[#111111] border border-[#1a1a1a] p-12 text-center">
            <svg
              className="w-16 h-16 text-[#2a2a2a] mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-[#888888] font-[family-name:var(--font-montserrat)] mb-4">
              No appointments scheduled
            </p>
            <button
              onClick={() => setShowBookingModal(true)}
              className="inline-block bg-[#c9a962] text-[#0a0a0a] px-6 py-2 font-[family-name:var(--font-montserrat)] text-sm uppercase tracking-wider hover:bg-[#d4b87a] transition-colors"
            >
              Book Your First Appointment
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Upcoming Appointments */}
            {upcomingAppointments.length > 0 && (
              <div>
                <h2 className="text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-4">
                  Upcoming ({upcomingAppointments.length})
                </h2>
                <div className="space-y-4">
                  {upcomingAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="bg-[#111111] border border-[#1a1a1a] p-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="text-center bg-[#0a0a0a] p-3 border border-[#1a1a1a]">
                            <p className="text-2xl text-[#c9a962] font-[family-name:var(--font-cormorant)]">
                              {new Date(apt.date).getDate()}
                            </p>
                            <p className="text-xs text-[#888888] font-[family-name:var(--font-montserrat)] uppercase">
                              {new Date(apt.date).toLocaleDateString("en-US", { month: "short" })}
                            </p>
                          </div>
                          <div>
                            <p className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                              {typeLabels[apt.type]}
                            </p>
                            <p className="text-sm text-[#888888] font-[family-name:var(--font-montserrat)]">
                              {apt.timeSlot} •{" "}
                              {new Date(apt.date).toLocaleDateString("en-NG", {
                                weekday: "long",
                              })}
                            </p>
                            {apt.notes && (
                              <p className="text-sm text-[#666666] mt-1 font-[family-name:var(--font-montserrat)]">
                                Note: {apt.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 text-xs border ${statusColors[apt.status]} font-[family-name:var(--font-montserrat)]`}
                          >
                            {apt.status}
                          </span>
                          {canModifyAppointment(apt) && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => openRescheduleModal(apt)}
                                className="text-[#c9a962] text-sm font-[family-name:var(--font-montserrat)] hover:underline"
                              >
                                Reschedule
                              </button>
                              <button
                                onClick={() => openCancelConfirm(apt)}
                                className="text-red-400 text-sm font-[family-name:var(--font-montserrat)] hover:underline"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Past Appointments */}
            {pastAppointments.length > 0 && (
              <div>
                <h2 className="text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-4">
                  Past Appointments
                </h2>
                <div className="bg-[#111111] border border-[#1a1a1a] divide-y divide-[#1a1a1a]">
                  {pastAppointments.map((apt) => (
                    <div key={apt.id} className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                            {typeLabels[apt.type]}
                          </span>
                          <span className="text-[#888888] text-sm ml-3 font-[family-name:var(--font-montserrat)]">
                            {formatDateDisplay(apt.date)} at {apt.timeSlot}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-0.5 text-xs border ${statusColors[apt.status]} font-[family-name:var(--font-montserrat)]`}
                        >
                          {apt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-[#111111] border border-[#1a1a1a] w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-[#111111] border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
                  Book Appointment
                </h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-[#888888] hover:text-[#f5f5f5]"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Appointment Type */}
                <div>
                  <label className="block text-sm text-[#888888] mb-3 font-[family-name:var(--font-montserrat)]">
                    What do you need?
                  </label>
                  <div className="space-y-2">
                    {(Object.keys(typeLabels) as AppointmentType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => setBookingType(type)}
                        className={`w-full text-left p-3 border transition-colors ${
                          bookingType === type
                            ? "border-[#c9a962] bg-[#c9a962]/10"
                            : "border-[#2a2a2a] hover:border-[#3a3a3a]"
                        }`}
                      >
                        <p
                          className={`font-[family-name:var(--font-montserrat)] ${
                            bookingType === type ? "text-[#c9a962]" : "text-[#f5f5f5]"
                          }`}
                        >
                          {typeLabels[type]}
                        </p>
                        <p className="text-xs text-[#888888] font-[family-name:var(--font-montserrat)] mt-1">
                          {typeDescriptions[type]}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => {
                      setBookingDate(e.target.value);
                      setBookingTime(""); // Reset time when date changes
                    }}
                    min={today}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                  />
                  {bookingDate && !isDateAvailable(bookingDate) && (
                    <p className="text-red-400 text-xs mt-2 font-[family-name:var(--font-montserrat)]">
                      This date is not available. Please select another date.
                    </p>
                  )}
                </div>

                {/* Time */}
                {bookingDate && isDateAvailable(bookingDate) && (
                  <div>
                    <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                      Select Time
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {generateTimeSlots().map((slot) => {
                        const isBlocked = isTimeSlotBlocked(bookingDate, slot);
                        const isBooked = isTimeSlotBooked(bookingDate, slot);
                        const isUnavailable = isBlocked || isBooked;
                        return (
                          <button
                            key={slot}
                            onClick={() => !isUnavailable && setBookingTime(slot)}
                            disabled={isUnavailable}
                            className={`py-2 text-sm border font-[family-name:var(--font-montserrat)] transition-colors ${
                              isUnavailable
                                ? "border-[#1a1a1a] text-[#444444] bg-[#1a1a1a] cursor-not-allowed"
                                : bookingTime === slot
                                ? "border-[#c9a962] text-[#c9a962] bg-[#c9a962]/10"
                                : "border-[#2a2a2a] text-[#888888] hover:border-[#3a3a3a]"
                            }`}
                          >
                            {slot}
                            {isBooked && !isBlocked && <span className="block text-[9px]">Booked</span>}
                            {isBlocked && <span className="block text-[9px]">Unavailable</span>}
                          </button>
                        );
                      })}
                    </div>
                    {getAvailableTimeSlots(bookingDate).length === 0 && (
                      <p className="text-orange-400 text-xs mt-2 font-[family-name:var(--font-montserrat)]">
                        No available time slots on this date. Please select another date.
                      </p>
                    )}
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                    Additional Notes (optional)
                  </label>
                  <textarea
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    rows={2}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none resize-none"
                    placeholder="Any special requests or notes..."
                  />
                </div>

                {/* Summary */}
                {bookingDate && bookingTime && (
                  <div className="bg-[#0a0a0a] p-4 border border-[#1a1a1a]">
                    <p className="text-xs text-[#666666] mb-2 font-[family-name:var(--font-montserrat)]">
                      Your Appointment
                    </p>
                    <p className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                      {typeLabels[bookingType]}
                    </p>
                    <p className="text-sm text-[#888888] font-[family-name:var(--font-montserrat)]">
                      {formatDateDisplay(bookingDate)} at {bookingTime}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 border border-[#2a2a2a] text-[#888888] py-2 font-[family-name:var(--font-montserrat)] hover:border-[#3a3a3a] hover:text-[#f5f5f5] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBookAppointment}
                    disabled={
                      saving || !bookingDate || !bookingTime || !isDateAvailable(bookingDate) || isTimeSlotUnavailable(bookingDate, bookingTime)
                    }
                    className="flex-1 bg-[#c9a962] text-[#0a0a0a] py-2 font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors disabled:opacity-50"
                  >
                    {saving ? "Booking..." : "Confirm Booking"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {showCancelConfirm && selectedAppointment && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-[#111111] border border-[#1a1a1a] w-full max-w-sm p-6">
              <h3 className="text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-4">
                Cancel Appointment
              </h3>
              <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)] mb-2">
                Are you sure you want to cancel your{" "}
                <span className="text-[#f5f5f5]">{typeLabels[selectedAppointment.type]}</span>{" "}
                appointment?
              </p>
              <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)] mb-6">
                Scheduled for{" "}
                <span className="text-[#f5f5f5]">
                  {formatDateDisplay(selectedAppointment.date)} at {selectedAppointment.timeSlot}
                </span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCancelConfirm(false);
                    setSelectedAppointment(null);
                  }}
                  disabled={actionLoading}
                  className="flex-1 border border-[#2a2a2a] text-[#f5f5f5] py-2 text-sm font-[family-name:var(--font-montserrat)] hover:bg-[#1a1a1a] transition-colors disabled:opacity-50"
                >
                  Keep Appointment
                </button>
                <button
                  onClick={handleCancelAppointment}
                  disabled={actionLoading}
                  className="flex-1 bg-red-500 text-white py-2 text-sm font-[family-name:var(--font-montserrat)] hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? "Cancelling..." : "Yes, Cancel"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reschedule Modal */}
        {showRescheduleModal && selectedAppointment && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-[#111111] border border-[#1a1a1a] w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-[#111111] border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
                  Reschedule Appointment
                </h2>
                <button
                  onClick={() => {
                    setShowRescheduleModal(false);
                    setSelectedAppointment(null);
                    setRescheduleDate("");
                    setRescheduleTime("");
                  }}
                  className="text-[#888888] hover:text-[#f5f5f5]"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Current appointment info */}
                <div className="bg-[#0a0a0a] p-4 border border-[#1a1a1a]">
                  <p className="text-xs text-[#666666] mb-2 font-[family-name:var(--font-montserrat)]">
                    Current Appointment
                  </p>
                  <p className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                    {typeLabels[selectedAppointment.type]}
                  </p>
                  <p className="text-sm text-[#888888] font-[family-name:var(--font-montserrat)]">
                    {formatDateDisplay(selectedAppointment.date)} at {selectedAppointment.timeSlot}
                  </p>
                </div>

                {/* New Date */}
                <div>
                  <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                    Select New Date
                  </label>
                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => {
                      setRescheduleDate(e.target.value);
                      setRescheduleTime(""); // Reset time when date changes
                    }}
                    min={today}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                  />
                  {rescheduleDate && !isDateAvailable(rescheduleDate) && (
                    <p className="text-red-400 text-xs mt-2 font-[family-name:var(--font-montserrat)]">
                      This date is not available. Please select another date.
                    </p>
                  )}
                </div>

                {/* New Time */}
                {rescheduleDate && isDateAvailable(rescheduleDate) && (
                  <div>
                    <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                      Select New Time
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {generateTimeSlots().map((slot) => {
                        const isBlocked = isTimeSlotBlocked(rescheduleDate, slot);
                        const isBooked = isTimeSlotBooked(rescheduleDate, slot, selectedAppointment?.id);
                        const isUnavailable = isBlocked || isBooked;
                        return (
                          <button
                            key={slot}
                            onClick={() => !isUnavailable && setRescheduleTime(slot)}
                            disabled={isUnavailable}
                            className={`py-2 text-sm border font-[family-name:var(--font-montserrat)] transition-colors relative ${
                              isUnavailable
                                ? "border-[#1a1a1a] text-[#444444] bg-[#1a1a1a] cursor-not-allowed"
                                : rescheduleTime === slot
                                ? "border-[#c9a962] text-[#c9a962] bg-[#c9a962]/10"
                                : "border-[#2a2a2a] text-[#888888] hover:border-[#3a3a3a]"
                            }`}
                          >
                            <span className={isUnavailable ? "line-through" : ""}>{slot}</span>
                            {isBooked && !isBlocked && (
                              <span className="absolute -top-1 -right-1 text-[8px] bg-orange-500/80 text-white px-1 rounded">
                                Booked
                              </span>
                            )}
                            {isBlocked && (
                              <span className="absolute -top-1 -right-1 text-[8px] bg-red-500/80 text-white px-1 rounded">
                                Unavailable
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {getAvailableTimeSlots(rescheduleDate, selectedAppointment?.id).length === 0 && (
                      <p className="text-orange-400 text-xs mt-2 font-[family-name:var(--font-montserrat)]">
                        No available time slots on this date. Please select another date.
                      </p>
                    )}
                  </div>
                )}

                {/* New appointment summary */}
                {rescheduleDate && rescheduleTime && (
                  <div className="bg-[#c9a962]/10 p-4 border border-[#c9a962]/30">
                    <p className="text-xs text-[#c9a962] mb-2 font-[family-name:var(--font-montserrat)]">
                      New Appointment
                    </p>
                    <p className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                      {typeLabels[selectedAppointment.type]}
                    </p>
                    <p className="text-sm text-[#888888] font-[family-name:var(--font-montserrat)]">
                      {formatDateDisplay(rescheduleDate)} at {rescheduleTime}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => {
                      setShowRescheduleModal(false);
                      setSelectedAppointment(null);
                      setRescheduleDate("");
                      setRescheduleTime("");
                    }}
                    disabled={actionLoading}
                    className="flex-1 border border-[#2a2a2a] text-[#888888] py-2 font-[family-name:var(--font-montserrat)] hover:border-[#3a3a3a] hover:text-[#f5f5f5] transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRescheduleAppointment}
                    disabled={
                      actionLoading ||
                      !rescheduleDate ||
                      !rescheduleTime ||
                      !isDateAvailable(rescheduleDate) ||
                      isTimeSlotUnavailable(rescheduleDate, rescheduleTime, selectedAppointment?.id) ||
                      (rescheduleDate === selectedAppointment.date &&
                        rescheduleTime === selectedAppointment.timeSlot)
                    }
                    className="flex-1 bg-[#c9a962] text-[#0a0a0a] py-2 font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? "Rescheduling..." : "Confirm Reschedule"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
