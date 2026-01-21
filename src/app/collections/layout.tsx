import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collections",
  description: "Explore our curated fashion collections - ready to wear, custom designs, wedding attire, and traditional Nigerian fashion. Each piece crafted with meticulous attention to detail.",
  openGraph: {
    title: "Collections | Nifemii Abe",
    description: "Explore our curated fashion collections - ready to wear, custom designs, wedding attire, and traditional Nigerian fashion.",
    images: ["/images/IMG_1596.jpg"],
  },
};

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
