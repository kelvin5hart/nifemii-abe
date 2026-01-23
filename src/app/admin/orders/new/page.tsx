"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  addDoc,
  Timestamp,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  OrderType,
  OrderItem,
  ServiceDetails,
  Measurements,
  Address,
  Product,
  BulkRecipient,
} from "@/lib/firebase-types";
import { formatPhoneNumber } from "@/lib/otp-service";
import Image from "next/image";

type Step = "type" | "customer" | "details" | "pricing" | "review";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function NewOrderPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("type");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Products for selection
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [selectedProductForSize, setSelectedProductForSize] = useState<Product | null>(null);

  // Order data
  const [orderType, setOrderType] = useState<OrderType>("ready-to-wear");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [existingCustomerId, setExistingCustomerId] = useState<string | null>(null);

  // Items (for ready-to-wear)
  const [items, setItems] = useState<OrderItem[]>([]);

  // Service details (for bespoke/sew-only)
  const [serviceDetails, setServiceDetails] = useState<ServiceDetails>({
    fabricProvided: false,
  });

  // Measurements
  const [measurements, setMeasurements] = useState<Measurements>({});

  // Bulk order recipients
  const [bulkRecipients, setBulkRecipients] = useState<BulkRecipient[]>([]);
  const [bulkBaseProduct, setBulkBaseProduct] = useState<string>("");
  const [bulkPricePerUnit, setBulkPricePerUnit] = useState("");

  // Pricing - using string for better input handling, convert to number when needed
  const [subtotal, setSubtotal] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [depositPaid, setDepositPaid] = useState(false);

  // Delivery
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup");
  const [deliveryAddress, setDeliveryAddress] = useState<Address>({
    id: "",
    label: "",
    street: "",
    city: "",
    state: "",
  });

  // Due date
  const [dueDate, setDueDate] = useState("");

  const [notes, setNotes] = useState("");

  // Fetch products - filter active products client-side to avoid composite index requirement
  useEffect(() => {
    const productsQuery = query(
      collection(db, "products"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      productsQuery,
      (snapshot) => {
        const productsData = snapshot.docs
          .map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }) as Product)
          .filter((product) => product.active !== false);
        setProducts(productsData);
        setLoadingProducts(false);
      },
      (error) => {
        console.error("Error fetching products:", error);
        setLoadingProducts(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Helper to parse price (handles comma-separated values)
  const parsePrice = (value: string): number => {
    const cleaned = value.replace(/,/g, "").replace(/[^0-9.]/g, "");
    return parseFloat(cleaned) || 0;
  };

  // Helper to format price for display
  const formatPriceInput = (value: string): string => {
    const cleaned = value.replace(/[^0-9]/g, "");
    if (!cleaned) return "";
    return parseInt(cleaned).toLocaleString();
  };

  const handleCustomerSearch = async () => {
    if (customerPhone.length < 10) return;

    try {
      const formattedPhone = formatPhoneNumber(customerPhone);
      const usersQuery = query(
        collection(db, "users"),
        where("phone", "==", formattedPhone)
      );
      const snapshot = await getDocs(usersQuery);

      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        setExistingCustomerId(snapshot.docs[0].id);
        setCustomerName(userData.name || "");
        if (userData.measurements) {
          setMeasurements(userData.measurements);
        }
      } else {
        setExistingCustomerId(null);
      }
    } catch (err) {
      console.error("Error searching customer:", err);
    }
  };

  // Product selector handlers
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.sku?.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleSelectProduct = (product: Product) => {
    setSelectedProductForSize(product);
  };

  const handleAddProductWithSize = (size: string) => {
    if (!selectedProductForSize) return;

    const stock = selectedProductForSize.sizes[size] || 0;
    if (stock <= 0) return;

    // Check if this product+size already exists in items
    const existingIndex = items.findIndex(
      (item) => item.productId === selectedProductForSize.id && item.size === size
    );

    if (existingIndex >= 0) {
      // Increment quantity
      const newItems = [...items];
      const currentQty = newItems[existingIndex].quantity;
      if (currentQty < stock) {
        newItems[existingIndex].quantity = currentQty + 1;
        setItems(newItems);
      }
    } else {
      // Add new item
      const newItem: OrderItem = {
        productId: selectedProductForSize.id,
        productName: selectedProductForSize.name,
        sku: selectedProductForSize.sku,
        size,
        quantity: 1,
        price: selectedProductForSize.salePrice || selectedProductForSize.price,
        image: selectedProductForSize.images[0],
      };
      setItems([...items, newItem]);
    }

    setSelectedProductForSize(null);
    setShowProductSelector(false);
    setProductSearch("");
  };

  const updateItemQuantity = (index: number, quantity: number) => {
    const newItems = [...items];
    const item = newItems[index];
    const product = products.find((p) => p.id === item.productId);
    const maxStock = product?.sizes[item.size] || 99;

    newItems[index].quantity = Math.max(1, Math.min(quantity, maxStock));
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Bulk order handlers
  const addBulkRecipient = () => {
    setBulkRecipients([
      ...bulkRecipients,
      { name: "", size: "", phone: "" },
    ]);
  };

  const updateBulkRecipient = (index: number, field: keyof BulkRecipient, value: string) => {
    const newRecipients = [...bulkRecipients];
    newRecipients[index][field] = value;
    setBulkRecipients(newRecipients);
  };

  const removeBulkRecipient = (index: number) => {
    setBulkRecipients(bulkRecipients.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    if (orderType === "ready-to-wear") {
      const itemsTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return itemsTotal + parsePrice(deliveryFee);
    } else if (orderType === "bulk-bespoke") {
      const bulkTotal = bulkRecipients.length * parsePrice(bulkPricePerUnit);
      return bulkTotal + parsePrice(deliveryFee);
    } else {
      return parsePrice(subtotal) + parsePrice(deliveryFee);
    }
  };

  const getSubtotalAmount = () => {
    if (orderType === "ready-to-wear") {
      return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    } else if (orderType === "bulk-bespoke") {
      return bulkRecipients.length * parsePrice(bulkPricePerUnit);
    }
    return parsePrice(subtotal);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const formattedPhone = formatPhoneNumber(customerPhone);
      let userId = existingCustomerId;

      // Create customer if doesn't exist
      if (!userId) {
        const userRef = doc(collection(db, "users"));
        userId = userRef.id;
        await setDoc(userRef, {
          phone: formattedPhone,
          name: customerName,
          measurements: measurements,
          createdAt: Timestamp.now(),
          createdBy: "admin",
        });
      }

      const totalAmount = calculateTotal();
      const subtotalAmount = getSubtotalAmount();
      const deliveryFeeAmount = parsePrice(deliveryFee);
      const depositAmountNum = parsePrice(depositAmount);
      const balanceAmount = totalAmount - depositAmountNum;

      // Build pricing object without undefined values
      const pricing: Record<string, number | boolean> = {
        subtotal: subtotalAmount,
        deliveryFee: deliveryFeeAmount,
        totalAmount,
        balancePaid: false,
      };
      if (depositAmountNum > 0) {
        pricing.depositAmount = depositAmountNum;
        pricing.depositPaid = depositPaid;
        pricing.balanceAmount = balanceAmount;
      }

      // Build order data without undefined values (Firebase rejects undefined)
      const orderData: Record<string, unknown> = {
        userId,
        userPhone: formattedPhone,
        userName: customerName,
        type: orderType,
        status: "pending",
        pricing,
        deliveryMethod,
        paymentMethod: "offline",
        createdBy: "admin",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      // Add type-specific data
      if (orderType === "ready-to-wear" && items.length > 0) {
        orderData.items = items;
      }

      if (orderType === "full-bespoke" || orderType === "sew-only") {
        orderData.serviceDetails = serviceDetails;
        orderData.measurements = measurements;
      }

      if (orderType === "bulk-bespoke") {
        orderData.bulkRecipients = bulkRecipients;
        orderData.bulkBaseProduct = bulkBaseProduct;
        orderData.bulkPricePerUnit = parsePrice(bulkPricePerUnit);
      }

      if (deliveryMethod === "delivery") {
        orderData.deliveryAddress = deliveryAddress;
      }

      if (notes.trim()) {
        orderData.notes = notes;
      }

      if (dueDate) {
        orderData.dueDate = dueDate;
      }

      await addDoc(collection(db, "orders"), orderData);
      router.push("/admin/orders");
    } catch (err) {
      console.error("Error creating order:", err);
      setError("Failed to create order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case "type":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
              Select Order Type
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(
                [
                  { value: "ready-to-wear", label: "Ready to Wear", desc: "Select from your product catalog", icon: "👗" },
                  { value: "full-bespoke", label: "Full Bespoke", desc: "Custom made from scratch with fabric", icon: "✂️" },
                  { value: "sew-only", label: "Sew Only", desc: "Customer provides their own fabric", icon: "🧵" },
                  { value: "bulk-bespoke", label: "Bulk Order", desc: "Multiple recipients with sizes", icon: "📦" },
                ] as const
              ).map((type) => (
                <button
                  key={type.value}
                  onClick={() => setOrderType(type.value)}
                  className={`p-4 border text-left transition-colors ${
                    orderType === type.value
                      ? "border-[#c9a962] bg-[#c9a962]/10"
                      : "border-[#2a2a2a] hover:border-[#3a3a3a]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{type.icon}</span>
                    <div>
                      <p className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                        {type.label}
                      </p>
                      <p className="text-sm text-[#888888] font-[family-name:var(--font-montserrat)] mt-1">
                        {type.desc}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep("customer")}
              className="bg-[#c9a962] text-[#0a0a0a] px-6 py-2 font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors"
            >
              Continue
            </button>
          </div>
        );

      case "customer":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
              Customer Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ""))}
                    onBlur={handleCustomerSearch}
                    className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                    placeholder="08012345678"
                  />
                </div>
                {existingCustomerId && (
                  <p className="text-green-400 text-sm mt-2 font-[family-name:var(--font-montserrat)]">
                    Existing customer found
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                  placeholder="Full name"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setStep("type")}
                className="border border-[#2a2a2a] text-[#888888] px-6 py-2 font-[family-name:var(--font-montserrat)] hover:border-[#3a3a3a] hover:text-[#f5f5f5] transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep("details")}
                disabled={!customerPhone || !customerName}
                className="bg-[#c9a962] text-[#0a0a0a] px-6 py-2 font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        );

      case "details":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
              {orderType === "ready-to-wear" && "Select Products"}
              {orderType === "full-bespoke" && "Bespoke Order Details"}
              {orderType === "sew-only" && "Sew Only Details"}
              {orderType === "bulk-bespoke" && "Bulk Order Details"}
            </h2>

            {/* READY TO WEAR - Product Selector */}
            {orderType === "ready-to-wear" && (
              <div className="space-y-4">
                {/* Selected Items */}
                {items.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm text-[#888888] font-[family-name:var(--font-montserrat)]">
                      Selected Items ({items.length})
                    </p>
                    {items.map((item, index) => (
                      <div
                        key={`${item.productId}-${item.size}`}
                        className="bg-[#0a0a0a] border border-[#1a1a1a] p-3 flex gap-3"
                      >
                        {item.image && (
                          <div className="w-16 h-16 bg-[#1a1a1a] flex-shrink-0 overflow-hidden">
                            <Image
                              src={item.image}
                              alt={item.productName}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)]">
                                {item.productName}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                {item.sku && (
                                  <span className="text-[10px] text-[#c9a962] bg-[#c9a962]/10 px-1.5 py-0.5">
                                    {item.sku}
                                  </span>
                                )}
                                <span className="text-xs text-[#888888]">Size: {item.size}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => removeItem(index)}
                              className="text-red-400 text-xs hover:text-red-300"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateItemQuantity(index, item.quantity - 1)}
                                className="w-6 h-6 border border-[#2a2a2a] text-[#888888] hover:border-[#c9a962] hover:text-[#c9a962]"
                              >
                                -
                              </button>
                              <span className="text-[#f5f5f5] text-sm w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateItemQuantity(index, item.quantity + 1)}
                                className="w-6 h-6 border border-[#2a2a2a] text-[#888888] hover:border-[#c9a962] hover:text-[#c9a962]"
                              >
                                +
                              </button>
                            </div>
                            <p className="text-[#c9a962] text-sm font-[family-name:var(--font-montserrat)]">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 border-t border-[#1a1a1a]">
                      <span className="text-[#888888] font-[family-name:var(--font-montserrat)]">Subtotal</span>
                      <span className="text-[#c9a962] font-[family-name:var(--font-montserrat)]">
                        {formatCurrency(items.reduce((sum, item) => sum + item.price * item.quantity, 0))}
                      </span>
                    </div>
                  </div>
                )}

                {/* Add Product Button */}
                <button
                  onClick={() => setShowProductSelector(true)}
                  className="w-full py-3 border border-dashed border-[#2a2a2a] text-[#888888] hover:border-[#c9a962] hover:text-[#c9a962] transition-colors font-[family-name:var(--font-montserrat)]"
                >
                  + Add Product from Catalog
                </button>

                {items.length === 0 && (
                  <p className="text-center text-sm text-[#666666] font-[family-name:var(--font-montserrat)]">
                    No products added yet. Click above to select from your catalog.
                  </p>
                )}
              </div>
            )}

            {/* FULL BESPOKE */}
            {orderType === "full-bespoke" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                    Style/Design Description *
                  </label>
                  <textarea
                    value={serviceDetails.styleDescription || ""}
                    onChange={(e) =>
                      setServiceDetails({ ...serviceDetails, styleDescription: e.target.value })
                    }
                    rows={3}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none resize-none"
                    placeholder="Describe the style (e.g., Agbada with embroidery, Senator style with gold buttons...)"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                    Fabric Details
                  </label>
                  <textarea
                    value={serviceDetails.fabricDetails || ""}
                    onChange={(e) =>
                      setServiceDetails({ ...serviceDetails, fabricDetails: e.target.value })
                    }
                    rows={2}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none resize-none"
                    placeholder="Fabric type, color, quantity needed..."
                  />
                </div>

                {/* Measurements */}
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4">
                  <h3 className="text-sm uppercase tracking-wider text-[#888888] mb-4 font-[family-name:var(--font-montserrat)]">
                    Measurements (inches)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { key: "chest", label: "Chest" },
                      { key: "waist", label: "Waist" },
                      { key: "hips", label: "Hips" },
                      { key: "shoulder", label: "Shoulder" },
                      { key: "sleeveLength", label: "Sleeve" },
                      { key: "shirtLength", label: "Shirt Length" },
                      { key: "neck", label: "Neck" },
                      { key: "trouserWaist", label: "Trouser Waist" },
                      { key: "trouserLength", label: "Trouser Length" },
                      { key: "thigh", label: "Thigh" },
                      { key: "ankle", label: "Ankle" },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="block text-xs text-[#666666] mb-1 font-[family-name:var(--font-montserrat)]">
                          {field.label}
                        </label>
                        <input
                          type="number"
                          value={(measurements as Record<string, number | undefined>)[field.key] || ""}
                          onChange={(e) =>
                            setMeasurements({
                              ...measurements,
                              [field.key]: parseFloat(e.target.value) || undefined,
                            })
                          }
                          className="w-full bg-[#111111] border border-[#2a2a2a] px-2 py-1 text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SEW ONLY */}
            {orderType === "sew-only" && (
              <div className="space-y-4">
                <div className="bg-[#c9a962]/10 border border-[#c9a962]/30 p-4">
                  <p className="text-[#c9a962] text-sm font-[family-name:var(--font-montserrat)]">
                    Customer provides their own fabric. This order is for labor/sewing only.
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                    What to Make *
                  </label>
                  <textarea
                    value={serviceDetails.styleDescription || ""}
                    onChange={(e) =>
                      setServiceDetails({ ...serviceDetails, styleDescription: e.target.value, fabricProvided: true })
                    }
                    rows={3}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none resize-none"
                    placeholder="Describe what should be made with the customer's fabric..."
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                    Fabric Received?
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setServiceDetails({ ...serviceDetails, fabricReceived: true })}
                      className={`flex-1 py-2 border ${
                        serviceDetails.fabricReceived === true
                          ? "border-[#c9a962] text-[#c9a962]"
                          : "border-[#2a2a2a] text-[#888888]"
                      } font-[family-name:var(--font-montserrat)]`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setServiceDetails({ ...serviceDetails, fabricReceived: false })}
                      className={`flex-1 py-2 border ${
                        serviceDetails.fabricReceived === false
                          ? "border-[#c9a962] text-[#c9a962]"
                          : "border-[#2a2a2a] text-[#888888]"
                      } font-[family-name:var(--font-montserrat)]`}
                    >
                      Not Yet
                    </button>
                  </div>
                </div>

                {/* Measurements */}
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4">
                  <h3 className="text-sm uppercase tracking-wider text-[#888888] mb-4 font-[family-name:var(--font-montserrat)]">
                    Measurements (inches)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { key: "chest", label: "Chest" },
                      { key: "waist", label: "Waist" },
                      { key: "hips", label: "Hips" },
                      { key: "shoulder", label: "Shoulder" },
                      { key: "sleeveLength", label: "Sleeve" },
                      { key: "shirtLength", label: "Shirt Length" },
                      { key: "neck", label: "Neck" },
                      { key: "trouserWaist", label: "Trouser Waist" },
                      { key: "trouserLength", label: "Trouser Length" },
                      { key: "thigh", label: "Thigh" },
                      { key: "ankle", label: "Ankle" },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="block text-xs text-[#666666] mb-1 font-[family-name:var(--font-montserrat)]">
                          {field.label}
                        </label>
                        <input
                          type="number"
                          value={(measurements as Record<string, number | undefined>)[field.key] || ""}
                          onChange={(e) =>
                            setMeasurements({
                              ...measurements,
                              [field.key]: parseFloat(e.target.value) || undefined,
                            })
                          }
                          className="w-full bg-[#111111] border border-[#2a2a2a] px-2 py-1 text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* BULK ORDER */}
            {orderType === "bulk-bespoke" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                    Base Product/Design *
                  </label>
                  <input
                    type="text"
                    value={bulkBaseProduct}
                    onChange={(e) => setBulkBaseProduct(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                    placeholder="e.g., Company Uniform - Blue Ankara"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                    Price Per Unit (₦)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888888] font-[family-name:var(--font-montserrat)]">₦</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={bulkPricePerUnit}
                      onChange={(e) => setBulkPricePerUnit(formatPriceInput(e.target.value))}
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] pl-8 pr-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                      placeholder="e.g., 25,000"
                    />
                  </div>
                </div>

                {/* Recipients List */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-[#888888] font-[family-name:var(--font-montserrat)]">
                      Recipients ({bulkRecipients.length})
                    </p>
                    <button
                      onClick={addBulkRecipient}
                      className="text-[#c9a962] text-sm font-[family-name:var(--font-montserrat)]"
                    >
                      + Add Recipient
                    </button>
                  </div>

                  {bulkRecipients.map((recipient, index) => (
                    <div key={index} className="bg-[#0a0a0a] border border-[#1a1a1a] p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-[#666666] font-[family-name:var(--font-montserrat)]">
                          Recipient {index + 1}
                        </span>
                        <button
                          onClick={() => removeBulkRecipient(index)}
                          className="text-red-400 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={recipient.name}
                          onChange={(e) => updateBulkRecipient(index, "name", e.target.value)}
                          className="col-span-2 bg-[#111111] border border-[#2a2a2a] px-3 py-2 text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                          placeholder="Name"
                        />
                        <input
                          type="text"
                          value={recipient.size}
                          onChange={(e) => updateBulkRecipient(index, "size", e.target.value)}
                          className="bg-[#111111] border border-[#2a2a2a] px-3 py-2 text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                          placeholder="Size"
                        />
                      </div>
                      <input
                        type="tel"
                        value={recipient.phone || ""}
                        onChange={(e) => updateBulkRecipient(index, "phone", e.target.value.replace(/\D/g, ""))}
                        className="w-full bg-[#111111] border border-[#2a2a2a] px-3 py-2 text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                        placeholder="Phone (optional)"
                      />
                    </div>
                  ))}

                  {bulkRecipients.length === 0 && (
                    <p className="text-center text-sm text-[#666666] py-4 font-[family-name:var(--font-montserrat)]">
                      No recipients added. Click above to add recipients with their sizes.
                    </p>
                  )}

                  {bulkRecipients.length > 0 && parsePrice(bulkPricePerUnit) > 0 && (
                    <div className="flex justify-between pt-2 border-t border-[#1a1a1a]">
                      <span className="text-[#888888] font-[family-name:var(--font-montserrat)]">
                        Total ({bulkRecipients.length} × {formatCurrency(parsePrice(bulkPricePerUnit))})
                      </span>
                      <span className="text-[#c9a962] font-[family-name:var(--font-montserrat)]">
                        {formatCurrency(bulkRecipients.length * parsePrice(bulkPricePerUnit))}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setStep("customer")}
                className="border border-[#2a2a2a] text-[#888888] px-6 py-2 font-[family-name:var(--font-montserrat)] hover:border-[#3a3a3a] hover:text-[#f5f5f5] transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep("pricing")}
                disabled={
                  (orderType === "ready-to-wear" && items.length === 0) ||
                  (orderType === "bulk-bespoke" && bulkRecipients.length === 0)
                }
                className="bg-[#c9a962] text-[#0a0a0a] px-6 py-2 font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        );

      case "pricing":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
              Pricing & Delivery
            </h2>

            <div className="space-y-4">
              {/* Service Price (only for bespoke/sew-only) */}
              {(orderType === "full-bespoke" || orderType === "sew-only") && (
                <div>
                  <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                    {orderType === "sew-only" ? "Labor Cost (₦)" : "Total Price (₦)"}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888888] font-[family-name:var(--font-montserrat)]">₦</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={subtotal}
                      onChange={(e) => setSubtotal(formatPriceInput(e.target.value))}
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] pl-8 pr-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                      placeholder="e.g., 50,000"
                    />
                  </div>
                </div>
              )}

              {/* Delivery Method */}
              <div>
                <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                  Delivery Method
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("pickup")}
                    className={`flex-1 py-2 border ${
                      deliveryMethod === "pickup"
                        ? "border-[#c9a962] text-[#c9a962]"
                        : "border-[#2a2a2a] text-[#888888]"
                    } font-[family-name:var(--font-montserrat)]`}
                  >
                    Pickup
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("delivery")}
                    className={`flex-1 py-2 border ${
                      deliveryMethod === "delivery"
                        ? "border-[#c9a962] text-[#c9a962]"
                        : "border-[#2a2a2a] text-[#888888]"
                    } font-[family-name:var(--font-montserrat)]`}
                  >
                    Delivery
                  </button>
                </div>
              </div>

              {deliveryMethod === "delivery" && (
                <>
                  <div>
                    <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                      Delivery Fee (₦)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888888] font-[family-name:var(--font-montserrat)]">₦</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={deliveryFee}
                        onChange={(e) => setDeliveryFee(formatPriceInput(e.target.value))}
                        className="w-full bg-[#0a0a0a] border border-[#2a2a2a] pl-8 pr-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                        placeholder="e.g., 2,000"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={deliveryAddress.street}
                      onChange={(e) =>
                        setDeliveryAddress({ ...deliveryAddress, street: e.target.value })
                      }
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                      placeholder="Street address"
                    />
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={deliveryAddress.city}
                        onChange={(e) =>
                          setDeliveryAddress({ ...deliveryAddress, city: e.target.value })
                        }
                        className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                        placeholder="City"
                      />
                      <input
                        type="text"
                        value={deliveryAddress.state}
                        onChange={(e) =>
                          setDeliveryAddress({ ...deliveryAddress, state: e.target.value })
                        }
                        className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                        placeholder="State"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                  Deposit Amount (₦)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888888] font-[family-name:var(--font-montserrat)]">₦</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(formatPriceInput(e.target.value))}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] pl-8 pr-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                    placeholder="e.g., 25,000"
                  />
                </div>
              </div>

              {parsePrice(depositAmount) > 0 && (
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="depositPaid"
                    checked={depositPaid}
                    onChange={(e) => setDepositPaid(e.target.checked)}
                    className="w-4 h-4 accent-[#c9a962]"
                  />
                  <label
                    htmlFor="depositPaid"
                    className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]"
                  >
                    Deposit paid
                  </label>
                </div>
              )}

              {/* Due Date */}
              <div>
                <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                  Due Date (Customer&apos;s Deadline)
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none [&::-webkit-calendar-picker-indicator]:invert"
                />
                <p className="text-xs text-[#666666] mt-1 font-[family-name:var(--font-montserrat)]">
                  When does the customer need this order by?
                </p>
              </div>

              <div>
                <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none resize-none"
                  placeholder="Additional notes..."
                />
              </div>

              {/* Total */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4">
                <div className="flex justify-between text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                  <span>Total</span>
                  <span className="text-[#c9a962]">
                    {formatCurrency(calculateTotal())}
                  </span>
                </div>
                {parsePrice(depositAmount) > 0 && (
                  <div className="flex justify-between text-sm text-[#888888] mt-2 font-[family-name:var(--font-montserrat)]">
                    <span>Balance due</span>
                    <span>{formatCurrency(calculateTotal() - parsePrice(depositAmount))}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep("details")}
                className="border border-[#2a2a2a] text-[#888888] px-6 py-2 font-[family-name:var(--font-montserrat)] hover:border-[#3a3a3a] hover:text-[#f5f5f5] transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-[#c9a962] text-[#0a0a0a] px-6 py-2 font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Order"}
              </button>
            </div>

            {error && (
              <p className="text-red-400 text-sm font-[family-name:var(--font-montserrat)]">
                {error}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="text-[#888888] hover:text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] mb-4"
        >
          ← Back to Orders
        </button>
        <h1 className="text-2xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
          Create New Order
        </h1>
      </div>

      {/* Progress */}
      <div className="flex gap-2 mb-8">
        {(["type", "customer", "details", "pricing"] as Step[]).map((s, i) => (
          <div
            key={s}
            className={`h-1 flex-1 ${
              ["type", "customer", "details", "pricing"].indexOf(step) >= i
                ? "bg-[#c9a962]"
                : "bg-[#2a2a2a]"
            }`}
          />
        ))}
      </div>

      <div className="bg-[#111111] border border-[#1a1a1a] p-6">{renderStep()}</div>

      {/* Product Selector Modal */}
      {showProductSelector && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#1a1a1a] w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-[#1a1a1a] flex items-center justify-between">
              <h3 className="text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
                {selectedProductForSize ? "Select Size" : "Select Product"}
              </h3>
              <button
                onClick={() => {
                  setShowProductSelector(false);
                  setSelectedProductForSize(null);
                  setProductSearch("");
                }}
                className="text-[#888888] hover:text-[#f5f5f5]"
              >
                ✕
              </button>
            </div>

            {!selectedProductForSize ? (
              <>
                {/* Search */}
                <div className="p-4 border-b border-[#1a1a1a]">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search by name, SKU, or category..."
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                  />
                </div>

                {/* Product Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                  {loadingProducts ? (
                    <div className="text-center py-8">
                      <div className="w-6 h-6 border-2 border-[#c9a962] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-8 text-[#888888] font-[family-name:var(--font-montserrat)]">
                      No products found
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {filteredProducts.map((product) => {
                        const totalStock = Object.values(product.sizes).reduce((a, b) => a + b, 0);
                        return (
                          <button
                            key={product.id}
                            onClick={() => handleSelectProduct(product)}
                            disabled={totalStock === 0}
                            className={`text-left border transition-colors ${
                              totalStock === 0
                                ? "border-[#1a1a1a] opacity-50 cursor-not-allowed"
                                : "border-[#2a2a2a] hover:border-[#c9a962]"
                            }`}
                          >
                            <div className="aspect-square bg-[#0a0a0a] relative">
                              {product.images[0] ? (
                                <Image
                                  src={product.images[0]}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#2a2a2a]">
                                  No Image
                                </div>
                              )}
                              {totalStock === 0 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                  <span className="text-red-400 text-xs font-[family-name:var(--font-montserrat)]">
                                    Out of Stock
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="p-2">
                              <p className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] truncate">
                                {product.name}
                              </p>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs text-[#c9a962]">
                                  {formatCurrency(product.salePrice || product.price)}
                                </span>
                                {product.sku && (
                                  <span className="text-[10px] text-[#666666]">
                                    {product.sku}
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Size Selection */
              <div className="p-4">
                <div className="flex gap-4 mb-4">
                  {selectedProductForSize.images[0] && (
                    <div className="w-24 h-24 bg-[#0a0a0a] flex-shrink-0 overflow-hidden">
                      <Image
                        src={selectedProductForSize.images[0]}
                        alt={selectedProductForSize.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                      {selectedProductForSize.name}
                    </p>
                    {selectedProductForSize.sku && (
                      <p className="text-xs text-[#c9a962] mt-1">{selectedProductForSize.sku}</p>
                    )}
                    <p className="text-[#c9a962] mt-2 font-[family-name:var(--font-montserrat)]">
                      {formatCurrency(selectedProductForSize.salePrice || selectedProductForSize.price)}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-[#888888] mb-3 font-[family-name:var(--font-montserrat)]">
                  Select Size:
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(selectedProductForSize.sizes).map(([size, stock]) => (
                    <button
                      key={size}
                      onClick={() => handleAddProductWithSize(size)}
                      disabled={stock === 0}
                      className={`py-3 border text-center font-[family-name:var(--font-montserrat)] transition-colors ${
                        stock === 0
                          ? "border-[#1a1a1a] text-[#444444] cursor-not-allowed"
                          : "border-[#2a2a2a] text-[#f5f5f5] hover:border-[#c9a962] hover:text-[#c9a962]"
                      }`}
                    >
                      <span className="block text-sm">{size}</span>
                      <span className={`block text-xs mt-1 ${stock === 0 ? "text-red-400" : "text-[#666666]"}`}>
                        {stock === 0 ? "Out" : `${stock} left`}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedProductForSize(null)}
                  className="mt-4 w-full py-2 border border-[#2a2a2a] text-[#888888] hover:border-[#3a3a3a] hover:text-[#f5f5f5] font-[family-name:var(--font-montserrat)] transition-colors"
                >
                  ← Back to Products
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
