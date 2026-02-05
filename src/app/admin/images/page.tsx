"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import {
  WebsiteImage,
  ImageCategory,
  categoryDisplayNames,
  categoryDescriptions,
  defaultImages,
} from "@/lib/website-image-types";

const categories: ImageCategory[] = [
  "hero",
  "about-hero",
  "about-gallery",
  "about-founder",
  "services",
  "collections",
  "shop-hero",
  "backgrounds",
];

export default function AdminImagesPage() {
  const [selectedCategory, setSelectedCategory] = useState<ImageCategory>("hero");
  const [images, setImages] = useState<WebsiteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch images for selected category
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError("");

      try {
        const q = query(
          collection(db, "websiteImages"),
          where("category", "==", selectedCategory),
          orderBy("order", "asc")
        );
        const snapshot = await getDocs(q);
        const imageData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as WebsiteImage[];
        setImages(imageData);
      } catch (err) {
        console.error("Error fetching images:", err);
        setError("Failed to load images");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [selectedCategory]);

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const newImages: WebsiteImage[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith("image/")) {
          setError(`${file.name} is not an image file`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError(`${file.name} is too large. Max size is 5MB`);
          continue;
        }

        // Create unique filename
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
        const storageRef = ref(
          storage,
          `website/${selectedCategory}/${timestamp}_${safeName}`
        );

        // Upload to Firebase Storage
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);

        // Get current max order
        const maxOrder = images.length > 0
          ? Math.max(...images.map((img) => img.order))
          : -1;

        // Add to Firestore
        const docRef = await addDoc(collection(db, "websiteImages"), {
          category: selectedCategory,
          url: downloadUrl,
          name: file.name,
          order: maxOrder + 1 + i,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });

        newImages.push({
          id: docRef.id,
          category: selectedCategory,
          url: downloadUrl,
          name: file.name,
          order: maxOrder + 1 + i,
          createdAt: new Date(),
        });
      }

      setImages([...images, ...newImages]);
      setSuccess(`${newImages.length} image(s) uploaded successfully`);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error uploading images:", err);
      setError("Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
      // Reset file input
      e.target.value = "";
    }
  };

  // Delete image
  const handleDeleteImage = async (image: WebsiteImage) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      // Delete from Storage if it's a Firebase URL
      if (image.url.includes("firebasestorage.googleapis.com")) {
        try {
          const storageRef = ref(storage, image.url);
          await deleteObject(storageRef);
        } catch (storageErr) {
          console.error("Error deleting from storage:", storageErr);
          // Continue anyway - the storage file might not exist
        }
      }

      // Delete from Firestore
      await deleteDoc(doc(db, "websiteImages", image.id));

      // Update local state
      setImages(images.filter((img) => img.id !== image.id));
      setSuccess("Image deleted successfully");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error deleting image:", err);
      setError("Failed to delete image");
    }
  };

  // Move image up in order
  const handleMoveUp = async (index: number) => {
    if (index === 0) return;

    const newImages = [...images];
    const currentImage = newImages[index];
    const prevImage = newImages[index - 1];

    // Swap orders
    const tempOrder = currentImage.order;
    currentImage.order = prevImage.order;
    prevImage.order = tempOrder;

    // Swap positions in array
    newImages[index] = prevImage;
    newImages[index - 1] = currentImage;

    setImages(newImages);

    // Update Firestore
    try {
      await updateDoc(doc(db, "websiteImages", currentImage.id), {
        order: currentImage.order,
        updatedAt: Timestamp.now(),
      });
      await updateDoc(doc(db, "websiteImages", prevImage.id), {
        order: prevImage.order,
        updatedAt: Timestamp.now(),
      });
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  // Move image down in order
  const handleMoveDown = async (index: number) => {
    if (index === images.length - 1) return;

    const newImages = [...images];
    const currentImage = newImages[index];
    const nextImage = newImages[index + 1];

    // Swap orders
    const tempOrder = currentImage.order;
    currentImage.order = nextImage.order;
    nextImage.order = tempOrder;

    // Swap positions in array
    newImages[index] = nextImage;
    newImages[index + 1] = currentImage;

    setImages(newImages);

    // Update Firestore
    try {
      await updateDoc(doc(db, "websiteImages", currentImage.id), {
        order: currentImage.order,
        updatedAt: Timestamp.now(),
      });
      await updateDoc(doc(db, "websiteImages", nextImage.id), {
        order: nextImage.order,
        updatedAt: Timestamp.now(),
      });
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-2">
          Website Images
        </h1>
        <p className="text-[#888888] font-[family-name:var(--font-montserrat)] text-sm">
          Manage images displayed across the website
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 text-sm font-[family-name:var(--font-montserrat)] transition-colors ${
              selectedCategory === category
                ? "bg-[#c9a962] text-[#0a0a0a]"
                : "bg-[#1a1a1a] text-[#888888] hover:bg-[#2a2a2a] hover:text-[#f5f5f5]"
            }`}
          >
            {categoryDisplayNames[category]}
          </button>
        ))}
      </div>

      {/* Category Description */}
      <div className="bg-[#111111] border border-[#1a1a1a] p-4">
        <h2 className="text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-1">
          {categoryDisplayNames[selectedCategory]}
        </h2>
        <p className="text-[#888888] font-[family-name:var(--font-montserrat)] text-sm">
          {categoryDescriptions[selectedCategory]}
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 text-sm font-[family-name:var(--font-montserrat)]">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 text-sm font-[family-name:var(--font-montserrat)]">
          {success}
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-[#111111] border border-[#1a1a1a] p-6">
        <h3 className="text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-4">
          Upload New Images
        </h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <label className="flex-1 cursor-pointer">
            <div className="border-2 border-dashed border-[#2a2a2a] hover:border-[#c9a962] transition-colors p-8 text-center">
              <svg
                className="w-12 h-12 mx-auto text-[#888888] mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-[#888888] font-[family-name:var(--font-montserrat)] text-sm mb-2">
                {uploading ? "Uploading..." : "Click to upload images"}
              </p>
              <p className="text-[#666666] font-[family-name:var(--font-montserrat)] text-xs">
                JPG, PNG, WebP (max 5MB each)
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Current Images */}
      <div className="bg-[#111111] border border-[#1a1a1a] p-6">
        <h3 className="text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-4">
          Current Images ({images.length})
        </h3>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c9a962] mx-auto"></div>
            <p className="text-[#888888] mt-4 font-[family-name:var(--font-montserrat)] text-sm">
              Loading images...
            </p>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[#888888] font-[family-name:var(--font-montserrat)] text-sm mb-2">
              No custom images configured
            </p>
            <p className="text-[#666666] font-[family-name:var(--font-montserrat)] text-xs">
              Using {defaultImages[selectedCategory]?.length || 0} default image(s)
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="relative group bg-[#0a0a0a] border border-[#2a2a2a]"
              >
                <div className="aspect-square relative">
                  <Image
                    src={image.url}
                    alt={image.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  />
                </div>

                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <p className="text-[#f5f5f5] text-xs font-[family-name:var(--font-montserrat)] px-2 text-center truncate w-full">
                    {image.name}
                  </p>

                  <div className="flex gap-2">
                    {/* Move Up */}
                    {index > 0 && (
                      <button
                        onClick={() => handleMoveUp(index)}
                        className="p-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-colors"
                        title="Move up"
                      >
                        <svg className="w-4 h-4 text-[#f5f5f5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                    )}

                    {/* Move Down */}
                    {index < images.length - 1 && (
                      <button
                        onClick={() => handleMoveDown(index)}
                        className="p-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-colors"
                        title="Move down"
                      >
                        <svg className="w-4 h-4 text-[#f5f5f5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteImage(image)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/40 transition-colors"
                      title="Delete"
                    >
                      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Order badge */}
                <div className="absolute top-2 left-2 bg-[#0a0a0a]/80 px-2 py-1 text-xs text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Default Images Reference */}
      <div className="bg-[#111111] border border-[#1a1a1a] p-6">
        <h3 className="text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-4">
          Default Images (Fallback)
        </h3>
        <p className="text-[#888888] font-[family-name:var(--font-montserrat)] text-sm mb-4">
          These images are used if no custom images are uploaded for this category.
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {defaultImages[selectedCategory]?.map((url, index) => (
            <div key={index} className="aspect-square relative bg-[#0a0a0a] border border-[#2a2a2a]">
              <Image
                src={url}
                alt={`Default ${index + 1}`}
                fill
                className="object-cover opacity-60"
                sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 16vw, 12vw"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
