"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  Timestamp,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User, Measurements, Order } from "@/lib/firebase-types";
import { formatPhoneNumber } from "@/lib/otp-service";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);

  // New customer form state
  const [newCustomer, setNewCustomer] = useState({
    phone: "",
    name: "",
    email: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Fetch customers (non-admin users)
    const customersQuery = query(
      collection(db, "users"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(customersQuery, (snapshot) => {
      const customersData = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as User;
        })
        .filter((user) => !user.isAdmin);
      setCustomers(customersData);
      setLoading(false);
    });

    // Fetch order counts
    const ordersQuery = query(collection(db, "orders"));
    const unsubOrders = onSnapshot(ordersQuery, (snapshot) => {
      const orderCounts: Record<string, number> = {};
      snapshot.docs.forEach((doc) => {
        const userId = doc.data().userId;
        orderCounts[userId] = (orderCounts[userId] || 0) + 1;
      });
      setOrders(orderCounts);
    });

    return () => {
      unsubscribe();
      unsubOrders();
    };
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      customer.name?.toLowerCase().includes(query) ||
      customer.phone.includes(query) ||
      customer.email?.toLowerCase().includes(query)
    );
  });

  const handleCreateCustomer = async () => {
    if (!newCustomer.phone || !newCustomer.name) return;

    setSaving(true);
    try {
      const formattedPhone = formatPhoneNumber(newCustomer.phone);

      // Check if customer already exists
      const existingQuery = query(
        collection(db, "users"),
        where("phone", "==", formattedPhone)
      );
      const existing = await getDocs(existingQuery);

      if (!existing.empty) {
        alert("A customer with this phone number already exists");
        setSaving(false);
        return;
      }

      await addDoc(collection(db, "users"), {
        phone: formattedPhone,
        name: newCustomer.name,
        email: newCustomer.email || null,
        createdAt: Timestamp.now(),
        createdBy: "admin",
      });

      setNewCustomer({ phone: "", name: "", email: "" });
      setShowNewCustomerForm(false);
    } catch (error) {
      console.error("Error creating customer:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateCustomer = async () => {
    if (!selectedCustomer) return;

    setSaving(true);
    try {
      await updateDoc(doc(db, "users", selectedCustomer.id), {
        name: selectedCustomer.name || null,
        email: selectedCustomer.email || null,
        measurements: selectedCustomer.measurements || null,
        updatedAt: Timestamp.now(),
      });
      setEditMode(false);
    } catch (error) {
      console.error("Error updating customer:", error);
    } finally {
      setSaving(false);
    }
  };

  const updateMeasurement = (key: keyof Measurements, value: number | string | undefined) => {
    if (!selectedCustomer) return;
    setSelectedCustomer({
      ...selectedCustomer,
      measurements: {
        ...selectedCustomer.measurements,
        [key]: value,
      },
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#888888]">Loading customers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
          Customers
        </h1>
        <button
          onClick={() => setShowNewCustomerForm(true)}
          className="bg-[#c9a962] text-[#0a0a0a] px-4 py-2 text-sm font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors"
        >
          + Add Customer
        </button>
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md bg-[#111111] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
          placeholder="Search by name, phone, or email..."
        />
      </div>

      {/* Customers List */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-[#111111] border border-[#1a1a1a] p-12 text-center">
          <p className="text-[#888888] font-[family-name:var(--font-montserrat)]">
            No customers found
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="bg-[#111111] border border-[#1a1a1a] p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                      {customer.name || "No name"}
                    </p>
                    <p className="text-xs text-[#888888] font-[family-name:var(--font-montserrat)]">
                      {customer.phone}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 ${
                      customer.measurements
                        ? "bg-green-500/20 text-green-400"
                        : "bg-[#2a2a2a] text-[#888888]"
                    } font-[family-name:var(--font-montserrat)]`}
                  >
                    {customer.measurements ? "Measurements" : "No measurements"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#888888] mb-3 font-[family-name:var(--font-montserrat)]">
                  <span>{orders[customer.id] || 0} orders</span>
                  <span>Joined {formatDate(customer.createdAt)}</span>
                </div>

                <button
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setEditMode(false);
                  }}
                  className="w-full bg-[#1a1a1a] text-[#c9a962] py-2 text-sm font-[family-name:var(--font-montserrat)] hover:bg-[#222222] transition-colors"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-[#111111] border border-[#1a1a1a] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0a0a0a] border-b border-[#1a1a1a]">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#888888] font-[family-name:var(--font-montserrat)]">
                      Customer
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#888888] font-[family-name:var(--font-montserrat)]">
                      Phone
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#888888] font-[family-name:var(--font-montserrat)]">
                      Orders
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#888888] font-[family-name:var(--font-montserrat)]">
                      Measurements
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#888888] font-[family-name:var(--font-montserrat)]">
                      Joined
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#888888] font-[family-name:var(--font-montserrat)]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a1a]">
                  {filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="hover:bg-[#1a1a1a]/50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                            {customer.name || "No name"}
                          </p>
                          {customer.email && (
                            <p className="text-xs text-[#888888] font-[family-name:var(--font-montserrat)]">
                              {customer.email}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-[#888888] font-[family-name:var(--font-montserrat)]">
                        {customer.phone}
                      </td>
                      <td className="px-4 py-4 text-sm text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                        {orders[customer.id] || 0}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`text-xs px-2 py-1 ${
                            customer.measurements
                              ? "bg-green-500/20 text-green-400"
                              : "bg-[#2a2a2a] text-[#888888]"
                          } font-[family-name:var(--font-montserrat)]`}
                        >
                          {customer.measurements ? "Saved" : "Not set"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-[#888888] font-[family-name:var(--font-montserrat)]">
                        {formatDate(customer.createdAt)}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setEditMode(false);
                          }}
                          className="text-[#c9a962] hover:text-[#d4b87a] text-sm font-[family-name:var(--font-montserrat)]"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* New Customer Modal */}
      {showNewCustomerForm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end md:items-center justify-center md:p-4">
          <div className="bg-[#111111] border border-[#1a1a1a] w-full md:max-w-md max-h-[90vh] overflow-y-auto rounded-t-xl md:rounded-none">
            <div className="border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
                Add Customer
              </h2>
              <button
                onClick={() => setShowNewCustomerForm(false)}
                className="text-[#888888] hover:text-[#f5f5f5]"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, phone: e.target.value })
                  }
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                  placeholder="08012345678"
                />
              </div>
              <div>
                <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newCustomer.name}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, name: e.target.value })
                  }
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                  Email (optional)
                </label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, email: e.target.value })
                  }
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowNewCustomerForm(false)}
                  className="flex-1 border border-[#2a2a2a] text-[#888888] py-2 font-[family-name:var(--font-montserrat)] hover:border-[#3a3a3a] hover:text-[#f5f5f5] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCustomer}
                  disabled={saving || !newCustomer.phone || !newCustomer.name}
                  className="flex-1 bg-[#c9a962] text-[#0a0a0a] py-2 font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors disabled:opacity-50"
                >
                  {saving ? "Creating..." : "Create Customer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end md:items-center justify-center md:p-4">
          <div className="bg-[#111111] border border-[#1a1a1a] w-full md:max-w-2xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto rounded-t-xl md:rounded-none">
            <div className="sticky top-0 bg-[#111111] border-b border-[#1a1a1a] px-4 md:px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
                Customer Details
              </h2>
              <button
                onClick={() => {
                  setSelectedCustomer(null);
                  setEditMode(false);
                }}
                className="text-[#888888] hover:text-[#f5f5f5]"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="bg-[#0a0a0a] p-4 border border-[#1a1a1a]">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-sm uppercase tracking-wider text-[#888888] font-[family-name:var(--font-montserrat)]">
                    Contact Information
                  </h3>
                  {!editMode && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="text-[#c9a962] text-sm font-[family-name:var(--font-montserrat)]"
                    >
                      Edit
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-[#666666] mb-1 font-[family-name:var(--font-montserrat)]">
                      Phone
                    </label>
                    <p className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                      {selectedCustomer.phone}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs text-[#666666] mb-1 font-[family-name:var(--font-montserrat)]">
                      Name
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        value={selectedCustomer.name || ""}
                        onChange={(e) =>
                          setSelectedCustomer({
                            ...selectedCustomer,
                            name: e.target.value,
                          })
                        }
                        className="w-full bg-[#111111] border border-[#2a2a2a] px-3 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                      />
                    ) : (
                      <p className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                        {selectedCustomer.name || "Not set"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-[#666666] mb-1 font-[family-name:var(--font-montserrat)]">
                      Email
                    </label>
                    {editMode ? (
                      <input
                        type="email"
                        value={selectedCustomer.email || ""}
                        onChange={(e) =>
                          setSelectedCustomer({
                            ...selectedCustomer,
                            email: e.target.value,
                          })
                        }
                        className="w-full bg-[#111111] border border-[#2a2a2a] px-3 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                      />
                    ) : (
                      <p className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                        {selectedCustomer.email || "Not set"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Measurements */}
              <div className="bg-[#0a0a0a] p-4 border border-[#1a1a1a]">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-sm uppercase tracking-wider text-[#888888] font-[family-name:var(--font-montserrat)]">
                    Measurements (inches)
                  </h3>
                </div>
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
                      {editMode ? (
                        <input
                          type="number"
                          value={
                            (selectedCustomer.measurements as Record<string, number | undefined>)?.[
                              field.key
                            ] || ""
                          }
                          onChange={(e) =>
                            updateMeasurement(
                              field.key as keyof Measurements,
                              parseFloat(e.target.value) || undefined
                            )
                          }
                          className="w-full bg-[#111111] border border-[#2a2a2a] px-2 py-1 text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                        />
                      ) : (
                        <p className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)]">
                          {(selectedCustomer.measurements as Record<string, number | undefined>)?.[
                            field.key
                          ] || "-"}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                {editMode && (
                  <div className="mt-4">
                    <label className="block text-xs text-[#666666] mb-1 font-[family-name:var(--font-montserrat)]">
                      Notes
                    </label>
                    <textarea
                      value={selectedCustomer.measurements?.notes || ""}
                      onChange={(e) => updateMeasurement("notes", e.target.value)}
                      rows={2}
                      className="w-full bg-[#111111] border border-[#2a2a2a] px-3 py-2 text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none resize-none"
                      placeholder="Additional measurement notes..."
                    />
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0a0a0a] p-4 border border-[#1a1a1a]">
                  <p className="text-2xl text-[#c9a962] font-[family-name:var(--font-cormorant)]">
                    {orders[selectedCustomer.id] || 0}
                  </p>
                  <p className="text-xs text-[#888888] font-[family-name:var(--font-montserrat)]">
                    Total Orders
                  </p>
                </div>
                <div className="bg-[#0a0a0a] p-4 border border-[#1a1a1a]">
                  <p className="text-sm text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                    {formatDate(selectedCustomer.createdAt)}
                  </p>
                  <p className="text-xs text-[#888888] font-[family-name:var(--font-montserrat)]">
                    Customer Since
                  </p>
                </div>
              </div>

              {/* Actions */}
              {editMode && (
                <div className="flex gap-4 pt-4 border-t border-[#1a1a1a]">
                  <button
                    onClick={() => setEditMode(false)}
                    className="flex-1 border border-[#2a2a2a] text-[#888888] py-2 font-[family-name:var(--font-montserrat)] hover:border-[#3a3a3a] hover:text-[#f5f5f5] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateCustomer}
                    disabled={saving}
                    className="flex-1 bg-[#c9a962] text-[#0a0a0a] py-2 font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
