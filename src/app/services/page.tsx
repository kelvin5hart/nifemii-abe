import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | Nifemii Abe",
  description: "Custom made outfits, ready to wear collections, and wedding consultations. Discover our bespoke fashion services.",
};

const services = [
  {
    id: 1,
    title: "Custom Made Outfits",
    subtitle: "Bespoke Design Service",
    description: "Experience the luxury of having a garment designed and crafted exclusively for you. Our custom-made service ensures every piece fits your body perfectly and reflects your personal style.",
    features: [
      "Personal consultation to understand your vision",
      "Custom measurements for perfect fit",
      "Choice of premium fabrics and materials",
      "Multiple fittings to ensure perfection",
      "Detailed craftsmanship and finishing",
      "Alterations included",
    ],
    image: "/images/design_final.jpg",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Ready to Wear",
    subtitle: "Curated Collections",
    description: "Discover our collection of pre-designed pieces that embody the same attention to detail and quality as our custom work. Perfect for those who appreciate fine fashion with immediate availability.",
    features: [
      "Carefully curated seasonal collections",
      "Premium quality fabrics",
      "Limited edition pieces",
      "Available in select sizes",
      "Minor alterations available",
      "Quick delivery options",
    ],
    image: "/images/Traditional.jpg",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Wedding Consultations",
    subtitle: "Bridal & Groom Services",
    description: "Your wedding day deserves extraordinary attire. We offer comprehensive wedding consultations for brides, grooms, and wedding parties to create unforgettable looks for your special day.",
    features: [
      "Bridal gown design and creation",
      "Groom's traditional and contemporary attire",
      "Aso-Ebi coordination for wedding parties",
      "Multiple design consultations",
      "Fabric sourcing and selection",
      "Emergency alterations service",
    ],
    image: "/images/wedding_01.jpg",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Style Consultations",
    subtitle: "Personal Styling",
    description: "Not sure where to start? Our style consultation service helps you define your personal style and make informed decisions about your wardrobe, whether for a specific event or a complete style refresh.",
    features: [
      "Personal style assessment",
      "Color and fabric recommendations",
      "Wardrobe planning",
      "Event-specific styling",
      "Shopping guidance",
      "Ongoing style support",
    ],
    image: "/images/nifemi_founder.jpg",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
];

const process = [
  {
    step: "01",
    title: "Consultation",
    description: "We begin with a detailed consultation to understand your vision, preferences, and requirements.",
  },
  {
    step: "02",
    title: "Design",
    description: "Our designers create sketches and select fabrics that bring your vision to life.",
  },
  {
    step: "03",
    title: "Crafting",
    description: "Skilled artisans meticulously craft your piece with attention to every detail.",
  },
  {
    step: "04",
    title: "Fitting",
    description: "Multiple fittings ensure your garment fits perfectly and meets your expectations.",
  },
  {
    step: "05",
    title: "Delivery",
    description: "Your finished piece is delivered, ready to make you feel extraordinary.",
  },
];

export default function Services() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <Image
            src="/images/IMG_1606.jpg"
            alt="Services background"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/95 to-[#0a0a0a]" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <p className="text-[#c9a962] text-sm tracking-[0.3em] uppercase mb-4 font-[family-name:var(--font-montserrat)]">
            What We Offer
          </p>
          <h1 className="text-4xl md:text-6xl font-light text-[#f5f5f5] font-[family-name:var(--font-cormorant)] mb-6">
            Our Services
          </h1>
          <div className="divider" />
          <p className="text-[#888888] mt-6 max-w-2xl mx-auto font-[family-name:var(--font-montserrat)]">
            From custom creations to ready-to-wear collections, we offer a range of services
            designed to meet your fashion needs with excellence.
          </p>
        </div>
      </section>

      {/* Services Detail */}
      <section className="py-16 px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-24">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="text-[#c9a962] mb-4">
                    {service.icon}
                  </div>
                  <p className="text-[#c9a962] text-sm tracking-[0.2em] uppercase mb-2 font-[family-name:var(--font-montserrat)]">
                    {service.subtitle}
                  </p>
                  <h2 className="text-3xl md:text-4xl font-light text-[#f5f5f5] font-[family-name:var(--font-cormorant)] mb-4">
                    {service.title}
                  </h2>
                  <p className="text-[#888888] font-[family-name:var(--font-montserrat)] mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-[#888888] font-[family-name:var(--font-montserrat)] text-sm">
                        <svg className="w-4 h-4 text-[#c9a962] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact" className="btn-primary">
                    Inquire Now
                  </Link>
                </div>
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <div className="absolute inset-0 border border-[#c9a962]/20 z-10" />
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-6 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#c9a962] text-sm tracking-[0.3em] uppercase mb-4 font-[family-name:var(--font-montserrat)]">
              How It Works
            </p>
            <h2 className="text-4xl md:text-5xl font-light text-[#f5f5f5] font-[family-name:var(--font-cormorant)]">
              Our Process
            </h2>
            <div className="divider mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {process.map((item, index) => (
              <div key={item.step} className="relative">
                <div className="text-center">
                  <div className="text-5xl font-light text-[#c9a962]/30 font-[family-name:var(--font-cormorant)] mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
                    {item.description}
                  </p>
                </div>
                {index < process.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[1px] bg-[#c9a962]/20" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/images/IMG_1616.jpg"
            alt="Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-light text-[#f5f5f5] font-[family-name:var(--font-cormorant)] mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-[#888888] font-[family-name:var(--font-montserrat)] mb-8">
            Book a consultation today and let&apos;s bring your fashion vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-secondary">
              Book Consultation
            </Link>
            <a
              href="https://wa.me/2347067601656"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
