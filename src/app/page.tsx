import Link from "next/link";
import Image from "next/image";
import HeroCarousel from "@/components/HeroCarousel";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";

const featuredCollections = [
  {
    id: 1,
    title: "Evening Elegance",
    category: "Ready to Wear",
    image: "/images/IMG_1596.jpg",
  },
  {
    id: 2,
    title: "Bridal Collection",
    category: "Wedding",
    image: "/images/IMG_1597.jpg",
  },
  {
    id: 3,
    title: "Traditional Royalty",
    category: "Custom",
    image: "/images/IMG_1598.jpg",
  },
  {
    id: 4,
    title: "Corporate Chic",
    category: "Ready to Wear",
    image: "/images/IMG_1599.jpg",
  },
  {
    id: 5,
    title: "Celebration Wear",
    category: "Custom",
    image: "/images/IMG_1601.jpg",
  },
  {
    id: 6,
    title: "Casual Luxe",
    category: "Ready to Wear",
    image: "/images/IMG_1605.jpg",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Carousel */}
        <HeroCarousel />

        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#0a0a0a]/70 to-[#0a0a0a] z-10" />

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <p className="text-[#c9a962] text-[10px] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-4 sm:mb-6 font-[family-name:var(--font-montserrat)] animate-fade-in">
            Lagos, Nigeria
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light tracking-[0.05em] sm:tracking-[0.1em] text-[#f5f5f5] font-[family-name:var(--font-cormorant)] mb-4 sm:mb-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            NIFEMII <span className="text-[#c9a962]">ABE</span>
          </h1>
          <div className="divider mb-4 sm:mb-6 animate-fade-in" style={{ animationDelay: "0.4s" }} />
          <p className="text-base sm:text-lg md:text-xl text-[#e0e0e0] font-[family-name:var(--font-cormorant)] mb-8 sm:mb-10 animate-fade-in" style={{ animationDelay: "0.6s" }}>
            Bespoke Fashion Design
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.8s" }}>
            <Link href="/collections" className="btn-primary text-xs sm:text-sm">
              View Collections
            </Link>
            <Link href="/contact" className="btn-secondary text-xs sm:text-sm">
              Book Consultation
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 border border-[#c9a962] rounded-full flex justify-center">
            <div className="w-1 h-3 bg-[#c9a962] rounded-full mt-2" />
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
            <div>
              <p className="text-[#c9a962] text-[10px] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-3 sm:mb-4 font-[family-name:var(--font-montserrat)]">
                About The Designer
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-[#f5f5f5] font-[family-name:var(--font-cormorant)] mb-4 sm:mb-6">
                Crafting Elegance, <br />
                <span className="text-[#c9a962]">One Stitch at a Time</span>
              </h2>
              <p className="text-[#888888] text-sm sm:text-base leading-relaxed font-[family-name:var(--font-montserrat)] mb-6 sm:mb-8">
                Nifemii Abe is a distinguished fashion designer based in Lagos, Nigeria,
                specializing in creating exquisite custom-made outfits that celebrate
                individuality and elegance. With a keen eye for detail and a passion
                for craftsmanship, each piece is thoughtfully designed to enhance
                the unique beauty of every client.
              </p>
              <Link href="/about" className="btn-primary text-xs sm:text-sm">
                Learn More
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-[3/4] relative overflow-hidden">
                <div className="absolute inset-0 border border-[#c9a962]/20 z-10" />
                <div className="absolute -top-4 -left-4 w-full h-full border border-[#c9a962]/40" />
                <Image
                  src="/images/nifemi_founder.jpg"
                  alt="Nifemii Abe - Fashion Designer"
                  fill
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-[#c9a962] text-[10px] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-3 sm:mb-4 font-[family-name:var(--font-montserrat)]">
              What We Offer
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-[#f5f5f5] font-[family-name:var(--font-cormorant)]">
              Our Services
            </h2>
            <div className="divider mt-4 sm:mt-6" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                title: "Custom Made Outfits",
                description:
                  "Bespoke designs tailored to your unique measurements and style preferences. Every piece is crafted with precision and care.",
                image: "/images/design_final.jpg",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                ),
              },
              {
                title: "Ready to Wear",
                description:
                  "Curated collections of elegant pieces ready for immediate purchase. Timeless designs that embody sophistication.",
                image: "/images/Traditional.jpg",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                ),
              },
              {
                title: "Wedding Consultations",
                description:
                  "Specialized bridal and wedding party consultations. Create unforgettable moments with custom wedding attire.",
                image: "/images/wedding_01.jpg",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#c9a962]/50 transition-all duration-300 group overflow-hidden"
              >
                <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover object-[center_20%] group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
                </div>
                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="text-[#c9a962] mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 [&>svg]:w-6 [&>svg]:h-6 sm:[&>svg]:w-8 sm:[&>svg]:h-8">
                    {service.icon}
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-2 sm:mb-4">
                    {service.title}
                  </h3>
                  <p className="text-[#888888] text-xs sm:text-sm font-[family-name:var(--font-montserrat)] leading-relaxed line-clamp-3 sm:line-clamp-none">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Link href="/services" className="btn-primary text-xs sm:text-sm">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-16">
            <p className="text-[#c9a962] text-[10px] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-3 sm:mb-4 font-[family-name:var(--font-montserrat)]">
              Our Work
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-[#f5f5f5] font-[family-name:var(--font-cormorant)]">
              Featured Collections
            </h2>
            <div className="divider mt-4 sm:mt-6" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {featuredCollections.map((item) => (
              <Link
                href="/collections"
                key={item.id}
                className="aspect-[3/4] relative overflow-hidden group cursor-pointer"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover object-top group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-[#c9a962]/90 px-2 py-0.5 sm:px-3 sm:py-1">
                  <span className="text-[8px] sm:text-xs text-[#0a0a0a] font-[family-name:var(--font-montserrat)] uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6">
                  <h3 className="text-sm sm:text-base lg:text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5] group-hover:text-[#c9a962] transition-colors">
                    {item.title}
                  </h3>
                </div>
                <div className="absolute inset-0 bg-[#0a0a0a]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-[#c9a962] text-[10px] sm:text-sm tracking-[0.1em] sm:tracking-[0.2em] uppercase font-[family-name:var(--font-montserrat)] border border-[#c9a962] px-3 py-1.5 sm:px-6 sm:py-3">
                    View Collection
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Link href="/collections" className="btn-primary text-xs sm:text-sm">
              View All Collections
            </Link>
          </div>
        </div>
      </section>

      {/* From Sketch to Final - Design Process */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-[#c9a962] text-[10px] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-3 sm:mb-4 font-[family-name:var(--font-montserrat)]">
              The Art of Creation
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-[#f5f5f5] font-[family-name:var(--font-cormorant)]">
              From Sketch to <span className="text-[#c9a962]">Masterpiece</span>
            </h2>
            <div className="divider mt-4 sm:mt-6" />
            <p className="text-[#888888] text-sm sm:text-base mt-4 sm:mt-6 max-w-2xl mx-auto font-[family-name:var(--font-montserrat)]">
              Every creation begins with a vision. Slide to see how your ideas transform from initial sketches into stunning, wearable art.
            </p>
          </div>

          <BeforeAfterSlider
            beforeImage="/images/design_sketch.jpg"
            afterImage="/images/design_final.jpg"
            beforeLabel="Sketch"
            afterLabel="Final"
          />

          <div className="text-center mt-8 sm:mt-12">
            <Link href="/services" className="btn-primary text-xs sm:text-sm">
              Start Your Journey
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <Image
            src="/images/IMG_1610.jpg"
            alt="Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-[#c9a962] text-[10px] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-3 sm:mb-4 font-[family-name:var(--font-montserrat)]">
              Client Stories
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-[#f5f5f5] font-[family-name:var(--font-cormorant)] mb-4">
              What Our Clients Say
            </h2>
            <div className="divider" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Testimonial 1 */}
            <div className="bg-[#0f0f0f] border border-[#1a1a1a] p-6 sm:p-8 relative">
              <svg className="w-8 h-8 text-[#c9a962]/20 absolute top-4 right-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-[#c9a962]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-[#e0e0e0] text-sm sm:text-base font-[family-name:var(--font-cormorant)] leading-relaxed mb-6 italic">
                &ldquo;Nifemii Abe transformed my vision into reality. The attention to detail and craftsmanship is unparalleled. I felt like royalty on my wedding day.&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#c9a962]/20 flex items-center justify-center">
                  <span className="text-[#c9a962] text-sm font-[family-name:var(--font-cormorant)] font-semibold">AO</span>
                </div>
                <div>
                  <p className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)]">Adaeze Okonkwo</p>
                  <p className="text-[#888888] text-xs font-[family-name:var(--font-montserrat)]">Bride, Lagos</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-[#0f0f0f] border border-[#1a1a1a] p-6 sm:p-8 relative">
              <svg className="w-8 h-8 text-[#c9a962]/20 absolute top-4 right-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-[#c9a962]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-[#e0e0e0] text-sm sm:text-base font-[family-name:var(--font-cormorant)] leading-relaxed mb-6 italic">
                &ldquo;The agbada Nifemii created for my traditional wedding was beyond my expectations. The quality of the fabric and the intricate embroidery made me stand out. Highly recommended!&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#c9a962]/20 flex items-center justify-center">
                  <span className="text-[#c9a962] text-sm font-[family-name:var(--font-cormorant)] font-semibold">CO</span>
                </div>
                <div>
                  <p className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)]">Chukwuemeka Obi</p>
                  <p className="text-[#888888] text-xs font-[family-name:var(--font-montserrat)]">Groom, Abuja</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-[#0f0f0f] border border-[#1a1a1a] p-6 sm:p-8 relative">
              <svg className="w-8 h-8 text-[#c9a962]/20 absolute top-4 right-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-[#c9a962]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-[#e0e0e0] text-sm sm:text-base font-[family-name:var(--font-cormorant)] leading-relaxed mb-6 italic">
                &ldquo;I&apos;ve been a client for 3 years now. Every piece I&apos;ve ordered has been perfect. The consultation process is thorough and the delivery is always on time. True professionalism!&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#c9a962]/20 flex items-center justify-center">
                  <span className="text-[#c9a962] text-sm font-[family-name:var(--font-cormorant)] font-semibold">FA</span>
                </div>
                <div>
                  <p className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)]">Funke Adeyemi</p>
                  <p className="text-[#888888] text-xs font-[family-name:var(--font-montserrat)]">Loyal Client, Lagos</p>
                </div>
              </div>
            </div>

            {/* Testimonial 4 */}
            <div className="bg-[#0f0f0f] border border-[#1a1a1a] p-6 sm:p-8 relative md:col-span-2 lg:col-span-1">
              <svg className="w-8 h-8 text-[#c9a962]/20 absolute top-4 right-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-[#c9a962]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-[#e0e0e0] text-sm sm:text-base font-[family-name:var(--font-cormorant)] leading-relaxed mb-6 italic">
                &ldquo;Coordinating aso-ebi for my sister&apos;s wedding was stressful until I found Nifemii Abe. They handled everything seamlessly and all 50 guests looked stunning!&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#c9a962]/20 flex items-center justify-center">
                  <span className="text-[#c9a962] text-sm font-[family-name:var(--font-cormorant)] font-semibold">BI</span>
                </div>
                <div>
                  <p className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)]">Bukola Ibrahim</p>
                  <p className="text-[#888888] text-xs font-[family-name:var(--font-montserrat)]">Wedding Party, Port Harcourt</p>
                </div>
              </div>
            </div>

            {/* Testimonial 5 */}
            <div className="bg-[#0f0f0f] border border-[#1a1a1a] p-6 sm:p-8 relative lg:col-span-2">
              <svg className="w-8 h-8 text-[#c9a962]/20 absolute top-4 right-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-[#c9a962]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-[#e0e0e0] text-sm sm:text-base font-[family-name:var(--font-cormorant)] leading-relaxed mb-6 italic">
                &ldquo;As someone based in the UK, I was skeptical about ordering custom outfits from Nigeria. Nifemii Abe exceeded all expectations - from virtual consultations to international delivery. The fit was perfect and the quality speaks for itself. I&apos;ve already recommended them to all my friends!&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#c9a962]/20 flex items-center justify-center">
                  <span className="text-[#c9a962] text-sm font-[family-name:var(--font-cormorant)] font-semibold">TO</span>
                </div>
                <div>
                  <p className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)]">Tolu Ogundimu</p>
                  <p className="text-[#888888] text-xs font-[family-name:var(--font-montserrat)]">International Client, London</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed Preview */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-[#c9a962] text-[10px] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-3 sm:mb-4 font-[family-name:var(--font-montserrat)]">
              @nifemiiabe
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-[#f5f5f5] font-[family-name:var(--font-cormorant)]">
              Follow Us on Instagram
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2">
            {[
              "/images/IMG_1612.jpg",
              "/images/IMG_1613.jpg",
              "/images/IMG_1614.jpg",
              "/images/IMG_1615.jpg",
            ].map((img, index) => (
              <a
                key={index}
                href="https://instagram.com/nifemiiabe"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square relative overflow-hidden group"
              >
                <Image
                  src={img}
                  alt={`Instagram post ${index + 1}`}
                  fill
                  className="object-cover object-top group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#0a0a0a]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/IMG_1616.jpg"
            alt="Background"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-[#0a0a0a]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-[#f5f5f5] font-[family-name:var(--font-cormorant)] mb-4 sm:mb-6">
            Ready to Create Your <span className="text-[#c9a962]">Dream Outfit?</span>
          </h2>
          <p className="text-[#888888] text-sm sm:text-base font-[family-name:var(--font-montserrat)] mb-8 sm:mb-10 max-w-2xl mx-auto">
            Book a consultation today and let&apos;s bring your fashion vision to life.
            Whether it&apos;s a custom piece, wedding attire, or style advice, we&apos;re here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/contact" className="btn-secondary text-xs sm:text-sm">
              Book Consultation
            </Link>
            <a
              href="https://wa.me/2348000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-xs sm:text-sm"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
