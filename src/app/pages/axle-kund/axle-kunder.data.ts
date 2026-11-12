/**
 * Kundberättelser för /apps/axle och /axle/kunder/<slug>.
 *
 * `published: false` visas bara i utvecklingsläge (så designen går att granska) och aldrig i det publicerade bygget.
 * Utkasten nedan är HITTEPÅ: påhittade personer, verkstäder och citat, bara för att visa hur sidan ser ut. De får aldrig
 * publiceras. En riktig berättelse läggs till först när kunden godkänt texten, namnet och siffrorna.
 */
export interface KundStat {
	value: string;
	label: string;
}

export interface Kund {
	slug: string;
	published: boolean;
	/** Företagets namn, visas som text tills `logo` finns. */
	name: string;
	/** Ort, t.ex. "Nacka". */
	place: string;
	/** Sökväg till logotyp under /assets/imgs/axle/kunder/. */
	logo?: string;
	person: { name: string; role: string; photo?: string };
	/** Resultatet i en mening, rubriken på kortet och sidan. */
	headline: string;
	quote: string;
	/** Högst två siffror, visas bredvid citatet. */
	stats: KundStat[];
	/** Valfri bild till kortet och sidans topp. */
	image?: string;
	/** Berättelsen i delar, i ordning. */
	sections: { title: string; text: string }[];
}

export const KUNDER: Kund[] = [
	{
		slug: 'micke',
		published: false,
		name: 'Micke',
		place: 'Verkstadschef',
		person: { name: 'Micke', role: 'Verkstadschef' },
		headline: 'Excel räckte inte längre',
		quote: 'Helt ärligt så trodde jag att jag skulle klara mig med mina gamla Excel-ark, men det här är på en helt annan nivå. Riktigt modernt och stilrent. Det absolut bästa är att man ser all försäljning direkt i samma system utan att behöva hoppa mellan olika program.',
		stats: [
			{ value: '2 min', label: 'att kalla in hela däckhotellet med SMS' },
			{ value: '1 dag', label: 'snabbare från färdig bil till skickad faktura' },
		],
		sections: [{ title: 'Berättelsen', text: 'Exempeltext.' }],
	},
	{
		slug: 'anders',
		published: false,
		name: 'Anders',
		place: 'Verkstadsägare',
		person: { name: 'Anders', role: 'Verkstadsägare' },
		headline: 'Försäljningen i samma vy',
		quote: 'Riktigt vasst system. Jag var envis med att Excel räckte gott och väl för oss, men Axle är på en helt annan nivå. Att få in försäljningen i exakt samma vy gör att vi sparar hur mycket tid som helst.',
		stats: [
			{ value: '2 min', label: 'att kalla in hela däckhotellet med SMS' },
			{ value: '1 dag', label: 'snabbare från färdig bil till skickad faktura' },
		],
		sections: [{ title: 'Berättelsen', text: 'Exempeltext.' }],
	},
	{
		slug: 'johan',
		published: false,
		name: 'Johan',
		place: 'Verkstadschef',
		person: { name: 'Johan', role: 'Verkstadschef' },
		headline: 'Stenkoll på försäljningen',
		quote: 'Modernt och sjukt smidigt. Trodde jag skulle klara mig med Excel, men oj vad fel jag hade. Det här är på en helt annan nivå. Ett stort plus är att man har stenkoll på försäljningen direkt i systemet.',
		stats: [
			{ value: '2 min', label: 'att kalla in hela däckhotellet med SMS' },
			{ value: '1 dag', label: 'snabbare från färdig bil till skickad faktura' },
		],
		sections: [{ title: 'Berättelsen', text: 'Exempeltext.' }],
	},
	{
		slug: 'martin',
		published: false,
		name: 'Martin',
		place: 'Bilförsäljning',
		person: { name: 'Martin', role: 'Bilförsäljning' },
		headline: 'Hela verksamheten knyts ihop',
		quote: 'Vi letade efter något som kunde knyta ihop hela verksamheten. Att vi nu kan se och hantera bilhallen direkt i samma system som verkstaden gjorde bara allt så sjukt mycket enklare. Inget mer dubbeljobb.',
		stats: [
			{ value: '2 min', label: 'att kalla in hela däckhotellet med SMS' },
			{ value: '1 dag', label: 'snabbare från färdig bil till skickad faktura' },
		],
		sections: [{ title: 'Berättelsen', text: 'Exempeltext.' }],
	},
	{
		slug: 'andreas',
		published: false,
		name: 'Andreas',
		place: 'Bilförsäljning',
		person: { name: 'Andreas', role: 'Bilförsäljning' },
		headline: 'Bilhallen och försäljningen i systemet',
		quote: 'Det som verkligen avgjorde för oss var att vi kan hantera bilhallen och försäljningen direkt i systemet. Det gjorde bara vardagen så mycket enklare när allt hänger ihop på ett ställe.',
		stats: [
			{ value: '2 min', label: 'att kalla in hela däckhotellet med SMS' },
			{ value: '1 dag', label: 'snabbare från färdig bil till skickad faktura' },
		],
		sections: [{ title: 'Berättelsen', text: 'Exempeltext.' }],
	},
	{
		slug: 'robin',
		published: false,
		name: 'Robin',
		place: 'Verkstadsägare',
		person: { name: 'Robin', role: 'Verkstadsägare' },
		headline: 'Verkstad och försäljning på ett ställe',
		quote: 'Grymt system för oss som kör både verkstad och försäljning. Att få in bilhallen direkt i Axle gjorde allt mycket enklare, man har full koll på hela affären.',
		stats: [
			{ value: '2 min', label: 'att kalla in hela däckhotellet med SMS' },
			{ value: '1 dag', label: 'snabbare från färdig bil till skickad faktura' },
		],
		sections: [{ title: 'Berättelsen', text: 'Exempeltext.' }],
	},
	{
		slug: 'peter',
		published: false,
		name: 'Peter',
		place: 'Verkstadschef',
		person: { name: 'Peter', role: 'Verkstadschef' },
		headline: 'Mekanikerna ser vad som ska göras',
		quote: 'Översikten är klockren. Killarna i verkstan ser precis vad som ska göras och att ha däckhotellet i samma system som arbetsordrarna tar bort allt strul.',
		stats: [
			{ value: '2 min', label: 'att kalla in hela däckhotellet med SMS' },
			{ value: '1 dag', label: 'snabbare från färdig bil till skickad faktura' },
		],
		sections: [{ title: 'Berättelsen', text: 'Exempeltext.' }],
	},
	{
		slug: 'stefan',
		published: false,
		name: 'Stefan',
		place: 'Verkstadsägare',
		person: { name: 'Stefan', role: 'Verkstadsägare' },
		headline: 'Lätt att byta system',
		quote: 'Trodde det skulle vara bökigt att byta system, men Axle är grymt intuitivt. Att ha allt från bokning till försäljning på samma ställe är guld värt.',
		stats: [
			{ value: '2 min', label: 'att kalla in hela däckhotellet med SMS' },
			{ value: '1 dag', label: 'snabbare från färdig bil till skickad faktura' },
		],
		sections: [{ title: 'Berättelsen', text: 'Exempeltext.' }],
	},
];

export const kundBySlug = (slug: string | undefined): Kund | undefined =>
	KUNDER.find((k) => k.slug === slug);
