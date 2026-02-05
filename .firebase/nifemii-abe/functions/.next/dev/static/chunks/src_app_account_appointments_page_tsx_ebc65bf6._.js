(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/account/appointments/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CustomerAppointmentsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
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
    consultation: "Discuss your style ideas and get expert recommendations",
    fitting: "Try on your outfit and make any necessary adjustments",
    pickup: "Collect your completed order from the studio",
    "fabric-dropoff": "Bring your fabric for a sew-only order"
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
function CustomerAppointmentsPage() {
    _s();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [appointments, setAppointments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [availability, setAvailability] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultAvailability);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showBookingModal, setShowBookingModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Booking form
    const [bookingType, setBookingType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("consultation");
    const [bookingDate, setBookingDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [bookingTime, setBookingTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [bookingNotes, setBookingNotes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    // Cancel/Reschedule state
    const [selectedAppointment, setSelectedAppointment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showCancelConfirm, setShowCancelConfirm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showRescheduleModal, setShowRescheduleModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [rescheduleDate, setRescheduleDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [rescheduleTime, setRescheduleTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [actionLoading, setActionLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CustomerAppointmentsPage.useEffect": ()=>{
            if (!user?.phone) return;
            // Fetch appointments
            const appointmentsQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], "appointments"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])("userPhone", "==", user.phone), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["orderBy"])("date", "desc"));
            const unsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onSnapshot"])(appointmentsQuery, {
                "CustomerAppointmentsPage.useEffect.unsubscribe": (snapshot)=>{
                    const appointmentsData = snapshot.docs.map({
                        "CustomerAppointmentsPage.useEffect.unsubscribe.appointmentsData": (docSnap)=>{
                            const data = docSnap.data();
                            return {
                                id: docSnap.id,
                                ...data,
                                createdAt: data.createdAt?.toDate() || new Date()
                            };
                        }
                    }["CustomerAppointmentsPage.useEffect.unsubscribe.appointmentsData"]);
                    setAppointments(appointmentsData);
                    setLoading(false);
                }
            }["CustomerAppointmentsPage.useEffect.unsubscribe"]);
            return ({
                "CustomerAppointmentsPage.useEffect": ()=>unsubscribe()
            })["CustomerAppointmentsPage.useEffect"];
        }
    }["CustomerAppointmentsPage.useEffect"], [
        user?.phone
    ]);
    // Fetch availability settings with real-time updates
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CustomerAppointmentsPage.useEffect": ()=>{
            const unsubSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onSnapshot"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], "settings", "main"), {
                "CustomerAppointmentsPage.useEffect.unsubSettings": (docSnap)=>{
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        if (data.availability) {
                            // Merge with defaults to ensure all fields exist
                            setAvailability({
                                ...defaultAvailability,
                                ...data.availability,
                                blockedTimeSlots: data.availability.blockedTimeSlots || []
                            });
                        }
                    }
                }
            }["CustomerAppointmentsPage.useEffect.unsubSettings"]);
            return ({
                "CustomerAppointmentsPage.useEffect": ()=>unsubSettings()
            })["CustomerAppointmentsPage.useEffect"];
        }
    }["CustomerAppointmentsPage.useEffect"], []);
    // Fetch all appointments for checking booked slots
    const [allAppointments, setAllAppointments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CustomerAppointmentsPage.useEffect": ()=>{
            // Fetch all non-cancelled appointments to check for booked slots
            const allAppointmentsQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], "appointments"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])("status", "in", [
                "pending",
                "confirmed",
                "rescheduled"
            ]));
            const unsubAllAppointments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onSnapshot"])(allAppointmentsQuery, {
                "CustomerAppointmentsPage.useEffect.unsubAllAppointments": (snapshot)=>{
                    const appointmentsData = snapshot.docs.map({
                        "CustomerAppointmentsPage.useEffect.unsubAllAppointments.appointmentsData": (docSnap)=>({
                                id: docSnap.id,
                                ...docSnap.data()
                            })
                    }["CustomerAppointmentsPage.useEffect.unsubAllAppointments.appointmentsData"]);
                    setAllAppointments(appointmentsData);
                }
            }["CustomerAppointmentsPage.useEffect.unsubAllAppointments"]);
            return ({
                "CustomerAppointmentsPage.useEffect": ()=>unsubAllAppointments()
            })["CustomerAppointmentsPage.useEffect"];
        }
    }["CustomerAppointmentsPage.useEffect"], []);
    const generateTimeSlots = ()=>{
        const slots = [];
        const [startHour, startMin] = availability.workingHours.start.split(":").map(Number);
        const [endHour, endMin] = availability.workingHours.end.split(":").map(Number);
        const duration = availability.slotDuration;
        let currentTime = startHour * 60 + startMin;
        const endTime = endHour * 60 + endMin;
        while(currentTime < endTime){
            const hours = Math.floor(currentTime / 60);
            const mins = currentTime % 60;
            slots.push(`${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`);
            currentTime += duration;
        }
        return slots;
    };
    // Check if a specific time slot is blocked by admin on a given date
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
    // Check if a time slot is already booked by someone
    const isTimeSlotBooked = (dateStr, timeSlot, excludeAppointmentId)=>{
        return allAppointments.some((apt)=>{
            if (excludeAppointmentId && apt.id === excludeAppointmentId) return false;
            return apt.date === dateStr && apt.timeSlot === timeSlot;
        });
    };
    // Check if a time slot is unavailable (blocked OR booked)
    const isTimeSlotUnavailable = (dateStr, timeSlot, excludeAppointmentId)=>{
        return isTimeSlotBlocked(dateStr, timeSlot) || isTimeSlotBooked(dateStr, timeSlot, excludeAppointmentId);
    };
    // Get available time slots for a given date (excluding blocked and booked slots)
    const getAvailableTimeSlots = (dateStr, excludeAppointmentId)=>{
        const allSlots = generateTimeSlots();
        return allSlots.filter((slot)=>!isTimeSlotUnavailable(dateStr, slot, excludeAppointmentId));
    };
    const isDateAvailable = (dateStr)=>{
        const date = new Date(dateStr);
        const dayName = date.toLocaleDateString("en-US", {
            weekday: "long"
        }).toLowerCase();
        // Check if it's a working day
        if (!availability.workingDays.includes(dayName)) return false;
        // Check if it's blocked
        if (availability.blockedDates.includes(dateStr)) return false;
        return true;
    };
    const handleBookAppointment = async ()=>{
        if (!user?.phone || !bookingDate || !bookingTime) return;
        setSaving(true);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], "appointments"), {
                userId: user.id,
                userPhone: user.phone,
                userName: user.name || null,
                type: bookingType,
                date: bookingDate,
                timeSlot: bookingTime,
                status: "pending",
                notes: bookingNotes || null,
                createdBy: "customer",
                createdAt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Timestamp"].now()
            });
            setShowBookingModal(false);
            setBookingType("consultation");
            setBookingDate("");
            setBookingTime("");
            setBookingNotes("");
        } catch (error) {
            console.error("Error booking appointment:", error);
        } finally{
            setSaving(false);
        }
    };
    const formatDateDisplay = (dateStr)=>{
        return new Date(dateStr).toLocaleDateString("en-NG", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    };
    const upcomingAppointments = appointments.filter((a)=>new Date(a.date) >= new Date() && ![
            "cancelled",
            "completed"
        ].includes(a.status));
    const pastAppointments = appointments.filter((a)=>new Date(a.date) < new Date() || [
            "cancelled",
            "completed"
        ].includes(a.status));
    const canModifyAppointment = (apt)=>{
        // Can only cancel/reschedule pending or confirmed appointments
        return [
            "pending",
            "confirmed"
        ].includes(apt.status);
    };
    const handleCancelAppointment = async ()=>{
        if (!selectedAppointment) return;
        setActionLoading(true);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], "appointments", selectedAppointment.id), {
                status: "cancelled",
                updatedAt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Timestamp"].now()
            });
            setShowCancelConfirm(false);
            setSelectedAppointment(null);
        } catch (error) {
            console.error("Error cancelling appointment:", error);
        } finally{
            setActionLoading(false);
        }
    };
    const handleRescheduleAppointment = async ()=>{
        if (!selectedAppointment || !rescheduleDate || !rescheduleTime) return;
        setActionLoading(true);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], "appointments", selectedAppointment.id), {
                date: rescheduleDate,
                timeSlot: rescheduleTime,
                status: "pending",
                updatedAt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Timestamp"].now()
            });
            setShowRescheduleModal(false);
            setSelectedAppointment(null);
            setRescheduleDate("");
            setRescheduleTime("");
        } catch (error) {
            console.error("Error rescheduling appointment:", error);
        } finally{
            setActionLoading(false);
        }
    };
    const openRescheduleModal = (apt)=>{
        setSelectedAppointment(apt);
        setRescheduleDate(apt.date);
        setRescheduleTime(apt.timeSlot);
        setShowRescheduleModal(true);
    };
    const openCancelConfirm = (apt)=>{
        setSelectedAppointment(apt);
        setShowCancelConfirm(true);
    };
    // Generate minimum date (today)
    const today = new Date().toISOString().split("T")[0];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-2xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]",
                                    children: "Appointments"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/account/appointments/page.tsx",
                                    lineNumber: 320,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[#888888] text-sm font-[family-name:var(--font-montserrat)]",
                                    children: "Schedule and manage your appointments"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/account/appointments/page.tsx",
                                    lineNumber: 323,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/account/appointments/page.tsx",
                            lineNumber: 319,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setShowBookingModal(true),
                            className: "bg-[#c9a962] text-[#0a0a0a] px-4 py-2 text-sm font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors",
                            children: "Book Appointment"
                        }, void 0, false, {
                            fileName: "[project]/src/app/account/appointments/page.tsx",
                            lineNumber: 327,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/account/appointments/page.tsx",
                    lineNumber: 318,
                    columnNumber: 9
                }, this),
                loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center h-64",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-[#888888]",
                        children: "Loading appointments..."
                    }, void 0, false, {
                        fileName: "[project]/src/app/account/appointments/page.tsx",
                        lineNumber: 337,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/account/appointments/page.tsx",
                    lineNumber: 336,
                    columnNumber: 11
                }, this) : appointments.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-[#111111] border border-[#1a1a1a] p-12 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-16 h-16 text-[#2a2a2a] mx-auto mb-4",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 1,
                                d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            }, void 0, false, {
                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                lineNumber: 347,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/account/appointments/page.tsx",
                            lineNumber: 341,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[#888888] font-[family-name:var(--font-montserrat)] mb-4",
                            children: "No appointments scheduled"
                        }, void 0, false, {
                            fileName: "[project]/src/app/account/appointments/page.tsx",
                            lineNumber: 354,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setShowBookingModal(true),
                            className: "inline-block bg-[#c9a962] text-[#0a0a0a] px-6 py-2 font-[family-name:var(--font-montserrat)] text-sm uppercase tracking-wider hover:bg-[#d4b87a] transition-colors",
                            children: "Book Your First Appointment"
                        }, void 0, false, {
                            fileName: "[project]/src/app/account/appointments/page.tsx",
                            lineNumber: 357,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/account/appointments/page.tsx",
                    lineNumber: 340,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-8",
                    children: [
                        upcomingAppointments.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-4",
                                    children: [
                                        "Upcoming (",
                                        upcomingAppointments.length,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/account/appointments/page.tsx",
                                    lineNumber: 369,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4",
                                    children: upcomingAppointments.map((apt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-[#111111] border border-[#1a1a1a] p-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-start gap-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-center bg-[#0a0a0a] p-3 border border-[#1a1a1a]",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-2xl text-[#c9a962] font-[family-name:var(--font-cormorant)]",
                                                                        children: new Date(apt.date).getDate()
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/account/appointments/page.tsx",
                                                                        lineNumber: 381,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs text-[#888888] font-[family-name:var(--font-montserrat)] uppercase",
                                                                        children: new Date(apt.date).toLocaleDateString("en-US", {
                                                                            month: "short"
                                                                        })
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/account/appointments/page.tsx",
                                                                        lineNumber: 384,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                                lineNumber: 380,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-[#f5f5f5] font-[family-name:var(--font-montserrat)]",
                                                                        children: typeLabels[apt.type]
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/account/appointments/page.tsx",
                                                                        lineNumber: 389,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm text-[#888888] font-[family-name:var(--font-montserrat)]",
                                                                        children: [
                                                                            apt.timeSlot,
                                                                            " •",
                                                                            " ",
                                                                            new Date(apt.date).toLocaleDateString("en-NG", {
                                                                                weekday: "long"
                                                                            })
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/account/appointments/page.tsx",
                                                                        lineNumber: 392,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    apt.notes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm text-[#666666] mt-1 font-[family-name:var(--font-montserrat)]",
                                                                        children: [
                                                                            "Note: ",
                                                                            apt.notes
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/account/appointments/page.tsx",
                                                                        lineNumber: 399,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                                lineNumber: 388,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/account/appointments/page.tsx",
                                                        lineNumber: 379,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `px-3 py-1 text-xs border ${statusColors[apt.status]} font-[family-name:var(--font-montserrat)]`,
                                                                children: apt.status
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                                lineNumber: 406,
                                                                columnNumber: 27
                                                            }, this),
                                                            canModifyAppointment(apt) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>openRescheduleModal(apt),
                                                                        className: "text-[#c9a962] text-sm font-[family-name:var(--font-montserrat)] hover:underline",
                                                                        children: "Reschedule"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/account/appointments/page.tsx",
                                                                        lineNumber: 413,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>openCancelConfirm(apt),
                                                                        className: "text-red-400 text-sm font-[family-name:var(--font-montserrat)] hover:underline",
                                                                        children: "Cancel"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/account/appointments/page.tsx",
                                                                        lineNumber: 419,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                                lineNumber: 412,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/account/appointments/page.tsx",
                                                        lineNumber: 405,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                lineNumber: 378,
                                                columnNumber: 23
                                            }, this)
                                        }, apt.id, false, {
                                            fileName: "[project]/src/app/account/appointments/page.tsx",
                                            lineNumber: 374,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/account/appointments/page.tsx",
                                    lineNumber: 372,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/account/appointments/page.tsx",
                            lineNumber: 368,
                            columnNumber: 15
                        }, this),
                        pastAppointments.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-4",
                                    children: "Past Appointments"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/account/appointments/page.tsx",
                                    lineNumber: 438,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-[#111111] border border-[#1a1a1a] divide-y divide-[#1a1a1a]",
                                    children: pastAppointments.map((apt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[#f5f5f5] font-[family-name:var(--font-montserrat)]",
                                                                children: typeLabels[apt.type]
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                                lineNumber: 446,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[#888888] text-sm ml-3 font-[family-name:var(--font-montserrat)]",
                                                                children: [
                                                                    formatDateDisplay(apt.date),
                                                                    " at ",
                                                                    apt.timeSlot
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                                lineNumber: 449,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/account/appointments/page.tsx",
                                                        lineNumber: 445,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `px-2 py-0.5 text-xs border ${statusColors[apt.status]} font-[family-name:var(--font-montserrat)]`,
                                                        children: apt.status
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/account/appointments/page.tsx",
                                                        lineNumber: 453,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                lineNumber: 444,
                                                columnNumber: 23
                                            }, this)
                                        }, apt.id, false, {
                                            fileName: "[project]/src/app/account/appointments/page.tsx",
                                            lineNumber: 443,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/account/appointments/page.tsx",
                                    lineNumber: 441,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/account/appointments/page.tsx",
                            lineNumber: 437,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/account/appointments/page.tsx",
                    lineNumber: 365,
                    columnNumber: 11
                }, this),
                showBookingModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-[#111111] border border-[#1a1a1a] w-full max-w-md max-h-[90vh] overflow-y-auto",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "sticky top-0 bg-[#111111] border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]",
                                        children: "Book Appointment"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/account/appointments/page.tsx",
                                        lineNumber: 472,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowBookingModal(false),
                                        className: "text-[#888888] hover:text-[#f5f5f5]",
                                        children: "✕"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/account/appointments/page.tsx",
                                        lineNumber: 475,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                lineNumber: 471,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-6 space-y-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm text-[#888888] mb-3 font-[family-name:var(--font-montserrat)]",
                                                children: "What do you need?"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                lineNumber: 486,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2",
                                                children: Object.keys(typeLabels).map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setBookingType(type),
                                                        className: `w-full text-left p-3 border transition-colors ${bookingType === type ? "border-[#c9a962] bg-[#c9a962]/10" : "border-[#2a2a2a] hover:border-[#3a3a3a]"}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: `font-[family-name:var(--font-montserrat)] ${bookingType === type ? "text-[#c9a962]" : "text-[#f5f5f5]"}`,
                                                                children: typeLabels[type]
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                                lineNumber: 500,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-[#888888] font-[family-name:var(--font-montserrat)] mt-1",
                                                                children: typeDescriptions[type]
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                                lineNumber: 507,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, type, true, {
                                                        fileName: "[project]/src/app/account/appointments/page.tsx",
                                                        lineNumber: 491,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                lineNumber: 489,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/account/appointments/page.tsx",
                                        lineNumber: 485,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]",
                                                children: "Select Date"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                lineNumber: 517,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "date",
                                                value: bookingDate,
                                                onChange: (e)=>{
                                                    setBookingDate(e.target.value);
                                                    setBookingTime(""); // Reset time when date changes
                                                },
                                                min: today,
                                                className: "w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                lineNumber: 520,
                                                columnNumber: 19
                                            }, this),
                                            bookingDate && !isDateAvailable(bookingDate) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-red-400 text-xs mt-2 font-[family-name:var(--font-montserrat)]",
                                                children: "This date is not available. Please select another date."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                lineNumber: 531,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/account/appointments/page.tsx",
                                        lineNumber: 516,
                                        columnNumber: 17
                                    }, this),
                                    bookingDate && isDateAvailable(bookingDate) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]",
                                                children: "Select Time"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                lineNumber: 540,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-4 gap-2",
                                                children: generateTimeSlots().map((slot)=>{
                                                    const isBlocked = isTimeSlotBlocked(bookingDate, slot);
                                                    const isBooked = isTimeSlotBooked(bookingDate, slot);
                                                    const isUnavailable = isBlocked || isBooked;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>!isUnavailable && setBookingTime(slot),
                                                        disabled: isUnavailable,
                                                        className: `py-2 text-sm border font-[family-name:var(--font-montserrat)] transition-colors ${isUnavailable ? "border-[#1a1a1a] text-[#444444] bg-[#1a1a1a] cursor-not-allowed" : bookingTime === slot ? "border-[#c9a962] text-[#c9a962] bg-[#c9a962]/10" : "border-[#2a2a2a] text-[#888888] hover:border-[#3a3a3a]"}`,
                                                        children: [
                                                            slot,
                                                            isBooked && !isBlocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "block text-[9px]",
                                                                children: "Booked"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                                lineNumber: 562,
                                                                columnNumber: 56
                                                            }, this),
                                                            isBlocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "block text-[9px]",
                                                                children: "Unavailable"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                                lineNumber: 563,
                                                                columnNumber: 43
                                                            }, this)
                                                        ]
                                                    }, slot, true, {
                                                        fileName: "[project]/src/app/account/appointments/page.tsx",
                                                        lineNumber: 549,
                                                        columnNumber: 27
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                lineNumber: 543,
                                                columnNumber: 21
                                            }, this),
                                            getAvailableTimeSlots(bookingDate).length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-orange-400 text-xs mt-2 font-[family-name:var(--font-montserrat)]",
                                                children: "No available time slots on this date. Please select another date."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                lineNumber: 569,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/account/appointments/page.tsx",
                                        lineNumber: 539,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]",
                                                children: "Additional Notes (optional)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                lineNumber: 578,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                value: bookingNotes,
                                                onChange: (e)=>setBookingNotes(e.target.value),
                                                rows: 2,
                                                className: "w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none resize-none",
                                                placeholder: "Any special requests or notes..."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                lineNumber: 581,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/account/appointments/page.tsx",
                                        lineNumber: 577,
                                        columnNumber: 17
                                    }, this),
                                    bookingDate && bookingTime && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-[#0a0a0a] p-4 border border-[#1a1a1a]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-[#666666] mb-2 font-[family-name:var(--font-montserrat)]",
                                                children: "Your Appointment"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                lineNumber: 593,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[#f5f5f5] font-[family-name:var(--font-montserrat)]",
                                                children: typeLabels[bookingType]
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                lineNumber: 596,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-[#888888] font-[family-name:var(--font-montserrat)]",
                                                children: [
                                                    formatDateDisplay(bookingDate),
                                                    " at ",
                                                    bookingTime
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                lineNumber: 599,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/account/appointments/page.tsx",
                                        lineNumber: 592,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-4 pt-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowBookingModal(false),
                                                className: "flex-1 border border-[#2a2a2a] text-[#888888] py-2 font-[family-name:var(--font-montserrat)] hover:border-[#3a3a3a] hover:text-[#f5f5f5] transition-colors",
                                                children: "Cancel"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                lineNumber: 607,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleBookAppointment,
                                                disabled: saving || !bookingDate || !bookingTime || !isDateAvailable(bookingDate) || isTimeSlotUnavailable(bookingDate, bookingTime),
                                                className: "flex-1 bg-[#c9a962] text-[#0a0a0a] py-2 font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors disabled:opacity-50",
                                                children: saving ? "Booking..." : "Confirm Booking"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                lineNumber: 613,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/account/appointments/page.tsx",
                                        lineNumber: 606,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                lineNumber: 483,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/account/appointments/page.tsx",
                        lineNumber: 470,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/account/appointments/page.tsx",
                    lineNumber: 469,
                    columnNumber: 11
                }, this),
                showCancelConfirm && selectedAppointment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-[#111111] border border-[#1a1a1a] w-full max-w-sm p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-4",
                                children: "Cancel Appointment"
                            }, void 0, false, {
                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                lineNumber: 632,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[#888888] text-sm font-[family-name:var(--font-montserrat)] mb-2",
                                children: [
                                    "Are you sure you want to cancel your",
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[#f5f5f5]",
                                        children: typeLabels[selectedAppointment.type]
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/account/appointments/page.tsx",
                                        lineNumber: 637,
                                        columnNumber: 17
                                    }, this),
                                    " ",
                                    "appointment?"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                lineNumber: 635,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[#888888] text-sm font-[family-name:var(--font-montserrat)] mb-6",
                                children: [
                                    "Scheduled for",
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[#f5f5f5]",
                                        children: [
                                            formatDateDisplay(selectedAppointment.date),
                                            " at ",
                                            selectedAppointment.timeSlot
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/account/appointments/page.tsx",
                                        lineNumber: 642,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                lineNumber: 640,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setShowCancelConfirm(false);
                                            setSelectedAppointment(null);
                                        },
                                        disabled: actionLoading,
                                        className: "flex-1 border border-[#2a2a2a] text-[#f5f5f5] py-2 text-sm font-[family-name:var(--font-montserrat)] hover:bg-[#1a1a1a] transition-colors disabled:opacity-50",
                                        children: "Keep Appointment"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/account/appointments/page.tsx",
                                        lineNumber: 647,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleCancelAppointment,
                                        disabled: actionLoading,
                                        className: "flex-1 bg-red-500 text-white py-2 text-sm font-[family-name:var(--font-montserrat)] hover:bg-red-600 transition-colors disabled:opacity-50",
                                        children: actionLoading ? "Cancelling..." : "Yes, Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/account/appointments/page.tsx",
                                        lineNumber: 657,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                lineNumber: 646,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/account/appointments/page.tsx",
                        lineNumber: 631,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/account/appointments/page.tsx",
                    lineNumber: 630,
                    columnNumber: 11
                }, this),
                showRescheduleModal && selectedAppointment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-[#111111] border border-[#1a1a1a] w-full max-w-md max-h-[90vh] overflow-y-auto",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "sticky top-0 bg-[#111111] border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]",
                                        children: "Reschedule Appointment"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/account/appointments/page.tsx",
                                        lineNumber: 674,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setShowRescheduleModal(false);
                                            setSelectedAppointment(null);
                                            setRescheduleDate("");
                                            setRescheduleTime("");
                                        },
                                        className: "text-[#888888] hover:text-[#f5f5f5]",
                                        children: "✕"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/account/appointments/page.tsx",
                                        lineNumber: 677,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                lineNumber: 673,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-6 space-y-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-[#0a0a0a] p-4 border border-[#1a1a1a]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-[#666666] mb-2 font-[family-name:var(--font-montserrat)]",
                                                children: "Current Appointment"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                lineNumber: 693,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[#f5f5f5] font-[family-name:var(--font-montserrat)]",
                                                children: typeLabels[selectedAppointment.type]
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                lineNumber: 696,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-[#888888] font-[family-name:var(--font-montserrat)]",
                                                children: [
                                                    formatDateDisplay(selectedAppointment.date),
                                                    " at ",
                                                    selectedAppointment.timeSlot
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                lineNumber: 699,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/account/appointments/page.tsx",
                                        lineNumber: 692,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]",
                                                children: "Select New Date"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                lineNumber: 706,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "date",
                                                value: rescheduleDate,
                                                onChange: (e)=>{
                                                    setRescheduleDate(e.target.value);
                                                    setRescheduleTime(""); // Reset time when date changes
                                                },
                                                min: today,
                                                className: "w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                lineNumber: 709,
                                                columnNumber: 19
                                            }, this),
                                            rescheduleDate && !isDateAvailable(rescheduleDate) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-red-400 text-xs mt-2 font-[family-name:var(--font-montserrat)]",
                                                children: "This date is not available. Please select another date."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                lineNumber: 720,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/account/appointments/page.tsx",
                                        lineNumber: 705,
                                        columnNumber: 17
                                    }, this),
                                    rescheduleDate && isDateAvailable(rescheduleDate) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]",
                                                children: "Select New Time"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                lineNumber: 729,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-4 gap-2",
                                                children: generateTimeSlots().map((slot)=>{
                                                    const isBlocked = isTimeSlotBlocked(rescheduleDate, slot);
                                                    const isBooked = isTimeSlotBooked(rescheduleDate, slot, selectedAppointment?.id);
                                                    const isUnavailable = isBlocked || isBooked;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>!isUnavailable && setRescheduleTime(slot),
                                                        disabled: isUnavailable,
                                                        className: `py-2 text-sm border font-[family-name:var(--font-montserrat)] transition-colors relative ${isUnavailable ? "border-[#1a1a1a] text-[#444444] bg-[#1a1a1a] cursor-not-allowed" : rescheduleTime === slot ? "border-[#c9a962] text-[#c9a962] bg-[#c9a962]/10" : "border-[#2a2a2a] text-[#888888] hover:border-[#3a3a3a]"}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: isUnavailable ? "line-through" : "",
                                                                children: slot
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                                lineNumber: 750,
                                                                columnNumber: 29
                                                            }, this),
                                                            isBooked && !isBlocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "absolute -top-1 -right-1 text-[8px] bg-orange-500/80 text-white px-1 rounded",
                                                                children: "Booked"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                                lineNumber: 752,
                                                                columnNumber: 31
                                                            }, this),
                                                            isBlocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "absolute -top-1 -right-1 text-[8px] bg-red-500/80 text-white px-1 rounded",
                                                                children: "Unavailable"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                                lineNumber: 757,
                                                                columnNumber: 31
                                                            }, this)
                                                        ]
                                                    }, slot, true, {
                                                        fileName: "[project]/src/app/account/appointments/page.tsx",
                                                        lineNumber: 738,
                                                        columnNumber: 27
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                lineNumber: 732,
                                                columnNumber: 21
                                            }, this),
                                            getAvailableTimeSlots(rescheduleDate, selectedAppointment?.id).length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-orange-400 text-xs mt-2 font-[family-name:var(--font-montserrat)]",
                                                children: "No available time slots on this date. Please select another date."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                lineNumber: 766,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/account/appointments/page.tsx",
                                        lineNumber: 728,
                                        columnNumber: 19
                                    }, this),
                                    rescheduleDate && rescheduleTime && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-[#c9a962]/10 p-4 border border-[#c9a962]/30",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-[#c9a962] mb-2 font-[family-name:var(--font-montserrat)]",
                                                children: "New Appointment"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                lineNumber: 776,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[#f5f5f5] font-[family-name:var(--font-montserrat)]",
                                                children: typeLabels[selectedAppointment.type]
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                lineNumber: 779,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-[#888888] font-[family-name:var(--font-montserrat)]",
                                                children: [
                                                    formatDateDisplay(rescheduleDate),
                                                    " at ",
                                                    rescheduleTime
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                lineNumber: 782,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/account/appointments/page.tsx",
                                        lineNumber: 775,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-4 pt-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    setShowRescheduleModal(false);
                                                    setSelectedAppointment(null);
                                                    setRescheduleDate("");
                                                    setRescheduleTime("");
                                                },
                                                disabled: actionLoading,
                                                className: "flex-1 border border-[#2a2a2a] text-[#888888] py-2 font-[family-name:var(--font-montserrat)] hover:border-[#3a3a3a] hover:text-[#f5f5f5] transition-colors disabled:opacity-50",
                                                children: "Cancel"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                lineNumber: 790,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleRescheduleAppointment,
                                                disabled: actionLoading || !rescheduleDate || !rescheduleTime || !isDateAvailable(rescheduleDate) || isTimeSlotUnavailable(rescheduleDate, rescheduleTime, selectedAppointment?.id) || rescheduleDate === selectedAppointment.date && rescheduleTime === selectedAppointment.timeSlot,
                                                className: "flex-1 bg-[#c9a962] text-[#0a0a0a] py-2 font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors disabled:opacity-50",
                                                children: actionLoading ? "Rescheduling..." : "Confirm Reschedule"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                                lineNumber: 802,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/account/appointments/page.tsx",
                                        lineNumber: 789,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/account/appointments/page.tsx",
                                lineNumber: 690,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/account/appointments/page.tsx",
                        lineNumber: 672,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/account/appointments/page.tsx",
                    lineNumber: 671,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/account/appointments/page.tsx",
            lineNumber: 317,
            columnNumber: 7
        }, this)
    }, void 0, false);
}
_s(CustomerAppointmentsPage, "viLx/HXW0qDMou4fyFlBLCKV9U0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = CustomerAppointmentsPage;
var _c;
__turbopack_context__.k.register(_c, "CustomerAppointmentsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_account_appointments_page_tsx_ebc65bf6._.js.map