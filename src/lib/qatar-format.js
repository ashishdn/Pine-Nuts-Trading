const QATAR_TIME_ZONE = "Asia/Qatar";

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-QA", {
  style: "currency",
  currency: "QAR",
  maximumFractionDigits: 0,
});

export function formatCurrency(value) {
  return CURRENCY_FORMATTER.format(value);
}

export function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-QA", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: QATAR_TIME_ZONE,
  }).format(new Date(`${value}T12:00:00Z`));
}

export function formatDayLabel(value) {
  return new Intl.DateTimeFormat("en-QA", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: QATAR_TIME_ZONE,
  }).format(new Date(`${value}T12:00:00Z`));
}

export function getQatarDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: QATAR_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function normalizeQatarPhone(value) {
  const digits = value.replace(/\D/g, "");
  const localNumber = digits.length === 11 && digits.startsWith("974")
    ? digits.slice(3)
    : digits;

  if (!/^[3-7]\d{7}$/.test(localNumber)) return null;
  return `+974 ${localNumber.slice(0, 4)} ${localNumber.slice(4)}`;
}
