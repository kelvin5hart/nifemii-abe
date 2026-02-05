(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/admin/appointments/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminAppointmentsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$otp$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/otp-service.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const statusColors = {
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
    confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/50",
    completed: "bg-green-500/20 text-green-400 border-green-500/50",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/50",
    rescheduled: "bg-purple-500/20 text-purple-400 border-purple-500/50"
};
const typeLabels = {
    consultation: "Consultation",
    fitting: "Fitting",
    pickup: "Pickup",
    "fabric-dropoff": "Fabric Drop-off"
};
const typeDescriptions = {
    consultation: "Initial meeting to discuss style ideas and requirements",
    fitting: "Try on outfit and make any necessary adjustments",
    pickup: "Customer collection of completed order",
    "fabric-dropoff": "Customer brings fabric for sew-only order"
};
const defaultAvailability = {
    workingDays: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday"
    ],
    workingHours: {
        start: "10:00",
        end: "18:00"
    },
    slotDuration: 30,
    blockedDates: [],
    blockedTimeSlots: []
};
function AdminAppointmentsPage() {
    _s();
    const [appointments, setAppointments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [availability, setAvailability] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultAvailability);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [selectedAppointment, setSelectedAppointment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showNewForm, setShowNewForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [filterStatus, setFilterStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [filterDate, setFilterDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    // New appointment form
    const [newAppointment, setNewAppointment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        customerPhone: "",
        customerName: "",
        type: "consultation",
        date: "",
        timeSlot: "",
        notes: ""
    });
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [customerLookup, setCustomerLookup] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [lookingUp, setLookingUp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Reschedule state
    const [showRescheduleModal, setShowRescheduleModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [rescheduleDate, setRescheduleDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [rescheduleTime, setRescheduleTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const today = new Date().toISOString().split("T")[0];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminAppointmentsPage.useEffect": ()=>{
            const appointmentsQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], "appointments"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["orderBy"])("date", "asc"));
            const unsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onSnapshot"])(appointmentsQuery, {
                "AdminAppointmentsPage.useEffect.unsubscribe": (snapshot)=>{
                    const appointmentsData = snapshot.docs.map({
                        "AdminAppointmentsPage.useEffect.unsubscribe.appointmentsData": (doc)=>{
                            const data = doc.data();
                            return {
                                id: doc.id,
                                ...data,
                                createdAt: data.createdAt?.toDate() || new Date(),
                                updatedAt: data.updatedAt?.toDate() || new Date()
                            };
                        }
                    }["AdminAppointmentsPage.useEffect.unsubscribe.appointmentsData"]);
                    setAppointments(appointmentsData);
                    setLoading(false);
                }
            }["AdminAppointmentsPage.useEffect.unsubscribe"]);
            // Fetch availability settings
            const fetchSettings = {
                "AdminAppointmentsPage.useEffect.fetchSettings": async ()=>{
                    try {
                        const settingsDoc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], "settings", "main"));
                        if (settingsDoc.exists() && settingsDoc.data().availability) {
                            setAvailability(settingsDoc.data().availability);
                        }
                    } catch (error) {
                        console.error("Error fetching settings:", error);
                    }
                }
            }["AdminAppointmentsPage.useEffect.fetchSettings"];
            fetchSettings();
            return ({
                "AdminAppointmentsPage.useEffect": ()=>unsubscribe()
            })["AdminAppointmentsPage.useEffect"];
        }
    }["AdminAppointmentsPage.useEffect"], []);
    // Look up customer when phone changes
    const handlePhoneLookup = async (phone)=>{
        setNewAppointment({
            ...newAppointment,
            customerPhone: phone
        });
        if (phone.length >= 10) {
            setLookingUp(true);
            try {
                const formattedPhone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$otp$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPhoneNumber"])(phone);
                const existingQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], "users"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])("phone", "==", formattedPhone));
                const existing = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])(existingQuery);
                if (!existing.empty) {
                    const userData = existing.docs[0].data();
                    setCustomerLookup({
                        id: existing.docs[0].id,
                        name: userData.name || "",
                        phone: formattedPhone
                    });
                    // Auto-fill name if found
                    if (userData.name && !newAppointment.customerName) {
                        setNewAppointment((prev)=>({
                                ...prev,
                                customerPhone: phone,
                                customerName: userData.name
                            }));
                    }
                } else {
                    setCustomerLookup(null);
                }
            } catch (error) {
                console.error("Error looking up customer:", error);
            } finally{
                setLookingUp(false);
            }
        } else {
            setCustomerLookup(null);
        }
    };
    const filteredAppointments = appointments.filter((apt)=>{
        if (filterStatus !== "all" && apt.status !== filterStatus) return false;
        if (filterDate && apt.date !== filterDate) return false;
        return true;
    });
    // Group appointments by date
    const groupedAppointments = filteredAppointments.reduce((groups, apt)=>{
        const date = apt.date;
        if (!groups[date]) groups[date] = [];
        groups[date].push(apt);
        return groups;
    }, {});
    // Check if date is available
    const isDateAvailable = (dateStr)=>{
        const date = new Date(dateStr);
        const dayName = date.toLocaleDateString("en-US", {
            weekday: "long"
        }).toLowerCase();
        if (!availability.workingDays.includes(dayName)) return false;
        if (availability.blockedDates.includes(dateStr)) return false;
        return true;
    };
    // Generate time slots based on availability settings
    const generateTimeSlots = ()=>{
        const slots = [];
        const [startHour, startMinute] = availability.workingHours.start.split(":").map(Number);
        const [endHour, endMinute] = availability.workingHours.end.split(":").map(Number);
        const duration = availability.slotDuration;
        let currentMinutes = startHour * 60 + startMinute;
        const endMinutes = endHour * 60 + endMinute;
        while(currentMinutes + duration <= endMinutes){
            const hours = Math.floor(currentMinutes / 60);
            const minutes = currentMinutes % 60;
            slots.push(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`);
            currentMinutes += duration;
        }
        return slots;
    };
    // Get booked slots for a date
    const getBookedSlots = (dateStr)=>{
        return appointments.filter((apt)=>apt.date === dateStr && ![
                "cancelled"
            ].includes(apt.status)).map((apt)=>apt.timeSlot);
    };
    // Check if a specific time slot is blocked on a given date
    const isTimeSlotBlocked = (dateStr, timeSlot)=>{
        const blockedSlots = availability.blockedTimeSlots || [];
        const slotTime = parseInt(timeSlot.replace(":", ""));
        return blockedSlots.some((blocked)=>{
            if (blocked.date !== dateStr) return false;
            const blockStart = parseInt(blocked.startTime.replace(":", ""));
            const blockEnd = parseInt(blocked.endTime.replace(":", ""));
            // Check if the time slot falls within the blocked period
            return slotTime >= blockStart && slotTime < blockEnd;
        });
    };
    // Get the reason for a blocked time slot
    const getBlockedSlotReason = (dateStr, timeSlot)=>{
        const blockedSlots = availability.blockedTimeSlots || [];
        const slotTime = parseInt(timeSlot.replace(":", ""));
        const blockedSlot = blockedSlots.find((blocked)=>{
            if (blocked.date !== dateStr) return false;
            const blockStart = parseInt(blocked.startTime.replace(":", ""));
            const blockEnd = parseInt(blocked.endTime.replace(":", ""));
            return slotTime >= blockStart && slotTime < blockEnd;
        });
        return blockedSlot?.reason || "Unavailable";
    };
    const handleCreateAppointment = async ()=>{
        if (!newAppointment.customerPhone || !newAppointment.date || !newAppointment.timeSlot) return;
        setSaving(true);
        try {
            const formattedPhone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$otp$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPhoneNumber"])(newAppointment.customerPhone);
            // Find or reference customer
            let userId = customerLookup?.id || "";
            let userName = newAppointment.customerName || customerLookup?.name || null;
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], "appointments"), {
                userId,
                userPhone: formattedPhone,
                userName,
                type: newAppointment.type,
                date: newAppointment.date,
                timeSlot: newAppointment.timeSlot,
                status: "pending",
                notes: newAppointment.notes || null,
                createdBy: "admin",
                createdAt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Timestamp"].now()
            });
            setNewAppointment({
                customerPhone: "",
                customerName: "",
                type: "consultation",
                date: "",
                timeSlot: "",
                notes: ""
            });
            setCustomerLookup(null);
            setShowNewForm(false);
        } catch (error) {
            console.error("Error creating appointment:", error);
        } finally{
            setSaving(false);
        }
    };
    const handleUpdateStatus = async (appointmentId, newStatus)=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], "appointments", appointmentId), {
                status: newStatus,
                updatedAt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Timestamp"].now()
            });
            if (selectedAppointment?.id === appointmentId) {
                setSelectedAppointment({
                    ...selectedAppointment,
                    status: newStatus
                });
            }
        } catch (error) {
            console.error("Error updating appointment status:", error);
        }
    };
    const handleReschedule = async ()=>{
        if (!selectedAppointment || !rescheduleDate || !rescheduleTime) return;
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], "appointments", selectedAppointment.id), {
                date: rescheduleDate,
                timeSlot: rescheduleTime,
                status: "rescheduled",
                updatedAt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Timestamp"].now()
            });
            setSelectedAppointment({
                ...selectedAppointment,
                date: rescheduleDate,
                timeSlot: rescheduleTime,
                status: "rescheduled"
            });
            setShowRescheduleModal(false);
            setRescheduleDate("");
            setRescheduleTime("");
        } catch (error) {
            console.error("Error rescheduling appointment:", error);
        }
    };
    const handleDelete = async (appointmentId)=>{
        if (!confirm("Are you sure you want to delete this appointment?")) return;
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], "appointments", appointmentId));
            setSelectedAppointment(null);
        } catch (error) {
            console.error("Error deleting appointment:", error);
        }
    };
    const formatDateDisplay = (dateStr)=>{
        const date = new Date(dateStr);
        const todayDate = new Date();
        const tomorrow = new Date(todayDate);
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (dateStr === todayDate.toISOString().split("T")[0]) {
            return "Today";
        } else if (dateStr === tomorrow.toISOString().split("T")[0]) {
            return "Tomorrow";
        }
        return new Intl.DateTimeFormat("en-NG", {
            weekday: "short",
            day: "numeric",
            month: "short"
        }).format(date);
    };
    const openRescheduleModal = ()=>{
        if (selectedAppointment) {
            setRescheduleDate(selectedAppointment.date);
            setRescheduleTime(selectedAppointment.timeSlot);
            setShowRescheduleModal(true);
        }
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-64",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-[#888888]",
                children: "Loading appointments..."
            }, void 0, false, {
                fileName: "[project]/src/app/admin/appointments/page.tsx",
                lineNumber: 364,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/admin/appointments/page.tsx",
            lineNumber: 363,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]",
                        children: "Appointments"
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/appointments/page.tsx",
                        lineNumber: 372,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setShowNewForm(true),
                        className: "bg-[#c9a962] text-[#0a0a0a] px-4 py-2 text-sm font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors",
                        children: "+ Schedule Appointment"
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/appointments/page.tsx",
                        lineNumber: 375,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/appointments/page.tsx",
                lineNumber: 371,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        value: filterStatus,
                        onChange: (e)=>setFilterStatus(e.target.value),
                        className: "bg-[#111111] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "all",
                                children: "All Statuses"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/appointments/page.tsx",
                                lineNumber: 390,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "pending",
                                children: "Pending"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/appointments/page.tsx",
                                lineNumber: 391,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "confirmed",
                                children: "Confirmed"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/appointments/page.tsx",
                                lineNumber: 392,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "completed",
                                children: "Completed"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/appointments/page.tsx",
                                lineNumber: 393,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "cancelled",
                                children: "Cancelled"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/appointments/page.tsx",
                                lineNumber: 394,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "rescheduled",
                                children: "Rescheduled"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/appointments/page.tsx",
                                lineNumber: 395,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/appointments/page.tsx",
                        lineNumber: 385,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "date",
                        value: filterDate,
                        onChange: (e)=>setFilterDate(e.target.value),
                        className: "bg-[#111111] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/appointments/page.tsx",
                        lineNumber: 398,
                        columnNumber: 9
                    }, this),
                    filterDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setFilterDate(""),
                        className: "text-[#888888] text-sm font-[family-name:var(--font-montserrat)] hover:text-[#f5f5f5]",
                        children: "Clear date"
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/appointments/page.tsx",
                        lineNumber: 406,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/appointments/page.tsx",
                lineNumber: 384,
                columnNumber: 7
            }, this),
            Object.keys(groupedAppointments).length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#111111] border border-[#1a1a1a] p-12 text-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-[#888888] font-[family-name:var(--font-montserrat)]",
                    children: "No appointments found"
                }, void 0, false, {
                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                    lineNumber: 418,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/admin/appointments/page.tsx",
                lineNumber: 417,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-6",
                children: Object.entries(groupedAppointments).sort(([a], [b])=>a.localeCompare(b)).map(([date, apts])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-3",
                                children: [
                                    formatDateDisplay(date),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-[#888888] ml-2 font-[family-name:var(--font-montserrat)]",
                                        children: [
                                            "(",
                                            apts.length,
                                            " appointment",
                                            apts.length !== 1 ? "s" : "",
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/appointments/page.tsx",
                                        lineNumber: 430,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/appointments/page.tsx",
                                lineNumber: 428,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-[#111111] border border-[#1a1a1a] divide-y divide-[#1a1a1a]",
                                children: apts.sort((a, b)=>a.timeSlot.localeCompare(b.timeSlot)).map((apt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-4 flex items-center justify-between hover:bg-[#1a1a1a]/50 transition-colors cursor-pointer",
                                        onClick: ()=>setSelectedAppointment(apt),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-center",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-lg text-[#c9a962] font-[family-name:var(--font-montserrat)]",
                                                            children: apt.timeSlot
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                            lineNumber: 445,
                                                            columnNumber: 29
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                        lineNumber: 444,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-[#f5f5f5] font-[family-name:var(--font-montserrat)]",
                                                                children: apt.userName || "Unknown"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                                lineNumber: 450,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-[#888888] font-[family-name:var(--font-montserrat)]",
                                                                children: [
                                                                    typeLabels[apt.type],
                                                                    " • ",
                                                                    apt.userPhone
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                                lineNumber: 453,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                        lineNumber: 449,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                lineNumber: 443,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `px-2 py-1 text-xs border ${statusColors[apt.status]} font-[family-name:var(--font-montserrat)]`,
                                                children: apt.status
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                lineNumber: 458,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, apt.id, true, {
                                        fileName: "[project]/src/app/admin/appointments/page.tsx",
                                        lineNumber: 438,
                                        columnNumber: 23
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/appointments/page.tsx",
                                lineNumber: 434,
                                columnNumber: 17
                            }, this)
                        ]
                    }, date, true, {
                        fileName: "[project]/src/app/admin/appointments/page.tsx",
                        lineNumber: 427,
                        columnNumber: 15
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/admin/appointments/page.tsx",
                lineNumber: 423,
                columnNumber: 9
            }, this),
            showNewForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-[#111111] border border-[#1a1a1a] w-full max-w-lg max-h-[90vh] overflow-y-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "sticky top-0 bg-[#111111] border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between z-10",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]",
                                    children: "Schedule Appointment"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                    lineNumber: 476,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setShowNewForm(false);
                                        setCustomerLookup(null);
                                        setNewAppointment({
                                            customerPhone: "",
                                            customerName: "",
                                            type: "consultation",
                                            date: "",
                                            timeSlot: "",
                                            notes: ""
                                        });
                                    },
                                    className: "text-[#888888] hover:text-[#f5f5f5]",
                                    children: "✕"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                    lineNumber: 479,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                            lineNumber: 475,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]",
                                                    children: "Customer Phone *"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                    lineNumber: 502,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "tel",
                                                            value: newAppointment.customerPhone,
                                                            onChange: (e)=>handlePhoneLookup(e.target.value),
                                                            className: "w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none",
                                                            placeholder: "08012345678"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                            lineNumber: 506,
                                                            columnNumber: 21
                                                        }, this),
                                                        lookingUp && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "absolute right-3 top-1/2 -translate-y-1/2",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-4 h-4 border-2 border-[#c9a962] border-t-transparent rounded-full animate-spin"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                                lineNumber: 515,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                            lineNumber: 514,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                    lineNumber: 505,
                                                    columnNumber: 19
                                                }, this),
                                                customerLookup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-green-400 mt-1 font-[family-name:var(--font-montserrat)]",
                                                    children: [
                                                        "✓ Existing customer: ",
                                                        customerLookup.name || customerLookup.phone
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                    lineNumber: 520,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                            lineNumber: 501,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]",
                                                    children: [
                                                        "Customer Name ",
                                                        !customerLookup && "*"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                    lineNumber: 527,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: newAppointment.customerName,
                                                    onChange: (e)=>setNewAppointment({
                                                            ...newAppointment,
                                                            customerName: e.target.value
                                                        }),
                                                    className: "w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none",
                                                    placeholder: customerLookup ? customerLookup.name || "Enter name" : "Enter customer name"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                    lineNumber: 530,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                            lineNumber: 526,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                    lineNumber: 500,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm text-[#888888] mb-3 font-[family-name:var(--font-montserrat)]",
                                            children: "Appointment Type"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                            lineNumber: 544,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-2 gap-2",
                                            children: Object.keys(typeLabels).map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>setNewAppointment({
                                                            ...newAppointment,
                                                            type
                                                        }),
                                                    className: `text-left p-3 border transition-colors ${newAppointment.type === type ? "border-[#c9a962] bg-[#c9a962]/10" : "border-[#2a2a2a] hover:border-[#3a3a3a]"}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: `text-sm font-[family-name:var(--font-montserrat)] ${newAppointment.type === type ? "text-[#c9a962]" : "text-[#f5f5f5]"}`,
                                                            children: typeLabels[type]
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                            lineNumber: 559,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[10px] text-[#888888] font-[family-name:var(--font-montserrat)] mt-1 line-clamp-2",
                                                            children: typeDescriptions[type]
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                            lineNumber: 566,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, type, true, {
                                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                    lineNumber: 549,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                            lineNumber: 547,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                    lineNumber: 543,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]",
                                            children: "Date *"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                            lineNumber: 576,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "date",
                                            value: newAppointment.date,
                                            onChange: (e)=>{
                                                setNewAppointment({
                                                    ...newAppointment,
                                                    date: e.target.value,
                                                    timeSlot: ""
                                                });
                                            },
                                            min: today,
                                            className: "w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                            lineNumber: 579,
                                            columnNumber: 17
                                        }, this),
                                        newAppointment.date && !isDateAvailable(newAppointment.date) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-red-400 text-xs mt-2 font-[family-name:var(--font-montserrat)]",
                                            children: "This date is not available. The studio is closed on this day."
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                            lineNumber: 589,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                    lineNumber: 575,
                                    columnNumber: 15
                                }, this),
                                newAppointment.date && isDateAvailable(newAppointment.date) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]",
                                            children: "Time *"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                            lineNumber: 598,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-4 gap-2",
                                            children: generateTimeSlots().map((slot)=>{
                                                const isBooked = getBookedSlots(newAppointment.date).includes(slot);
                                                const isBlocked = isTimeSlotBlocked(newAppointment.date, slot);
                                                const isUnavailable = isBooked || isBlocked;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>!isUnavailable && setNewAppointment({
                                                            ...newAppointment,
                                                            timeSlot: slot
                                                        }),
                                                    disabled: isUnavailable,
                                                    title: isBlocked ? getBlockedSlotReason(newAppointment.date, slot) : isBooked ? "Booked" : "",
                                                    className: `py-2 text-sm border font-[family-name:var(--font-montserrat)] transition-colors ${newAppointment.timeSlot === slot ? "border-[#c9a962] text-[#c9a962] bg-[#c9a962]/10" : isBlocked ? "border-orange-500/30 text-orange-400/50 bg-orange-500/10 cursor-not-allowed" : isBooked ? "border-[#1a1a1a] text-[#444444] bg-[#1a1a1a]/50 cursor-not-allowed" : "border-[#2a2a2a] text-[#888888] hover:border-[#3a3a3a]"}`,
                                                    children: [
                                                        slot,
                                                        isBlocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "block text-[9px]",
                                                            children: "Blocked"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                            lineNumber: 624,
                                                            columnNumber: 41
                                                        }, this),
                                                        isBooked && !isBlocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "block text-[9px]",
                                                            children: "Booked"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                            lineNumber: 625,
                                                            columnNumber: 54
                                                        }, this)
                                                    ]
                                                }, slot, true, {
                                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                    lineNumber: 607,
                                                    columnNumber: 25
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                            lineNumber: 601,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                    lineNumber: 597,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]",
                                            children: "Notes (optional)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                            lineNumber: 635,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            value: newAppointment.notes,
                                            onChange: (e)=>setNewAppointment({
                                                    ...newAppointment,
                                                    notes: e.target.value
                                                }),
                                            rows: 2,
                                            className: "w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none resize-none",
                                            placeholder: "Any special notes for this appointment..."
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                            lineNumber: 638,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                    lineNumber: 634,
                                    columnNumber: 15
                                }, this),
                                newAppointment.date && newAppointment.timeSlot && newAppointment.customerPhone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-[#0a0a0a] p-4 border border-[#1a1a1a]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-[#666666] mb-2 font-[family-name:var(--font-montserrat)]",
                                            children: "Appointment Summary"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                            lineNumber: 652,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[#f5f5f5] font-[family-name:var(--font-montserrat)]",
                                                    children: typeLabels[newAppointment.type]
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                    lineNumber: 656,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-[#888888] font-[family-name:var(--font-montserrat)]",
                                                    children: [
                                                        formatDateDisplay(newAppointment.date),
                                                        " at ",
                                                        newAppointment.timeSlot
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                    lineNumber: 659,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-[#888888] font-[family-name:var(--font-montserrat)]",
                                                    children: [
                                                        newAppointment.customerName || customerLookup?.name || "Unknown",
                                                        " • ",
                                                        newAppointment.customerPhone
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                    lineNumber: 662,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                            lineNumber: 655,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                    lineNumber: 651,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-4 pt-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                setShowNewForm(false);
                                                setCustomerLookup(null);
                                                setNewAppointment({
                                                    customerPhone: "",
                                                    customerName: "",
                                                    type: "consultation",
                                                    date: "",
                                                    timeSlot: "",
                                                    notes: ""
                                                });
                                            },
                                            className: "flex-1 border border-[#2a2a2a] text-[#888888] py-2 font-[family-name:var(--font-montserrat)] hover:border-[#3a3a3a] hover:text-[#f5f5f5] transition-colors",
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                            lineNumber: 671,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleCreateAppointment,
                                            disabled: saving || !newAppointment.customerPhone || !newAppointment.date || !newAppointment.timeSlot || !isDateAvailable(newAppointment.date),
                                            className: "flex-1 bg-[#c9a962] text-[#0a0a0a] py-2 font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors disabled:opacity-50",
                                            children: saving ? "Scheduling..." : "Schedule Appointment"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                            lineNumber: 688,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                    lineNumber: 670,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                            lineNumber: 498,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                    lineNumber: 474,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/admin/appointments/page.tsx",
                lineNumber: 473,
                columnNumber: 9
            }, this),
            selectedAppointment && !showRescheduleModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-[#111111] border border-[#1a1a1a] w-full max-w-md",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]",
                                    children: "Appointment Details"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                    lineNumber: 712,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setSelectedAppointment(null),
                                    className: "text-[#888888] hover:text-[#f5f5f5]",
                                    children: "✕"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                    lineNumber: 715,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                            lineNumber: 711,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]",
                                            children: "Status"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                            lineNumber: 726,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-2",
                                            children: [
                                                "pending",
                                                "confirmed",
                                                "completed",
                                                "cancelled"
                                            ].map((status)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleUpdateStatus(selectedAppointment.id, status),
                                                    className: `px-3 py-1 text-xs border font-[family-name:var(--font-montserrat)] transition-colors ${selectedAppointment.status === status ? statusColors[status] : "border-[#2a2a2a] text-[#888888] hover:border-[#3a3a3a]"}`,
                                                    children: status.charAt(0).toUpperCase() + status.slice(1)
                                                }, status, false, {
                                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                    lineNumber: 731,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                            lineNumber: 729,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                    lineNumber: 725,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-[#0a0a0a] p-4 border border-[#1a1a1a] space-y-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-[#666666] font-[family-name:var(--font-montserrat)]",
                                                    children: "Customer"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                    lineNumber: 749,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[#f5f5f5] font-[family-name:var(--font-montserrat)]",
                                                    children: selectedAppointment.userName || "Unknown"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                    lineNumber: 752,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: `tel:${selectedAppointment.userPhone}`,
                                                    className: "text-sm text-[#c9a962] font-[family-name:var(--font-montserrat)] hover:underline",
                                                    children: selectedAppointment.userPhone
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                    lineNumber: 755,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                            lineNumber: 748,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-[#666666] font-[family-name:var(--font-montserrat)]",
                                                    children: "Type"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                    lineNumber: 764,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[#f5f5f5] font-[family-name:var(--font-montserrat)]",
                                                    children: typeLabels[selectedAppointment.type]
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                    lineNumber: 767,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                            lineNumber: 763,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-[#666666] font-[family-name:var(--font-montserrat)]",
                                                    children: "Date & Time"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                    lineNumber: 773,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[#f5f5f5] font-[family-name:var(--font-montserrat)]",
                                                    children: [
                                                        formatDateDisplay(selectedAppointment.date),
                                                        " at",
                                                        " ",
                                                        selectedAppointment.timeSlot
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                    lineNumber: 776,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                            lineNumber: 772,
                                            columnNumber: 17
                                        }, this),
                                        selectedAppointment.notes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-[#666666] font-[family-name:var(--font-montserrat)]",
                                                    children: "Notes"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                    lineNumber: 784,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)]",
                                                    children: selectedAppointment.notes
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                    lineNumber: 787,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                            lineNumber: 783,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                    lineNumber: 747,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: `https://wa.me/${selectedAppointment.userPhone.replace(/[^0-9]/g, "")}`,
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            className: "flex-1 flex items-center justify-center gap-2 border border-[#2a2a2a] text-[#888888] py-2 text-sm font-[family-name:var(--font-montserrat)] hover:border-[#c9a962] hover:text-[#c9a962] transition-colors",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "w-4 h-4",
                                                    fill: "currentColor",
                                                    viewBox: "0 0 24 24",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                        lineNumber: 803,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                    lineNumber: 802,
                                                    columnNumber: 19
                                                }, this),
                                                "WhatsApp"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                            lineNumber: 796,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: openRescheduleModal,
                                            className: "flex-1 border border-[#2a2a2a] text-[#888888] py-2 text-sm font-[family-name:var(--font-montserrat)] hover:border-[#c9a962] hover:text-[#c9a962] transition-colors",
                                            children: "Reschedule"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                            lineNumber: 807,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                    lineNumber: 795,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleDelete(selectedAppointment.id),
                                    className: "w-full text-red-400 text-sm font-[family-name:var(--font-montserrat)] hover:text-red-300",
                                    children: "Delete Appointment"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                    lineNumber: 816,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                            lineNumber: 723,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                    lineNumber: 710,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/admin/appointments/page.tsx",
                lineNumber: 709,
                columnNumber: 9
            }, this),
            showRescheduleModal && selectedAppointment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-[#111111] border border-[#1a1a1a] w-full max-w-md max-h-[90vh] overflow-y-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "sticky top-0 bg-[#111111] border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between z-10",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]",
                                    children: "Reschedule Appointment"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                    lineNumber: 832,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setShowRescheduleModal(false);
                                        setRescheduleDate("");
                                        setRescheduleTime("");
                                    },
                                    className: "text-[#888888] hover:text-[#f5f5f5]",
                                    children: "✕"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                    lineNumber: 835,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                            lineNumber: 831,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-[#0a0a0a] p-4 border border-[#1a1a1a]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-[#666666] mb-1 font-[family-name:var(--font-montserrat)]",
                                            children: "Current Schedule"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                            lineNumber: 849,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[#f5f5f5] font-[family-name:var(--font-montserrat)]",
                                            children: [
                                                formatDateDisplay(selectedAppointment.date),
                                                " at ",
                                                selectedAppointment.timeSlot
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                            lineNumber: 852,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                    lineNumber: 848,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]",
                                            children: "New Date"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                            lineNumber: 859,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "date",
                                            value: rescheduleDate,
                                            onChange: (e)=>{
                                                setRescheduleDate(e.target.value);
                                                setRescheduleTime("");
                                            },
                                            min: today,
                                            className: "w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                            lineNumber: 862,
                                            columnNumber: 17
                                        }, this),
                                        rescheduleDate && !isDateAvailable(rescheduleDate) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-red-400 text-xs mt-2 font-[family-name:var(--font-montserrat)]",
                                            children: "This date is not available."
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                            lineNumber: 873,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                    lineNumber: 858,
                                    columnNumber: 15
                                }, this),
                                rescheduleDate && isDateAvailable(rescheduleDate) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]",
                                            children: "New Time"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                            lineNumber: 882,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-4 gap-2",
                                            children: generateTimeSlots().map((slot)=>{
                                                const isBooked = getBookedSlots(rescheduleDate).includes(slot) && !(rescheduleDate === selectedAppointment.date && slot === selectedAppointment.timeSlot);
                                                const isBlocked = isTimeSlotBlocked(rescheduleDate, slot);
                                                const isUnavailable = isBooked || isBlocked;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>!isUnavailable && setRescheduleTime(slot),
                                                    disabled: isUnavailable,
                                                    title: isBlocked ? getBlockedSlotReason(rescheduleDate, slot) : "",
                                                    className: `py-2 text-sm border font-[family-name:var(--font-montserrat)] transition-colors ${rescheduleTime === slot ? "border-[#c9a962] text-[#c9a962] bg-[#c9a962]/10" : isBlocked ? "border-orange-500/30 text-orange-400/50 bg-orange-500/10 cursor-not-allowed" : isBooked ? "border-[#1a1a1a] text-[#444444] bg-[#1a1a1a]/50 cursor-not-allowed" : "border-[#2a2a2a] text-[#888888] hover:border-[#3a3a3a]"}`,
                                                    children: slot
                                                }, slot, false, {
                                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                                    lineNumber: 892,
                                                    columnNumber: 25
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                            lineNumber: 885,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                    lineNumber: 881,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-4 pt-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                setShowRescheduleModal(false);
                                                setRescheduleDate("");
                                                setRescheduleTime("");
                                            },
                                            className: "flex-1 border border-[#2a2a2a] text-[#888888] py-2 font-[family-name:var(--font-montserrat)] hover:border-[#3a3a3a] hover:text-[#f5f5f5] transition-colors",
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                            lineNumber: 918,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleReschedule,
                                            disabled: !rescheduleDate || !rescheduleTime || !isDateAvailable(rescheduleDate),
                                            className: "flex-1 bg-[#c9a962] text-[#0a0a0a] py-2 font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors disabled:opacity-50",
                                            children: "Confirm Reschedule"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                                            lineNumber: 928,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                                    lineNumber: 917,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/admin/appointments/page.tsx",
                            lineNumber: 847,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/admin/appointments/page.tsx",
                    lineNumber: 830,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/admin/appointments/page.tsx",
                lineNumber: 829,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/admin/appointments/page.tsx",
        lineNumber: 370,
        columnNumber: 5
    }, this);
}
_s(AdminAppointmentsPage, "WZiiQkHnneYFsrzUCnL8Am55gso=");
_c = AdminAppointmentsPage;
var _c;
__turbopack_context__.k.register(_c, "AdminAppointmentsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_admin_appointments_page_tsx_8d8feffe._.js.map