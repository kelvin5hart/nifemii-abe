"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ContactMessage } from "@/lib/firebase-types";

// Helper to convert Firestore Timestamp to Date
const toDate = (value: unknown): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "object" && value !== null && "toDate" in value) {
    return (value as { toDate: () => Date }).toDate();
  }
  if (typeof value === "object" && value !== null && "seconds" in value) {
    return new Date((value as { seconds: number }).seconds * 1000);
  }
  return null;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<"all" | "new" | "read" | "replied">("all");

  useEffect(() => {
    const messagesQuery = query(
      collection(db, "contactMessages"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ContactMessage[];
      setMessages(messagesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = async (messageId: string) => {
    try {
      await updateDoc(doc(db, "contactMessages", messageId), {
        status: "read",
      });
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const markAsReplied = async (messageId: string) => {
    try {
      await updateDoc(doc(db, "contactMessages", messageId), {
        status: "replied",
        repliedAt: new Date(),
      });
      setSelectedMessage(null);
    } catch (error) {
      console.error("Error marking message as replied:", error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await deleteDoc(doc(db, "contactMessages", messageId));
      setSelectedMessage(null);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const openMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    if (message.status === "new") {
      markAsRead(message.id);
    }
  };

  const filteredMessages = messages.filter((message) => {
    if (filter === "all") return true;
    return message.status === filter;
  });

  const newCount = messages.filter((m) => m.status === "new").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#c9a962]" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
            Contact Messages
          </h1>
          <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
            {newCount > 0 ? `${newCount} new message${newCount > 1 ? "s" : ""}` : "No new messages"}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {(["all", "new", "read", "replied"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 text-xs font-[family-name:var(--font-montserrat)] uppercase tracking-wider transition-colors ${
                filter === status
                  ? "bg-[#c9a962] text-[#0a0a0a]"
                  : "border border-[#2a2a2a] text-[#888888] hover:border-[#c9a962] hover:text-[#c9a962]"
              }`}
            >
              {status === "all" ? "All" : status}
              {status === "new" && newCount > 0 && (
                <span className="ml-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {newCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {filteredMessages.length === 0 ? (
        <div className="bg-[#111111] border border-[#1a1a1a] p-12 text-center">
          <svg
            className="w-16 h-16 text-[#2a2a2a] mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <p className="text-[#888888] font-[family-name:var(--font-montserrat)]">
            No messages found
          </p>
        </div>
      ) : (
        <div className="bg-[#111111] border border-[#1a1a1a]">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              onClick={() => openMessage(message)}
              className={`p-4 border-b border-[#1a1a1a] cursor-pointer hover:bg-[#1a1a1a] transition-colors ${
                message.status === "new" ? "bg-[#c9a962]/5" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {message.status === "new" && (
                      <span className="w-2 h-2 bg-[#c9a962] rounded-full flex-shrink-0" />
                    )}
                    <h3 className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)] font-medium truncate">
                      {message.name}
                    </h3>
                    <span className="text-xs text-[#888888] font-[family-name:var(--font-montserrat)] flex-shrink-0">
                      {message.service}
                    </span>
                  </div>
                  <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
                    {message.email}
                  </p>
                  <p className="text-[#666666] text-sm font-[family-name:var(--font-montserrat)] truncate mt-1">
                    {message.message}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-[#888888] font-[family-name:var(--font-montserrat)]">
                    {toDate(message.createdAt)?.toLocaleDateString("en-NG", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-[family-name:var(--font-montserrat)] uppercase ${
                      message.status === "new"
                        ? "bg-[#c9a962]/20 text-[#c9a962]"
                        : message.status === "replied"
                        ? "bg-green-900/20 text-green-400"
                        : "bg-[#2a2a2a] text-[#888888]"
                    }`}
                  >
                    {message.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="bg-[#111111] border border-[#1a1a1a] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-[#111111] border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
                Message from {selectedMessage.name}
              </h2>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-[#888888] hover:text-[#f5f5f5] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                    {selectedMessage.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-[#c9a962] font-[family-name:var(--font-montserrat)] hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.phone && (
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="text-[#c9a962] font-[family-name:var(--font-montserrat)] hover:underline"
                    >
                      {selectedMessage.phone}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                    {selectedMessage.service}
                  </span>
                </div>
              </div>

              {/* Message */}
              <div>
                <h3 className="text-sm text-[#888888] font-[family-name:var(--font-montserrat)] uppercase tracking-wider mb-2">
                  Message
                </h3>
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4">
                  <p className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)] whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div className="flex items-center justify-between text-sm text-[#888888] font-[family-name:var(--font-montserrat)]">
                <span>
                  Received:{" "}
                  {toDate(selectedMessage.createdAt)?.toLocaleDateString("en-NG", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span
                  className={`px-2 py-1 text-xs uppercase ${
                    selectedMessage.status === "new"
                      ? "bg-[#c9a962]/20 text-[#c9a962]"
                      : selectedMessage.status === "replied"
                      ? "bg-green-900/20 text-green-400"
                      : "bg-[#2a2a2a] text-[#888888]"
                  }`}
                >
                  {selectedMessage.status}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-[#1a1a1a]">
                <div className="flex gap-2">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.service} Inquiry&body=%0A%0A---%0AOriginal message:%0A${encodeURIComponent(selectedMessage.message)}`}
                    className="inline-flex items-center gap-2 bg-[#c9a962] text-[#0a0a0a] px-4 py-2 text-sm font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    Reply via Email
                  </a>
                  {selectedMessage.phone && (
                    <a
                      href={`https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-[#2a2a2a] text-[#888888] px-4 py-2 text-sm font-[family-name:var(--font-montserrat)] hover:border-[#c9a962] hover:text-[#c9a962] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      WhatsApp
                    </a>
                  )}
                </div>
                <div className="flex gap-2">
                  {selectedMessage.status !== "replied" && (
                    <button
                      onClick={() => markAsReplied(selectedMessage.id)}
                      className="text-green-400 text-sm font-[family-name:var(--font-montserrat)] hover:text-green-300"
                    >
                      Mark as Replied
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="text-red-400 text-sm font-[family-name:var(--font-montserrat)] hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
