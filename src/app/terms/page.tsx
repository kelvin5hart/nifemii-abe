import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | Nifemii Abe",
  description: "Terms and conditions for Nifemii Abe luxury bespoke fashion services.",
};

const sections = [
  {
    title: "Brand Positioning",
    content:
      "Nifemii Abe is a luxury bespoke fashion brand. All garments are handcrafted and made-to-measure using premium materials. By placing an order, clients acknowledge and accept our luxury production standards.",
  },
  {
    title: "Consultation & Measurements",
    content:
      "All consultations are by appointment only. Measurements taken by Nifemii Abe are final. Clients providing self-measurements accept full responsibility for fitting outcomes. Body changes after measurement are not the brand's responsibility.",
  },
  {
    title: "Payment Policy",
    content:
      "A minimum of 70% deposit is required to confirm any order. Full payment must be completed before delivery or pickup. All payments made are non-refundable.",
  },
  {
    title: "Production Timeline",
    content:
      "Standard production timeline is 3–6 weeks depending on design complexity. Express orders attract additional rush fees. Timelines commence after deposit confirmation and final design approval.",
  },
  {
    title: "Design Approval & Alterations",
    content:
      "Final designs must be approved before production begins. Only minor alterations are permitted at first fitting. Major redesigns or size changes attract additional charges.",
  },
  {
    title: "Fittings",
    content:
      "Clients are entitled to a maximum of two fittings. Additional fittings attract extra charges. Missed appointments may result in delays.",
  },
  {
    title: "Refunds & Cancellations",
    content:
      "All garments are custom-made and strictly non-refundable. Cancellations after production has commenced are not permitted.",
  },
  {
    title: "Pick-Up, Delivery & Storage",
    content:
      "Completed orders must be picked up within 14 days. Uncollected items may attract storage fees. Delivery costs are borne by the client. Liability ends once items leave the studio.",
  },
  {
    title: "Fabric & Materials",
    content:
      "Fabric choices are final once approved. Minor color variations may occur. The brand is not responsible for defects in client-supplied fabrics.",
  },
  {
    title: "Care & Maintenance",
    content:
      "Proper garment care is the client's responsibility. Dry-cleaning is recommended unless otherwise advised.",
  },
  {
    title: "Intellectual Property",
    content:
      "All designs, sketches, and concepts remain the intellectual property of Nifemii Abe and may not be reproduced without written consent.",
  },
  {
    title: "Media & Promotion",
    content:
      "Nifemii Abe reserves the right to photograph completed garments for promotional use while respecting client confidentiality.",
  },
  {
    title: "Client Conduct",
    content:
      "Respectful communication is required at all times. The brand reserves the right to decline service when necessary.",
  },
  {
    title: "Force Majeure",
    content:
      "Nifemii Abe will not be liable for delays caused by circumstances beyond our control.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 md:pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-light tracking-[0.1em] text-[#f5f5f5] font-[family-name:var(--font-cormorant)] mb-4">
            TERMS & <span className="text-[#c9a962]">CONDITIONS</span>
          </h1>
          <div className="w-16 h-[1px] bg-[#c9a962] mx-auto"></div>
        </div>

        {/* Introduction */}
        <div className="bg-[#111111] border border-[#1a1a1a] p-6 md:p-8 mb-8">
          <p className="text-[#888888] font-[family-name:var(--font-montserrat)] text-sm leading-relaxed">
            Please read these terms and conditions carefully before placing an order with Nifemii Abe.
            By placing an order, you confirm that you have read, understood, and agreed to these Terms & Conditions.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div
              key={index}
              className="bg-[#111111] border border-[#1a1a1a] p-6 md:p-8"
            >
              <h2 className="text-lg md:text-xl font-light text-[#f5f5f5] font-[family-name:var(--font-cormorant)] mb-4 flex items-center gap-3">
                <span className="text-[#c9a962] text-sm font-[family-name:var(--font-montserrat)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {section.title}
              </h2>
              <p className="text-[#888888] font-[family-name:var(--font-montserrat)] text-sm leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Agreement Notice */}
        <div className="mt-12 bg-[#c9a962]/10 border border-[#c9a962]/30 p-6 md:p-8 text-center">
          <h3 className="text-lg font-light text-[#c9a962] font-[family-name:var(--font-cormorant)] mb-3">
            Agreement
          </h3>
          <p className="text-[#888888] font-[family-name:var(--font-montserrat)] text-sm">
            Placing an order confirms that the client has read, understood, and agreed to these Terms & Conditions.
          </p>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-[#888888] hover:text-[#c9a962] transition-colors font-[family-name:var(--font-montserrat)] text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
