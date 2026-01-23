"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DeliverySettings, AvailabilitySettings, Settings, BlockedTimeSlot } from "@/lib/firebase-types";

const defaultDeliverySettings: DeliverySettings = {
  type: "flat",
  flatFee: 2000,
  freeAbove: 100000,
  stateFees: {},
  freeStates: [],
};

const defaultAvailabilitySettings: AvailabilitySettings = {
  workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
  workingHours: {
    start: "10:00",
    end: "18:00",
  },
  slotDuration: 30,
  blockedDates: [],
  blockedTimeSlots: [],
};

const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi",
  "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

const daysOfWeek = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

export default function AdminSettingsPage() {
  const [delivery, setDelivery] = useState<DeliverySettings>(defaultDeliverySettings);
  const [availability, setAvailability] = useState<AvailabilitySettings>(defaultAvailabilitySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // State fee input
  const [newStateFee, setNewStateFee] = useState({ state: "", fee: 0 });
  // Blocked date input
  const [newBlockedDate, setNewBlockedDate] = useState("");
  // Blocked time slot input
  const [newBlockedSlot, setNewBlockedSlot] = useState({
    date: "",
    startTime: "",
    endTime: "",
    reason: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, "settings", "main"));
        if (settingsDoc.exists()) {
          const data = settingsDoc.data() as Settings;
          setDelivery(data.delivery || defaultDeliverySettings);
          setAvailability(data.availability || defaultAvailabilitySettings);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      // Clean delivery settings - remove undefined/null values
      const cleanDelivery: Record<string, unknown> = {
        type: delivery.type,
      };
      if (delivery.flatFee !== undefined && delivery.flatFee > 0) {
        cleanDelivery.flatFee = delivery.flatFee;
      }
      if (delivery.freeAbove !== undefined && delivery.freeAbove > 0) {
        cleanDelivery.freeAbove = delivery.freeAbove;
      }
      if (delivery.stateFees && Object.keys(delivery.stateFees).length > 0) {
        cleanDelivery.stateFees = delivery.stateFees;
      }
      if (delivery.freeStates && delivery.freeStates.length > 0) {
        cleanDelivery.freeStates = delivery.freeStates;
      }

      // Clean blocked time slots - remove undefined reason fields
      const cleanBlockedTimeSlots = (availability.blockedTimeSlots || []).map((slot) => {
        const cleanSlot: Record<string, string> = {
          id: slot.id,
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
        };
        if (slot.reason) {
          cleanSlot.reason = slot.reason;
        }
        return cleanSlot;
      });

      const cleanAvailability = {
        workingDays: availability.workingDays,
        workingHours: availability.workingHours,
        slotDuration: availability.slotDuration,
        blockedDates: availability.blockedDates,
        blockedTimeSlots: cleanBlockedTimeSlots,
      };

      await setDoc(doc(db, "settings", "main"), {
        delivery: cleanDelivery,
        availability: cleanAvailability,
        updatedAt: Timestamp.now(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const addStateFee = () => {
    if (!newStateFee.state || newStateFee.fee <= 0) return;
    setDelivery({
      ...delivery,
      stateFees: {
        ...delivery.stateFees,
        [newStateFee.state]: newStateFee.fee,
      },
    });
    setNewStateFee({ state: "", fee: 0 });
  };

  const removeStateFee = (state: string) => {
    const newFees = { ...delivery.stateFees };
    delete newFees[state];
    setDelivery({ ...delivery, stateFees: newFees });
  };

  const toggleWorkingDay = (day: string) => {
    if (availability.workingDays.includes(day)) {
      setAvailability({
        ...availability,
        workingDays: availability.workingDays.filter((d) => d !== day),
      });
    } else {
      setAvailability({
        ...availability,
        workingDays: [...availability.workingDays, day],
      });
    }
  };

  const addBlockedDate = () => {
    if (!newBlockedDate || availability.blockedDates.includes(newBlockedDate)) return;
    setAvailability({
      ...availability,
      blockedDates: [...availability.blockedDates, newBlockedDate].sort(),
    });
    setNewBlockedDate("");
  };

  const removeBlockedDate = (date: string) => {
    setAvailability({
      ...availability,
      blockedDates: availability.blockedDates.filter((d) => d !== date),
    });
  };

  const addBlockedTimeSlot = () => {
    if (!newBlockedSlot.date || !newBlockedSlot.startTime || !newBlockedSlot.endTime) return;

    // Validate that start time is before end time
    if (newBlockedSlot.startTime >= newBlockedSlot.endTime) {
      alert("Start time must be before end time");
      return;
    }

    // Build slot without undefined values
    const newSlot: BlockedTimeSlot = {
      id: `${newBlockedSlot.date}-${newBlockedSlot.startTime}-${Date.now()}`,
      date: newBlockedSlot.date,
      startTime: newBlockedSlot.startTime,
      endTime: newBlockedSlot.endTime,
    };
    // Only add reason if it has a value
    if (newBlockedSlot.reason.trim()) {
      newSlot.reason = newBlockedSlot.reason.trim();
    }

    setAvailability({
      ...availability,
      blockedTimeSlots: [...(availability.blockedTimeSlots || []), newSlot],
    });
    setNewBlockedSlot({ date: "", startTime: "", endTime: "", reason: "" });
  };

  const removeBlockedTimeSlot = (slotId: string) => {
    setAvailability({
      ...availability,
      blockedTimeSlots: (availability.blockedTimeSlots || []).filter((s) => s.id !== slotId),
    });
  };

  // Generate time options for dropdowns
  const generateTimeOptions = () => {
    const times: string[] = [];
    const startHour = parseInt(availability.workingHours.start.split(":")[0]);
    const endHour = parseInt(availability.workingHours.end.split(":")[0]);

    for (let hour = startHour; hour <= endHour; hour++) {
      times.push(`${hour.toString().padStart(2, "0")}:00`);
      if (hour < endHour) {
        times.push(`${hour.toString().padStart(2, "0")}:30`);
      }
    }
    return times;
  };

  const formatTime12Hour = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#888888]">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
          Settings
        </h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#c9a962] text-[#0a0a0a] px-6 py-2 text-sm font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Delivery Settings */}
      <div className="bg-[#111111] border border-[#1a1a1a] p-6">
        <h2 className="text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-6">
          Delivery Settings
        </h2>

        <div className="space-y-6">
          {/* Delivery Type */}
          <div>
            <label className="block text-sm text-[#888888] mb-3 font-[family-name:var(--font-montserrat)]">
              Delivery Fee Type
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "flat", label: "Flat Fee" },
                { value: "state-based", label: "State-Based" },
                { value: "free", label: "Free Delivery" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    setDelivery({ ...delivery, type: option.value as DeliverySettings["type"] })
                  }
                  className={`py-3 border text-sm font-[family-name:var(--font-montserrat)] transition-colors ${
                    delivery.type === option.value
                      ? "border-[#c9a962] text-[#c9a962] bg-[#c9a962]/10"
                      : "border-[#2a2a2a] text-[#888888] hover:border-[#3a3a3a]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Flat Fee */}
          {delivery.type === "flat" && (
            <div>
              <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                Delivery Fee (₦)
              </label>
              <input
                type="number"
                value={delivery.flatFee || ""}
                onChange={(e) =>
                  setDelivery({ ...delivery, flatFee: parseFloat(e.target.value) || 0 })
                }
                className="w-full max-w-xs bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
              />
            </div>
          )}

          {/* State-Based Fees */}
          {delivery.type === "state-based" && (
            <div>
              <label className="block text-sm text-[#888888] mb-3 font-[family-name:var(--font-montserrat)]">
                State Delivery Fees
              </label>

              <div className="flex gap-2 mb-4">
                <select
                  value={newStateFee.state}
                  onChange={(e) => setNewStateFee({ ...newStateFee, state: e.target.value })}
                  className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                >
                  <option value="">Select state</option>
                  {nigerianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={newStateFee.fee || ""}
                  onChange={(e) =>
                    setNewStateFee({ ...newStateFee, fee: parseFloat(e.target.value) || 0 })
                  }
                  className="w-32 bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                  placeholder="Fee"
                />
                <button
                  onClick={addStateFee}
                  className="px-4 py-2 bg-[#c9a962] text-[#0a0a0a] text-sm font-[family-name:var(--font-montserrat)]"
                >
                  Add
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {Object.entries(delivery.stateFees || {}).map(([state, fee]) => (
                  <div
                    key={state}
                    className="flex items-center justify-between bg-[#0a0a0a] border border-[#1a1a1a] px-4 py-2"
                  >
                    <span className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)]">
                      {state}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
                        {formatCurrency(fee)}
                      </span>
                      <button
                        onClick={() => removeStateFee(state)}
                        className="text-red-400 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Free Delivery Above */}
          {delivery.type !== "free" && (
            <div>
              <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                Free Delivery for Orders Above (₦)
              </label>
              <input
                type="number"
                value={delivery.freeAbove || ""}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (value > 0) {
                    setDelivery({ ...delivery, freeAbove: value });
                  } else {
                    // Remove the field if value is 0 or empty
                    const { freeAbove, ...rest } = delivery;
                    setDelivery({ ...rest, freeAbove: 0 } as DeliverySettings);
                  }
                }}
                className="w-full max-w-xs bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                placeholder="Leave empty for no free delivery threshold"
              />
            </div>
          )}
        </div>
      </div>

      {/* Availability Settings */}
      <div className="bg-[#111111] border border-[#1a1a1a] p-6">
        <h2 className="text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-6">
          Availability Settings
        </h2>

        <div className="space-y-6">
          {/* Working Days */}
          <div>
            <label className="block text-sm text-[#888888] mb-3 font-[family-name:var(--font-montserrat)]">
              Working Days
            </label>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day) => (
                <button
                  key={day.value}
                  onClick={() => toggleWorkingDay(day.value)}
                  className={`px-4 py-2 border text-sm font-[family-name:var(--font-montserrat)] transition-colors ${
                    availability.workingDays.includes(day.value)
                      ? "border-[#c9a962] text-[#c9a962] bg-[#c9a962]/10"
                      : "border-[#2a2a2a] text-[#888888] hover:border-[#3a3a3a]"
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          {/* Working Hours */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                Opening Time
              </label>
              <input
                type="time"
                value={availability.workingHours.start}
                onChange={(e) =>
                  setAvailability({
                    ...availability,
                    workingHours: { ...availability.workingHours, start: e.target.value },
                  })
                }
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                Closing Time
              </label>
              <input
                type="time"
                value={availability.workingHours.end}
                onChange={(e) =>
                  setAvailability({
                    ...availability,
                    workingHours: { ...availability.workingHours, end: e.target.value },
                  })
                }
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
              />
            </div>
          </div>

          {/* Slot Duration */}
          <div>
            <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
              Appointment Slot Duration (minutes)
            </label>
            <select
              value={availability.slotDuration}
              onChange={(e) =>
                setAvailability({
                  ...availability,
                  slotDuration: parseInt(e.target.value),
                })
              }
              className="w-full max-w-xs bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>1 hour</option>
            </select>
          </div>

          {/* Blocked Dates (Full Day) */}
          <div>
            <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
              Blocked Dates (Full Day Off)
            </label>
            <p className="text-xs text-[#666666] mb-3 font-[family-name:var(--font-montserrat)]">
              Block entire days when you&apos;re completely unavailable (e.g., holidays)
            </p>

            <div className="flex gap-2 mb-4">
              <input
                type="date"
                value={newBlockedDate}
                onChange={(e) => setNewBlockedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="flex-1 max-w-xs bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
              />
              <button
                onClick={addBlockedDate}
                className="px-4 py-2 bg-[#c9a962] text-[#0a0a0a] text-sm font-[family-name:var(--font-montserrat)]"
              >
                Block Date
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {availability.blockedDates.map((date) => (
                <div
                  key={date}
                  className="flex items-center gap-2 bg-[#0a0a0a] border border-red-500/30 px-3 py-1"
                >
                  <span className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)]">
                    {new Date(date).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <button onClick={() => removeBlockedDate(date)} className="text-red-400 text-sm">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Blocked Time Slots (Partial Day) */}
          <div>
            <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
              Blocked Time Slots (Partial Day)
            </label>
            <p className="text-xs text-[#666666] mb-3 font-[family-name:var(--font-montserrat)]">
              Block specific hours on a date when you have other commitments but are still partially available
            </p>

            <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs text-[#666666] mb-1 font-[family-name:var(--font-montserrat)]">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newBlockedSlot.date}
                    onChange={(e) => setNewBlockedSlot({ ...newBlockedSlot, date: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full bg-[#111111] border border-[#2a2a2a] px-3 py-2 text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#666666] mb-1 font-[family-name:var(--font-montserrat)]">
                    Reason (optional)
                  </label>
                  <input
                    type="text"
                    value={newBlockedSlot.reason}
                    onChange={(e) => setNewBlockedSlot({ ...newBlockedSlot, reason: e.target.value })}
                    placeholder="e.g., Doctor appointment"
                    className="w-full bg-[#111111] border border-[#2a2a2a] px-3 py-2 text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs text-[#666666] mb-1 font-[family-name:var(--font-montserrat)]">
                    From
                  </label>
                  <select
                    value={newBlockedSlot.startTime}
                    onChange={(e) => setNewBlockedSlot({ ...newBlockedSlot, startTime: e.target.value })}
                    className="w-full bg-[#111111] border border-[#2a2a2a] px-3 py-2 text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                  >
                    <option value="">Select time</option>
                    {generateTimeOptions().map((time) => (
                      <option key={time} value={time}>
                        {formatTime12Hour(time)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#666666] mb-1 font-[family-name:var(--font-montserrat)]">
                    To
                  </label>
                  <select
                    value={newBlockedSlot.endTime}
                    onChange={(e) => setNewBlockedSlot({ ...newBlockedSlot, endTime: e.target.value })}
                    className="w-full bg-[#111111] border border-[#2a2a2a] px-3 py-2 text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                  >
                    <option value="">Select time</option>
                    {generateTimeOptions().map((time) => (
                      <option key={time} value={time}>
                        {formatTime12Hour(time)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={addBlockedTimeSlot}
                disabled={!newBlockedSlot.date || !newBlockedSlot.startTime || !newBlockedSlot.endTime}
                className="w-full py-2 bg-[#c9a962] text-[#0a0a0a] text-sm font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Block Time Slot
              </button>
            </div>

            {/* List of blocked time slots */}
            <div className="space-y-2">
              {(availability.blockedTimeSlots || [])
                .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
                .map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between bg-[#0a0a0a] border border-orange-500/30 px-4 py-3"
                >
                  <div>
                    <p className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)]">
                      {new Date(slot.date).toLocaleDateString("en-NG", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-[#c9a962] text-xs font-[family-name:var(--font-montserrat)]">
                      {formatTime12Hour(slot.startTime)} - {formatTime12Hour(slot.endTime)}
                      {slot.reason && (
                        <span className="text-[#888888] ml-2">({slot.reason})</span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => removeBlockedTimeSlot(slot.id)}
                    className="text-red-400 text-sm hover:text-red-300 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {(!availability.blockedTimeSlots || availability.blockedTimeSlots.length === 0) && (
                <p className="text-[#666666] text-sm font-[family-name:var(--font-montserrat)] text-center py-4">
                  No blocked time slots
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save Button (bottom) */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#c9a962] text-[#0a0a0a] px-8 py-3 text-sm font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : saved ? "Saved!" : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}
