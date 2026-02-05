"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  WebsiteImage,
  ImageCategory,
  defaultImages,
} from "@/lib/website-image-types";

interface UseWebsiteImagesResult {
  images: string[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch website images by category from Firestore
 * Falls back to default images if none are configured
 */
export function useWebsiteImages(category: ImageCategory): UseWebsiteImagesResult {
  const [images, setImages] = useState<string[]>(defaultImages[category] || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "websiteImages"),
      where("category", "==", category),
      orderBy("order", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          // No images configured - use defaults
          setImages(defaultImages[category] || []);
        } else {
          // Use configured images
          const imageUrls = snapshot.docs.map(
            (doc) => (doc.data() as WebsiteImage).url
          );
          setImages(imageUrls);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error(`Error fetching ${category} images:`, err);
        setError(err.message);
        // Fall back to defaults on error
        setImages(defaultImages[category] || []);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [category]);

  return { images, loading, error };
}

/**
 * Hook to fetch a single image by category (e.g., founder photo, hero background)
 * Returns the first image from the category
 */
export function useWebsiteImage(category: ImageCategory): {
  image: string;
  loading: boolean;
  error: string | null;
} {
  const { images, loading, error } = useWebsiteImages(category);

  return {
    image: images[0] || defaultImages[category]?.[0] || "",
    loading,
    error,
  };
}

/**
 * Hook to fetch all website images for admin management
 */
export function useAllWebsiteImages(): {
  images: WebsiteImage[];
  loading: boolean;
  error: string | null;
} {
  const [images, setImages] = useState<WebsiteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "websiteImages"),
      orderBy("category", "asc"),
      orderBy("order", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const imageData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as WebsiteImage[];
        setImages(imageData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching all website images:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { images, loading, error };
}
