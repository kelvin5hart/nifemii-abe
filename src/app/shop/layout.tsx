import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description: "Shop our ready-to-wear collection of premium Nigerian menswear. Senator styles, kaftans, and contemporary designs available for immediate purchase.",
  openGraph: {
    title: "Shop | Nifemii Abe",
    description: "Shop our ready-to-wear collection of premium Nigerian menswear. Senator styles, kaftans, and contemporary designs.",
    images: ["/images/outfit5.jpg"],
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
