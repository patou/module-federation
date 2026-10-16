const currency = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const date = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: "UTC" });

export function formatCurrency(amount: number): string {
  return currency.format(amount);
}

export function formatDate(isoDate: string): string {
  return date.format(new Date(`${isoDate}T00:00:00Z`));
}
