// Phone number formatting utilities for Nigerian numbers

// Format phone number to standard format (+234XXXXXXXXXX)
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  let digits = phone.replace(/\D/g, "");

  // Handle Nigerian numbers
  if (digits.startsWith("0")) {
    digits = "234" + digits.slice(1);
  } else if (!digits.startsWith("234")) {
    digits = "234" + digits;
  }

  return "+" + digits;
}

// Format phone for display (without + sign)
export function formatPhoneForDisplay(phone: string): string {
  return phone.replace(/\+/g, "");
}

// Validate Nigerian phone number
export function isValidNigerianPhone(phone: string): boolean {
  const formatted = formatPhoneNumber(phone);
  // Nigerian phone numbers should be +234 followed by 10 digits
  return /^\+234[0-9]{10}$/.test(formatted);
}
