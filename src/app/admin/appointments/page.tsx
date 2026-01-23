"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  Timestamp,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Appointment, AppointmentStatus, AppointmentType, AvailabilitySettings } from "@/lib/firebase-types";
import { formatPhoneNumber } from "@/lib/otp-service";

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
  consultation: "Initial meeting to discuss style ideas and requirements",
  fitting: "Try on outfit and make any necessary adjustments",
  pickup: "Customer collection of completed order",
  "fabric-dropoff": "Customer brings fabric for sew-only order",
};

const defaultAvailability: AvailabilitySettings = {
  workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
  workingHours: { start: "10:00", end: "18:00" },
  slotDuration: 30,
  blockedDates: [],
  blockedTimeSlots: [],
};

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySettings>(defaultAvailability);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<AppointmentStatus | "all">("all");
  const [filterDate, setFilterDate] = useState<string>("");

  // New appointment form
  const [newAppointment, setNewAppointment] = useState({
    customerPhone: "",
    customerName: "",
    type: "consultation" as AppointmentType,
    date: "",
    timeSlot: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [customerLookup, setCustomerLookup] = useState<{ id: string; name: string; phone: string } | null>(null);
  const [lookingUp, setLookingUp] = useState(false);

  // Reschedule state
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const appointmentsQuery = query(
      collection(db, "appointments"),
      orderBy("date", "asc")
    );

    const unsubscribe = onSnapshot(appointmentsQuery, (snapshot) => {
      const appointmentsData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Appointment;
      });
      setAppointments(appointmentsData);
      setLoading(false);
    });

    // Fetch availability settings
    const fetchSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, "settings", "main"));
        if (settingsDoc.exists() && settingsDoc.data().availability) {
          setAvailability(settingsDoc.data().availability as AvailabilitySettings);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();

    return () => unsubscribe();
  }, []);

  // Look up customer when phone changes
  const handlePhoneLookup = async (phone: string) => {
    setNewAppointment({ ...newAppointment, customerPhone: phone });

    if (phone.length >= 10) {
      setLookingUp(true);
      try {
        const formattedPhone = formatPhoneNumber(phone);
        const existingQuery = query(
          collection(db, "users"),
          where("phone", "==", formattedPhone)
        );
        const existing = await getDocs(existingQuery);

        if (!existing.empty) {
          const userData = existing.docs[0].data();
          setCustomerLookup({
            id: existing.docs[0].id,
            name: userData.name || "",
            phone: formattedPhone,
          });
          // Auto-fill name if found
          if (userData.name && !newAppointment.customerName) {
            setNewAppointment(prev => ({ ...prev, customerPhone: phone, customerName: userData.name }));
          }
        } else {
          setCustomerLookup(null);
        }
      } catch (error) {
        console.error("Error looking up customer:", error);
      } finally {
        setLookingUp(false);
      }
    } else {
      setCustomerLookup(null);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (filterStatus !== "all" && apt.status !== filterStatus) return false;
    if (filterDate && apt.date !== filterDate) return false;
    return true;
  });

  // Group appointments by date
  const groupedAppointments = filteredAppointments.reduce(
    (groups, apt) => {
      const date = apt.date;
      if (!groups[date]) groups[date] = [];
      groups[date].push(apt);
      return groups;
    },
    {} as Record<string, Appointment[]>
  );

  // Check if date is available
  const isDateAvailable = (dateStr: string) => {
    const date = new Date(dateStr);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();

    if (!availability.workingDays.includes(dayName)) return false;
    if (availability.blockedDates.includes(dateStr)) return false;

    return true;
  };

  // Generate time slots based on availability settings
  const generateTimeSlots = () => {
    const slots: string[] = [];
    const [startHour, startMinute] = availability.workingHours.start.split(":").map(Number);
    const [endHour, endMinute] = availability.workingHours.end.split(":").map(Number);
    const duration = availability.slotDuration;

    let currentMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    while (currentMinutes + duration <= endMinutes) {
      const hours = Math.floor(currentMinutes / 60);
      const minutes = currentMinutes % 60;
      slots.push(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`);
      currentMinutes += duration;
    }

    return slots;
  };

  // Get booked slots for a date
  const getBookedSlots = (dateStr: string) => {
    return appointments
      .filter(apt => apt.date === dateStr && !["cancelled"].includes(apt.status))
      .map(apt => apt.timeSlot);
  };

  // Check if a specific time slot is blocked on a given date
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

  // Get the reason for a blocked time slot
  const getBlockedSlotReason = (dateStr: string, timeSlot: string) => {
    const blockedSlots = availability.blockedTimeSlots || [];
    const slotTime = parseInt(timeSlot.replace(":", ""));

    const blockedSlot = blockedSlots.find((blocked) => {
      if (blocked.date !== dateStr) return false;

      const blockStart = parseInt(blocked.startTime.replace(":", ""));
      const blockEnd = parseInt(blocked.endTime.replace(":", ""));

      return slotTime >= blockStart && slotTime < blockEnd;
    });

    return blockedSlot?.reason || "Unavailable";
  };

  const handleCreateAppointment = async () => {
    if (!newAppointment.customerPhone || !newAppointment.date || !newAppointment.timeSlot)
      return;

    setSaving(true);
    try {
      const formattedPhone = formatPhoneNumber(newAppointment.customerPhone);

      // Find or reference customer
      let userId = customerLookup?.id || "";
      let userName = newAppointment.customerName || customerLookup?.name || null;

      await addDoc(collection(db, "appointments"), {
        userId,
        userPhone: formattedPhone,
        userName,
        type: newAppointment.type,
        date: newAppointment.date,
        timeSlot: newAppointment.timeSlot,
        status: "pending",
        notes: newAppointment.notes || null,
        createdBy: "admin",
        createdAt: Timestamp.now(),
      });

      setNewAppointment({
        customerPhone: "",
        customerName: "",
        type: "consultation",
        date: "",
        timeSlot: "",
        notes: "",
      });
      setCustomerLookup(null);
      setShowNewForm(false);
    } catch (error) {
      console.error("Error creating appointment:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStatus = async (appointmentId: string, newStatus: AppointmentStatus) => {
    try {
      await updateDoc(doc(db, "appointments", appointmentId), {
        status: newStatus,
        updatedAt: Timestamp.now(),
      });
      if (selectedAppointment?.id === appointmentId) {
        setSelectedAppointment({ ...selectedAppointment, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  const handleReschedule = async () => {
    if (!selectedAppointment || !rescheduleDate || !rescheduleTime) return;

    try {
      await updateDoc(doc(db, "appointments", selectedAppointment.id), {
        date: rescheduleDate,
        timeSlot: rescheduleTime,
        status: "rescheduled",
        updatedAt: Timestamp.now(),
      });
      setSelectedAppointment({
        ...selectedAppointment,
        date: rescheduleDate,
        timeSlot: rescheduleTime,
        status: "rescheduled",
      });
      setShowRescheduleModal(false);
      setRescheduleDate("");
      setRescheduleTime("");
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
    }
  };

  const handleDelete = async (appointmentId: string) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;

    try {
      await deleteDoc(doc(db, "appointments", appointmentId));
      setSelectedAppointment(null);
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr);
    const todayDate = new Date();
    const tomorrow = new Date(todayDate);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dateStr === todayDate.toISOString().split("T")[0]) {
      return "Today";
    } else if (dateStr === tomorrow.toISOString().split("T")[0]) {
      return "Tomorrow";
    }

    return new Intl.DateTimeFormat("en-NG", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(date);
  };

  const openRescheduleModal = () => {
    if (selectedAppointment) {
      setRescheduleDate(selectedAppointment.date);
      setRescheduleTime(selectedAppointment.timeSlot);
      setShowRescheduleModal(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#888888]">Loading appointments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
          Appointments
        </h1>
        <button
          onClick={() => setShowNewForm(true)}
          className="bg-[#c9a962] text-[#0a0a0a] px-4 py-2 text-sm font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors"
        >
          + Schedule Appointment
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as AppointmentStatus | "all")}
          className="bg-[#111111] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="rescheduled">Rescheduled</option>
        </select>

        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="bg-[#111111] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
        />

        {filterDate && (
          <button
            onClick={() => setFilterDate("")}
            className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)] hover:text-[#f5f5f5]"
          >
            Clear date
          </button>
        )}
      </div>

      {/* Appointments by Date */}
      {Object.keys(groupedAppointments).length === 0 ? (
        <div className="bg-[#111111] border border-[#1a1a1a] p-12 text-center">
          <p className="text-[#888888] font-[family-name:var(--font-montserrat)]">
            No appointments found
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedAppointments)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, apts]) => (
              <div key={date}>
                <h2 className="text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-3">
                  {formatDateDisplay(date)}
                  <span className="text-sm text-[#888888] ml-2 font-[family-name:var(--font-montserrat)]">
                    ({apts.length} appointment{apts.length !== 1 ? "s" : ""})
                  </span>
                </h2>
                <div className="bg-[#111111] border border-[#1a1a1a] divide-y divide-[#1a1a1a]">
                  {apts
                    .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot))
                    .map((apt) => (
                      <div
                        key={apt.id}
                        className="p-4 flex items-center justify-between hover:bg-[#1a1a1a]/50 transition-colors cursor-pointer"
                        onClick={() => setSelectedAppointment(apt)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-lg text-[#c9a962] font-[family-name:var(--font-montserrat)]">
                              {apt.timeSlot}
                            </p>
                          </div>
                          <div>
                            <p className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                              {apt.userName || "Unknown"}
                            </p>
                            <p className="text-sm text-[#888888] font-[family-name:var(--font-montserrat)]">
                              {typeLabels[apt.type]} • {apt.userPhone}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs border ${statusColors[apt.status]} font-[family-name:var(--font-montserrat)]`}
                        >
                          {apt.status}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* New Appointment Modal - Enhanced */}
      {showNewForm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#1a1a1a] w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#111111] border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
                Schedule Appointment
              </h2>
              <button
                onClick={() => {
                  setShowNewForm(false);
                  setCustomerLookup(null);
                  setNewAppointment({
                    customerPhone: "",
                    customerName: "",
                    type: "consultation",
                    date: "",
                    timeSlot: "",
                    notes: "",
                  });
                }}
                className="text-[#888888] hover:text-[#f5f5f5]"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                    Customer Phone *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={newAppointment.customerPhone}
                      onChange={(e) => handlePhoneLookup(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                      placeholder="08012345678"
                    />
                    {lookingUp && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-[#c9a962] border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  {customerLookup && (
                    <p className="text-xs text-green-400 mt-1 font-[family-name:var(--font-montserrat)]">
                      ✓ Existing customer: {customerLookup.name || customerLookup.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                    Customer Name {!customerLookup && "*"}
                  </label>
                  <input
                    type="text"
                    value={newAppointment.customerName}
                    onChange={(e) =>
                      setNewAppointment({ ...newAppointment, customerName: e.target.value })
                    }
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                    placeholder={customerLookup ? customerLookup.name || "Enter name" : "Enter customer name"}
                  />
                </div>
              </div>

              {/* Appointment Type - Visual Selection */}
              <div>
                <label className="block text-sm text-[#888888] mb-3 font-[family-name:var(--font-montserrat)]">
                  Appointment Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(typeLabels) as AppointmentType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewAppointment({ ...newAppointment, type })}
                      className={`text-left p-3 border transition-colors ${
                        newAppointment.type === type
                          ? "border-[#c9a962] bg-[#c9a962]/10"
                          : "border-[#2a2a2a] hover:border-[#3a3a3a]"
                      }`}
                    >
                      <p
                        className={`text-sm font-[family-name:var(--font-montserrat)] ${
                          newAppointment.type === type ? "text-[#c9a962]" : "text-[#f5f5f5]"
                        }`}
                      >
                        {typeLabels[type]}
                      </p>
                      <p className="text-[10px] text-[#888888] font-[family-name:var(--font-montserrat)] mt-1 line-clamp-2">
                        {typeDescriptions[type]}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                  Date *
                </label>
                <input
                  type="date"
                  value={newAppointment.date}
                  onChange={(e) => {
                    setNewAppointment({ ...newAppointment, date: e.target.value, timeSlot: "" });
                  }}
                  min={today}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                />
                {newAppointment.date && !isDateAvailable(newAppointment.date) && (
                  <p className="text-red-400 text-xs mt-2 font-[family-name:var(--font-montserrat)]">
                    This date is not available. The studio is closed on this day.
                  </p>
                )}
              </div>

              {/* Time Selection - Visual Grid */}
              {newAppointment.date && isDateAvailable(newAppointment.date) && (
                <div>
                  <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                    Time *
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {generateTimeSlots().map((slot) => {
                      const isBooked = getBookedSlots(newAppointment.date).includes(slot);
                      const isBlocked = isTimeSlotBlocked(newAppointment.date, slot);
                      const isUnavailable = isBooked || isBlocked;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => !isUnavailable && setNewAppointment({ ...newAppointment, timeSlot: slot })}
                          disabled={isUnavailable}
                          title={isBlocked ? getBlockedSlotReason(newAppointment.date, slot) : isBooked ? "Booked" : ""}
                          className={`py-2 text-sm border font-[family-name:var(--font-montserrat)] transition-colors ${
                            newAppointment.timeSlot === slot
                              ? "border-[#c9a962] text-[#c9a962] bg-[#c9a962]/10"
                              : isBlocked
                              ? "border-orange-500/30 text-orange-400/50 bg-orange-500/10 cursor-not-allowed"
                              : isBooked
                              ? "border-[#1a1a1a] text-[#444444] bg-[#1a1a1a]/50 cursor-not-allowed"
                              : "border-[#2a2a2a] text-[#888888] hover:border-[#3a3a3a]"
                          }`}
                        >
                          {slot}
                          {isBlocked && <span className="block text-[9px]">Blocked</span>}
                          {isBooked && !isBlocked && <span className="block text-[9px]">Booked</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                  Notes (optional)
                </label>
                <textarea
                  value={newAppointment.notes}
                  onChange={(e) =>
                    setNewAppointment({ ...newAppointment, notes: e.target.value })
                  }
                  rows={2}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none resize-none"
                  placeholder="Any special notes for this appointment..."
                />
              </div>

              {/* Summary */}
              {newAppointment.date && newAppointment.timeSlot && newAppointment.customerPhone && (
                <div className="bg-[#0a0a0a] p-4 border border-[#1a1a1a]">
                  <p className="text-xs text-[#666666] mb-2 font-[family-name:var(--font-montserrat)]">
                    Appointment Summary
                  </p>
                  <div className="space-y-1">
                    <p className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                      {typeLabels[newAppointment.type]}
                    </p>
                    <p className="text-sm text-[#888888] font-[family-name:var(--font-montserrat)]">
                      {formatDateDisplay(newAppointment.date)} at {newAppointment.timeSlot}
                    </p>
                    <p className="text-sm text-[#888888] font-[family-name:var(--font-montserrat)]">
                      {newAppointment.customerName || customerLookup?.name || "Unknown"} • {newAppointment.customerPhone}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    setShowNewForm(false);
                    setCustomerLookup(null);
                    setNewAppointment({
                      customerPhone: "",
                      customerName: "",
                      type: "consultation",
                      date: "",
                      timeSlot: "",
                      notes: "",
                    });
                  }}
                  className="flex-1 border border-[#2a2a2a] text-[#888888] py-2 font-[family-name:var(--font-montserrat)] hover:border-[#3a3a3a] hover:text-[#f5f5f5] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAppointment}
                  disabled={
                    saving ||
                    !newAppointment.customerPhone ||
                    !newAppointment.date ||
                    !newAppointment.timeSlot ||
                    !isDateAvailable(newAppointment.date)
                  }
                  className="flex-1 bg-[#c9a962] text-[#0a0a0a] py-2 font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors disabled:opacity-50"
                >
                  {saving ? "Scheduling..." : "Schedule Appointment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Detail Modal - Enhanced */}
      {selectedAppointment && !showRescheduleModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#1a1a1a] w-full max-w-md">
            <div className="border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
                Appointment Details
              </h2>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-[#888888] hover:text-[#f5f5f5]"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {(["pending", "confirmed", "completed", "cancelled"] as AppointmentStatus[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(selectedAppointment.id, status)}
                      className={`px-3 py-1 text-xs border font-[family-name:var(--font-montserrat)] transition-colors ${
                        selectedAppointment.status === status
                          ? statusColors[status]
                          : "border-[#2a2a2a] text-[#888888] hover:border-[#3a3a3a]"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="bg-[#0a0a0a] p-4 border border-[#1a1a1a] space-y-3">
                <div>
                  <p className="text-xs text-[#666666] font-[family-name:var(--font-montserrat)]">
                    Customer
                  </p>
                  <p className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                    {selectedAppointment.userName || "Unknown"}
                  </p>
                  <a
                    href={`tel:${selectedAppointment.userPhone}`}
                    className="text-sm text-[#c9a962] font-[family-name:var(--font-montserrat)] hover:underline"
                  >
                    {selectedAppointment.userPhone}
                  </a>
                </div>

                <div>
                  <p className="text-xs text-[#666666] font-[family-name:var(--font-montserrat)]">
                    Type
                  </p>
                  <p className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                    {typeLabels[selectedAppointment.type]}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#666666] font-[family-name:var(--font-montserrat)]">
                    Date & Time
                  </p>
                  <p className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                    {formatDateDisplay(selectedAppointment.date)} at{" "}
                    {selectedAppointment.timeSlot}
                  </p>
                </div>

                {selectedAppointment.notes && (
                  <div>
                    <p className="text-xs text-[#666666] font-[family-name:var(--font-montserrat)]">
                      Notes
                    </p>
                    <p className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)]">
                      {selectedAppointment.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <a
                  href={`https://wa.me/${selectedAppointment.userPhone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 border border-[#2a2a2a] text-[#888888] py-2 text-sm font-[family-name:var(--font-montserrat)] hover:border-[#c9a962] hover:text-[#c9a962] transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
                <button
                  onClick={openRescheduleModal}
                  className="flex-1 border border-[#2a2a2a] text-[#888888] py-2 text-sm font-[family-name:var(--font-montserrat)] hover:border-[#c9a962] hover:text-[#c9a962] transition-colors"
                >
                  Reschedule
                </button>
              </div>

              {/* Delete */}
              <button
                onClick={() => handleDelete(selectedAppointment.id)}
                className="w-full text-red-400 text-sm font-[family-name:var(--font-montserrat)] hover:text-red-300"
              >
                Delete Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#1a1a1a] w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#111111] border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
                Reschedule Appointment
              </h2>
              <button
                onClick={() => {
                  setShowRescheduleModal(false);
                  setRescheduleDate("");
                  setRescheduleTime("");
                }}
                className="text-[#888888] hover:text-[#f5f5f5]"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-[#0a0a0a] p-4 border border-[#1a1a1a]">
                <p className="text-xs text-[#666666] mb-1 font-[family-name:var(--font-montserrat)]">
                  Current Schedule
                </p>
                <p className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                  {formatDateDisplay(selectedAppointment.date)} at {selectedAppointment.timeSlot}
                </p>
              </div>

              {/* New Date */}
              <div>
                <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                  New Date
                </label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => {
                    setRescheduleDate(e.target.value);
                    setRescheduleTime("");
                  }}
                  min={today}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                />
                {rescheduleDate && !isDateAvailable(rescheduleDate) && (
                  <p className="text-red-400 text-xs mt-2 font-[family-name:var(--font-montserrat)]">
                    This date is not available.
                  </p>
                )}
              </div>

              {/* New Time */}
              {rescheduleDate && isDateAvailable(rescheduleDate) && (
                <div>
                  <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                    New Time
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {generateTimeSlots().map((slot) => {
                      const isBooked = getBookedSlots(rescheduleDate).includes(slot) &&
                        !(rescheduleDate === selectedAppointment.date && slot === selectedAppointment.timeSlot);
                      const isBlocked = isTimeSlotBlocked(rescheduleDate, slot);
                      const isUnavailable = isBooked || isBlocked;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => !isUnavailable && setRescheduleTime(slot)}
                          disabled={isUnavailable}
                          title={isBlocked ? getBlockedSlotReason(rescheduleDate, slot) : ""}
                          className={`py-2 text-sm border font-[family-name:var(--font-montserrat)] transition-colors ${
                            rescheduleTime === slot
                              ? "border-[#c9a962] text-[#c9a962] bg-[#c9a962]/10"
                              : isBlocked
                              ? "border-orange-500/30 text-orange-400/50 bg-orange-500/10 cursor-not-allowed"
                              : isBooked
                              ? "border-[#1a1a1a] text-[#444444] bg-[#1a1a1a]/50 cursor-not-allowed"
                              : "border-[#2a2a2a] text-[#888888] hover:border-[#3a3a3a]"
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    setShowRescheduleModal(false);
                    setRescheduleDate("");
                    setRescheduleTime("");
                  }}
                  className="flex-1 border border-[#2a2a2a] text-[#888888] py-2 font-[family-name:var(--font-montserrat)] hover:border-[#3a3a3a] hover:text-[#f5f5f5] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReschedule}
                  disabled={!rescheduleDate || !rescheduleTime || !isDateAvailable(rescheduleDate)}
                  className="flex-1 bg-[#c9a962] text-[#0a0a0a] py-2 font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors disabled:opacity-50"
                >
                  Confirm Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
