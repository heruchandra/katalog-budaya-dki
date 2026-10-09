/**
 * WhatsApp digits in international form (62…) from a phone string: "0859-3983-6744", "+62 859 3983 6744" or
 * "859 3983 6744". A string holding several numbers ("0813… / 0859…") yields the first one, never the digits of
 * both run together. Empty when there is no usable number.
 */
export function toWaNumber(phone?: string) {
  const digits =
    (phone || "")
      .split(/[\/,;|]|\s(?:dan|atau|or)\s/i)
      .map((part) => part.replace(/\D/g, ""))
      .find((d) => d.length >= 9) ?? "";
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("8")) return `62${digits}`;
  return digits;
}
