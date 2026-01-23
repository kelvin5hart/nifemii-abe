"use client";

import { useState, useEffect } from "react";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Measurements } from "@/lib/firebase-types";

// Helper to convert Firestore Timestamp or Date to Date
const toDate = (value: unknown): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "object" && value !== null && "toDate" in value) {
    return (value as { toDate: () => Date }).toDate();
  }
  if (typeof value === "object" && value !== null && "seconds" in value) {
    // Handle serialized timestamp { seconds, nanoseconds }
    return new Date((value as { seconds: number }).seconds * 1000);
  }
  return null;
};

const measurementFields = [
  {
    key: "chest",
    label: "Chest",
    description: "Measure around the fullest part of your chest",
  },
  {
    key: "waist",
    label: "Waist",
    description: "Measure around your natural waistline",
  },
  {
    key: "hips",
    label: "Hips",
    description: "Measure around the fullest part of your hips",
  },
  {
    key: "shoulder",
    label: "Shoulder Width",
    description: "Measure from shoulder point to shoulder point",
  },
  {
    key: "sleeveLength",
    label: "Sleeve Length",
    description: "Measure from shoulder point to wrist",
  },
  {
    key: "shirtLength",
    label: "Shirt/Top Length",
    description: "Measure from shoulder to desired length",
  },
  {
    key: "neck",
    label: "Neck",
    description: "Measure around the base of your neck",
  },
  {
    key: "trouserWaist",
    label: "Trouser Waist",
    description: "Measure where you want your trousers to sit",
  },
  {
    key: "trouserLength",
    label: "Trouser Length",
    description: "Measure from waist to ankle or desired length",
  },
  {
    key: "thigh",
    label: "Thigh",
    description: "Measure around the fullest part of your thigh",
  },
  {
    key: "ankle",
    label: "Ankle",
    description: "Measure around your ankle",
  },
];

export default function CustomerMeasurementsPage() {
  const { user } = useAuth();
  const [measurements, setMeasurements] = useState<Measurements>({});
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user?.measurements) {
      setMeasurements(user.measurements);
    }
  }, [user?.measurements]);

  const handleSave = async () => {
    if (!user?.id) return;

    setSaving(true);
    setSaved(false);

    try {
      await updateDoc(doc(db, "users", user.id), {
        measurements: {
          ...measurements,
          updatedAt: Timestamp.now(),
        },
        updatedAt: Timestamp.now(),
      });
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving measurements:", error);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: string, value: string) => {
    const numValue = parseFloat(value);
    setMeasurements({
      ...measurements,
      [key]: isNaN(numValue) ? undefined : numValue,
    });
  };

  const hasAnyMeasurements = measurementFields.some(
    (f) => (measurements as Record<string, number | undefined>)[f.key]
  );

  return (
    <>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
              My Measurements
            </h1>
            <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
              Keep your measurements updated for perfect-fitting outfits
            </p>
          </div>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="bg-[#c9a962] text-[#0a0a0a] px-4 py-2 text-sm font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors"
            >
              {hasAnyMeasurements ? "Edit Measurements" : "Add Measurements"}
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditing(false);
                  setMeasurements(user?.measurements || {});
                }}
                className="border border-[#2a2a2a] text-[#888888] px-4 py-2 text-sm font-[family-name:var(--font-montserrat)] hover:border-[#3a3a3a] hover:text-[#f5f5f5] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#c9a962] text-[#0a0a0a] px-4 py-2 text-sm font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : saved ? "Saved!" : "Save"}
              </button>
            </div>
          )}
        </div>

        {/* Measurement Guide */}
        <div className="bg-[#111111] border border-[#1a1a1a] p-6 mb-8">
          <h2 className="text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-4">
            How to Measure
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-[family-name:var(--font-montserrat)]">
            <div className="flex items-start gap-3">
              <span className="text-[#c9a962]">1</span>
              <p className="text-[#888888]">
                Use a flexible measuring tape for accurate measurements
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#c9a962]">2</span>
              <p className="text-[#888888]">
                Stand straight with arms relaxed at your sides
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#c9a962]">3</span>
              <p className="text-[#888888]">
                Keep the tape snug but not tight
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#c9a962]">4</span>
              <p className="text-[#888888]">
                All measurements are in inches
              </p>
            </div>
          </div>
        </div>

        {/* Measurements Form/Display */}
        <div className="bg-[#111111] border border-[#1a1a1a]">
          <div className="p-6 border-b border-[#1a1a1a]">
            <h2 className="text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
              Your Measurements
            </h2>
            <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
              All measurements in inches
            </p>
          </div>

          <div className="p-6">
            {!hasAnyMeasurements && !editing ? (
              <div className="text-center py-8">
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
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-[#888888] font-[family-name:var(--font-montserrat)] mb-4">
                  No measurements saved yet
                </p>
                <button
                  onClick={() => setEditing(true)}
                  className="inline-block bg-[#c9a962] text-[#0a0a0a] px-6 py-2 font-[family-name:var(--font-montserrat)] text-sm uppercase tracking-wider hover:bg-[#d4b87a] transition-colors"
                >
                  Add Your Measurements
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {measurementFields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="block text-sm text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                      {field.label}
                    </label>
                    {editing ? (
                      <>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="0.5"
                            value={
                              (measurements as Record<string, number | undefined>)[field.key] ||
                              ""
                            }
                            onChange={(e) => updateField(field.key, e.target.value)}
                            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                            placeholder="0"
                          />
                          <span className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
                            in
                          </span>
                        </div>
                        <p className="text-xs text-[#666666] font-[family-name:var(--font-montserrat)]">
                          {field.description}
                        </p>
                      </>
                    ) : (
                      <div className="bg-[#0a0a0a] border border-[#1a1a1a] px-4 py-3">
                        <span className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                          {(measurements as Record<string, number | undefined>)[field.key] || "-"}
                        </span>
                        {(measurements as Record<string, number | undefined>)[field.key] && (
                          <span className="text-[#888888] text-sm ml-1 font-[family-name:var(--font-montserrat)]">
                            inches
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Notes */}
            {(editing || measurements.notes) && (
              <div className="mt-6 pt-6 border-t border-[#1a1a1a]">
                <label className="block text-sm text-[#f5f5f5] mb-2 font-[family-name:var(--font-montserrat)]">
                  Additional Notes
                </label>
                {editing ? (
                  <textarea
                    value={measurements.notes || ""}
                    onChange={(e) =>
                      setMeasurements({ ...measurements, notes: e.target.value })
                    }
                    rows={3}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none resize-none"
                    placeholder="Any special fitting preferences or notes for the tailor..."
                  />
                ) : (
                  <div className="bg-[#0a0a0a] border border-[#1a1a1a] px-4 py-3">
                    <p className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)]">
                      {measurements.notes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Last Updated */}
          {measurements.updatedAt && toDate(measurements.updatedAt) && (
            <div className="px-6 py-4 border-t border-[#1a1a1a] text-sm text-[#888888] font-[family-name:var(--font-montserrat)]">
              Last updated:{" "}
              {toDate(measurements.updatedAt)!.toLocaleDateString("en-NG", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-8 bg-[#c9a962]/10 border border-[#c9a962]/30 p-6">
          <h3 className="text-[#c9a962] font-[family-name:var(--font-cormorant)] text-lg mb-2">
            Pro Tip
          </h3>
          <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
            For the most accurate fit, we recommend getting professionally measured at our studio
            during a consultation appointment. Our experts can ensure precise measurements for
            your bespoke pieces.
          </p>
        </div>
      </div>
    </>
  );
}
