"use client";

import { useState, useEffect, useRef } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Product } from "@/lib/firebase-types";
import Image from "next/image";
import { standardSizes } from "@/components/SizeGuide";

const defaultProduct: Omit<Product, "id" | "createdAt"> = {
  sku: "",
  name: "",
  description: "",
  price: 0,
  images: [],
  category: "",
  sizes: {},
  active: true,
};

// Generate SKU from product count
const generateSKU = (productCount: number) => {
  const num = (productCount + 1).toString().padStart(3, "0");
  return `NA-${num}`;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newSize, setNewSize] = useState({ size: "", stock: 0 });
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const productsQuery = query(
      collection(db, "products"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(productsQuery, (snapshot) => {
      const productsData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Product;
      });
      setProducts(productsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  const filteredProducts = products.filter((product) => {
    if (filterCategory !== "all" && product.category !== filterCategory) return false;
    return true;
  });

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsNew(false);
  };

  const handleNew = () => {
    // Auto-generate SKU based on product count
    const newSku = generateSKU(products.length);
    setEditingProduct({ ...defaultProduct, sku: newSku });
    setIsNew(true);
  };

  const handleSave = async () => {
    if (!editingProduct) return;

    setSaving(true);
    try {
      if (isNew) {
        await addDoc(collection(db, "products"), {
          ...editingProduct,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
      } else if (editingProduct.id) {
        await updateDoc(doc(db, "products", editingProduct.id), {
          ...editingProduct,
          updatedAt: Timestamp.now(),
        });
      }
      setEditingProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteDoc(doc(db, "products", productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      await updateDoc(doc(db, "products", product.id), {
        active: !product.active,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error toggling product status:", error);
    }
  };

  const addImage = () => {
    if (!newImageUrl || !editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      images: [...(editingProduct.images || []), newImageUrl],
    });
    setNewImageUrl("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingProduct) return;

    setUploadingImage(true);
    const newImages: string[] = [];

    try {
      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          alert(`${file.name} is not an image file`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} is too large. Max size is 5MB`);
          continue;
        }

        // Create unique filename
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
        const storageRef = ref(storage, `products/${timestamp}_${safeName}`);

        // Upload file
        await uploadBytes(storageRef, file);

        // Get download URL
        const downloadUrl = await getDownloadURL(storageRef);
        newImages.push(downloadUrl);
      }

      setEditingProduct({
        ...editingProduct,
        images: [...(editingProduct.images || []), ...newImages],
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = async (index: number) => {
    if (!editingProduct) return;

    const imageUrl = editingProduct.images?.[index];

    // Try to delete from storage if it's a Firebase Storage URL
    if (imageUrl && imageUrl.includes("firebasestorage.googleapis.com")) {
      try {
        const storageRef = ref(storage, imageUrl);
        await deleteObject(storageRef);
      } catch (error) {
        console.error("Error deleting image from storage:", error);
        // Continue anyway - the URL will be removed from the product
      }
    }

    setEditingProduct({
      ...editingProduct,
      images: editingProduct.images?.filter((_, i) => i !== index) || [],
    });
  };

  const addSize = () => {
    if (!newSize.size || !editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      sizes: {
        ...editingProduct.sizes,
        [newSize.size]: newSize.stock,
      },
    });
    setNewSize({ size: "", stock: 0 });
  };

  const removeSize = (size: string) => {
    if (!editingProduct || !editingProduct.sizes) return;
    const newSizes = { ...editingProduct.sizes };
    delete newSizes[size];
    setEditingProduct({
      ...editingProduct,
      sizes: newSizes,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const getTotalStock = (sizes: Record<string, number>) => {
    return Object.values(sizes).reduce((sum, qty) => sum + qty, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#888888]">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
          Products
        </h1>
        <button
          onClick={handleNew}
          className="bg-[#c9a962] text-[#0a0a0a] px-4 py-2 text-sm font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors"
        >
          + Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-[#111111] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-[#111111] border border-[#1a1a1a] p-12 text-center">
          <p className="text-[#888888] font-[family-name:var(--font-montserrat)]">
            No products found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`bg-[#111111] border ${
                product.active ? "border-[#1a1a1a]" : "border-red-500/30"
              } overflow-hidden`}
            >
              {/* Image */}
              <div className="aspect-[4/5] relative bg-[#0a0a0a]">
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#888888] text-xs">
                    No image
                  </div>
                )}
                {!product.active && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-red-400 text-xs md:text-sm font-[family-name:var(--font-montserrat)]">
                      Inactive
                    </span>
                  </div>
                )}
                {/* SKU Badge - Mobile */}
                {product.sku && (
                  <span className="absolute top-1 right-1 text-[10px] md:text-xs text-[#c9a962] bg-[#0a0a0a]/80 px-1.5 py-0.5 font-[family-name:var(--font-montserrat)]">
                    {product.sku}
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="p-2 md:p-4 space-y-1 md:space-y-2">
                <h3 className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)] text-xs md:text-sm line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-[10px] md:text-sm text-[#888888] font-[family-name:var(--font-montserrat)] line-clamp-1">
                  {product.category}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[#c9a962] font-[family-name:var(--font-montserrat)] text-xs md:text-sm">
                    {formatCurrency(product.salePrice || product.price)}
                  </span>
                </div>
                <p className="text-[10px] md:text-sm text-[#888888] font-[family-name:var(--font-montserrat)]">
                  Stock: {getTotalStock(product.sizes)}
                </p>

                {/* Actions - Stacked on mobile */}
                <div className="flex flex-col md:flex-row gap-1 md:gap-2 pt-1 md:pt-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 text-[#c9a962] border border-[#c9a962] py-1 md:py-1 text-[10px] md:text-sm font-[family-name:var(--font-montserrat)] hover:bg-[#c9a962]/10 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleActive(product)}
                    className={`flex-1 py-1 md:py-1 text-[10px] md:text-sm border font-[family-name:var(--font-montserrat)] transition-colors ${
                      product.active
                        ? "text-[#888888] border-[#2a2a2a] hover:text-yellow-400 hover:border-yellow-400"
                        : "text-green-400 border-green-400 hover:bg-green-400/10"
                    }`}
                  >
                    {product.active ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end md:items-center justify-center md:p-4">
          <div className="bg-[#111111] border border-[#1a1a1a] w-full md:max-w-2xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto rounded-t-xl md:rounded-none">
            <div className="sticky top-0 bg-[#111111] border-b border-[#1a1a1a] px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
              <h2 className="text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
                {isNew ? "Add Product" : "Edit Product"}
              </h2>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-[#888888] hover:text-[#f5f5f5]"
              >
                ✕
              </button>
            </div>

            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              {/* Basic Info */}
              <div className="space-y-3 md:space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={editingProduct.name || ""}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, name: e.target.value })
                      }
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                      SKU/Product Code
                    </label>
                    <input
                      type="text"
                      value={editingProduct.sku || ""}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, sku: e.target.value.toUpperCase() })
                      }
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#c9a962] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                      placeholder="e.g., NA-001"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                    Description
                  </label>
                  <textarea
                    value={editingProduct.description || ""}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, description: e.target.value })
                    }
                    rows={3}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-xs md:text-sm text-[#888888] mb-1 md:mb-2 font-[family-name:var(--font-montserrat)]">
                      Price (₦)
                    </label>
                    <input
                      type="number"
                      value={editingProduct.price || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                      Sale Price (₦)
                    </label>
                    <input
                      type="number"
                      value={editingProduct.salePrice || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          salePrice: parseFloat(e.target.value) || undefined,
                        })
                      }
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                      placeholder="Leave empty for no sale"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editingProduct.category || ""}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, category: e.target.value })
                    }
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                    placeholder="e.g., Dresses, Tops, Suits"
                  />
                </div>
              </div>

              {/* Images */}
              <div className="bg-[#0a0a0a] p-4 border border-[#1a1a1a]">
                <h3 className="text-sm uppercase tracking-wider text-[#888888] mb-4 font-[family-name:var(--font-montserrat)]">
                  Images
                </h3>

                {/* File Upload */}
                <div className="mb-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className={`inline-flex items-center gap-2 px-4 py-2 border border-dashed border-[#c9a962] text-[#c9a962] text-sm font-[family-name:var(--font-montserrat)] cursor-pointer hover:bg-[#c9a962]/10 transition-colors ${
                      uploadingImage ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {uploadingImage ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#c9a962] border-t-transparent rounded-full animate-spin"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Upload Images
                      </>
                    )}
                  </label>
                  <p className="text-xs text-[#888888] mt-2 font-[family-name:var(--font-montserrat)]">
                    Max 5MB per image. JPG, PNG, WebP supported.
                  </p>
                </div>

                {/* URL Input (Alternative) */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 bg-[#111111] border border-[#2a2a2a] px-3 py-2 text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                    placeholder="Or paste image URL"
                  />
                  <button
                    onClick={addImage}
                    className="px-4 py-2 bg-[#2a2a2a] text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] hover:bg-[#3a3a3a] transition-colors"
                  >
                    Add URL
                  </button>
                </div>

                {/* Image Preview */}
                <div className="flex flex-wrap gap-2">
                  {editingProduct.images?.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-20 h-20 bg-[#111111] border border-[#2a2a2a] group"
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                      {idx === 0 && (
                        <span className="absolute bottom-0 left-0 right-0 bg-[#c9a962] text-[#0a0a0a] text-[10px] text-center font-[family-name:var(--font-montserrat)]">
                          Main
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Sizes & Stock */}
              <div className="bg-[#0a0a0a] p-4 border border-[#1a1a1a]">
                <h3 className="text-sm uppercase tracking-wider text-[#888888] mb-4 font-[family-name:var(--font-montserrat)]">
                  Sizes & Stock
                </h3>

                {/* Quick Add Standard Sizes */}
                <div className="mb-4">
                  <p className="text-xs text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                    Quick add standard sizes:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {standardSizes.map((size) => {
                      const hasSize = editingProduct.sizes && size in editingProduct.sizes;
                      return (
                        <button
                          key={size}
                          onClick={() => {
                            if (!hasSize) {
                              setEditingProduct({
                                ...editingProduct,
                                sizes: {
                                  ...editingProduct.sizes,
                                  [size]: 1,
                                },
                              });
                            }
                          }}
                          disabled={hasSize}
                          className={`px-3 py-1 text-xs font-[family-name:var(--font-montserrat)] border transition-colors ${
                            hasSize
                              ? "border-[#2a2a2a] text-[#444444] cursor-not-allowed"
                              : "border-[#c9a962] text-[#c9a962] hover:bg-[#c9a962]/10"
                          }`}
                        >
                          + {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Size Input */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newSize.size}
                    onChange={(e) => setNewSize({ ...newSize, size: e.target.value.toUpperCase() })}
                    className="w-24 bg-[#111111] border border-[#2a2a2a] px-3 py-2 text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                    placeholder="Custom"
                  />
                  <input
                    type="number"
                    value={newSize.stock}
                    onChange={(e) =>
                      setNewSize({ ...newSize, stock: parseInt(e.target.value) || 0 })
                    }
                    className="w-24 bg-[#111111] border border-[#2a2a2a] px-3 py-2 text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                    placeholder="Stock"
                    min="0"
                  />
                  <button
                    onClick={addSize}
                    className="px-4 py-2 bg-[#c9a962] text-[#0a0a0a] text-sm font-[family-name:var(--font-montserrat)]"
                  >
                    Add
                  </button>
                </div>

                {/* Current Sizes with Editable Stock */}
                {Object.keys(editingProduct.sizes || {}).length > 0 && (
                  <div className="border-t border-[#1a1a1a] pt-4 mt-4">
                    <p className="text-xs text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                      Current sizes (click stock to edit):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(editingProduct.sizes || {}).map(([size, stock]) => (
                        <div
                          key={size}
                          className="flex items-center gap-1 bg-[#111111] border border-[#2a2a2a] px-2 py-1"
                        >
                          <span className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] font-medium">
                            {size}:
                          </span>
                          <input
                            type="number"
                            value={stock}
                            onChange={(e) => {
                              const newStock = parseInt(e.target.value) || 0;
                              setEditingProduct({
                                ...editingProduct,
                                sizes: {
                                  ...editingProduct.sizes,
                                  [size]: newStock,
                                },
                              });
                            }}
                            min="0"
                            className="w-12 bg-transparent border-none text-[#c9a962] text-sm font-[family-name:var(--font-montserrat)] focus:outline-none text-center"
                          />
                          <button
                            onClick={() => removeSize(size)}
                            className="text-red-400 text-xs hover:text-red-300 ml-1"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingProduct.active ?? true}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, active: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#c9a962]"
                  />
                  <span className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)]">
                    Active
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingProduct.featured ?? false}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, featured: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#c9a962]"
                  />
                  <span className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)]">
                    Featured
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-[#1a1a1a]">
                <button
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 border border-[#2a2a2a] text-[#888888] py-2 font-[family-name:var(--font-montserrat)] hover:border-[#3a3a3a] hover:text-[#f5f5f5] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !editingProduct.name || !editingProduct.price}
                  className="flex-1 bg-[#c9a962] text-[#0a0a0a] py-2 font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Product"}
                </button>
              </div>

              {/* Delete */}
              {!isNew && editingProduct.id && (
                <button
                  onClick={() => {
                    handleDelete(editingProduct.id!);
                    setEditingProduct(null);
                  }}
                  className="w-full text-red-400 text-sm font-[family-name:var(--font-montserrat)] hover:text-red-300"
                >
                  Delete Product
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
