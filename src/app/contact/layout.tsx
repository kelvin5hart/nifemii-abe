import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Book a fashion consultation with Nifemii Abe. Get in touch via phone, email, or WhatsApp. Located in Lagos, Nigeria.",
  openGraph: {
    title: "Contact | Nifemii Abe",
    description: "Book a fashion consultation with Nifemii Abe. Get in touch via phone, email, or WhatsApp.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
