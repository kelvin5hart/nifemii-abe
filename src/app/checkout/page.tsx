"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc, addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DeliverySettings } from "@/lib/firebase-types";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
};

const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi",
  "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState(1); // 1: Info, 2: Delivery, 3: Payment
  const [loading, setLoading] = useState(false);
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings | null>(null);

  // Customer info
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
  });

  // Delivery info
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("delivery");
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: "",
    city: "",
    state: "Lagos",
    landmark: "",
  });

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<"online" | "pay-on-delivery">("online");

  // Load user data if logged in
  useEffect(() => {
    if (user) {
      setCustomerInfo({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // Load delivery settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, "settings", "main"));
        if (settingsDoc.exists()) {
          setDeliverySettings(settingsDoc.data().delivery as DeliverySettings);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  // Calculate delivery fee
  const calculateDeliveryFee = () => {
    if (deliveryMethod === "pickup") return 0;
    if (!deliverySettings) return 2000; // Default

    // Free delivery threshold
    if (deliverySettings.freeAbove && subtotal >= deliverySettings.freeAbove) {
      return 0;
    }

    switch (deliverySettings.type) {
      case "free":
        return 0;
      case "flat":
        return deliverySettings.flatFee || 2000;
      case "state-based":
        return deliverySettings.stateFees?.[deliveryAddress.state] || 3000;
      default:
        return 2000;
    }
  };

  const deliveryFee = calculateDeliveryFee();
  const total = subtotal + deliveryFee;

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/shop");
    }
  }, [items, router]);

  const validateStep1 = () => {
    return customerInfo.name && customerInfo.phone;
  };

  const validateStep2 = () => {
    if (deliveryMethod === "pickup") return true;
    return deliveryAddress.street && deliveryAddress.city && deliveryAddress.state;
  };

  const handlePlaceOrder = async () => {
    if (!validateStep1() || !validateStep2()) return;

    // Ensure we have items to order
    if (items.length === 0) {
      alert("Your cart is empty. Please add items before placing an order.");
      router.push("/shop");
      return;
    }

    setLoading(true);
    try {
      // Prepare order items, ensuring no undefined values
      const orderItems = items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        sku: item.sku || undefined,
        size: item.size,
        quantity: item.quantity,
        price: item.salePrice || item.price,
        image: item.image || "/images/placeholder.jpg",
      }));

      // Create order in Firebase
      const orderData = {
        userId: user?.id || "",
        userPhone: customerInfo.phone,
        userName: customerInfo.name,
        userEmail: customerInfo.email || null,
        type: "ready-to-wear",
        status: "pending",
        items: orderItems,
        pricing: {
          subtotal,
          deliveryFee,
          totalAmount: total,
        },
        deliveryMethod,
        deliveryAddress: deliveryMethod === "delivery" ? {
          street: deliveryAddress.street,
          city: deliveryAddress.city,
          state: deliveryAddress.state,
          landmark: deliveryAddress.landmark || null,
        } : null,
        paymentMethod,
        createdBy: user?.id || "guest",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const orderRef = await addDoc(collection(db, "orders"), orderData);

      // If online payment, redirect to Paystack
      if (paymentMethod === "online") {
        try {
          // Initialize Paystack payment
          const paystackResponse = await fetch("/api/paystack/initialize", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: customerInfo.email || `${customerInfo.phone}@guest.nifemiiabe.com`,
              amount: total,
              orderId: orderRef.id,
              metadata: {
                customerName: customerInfo.name,
                customerPhone: customerInfo.phone,
              },
            }),
          });

          const paystackData = await paystackResponse.json();

          if (!paystackResponse.ok) {
            throw new Error(paystackData.error || "Failed to initialize payment");
          }

          // Clear cart before redirecting to Paystack
          clearCart();

          // Redirect to Paystack payment page
          window.location.href = paystackData.authorization_url;
          return;
        } catch (paystackError) {
          console.error("Paystack error:", paystackError);
          // If Paystack fails, still keep the order but as unpaid
          alert("Payment initialization failed. Your order has been saved. Please try paying later or contact us.");
        }
      }

      // For pay-on-delivery, just clear cart and redirect
      clearCart();
      router.push(`/checkout/success?orderId=${orderRef.id}`);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#c9a962] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#888888]">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/shop" className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)] hover:text-[#c9a962] transition-colors">
            ← Back to Shop
          </Link>
          <h1 className="text-3xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mt-4">
            Checkout
          </h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[
            { num: 1, label: "Information" },
            { num: 2, label: "Delivery" },
            { num: 3, label: "Payment" },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-[family-name:var(--font-montserrat)] ${
                  step >= s.num
                    ? "bg-[#c9a962] text-[#0a0a0a]"
                    : "bg-[#2a2a2a] text-[#888888]"
                }`}
              >
                {s.num}
              </div>
              <span className={`ml-2 text-sm font-[family-name:var(--font-montserrat)] hidden sm:inline ${
                step >= s.num ? "text-[#f5f5f5]" : "text-[#888888]"
              }`}>
                {s.label}
              </span>
              {i < 2 && (
                <div className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 ${
                  step > s.num ? "bg-[#c9a962]" : "bg-[#2a2a2a]"
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Customer Information */}
            {step === 1 && (
              <div className="bg-[#111111] border border-[#1a1a1a] p-6">
                <h2 className="text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-6">
                  Contact Information
                </h2>

                {!user && (
                  <div className="mb-6 p-4 bg-[#0a0a0a] border border-[#2a2a2a]">
                    <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
                      Already have an account?{" "}
                      <Link href="/account/login" className="text-[#c9a962] hover:underline">
                        Log in
                      </Link>{" "}
                      for faster checkout.
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-3 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-3 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                      placeholder="08012345678"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                      Email (optional)
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-3 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={() => validateStep1() && setStep(2)}
                  disabled={!validateStep1()}
                  className="w-full mt-6 bg-[#c9a962] text-[#0a0a0a] py-3 text-sm tracking-[0.1em] uppercase font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Delivery
                </button>
              </div>
            )}

            {/* Step 2: Delivery */}
            {step === 2 && (
              <div className="bg-[#111111] border border-[#1a1a1a] p-6">
                <h2 className="text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-6">
                  Delivery Method
                </h2>

                <div className="space-y-4 mb-6">
                  <label className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors ${
                    deliveryMethod === "delivery"
                      ? "border-[#c9a962] bg-[#c9a962]/10"
                      : "border-[#2a2a2a] hover:border-[#3a3a3a]"
                  }`}>
                    <input
                      type="radio"
                      name="deliveryMethod"
                      checked={deliveryMethod === "delivery"}
                      onChange={() => setDeliveryMethod("delivery")}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                        Delivery
                      </p>
                      <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
                        {deliveryFee === 0 ? "Free delivery" : `Delivery fee: ${formatPrice(deliveryFee)}`}
                      </p>
                    </div>
                  </label>

                  <label className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors ${
                    deliveryMethod === "pickup"
                      ? "border-[#c9a962] bg-[#c9a962]/10"
                      : "border-[#2a2a2a] hover:border-[#3a3a3a]"
                  }`}>
                    <input
                      type="radio"
                      name="deliveryMethod"
                      checked={deliveryMethod === "pickup"}
                      onChange={() => setDeliveryMethod("pickup")}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                        Pickup
                      </p>
                      <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
                        Pick up from our Lagos studio - Free
                      </p>
                    </div>
                  </label>
                </div>

                {deliveryMethod === "delivery" && (
                  <div className="space-y-4 border-t border-[#1a1a1a] pt-6">
                    <h3 className="text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
                      Delivery Address
                    </h3>

                    <div>
                      <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress.street}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                        className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-3 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                          City *
                        </label>
                        <input
                          type="text"
                          value={deliveryAddress.city}
                          onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                          className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-3 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                          State *
                        </label>
                        <select
                          value={deliveryAddress.state}
                          onChange={(e) => setDeliveryAddress({ ...deliveryAddress, state: e.target.value })}
                          className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-3 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                        >
                          {nigerianStates.map((state) => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                        Landmark (optional)
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress.landmark}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, landmark: e.target.value })}
                        className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-3 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                        placeholder="Near any landmark..."
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border border-[#2a2a2a] text-[#888888] py-3 text-sm font-[family-name:var(--font-montserrat)] hover:border-[#3a3a3a] hover:text-[#f5f5f5] transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => validateStep2() && setStep(3)}
                    disabled={!validateStep2()}
                    className="flex-1 bg-[#c9a962] text-[#0a0a0a] py-3 text-sm tracking-[0.1em] uppercase font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="bg-[#111111] border border-[#1a1a1a] p-6">
                <h2 className="text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-6">
                  Payment Method
                </h2>

                <div className="space-y-4 mb-6">
                  <label className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors ${
                    paymentMethod === "online"
                      ? "border-[#c9a962] bg-[#c9a962]/10"
                      : "border-[#2a2a2a] hover:border-[#3a3a3a]"
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "online"}
                      onChange={() => setPaymentMethod("online")}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                        Pay Online
                      </p>
                      <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
                        Pay securely with card or bank transfer via Paystack
                      </p>
                    </div>
                  </label>

                  <label className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors ${
                    paymentMethod === "pay-on-delivery"
                      ? "border-[#c9a962] bg-[#c9a962]/10"
                      : "border-[#2a2a2a] hover:border-[#3a3a3a]"
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "pay-on-delivery"}
                      onChange={() => setPaymentMethod("pay-on-delivery")}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                        Pay on Delivery
                      </p>
                      <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
                        Pay cash or transfer when you receive your order
                      </p>
                    </div>
                  </label>
                </div>

                {/* Order Summary */}
                <div className="border-t border-[#1a1a1a] pt-6">
                  <h3 className="text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-4">
                    Order Summary
                  </h3>
                  <div className="space-y-2 text-sm font-[family-name:var(--font-montserrat)]">
                    <div className="flex justify-between text-[#888888]">
                      <span>Contact:</span>
                      <span className="text-[#f5f5f5]">{customerInfo.phone}</span>
                    </div>
                    <div className="flex justify-between text-[#888888]">
                      <span>Delivery:</span>
                      <span className="text-[#f5f5f5]">
                        {deliveryMethod === "pickup" ? "Pickup" : `${deliveryAddress.city}, ${deliveryAddress.state}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 border border-[#2a2a2a] text-[#888888] py-3 text-sm font-[family-name:var(--font-montserrat)] hover:border-[#3a3a3a] hover:text-[#f5f5f5] transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="flex-1 bg-[#c9a962] text-[#0a0a0a] py-3 text-sm tracking-[0.1em] uppercase font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors disabled:opacity-50"
                  >
                    {loading ? "Processing..." : paymentMethod === "online" ? "Pay Now" : "Place Order"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#111111] border border-[#1a1a1a] p-6 sticky top-24">
              <h2 className="text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="flex gap-4">
                    <div className="w-16 h-20 relative flex-shrink-0 bg-[#0a0a0a]">
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute -top-2 -right-2 bg-[#c9a962] text-[#0a0a0a] text-xs w-5 h-5 rounded-full flex items-center justify-center font-[family-name:var(--font-montserrat)]">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-[family-name:var(--font-cormorant)] text-[#f5f5f5] truncate">
                        {item.productName}
                      </h3>
                      <p className="text-xs text-[#888888] font-[family-name:var(--font-montserrat)]">
                        Size: {item.size}
                      </p>
                      <p className="text-sm text-[#c9a962] font-[family-name:var(--font-montserrat)] mt-1">
                        {formatPrice((item.salePrice || item.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#1a1a1a] pt-4 space-y-2">
                <div className="flex justify-between text-sm font-[family-name:var(--font-montserrat)]">
                  <span className="text-[#888888]">Subtotal</span>
                  <span className="text-[#f5f5f5]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm font-[family-name:var(--font-montserrat)]">
                  <span className="text-[#888888]">Delivery</span>
                  <span className="text-[#f5f5f5]">
                    {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-[family-name:var(--font-cormorant)] pt-2 border-t border-[#1a1a1a]">
                  <span className="text-[#f5f5f5]">Total</span>
                  <span className="text-[#c9a962]">{formatPrice(total)}</span>
                </div>
              </div>

              {deliverySettings?.freeAbove && subtotal < deliverySettings.freeAbove && (
                <div className="mt-4 p-3 bg-[#c9a962]/10 border border-[#c9a962]/30">
                  <p className="text-[#c9a962] text-xs font-[family-name:var(--font-montserrat)]">
                    Add {formatPrice(deliverySettings.freeAbove - subtotal)} more for free delivery!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
