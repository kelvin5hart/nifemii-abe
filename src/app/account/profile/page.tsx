"use client";

import { useState, useEffect } from "react";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Address } from "@/lib/firebase-types";

const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi",
  "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

export default function CustomerProfilePage() {
  const { user, signOut } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Address form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);
  const [newAddress, setNewAddress] = useState<Address>({
    id: "",
    label: "",
    street: "",
    city: "",
    state: "",
    landmark: "",
    isDefault: false,
  });

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setAddresses(user.addresses || []);
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user?.id) return;

    setSaving(true);
    setSaved(false);

    try {
      await updateDoc(doc(db, "users", user.id), {
        name,
        email: email || null,
        updatedAt: Timestamp.now(),
      });
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!user?.id) return;

    let updatedAddresses = [...addresses];

    if (editingAddressIndex !== null) {
      // Editing existing address
      updatedAddresses[editingAddressIndex] = {
        ...newAddress,
        id: addresses[editingAddressIndex].id,
      };
    } else {
      // Adding new address
      const addressWithId = {
        ...newAddress,
        id: Date.now().toString(),
      };

      // If this is set as default, remove default from others
      if (addressWithId.isDefault) {
        updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
      }

      updatedAddresses.push(addressWithId);
    }

    // If setting as default, ensure only one default
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map((a, i) => ({
        ...a,
        isDefault: editingAddressIndex !== null ? i === editingAddressIndex : a.id === newAddress.id,
      }));
    }

    try {
      await updateDoc(doc(db, "users", user.id), {
        addresses: updatedAddresses,
        updatedAt: Timestamp.now(),
      });
      setAddresses(updatedAddresses);
      resetAddressForm();
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  const handleDeleteAddress = async (index: number) => {
    if (!user?.id || !confirm("Delete this address?")) return;

    const updatedAddresses = addresses.filter((_, i) => i !== index);

    try {
      await updateDoc(doc(db, "users", user.id), {
        addresses: updatedAddresses,
        updatedAt: Timestamp.now(),
      });
      setAddresses(updatedAddresses);
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const handleEditAddress = (index: number) => {
    setEditingAddressIndex(index);
    setNewAddress(addresses[index]);
    setShowAddressForm(true);
  };

  const resetAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddressIndex(null);
    setNewAddress({
      id: "",
      label: "",
      street: "",
      city: "",
      state: "",
      landmark: "",
      isDefault: false,
    });
  };

  const handleSignOut = async () => {
    if (confirm("Are you sure you want to sign out?")) {
      await signOut();
      window.location.href = "/";
    }
  };

  return (
    <>
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
            My Profile
          </h1>
          <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
            Manage your personal information and addresses
          </p>
        </div>

        {/* Personal Information */}
        <div className="bg-[#111111] border border-[#1a1a1a] mb-6">
          <div className="p-6 border-b border-[#1a1a1a] flex items-center justify-between">
            <h2 className="text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
              Personal Information
            </h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-[#c9a962] text-sm font-[family-name:var(--font-montserrat)]"
              >
                Edit
              </button>
            )}
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                Phone Number
              </label>
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] px-4 py-3">
                <span className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                  {user?.phone}
                </span>
                <span className="text-[#888888] text-xs ml-2 font-[family-name:var(--font-montserrat)]">
                  (cannot be changed)
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                Full Name
              </label>
              {editing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] px-4 py-3">
                  <span className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                    {name || "Not set"}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                Email (optional)
              </label>
              {editing ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                  placeholder="Enter your email address"
                />
              ) : (
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] px-4 py-3">
                  <span className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                    {email || "Not set"}
                  </span>
                </div>
              )}
            </div>

            {editing && (
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    setEditing(false);
                    setName(user?.name || "");
                    setEmail(user?.email || "");
                  }}
                  className="flex-1 border border-[#2a2a2a] text-[#888888] py-2 font-[family-name:var(--font-montserrat)] hover:border-[#3a3a3a] hover:text-[#f5f5f5] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex-1 bg-[#c9a962] text-[#0a0a0a] py-2 font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Saved Addresses */}
        <div className="bg-[#111111] border border-[#1a1a1a] mb-6">
          <div className="p-6 border-b border-[#1a1a1a] flex items-center justify-between">
            <h2 className="text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
              Saved Addresses
            </h2>
            <button
              onClick={() => setShowAddressForm(true)}
              className="text-[#c9a962] text-sm font-[family-name:var(--font-montserrat)]"
            >
              + Add Address
            </button>
          </div>

          <div className="p-6">
            {addresses.length === 0 ? (
              <div className="text-center py-8">
                <svg
                  className="w-12 h-12 text-[#2a2a2a] mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="text-[#888888] font-[family-name:var(--font-montserrat)] mb-4">
                  No saved addresses
                </p>
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="text-[#c9a962] text-sm font-[family-name:var(--font-montserrat)]"
                >
                  Add your first address
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.map((address, index) => (
                  <div
                    key={address.id}
                    className={`bg-[#0a0a0a] border p-4 ${
                      address.isDefault ? "border-[#c9a962]/50" : "border-[#1a1a1a]"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                            {address.label || "Address"}
                          </span>
                          {address.isDefault && (
                            <span className="text-xs bg-[#c9a962]/20 text-[#c9a962] px-2 py-0.5 font-[family-name:var(--font-montserrat)]">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#888888] font-[family-name:var(--font-montserrat)]">
                          {address.street}
                        </p>
                        <p className="text-sm text-[#888888] font-[family-name:var(--font-montserrat)]">
                          {address.city}, {address.state}
                        </p>
                        {address.landmark && (
                          <p className="text-xs text-[#666666] mt-1 font-[family-name:var(--font-montserrat)]">
                            Near: {address.landmark}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditAddress(index)}
                          className="text-[#c9a962] text-sm font-[family-name:var(--font-montserrat)]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(index)}
                          className="text-red-400 text-sm font-[family-name:var(--font-montserrat)]"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sign Out */}
        <div className="bg-[#111111] border border-[#1a1a1a] p-6">
          <button
            onClick={handleSignOut}
            className="w-full border border-red-500/50 text-red-400 py-3 font-[family-name:var(--font-montserrat)] hover:bg-red-500/10 transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Address Form Modal */}
        {showAddressForm && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-[#111111] border border-[#1a1a1a] w-full max-w-md">
              <div className="border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
                  {editingAddressIndex !== null ? "Edit Address" : "Add Address"}
                </h2>
                <button
                  onClick={resetAddressForm}
                  className="text-[#888888] hover:text-[#f5f5f5]"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                    Label (e.g., Home, Office)
                  </label>
                  <input
                    type="text"
                    value={newAddress.label}
                    onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                      City
                    </label>
                    <input
                      type="text"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                      State
                    </label>
                    <select
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                    >
                      <option value="">Select state</option>
                      {nigerianStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
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
                    value={newAddress.landmark || ""}
                    onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                    placeholder="e.g., Near XYZ Mall"
                  />
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newAddress.isDefault || false}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, isDefault: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#c9a962]"
                  />
                  <span className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)]">
                    Set as default address
                  </span>
                </label>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={resetAddressForm}
                    className="flex-1 border border-[#2a2a2a] text-[#888888] py-2 font-[family-name:var(--font-montserrat)] hover:border-[#3a3a3a] hover:text-[#f5f5f5] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAddress}
                    disabled={!newAddress.street || !newAddress.city || !newAddress.state}
                    className="flex-1 bg-[#c9a962] text-[#0a0a0a] py-2 font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors disabled:opacity-50"
                  >
                    Save Address
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
