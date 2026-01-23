"use client";

import { useState } from "react";

// Standard Nigerian menswear sizes
const sizeChart = {
  tops: [
    { size: "XS", chest: "34-36", shoulder: "16", length: "27", sleeve: "23" },
    { size: "S", chest: "36-38", shoulder: "17", length: "28", sleeve: "24" },
    { size: "M", chest: "38-40", shoulder: "18", length: "29", sleeve: "25" },
    { size: "L", chest: "40-42", shoulder: "19", length: "30", sleeve: "26" },
    { size: "XL", chest: "42-44", shoulder: "20", length: "31", sleeve: "27" },
    { size: "XXL", chest: "44-46", shoulder: "21", length: "32", sleeve: "28" },
    { size: "3XL", chest: "46-48", shoulder: "22", length: "33", sleeve: "29" },
  ],
  trousers: [
    { size: "XS", waist: "28-30", hips: "34-36", length: "40", thigh: "21" },
    { size: "S", waist: "30-32", hips: "36-38", length: "41", thigh: "22" },
    { size: "M", waist: "32-34", hips: "38-40", length: "42", thigh: "23" },
    { size: "L", waist: "34-36", hips: "40-42", length: "43", thigh: "24" },
    { size: "XL", waist: "36-38", hips: "42-44", length: "44", thigh: "25" },
    { size: "XXL", waist: "38-40", hips: "44-46", length: "45", thigh: "26" },
    { size: "3XL", waist: "40-42", hips: "46-48", length: "46", thigh: "27" },
  ],
};

const howToMeasure = [
  {
    title: "Chest",
    description: "Measure around the fullest part of your chest, keeping the tape horizontal.",
  },
  {
    title: "Shoulder",
    description: "Measure from the edge of one shoulder to the other, across the back.",
  },
  {
    title: "Waist",
    description: "Measure around your natural waistline, where you normally wear your trousers.",
  },
  {
    title: "Hips",
    description: "Measure around the fullest part of your hips, keeping the tape horizontal.",
  },
  {
    title: "Length (Top)",
    description: "Measure from the highest point of your shoulder down to your desired length.",
  },
  {
    title: "Sleeve",
    description: "Measure from the shoulder seam to your wrist with arm slightly bent.",
  },
  {
    title: "Trouser Length",
    description: "Measure from the waist down the outside of your leg to the floor.",
  },
  {
    title: "Thigh",
    description: "Measure around the fullest part of your thigh.",
  },
];

interface SizeGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuide({ isOpen, onClose }: SizeGuideProps) {
  const [activeTab, setActiveTab] = useState<"tops" | "trousers">("tops");

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#111111] border border-[#1a1a1a] w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#111111] border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
            Size Guide
          </h2>
          <button
            onClick={onClose}
            className="text-[#888888] hover:text-[#f5f5f5] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab("tops")}
              className={`px-6 py-2 text-sm font-[family-name:var(--font-montserrat)] uppercase tracking-wider transition-colors ${
                activeTab === "tops"
                  ? "bg-[#c9a962] text-[#0a0a0a]"
                  : "border border-[#2a2a2a] text-[#888888] hover:border-[#c9a962] hover:text-[#c9a962]"
              }`}
            >
              Tops / Agbada / Kaftan
            </button>
            <button
              onClick={() => setActiveTab("trousers")}
              className={`px-6 py-2 text-sm font-[family-name:var(--font-montserrat)] uppercase tracking-wider transition-colors ${
                activeTab === "trousers"
                  ? "bg-[#c9a962] text-[#0a0a0a]"
                  : "border border-[#2a2a2a] text-[#888888] hover:border-[#c9a962] hover:text-[#c9a962]"
              }`}
            >
              Trousers / Sokoto
            </button>
          </div>

          {/* Size Chart Table */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2a2a]">
                  <th className="text-left py-3 px-4 text-[#c9a962] text-sm font-[family-name:var(--font-montserrat)] uppercase tracking-wider">
                    Size
                  </th>
                  {activeTab === "tops" ? (
                    <>
                      <th className="text-left py-3 px-4 text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
                        Chest (in)
                      </th>
                      <th className="text-left py-3 px-4 text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
                        Shoulder (in)
                      </th>
                      <th className="text-left py-3 px-4 text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
                        Length (in)
                      </th>
                      <th className="text-left py-3 px-4 text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
                        Sleeve (in)
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="text-left py-3 px-4 text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
                        Waist (in)
                      </th>
                      <th className="text-left py-3 px-4 text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
                        Hips (in)
                      </th>
                      <th className="text-left py-3 px-4 text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
                        Length (in)
                      </th>
                      <th className="text-left py-3 px-4 text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
                        Thigh (in)
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {activeTab === "tops"
                  ? sizeChart.tops.map((row, index) => (
                      <tr
                        key={row.size}
                        className={`border-b border-[#1a1a1a] ${
                          index % 2 === 0 ? "bg-[#0a0a0a]" : ""
                        }`}
                      >
                        <td className="py-3 px-4 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] font-medium">
                          {row.size}
                        </td>
                        <td className="py-3 px-4 text-[#888888] font-[family-name:var(--font-montserrat)]">
                          {row.chest}
                        </td>
                        <td className="py-3 px-4 text-[#888888] font-[family-name:var(--font-montserrat)]">
                          {row.shoulder}
                        </td>
                        <td className="py-3 px-4 text-[#888888] font-[family-name:var(--font-montserrat)]">
                          {row.length}
                        </td>
                        <td className="py-3 px-4 text-[#888888] font-[family-name:var(--font-montserrat)]">
                          {row.sleeve}
                        </td>
                      </tr>
                    ))
                  : sizeChart.trousers.map((row, index) => (
                      <tr
                        key={row.size}
                        className={`border-b border-[#1a1a1a] ${
                          index % 2 === 0 ? "bg-[#0a0a0a]" : ""
                        }`}
                      >
                        <td className="py-3 px-4 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] font-medium">
                          {row.size}
                        </td>
                        <td className="py-3 px-4 text-[#888888] font-[family-name:var(--font-montserrat)]">
                          {row.waist}
                        </td>
                        <td className="py-3 px-4 text-[#888888] font-[family-name:var(--font-montserrat)]">
                          {row.hips}
                        </td>
                        <td className="py-3 px-4 text-[#888888] font-[family-name:var(--font-montserrat)]">
                          {row.length}
                        </td>
                        <td className="py-3 px-4 text-[#888888] font-[family-name:var(--font-montserrat)]">
                          {row.thigh}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* How to Measure */}
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6">
            <h3 className="text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-4">
              How to Measure
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {howToMeasure.map((item) => (
                <div key={item.title} className="flex gap-3">
                  <div className="w-2 h-2 bg-[#c9a962] mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] font-medium">
                      {item.title}
                    </p>
                    <p className="text-[#888888] text-xs font-[family-name:var(--font-montserrat)] mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="mt-6 bg-[#c9a962]/10 border border-[#c9a962]/30 p-4">
            <p className="text-[#c9a962] text-sm font-[family-name:var(--font-montserrat)]">
              <strong>Tip:</strong> If you're between sizes, we recommend going up a size for a more comfortable fit.
              For the most accurate fit, visit our studio for a professional measurement session.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export standard sizes for use in admin product creation
export const standardSizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
