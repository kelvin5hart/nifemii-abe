import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Nifemii Abe",
  description: "Learn about Nifemii Abe, a distinguished fashion designer based in Lagos, Nigeria, specializing in bespoke fashion design.",
};

const values = [
  {
    title: "Craftsmanship",
    description: "Every stitch tells a story. We take pride in the meticulous craftsmanship that goes into each piece, ensuring exceptional quality and attention to detail.",
  },
  {
    title: "Individuality",
    description: "We believe fashion should celebrate uniqueness. Each design is tailored to reflect the individual personality and style of our clients.",
  },
  {
    title: "Excellence",
    description: "We are committed to delivering nothing but the best. From fabric selection to final fitting, excellence guides every decision we make.",
  },
  {
    title: "Elegance",
    description: "Timeless elegance is at the heart of our designs. We create pieces that transcend trends and make lasting impressions.",
  },
];

const milestones = [
  {
    year: "2015",
    title: "The Beginning",
    description: "Nifemii Abe was founded in Lagos with a vision to create bespoke fashion that celebrates African elegance.",
  },
  {
    year: "2017",
    title: "First Collection",
    description: "Launched our first ready-to-wear collection, blending traditional Nigerian aesthetics with contemporary design.",
  },
  {
    year: "2019",
    title: "Bridal Launch",
    description: "Expanded into bridal wear, offering comprehensive wedding consultation services.",
  },
  {
    year: "2021",
    title: "Growing Community",
    description: "Reached over 5,000 satisfied clients and established a loyal community of fashion enthusiasts.",
  },
  {
    year: "2024",
    title: "New Studio",
    description: "Opened our new design studio in Lagos, featuring a private fitting room and showroom.",
  },
];

const galleryImages = [
  "/images/IMG_1618.jpg",
  "/images/IMG_1619.jpg",
  "/images/IMG_1620.jpg",
  "/images/IMG_1596.jpg",
];

export default function About() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <Image
            src="/images/IMG_1606.jpg"
            alt="About background"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/95 to-[#0a0a0a]" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <p className="text-[#c9a962] text-sm tracking-[0.3em] uppercase mb-4 font-[family-name:var(--font-montserrat)]">
            Our Story
          </p>
          <h1 className="text-4xl md:text-6xl font-light text-[#f5f5f5] font-[family-name:var(--font-cormorant)] mb-6">
            About Nifemii Abe
          </h1>
          <div className="divider" />
        </div>
      </section>

      {/* Main About Section */}
      <section className="py-16 px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-[3/4] relative overflow-hidden">
                <div className="absolute inset-0 border border-[#c9a962]/20 z-10" />
                <div className="absolute -bottom-4 -right-4 w-full h-full border border-[#c9a962]/40" />
                <Image
                  src="/images/nifemi_founder.jpg"
                  alt="Nifemii Abe - Fashion Designer"
                  fill
                  className="object-cover object-top"
                />
              </div>
            </div>
            <div>
              <p className="text-[#c9a962] text-sm tracking-[0.3em] uppercase mb-4 font-[family-name:var(--font-montserrat)]">
                The Designer
              </p>
              <h2 className="text-3xl md:text-4xl font-light text-[#f5f5f5] font-[family-name:var(--font-cormorant)] mb-6">
                A Passion for <span className="text-[#c9a962]">Elegance</span>
              </h2>
              <div className="space-y-4 text-[#888888] font-[family-name:var(--font-montserrat)] leading-relaxed">
                <p>
                  Nifemii Abe is a distinguished fashion designer based in Lagos, Nigeria,
                  with a passion for creating exquisite custom-made outfits that celebrate
                  individuality and elegance. With years of experience in the fashion industry,
                  Nifemii has built a reputation for exceptional craftsmanship and attention to detail.
                </p>
                <p>
                  What began as a love for fabric and design has grown into a thriving fashion
                  house that serves clients across Nigeria and beyond. Each piece created by
                  Nifemii Abe tells a unique story, reflecting the personality and vision of
                  the wearer.
                </p>
                <p>
                  From custom-made outfits for special occasions to ready-to-wear collections
                  and comprehensive wedding consultations, Nifemii Abe offers a full spectrum
                  of fashion services designed to make every client feel extraordinary.
                </p>
              </div>
              <div className="mt-8">
                <Link href="/contact" className="btn-primary">
                  Book a Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 px-6 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((img, index) => (
              <div key={index} className="aspect-square relative overflow-hidden group">
                <Image
                  src={img}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover object-top group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#c9a962]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#c9a962] text-sm tracking-[0.3em] uppercase mb-4 font-[family-name:var(--font-montserrat)]">
              What We Stand For
            </p>
            <h2 className="text-4xl md:text-5xl font-light text-[#f5f5f5] font-[family-name:var(--font-cormorant)]">
              Our Values
            </h2>
            <div className="divider mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center p-6 border border-[#1a1a1a] hover:border-[#c9a962]/30 transition-colors duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-6 border border-[#c9a962] rounded-full flex items-center justify-center">
                  <span className="text-2xl text-[#c9a962] font-[family-name:var(--font-cormorant)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-3">
                  {value.title}
                </h3>
                <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)] leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey/Timeline Section */}
      <section className="py-24 px-6 bg-[#0f0f0f]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#c9a962] text-sm tracking-[0.3em] uppercase mb-4 font-[family-name:var(--font-montserrat)]">
              Our Journey
            </p>
            <h2 className="text-4xl md:text-5xl font-light text-[#f5f5f5] font-[family-name:var(--font-cormorant)]">
              Milestones
            </h2>
            <div className="divider mt-6" />
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-[1px] bg-[#2a2a2a]" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-[#c9a962] rounded-full" />

                  {/* Content */}
                  <div
                    className={`ml-8 md:ml-0 md:w-1/2 ${
                      index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                    }`}
                  >
                    <span className="text-[#c9a962] text-sm font-[family-name:var(--font-montserrat)] tracking-wider">
                      {milestone.year}
                    </span>
                    <h3 className="text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mt-1 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/images/IMG_1616.jpg"
            alt="Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "7K+", label: "Instagram Followers" },
              { number: "500+", label: "Happy Clients" },
              { number: "9+", label: "Years Experience" },
              { number: "100+", label: "Wedding Outfits" },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl md:text-5xl font-light text-[#c9a962] font-[family-name:var(--font-cormorant)] mb-2">
                  {stat.number}
                </div>
                <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)] uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-[#0f0f0f]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-light text-[#f5f5f5] font-[family-name:var(--font-cormorant)] mb-6">
            Ready to Create Something <span className="text-[#c9a962]">Beautiful?</span>
          </h2>
          <p className="text-[#888888] font-[family-name:var(--font-montserrat)] mb-8">
            Let&apos;s work together to bring your fashion vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-secondary">
              Book Consultation
            </Link>
            <Link href="/collections" className="btn-primary">
              View Collections
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
