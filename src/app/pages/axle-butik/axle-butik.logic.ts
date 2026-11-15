/**
 * Butikens räkning på sidan. Servern räknar om allt när ordern läggs och det är serverns summa som
 * dras på kortet; den här räkningen finns bara för att visa samma belopp medan kunden väljer.
 * Reglerna är desamma som i backend (`priceShopOrder`): varje styck avrundas till hela öre inkl.
 * moms, och momsen är skillnaden mot nettot.
 */

export interface CartLine {
	priceMinor: number;
	shippingMinor: number;
	vatRate: number;
	quantity: number;
}

export interface CartTotals {
	goodsMinor: number;
	shippingMinor: number;
	netMinor: number;
	vatMinor: number;
	totalMinor: number;
}

const gross = (net: number, vatRate: number): number => Math.round((net * (100 + vatRate)) / 100);

export function cartTotals(lines: readonly CartLine[]): CartTotals {
	let goods = 0;
	let shipping = 0;
	let total = 0;
	for (const l of lines) {
		goods += l.priceMinor * l.quantity;
		shipping += l.shippingMinor * l.quantity;
		total += (gross(l.priceMinor, l.vatRate) + gross(l.shippingMinor, l.vatRate)) * l.quantity;
	}
	const net = goods + shipping;
	return { goodsMinor: goods, shippingMinor: shipping, netMinor: net, vatMinor: total - net, totalMinor: total };
}

const WHOLE = new Intl.NumberFormat('sv-SE', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const WITH_ORE = new Intl.NumberFormat('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** 549500 -> "5 495 kr", 686875 -> "6 868,75 kr", 699250 -> "6 992,50 kr": ören alltid med två siffror. */
export function kr(minor: number): string {
	return `${(minor % 100 === 0 ? WHOLE : WITH_ORE).format(minor / 100)} kr`;
}

/** Tio siffror ur det någon skrivit ("556012-5790", "SE556012579001"), eller null. */
export function orgNoDigits(raw: string): string | null {
	const text = raw.trim();
	if (!/^[0-9A-Za-z\s-]+$/.test(text)) return null;
	const digits = text.replace(/\D/g, '');
	const vat = /^SE/i.test(text);
	let ten: string;
	if (digits.length === 10 && !vat) ten = digits;
	else if (digits.length === 12) {
		if (vat) {
			if (!digits.endsWith('01')) return null;
			ten = digits.slice(0, 10);
		} else if (/^(16|19|20)/.test(digits)) ten = digits.slice(2);
		else if (digits.endsWith('01')) ten = digits.slice(0, 10);
		else return null;
	} else return null;
	return luhn(ten) ? ten : null;
}

function luhn(digits: string): boolean {
	let sum = 0;
	for (let i = 0; i < digits.length; i++) {
		const d = Number(digits[i]) * (i % 2 === 0 ? 2 : 1);
		sum += d > 9 ? d - 9 : d;
	}
	return sum % 10 === 0;
}
