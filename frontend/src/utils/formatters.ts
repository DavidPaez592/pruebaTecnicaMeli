// Formatear precio con separador de miles
export function formatPrice(amount: number): string {
  return amount.toLocaleString('es-AR');
}

// Formatear moneda
export function formatCurrency(currency: string): string {
  const symbols: Record<string, string> = {
    ARS: '$',
    USD: 'US$',
    BRL: 'R$',
  };
  return symbols[currency] || currency;
}

// Formatear precio completo
export function formatFullPrice(currency: string, amount: number): string {
  return `${formatCurrency(currency)} ${formatPrice(amount)}`;
}

// Calcular porcentaje de descuento
export function calculateDiscount(
  regularAmount: number | null,
  amount: number
): number | null {
  if (!regularAmount || regularAmount <= amount) return null;
  return Math.round(((regularAmount - amount) / regularAmount) * 100);
}

// Truncar texto
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

