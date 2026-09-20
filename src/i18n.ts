// SPDX-License-Identifier: MIT

export interface EmprivacyChromeStrings {
	acceptAll: string;
	rejectNonEssential: string;
	customize: string;
	saveChoices: string;
	close: string;
	essential: string;
	functional: string;
	analytics: string;
	marketing: string;
	essentialNote: string;
	privacyPolicy: string;
	cookiePolicy: string;
	cookieSettings: string;
	loadEmbed: string;
	embedBlocked: string;
	embedNeedConsent: string;
	vendorsHeading: string;
	whatWeUse: string;
}

export interface EmprivacyLocaleCopy {
	bannerTitle: string;
	bannerMessage: string;
}

export const DEFAULT_LOCALE = "en";

const LOCALE_KEY = /^[a-z]{2,3}(?:-[A-Za-z]{2})?$/;

export const CHROME: Record<string, EmprivacyChromeStrings> = {
	en: {
		acceptAll: "Accept all",
		rejectNonEssential: "Reject non-essential",
		customize: "Customize",
		saveChoices: "Save choices",
		close: "Close",
		essential: "Essential",
		functional: "Functional",
		analytics: "Analytics",
		marketing: "Marketing",
		essentialNote: "Always on — needed to run the site and remember this choice.",
		privacyPolicy: "Privacy policy",
		cookiePolicy: "Cookie policy",
		cookieSettings: "Cookie and privacy settings",
		loadEmbed: "Allow embeds and load",
		embedBlocked: "This embed is blocked until you allow the matching cookie category.",
		embedNeedConsent: "To load this embed, allow the matching category in cookie settings.",
		vendorsHeading: "What this site uses",
		whatWeUse: "What we use",
	},
	de: {
		acceptAll: "Alle akzeptieren",
		rejectNonEssential: "Nicht notwendige ablehnen",
		customize: "Anpassen",
		saveChoices: "Auswahl speichern",
		close: "Schließen",
		essential: "Essenziell",
		functional: "Funktional",
		analytics: "Analyse",
		marketing: "Marketing",
		essentialNote: "Immer aktiv — erforderlich für die Website und diese Auswahl.",
		privacyPolicy: "Datenschutzerklärung",
		cookiePolicy: "Cookie-Richtlinie",
		cookieSettings: "Cookie- und Datenschutzeinstellungen",
		loadEmbed: "Einbettungen erlauben und laden",
		embedBlocked: "Diese Einbettung ist gesperrt, bis Sie die passende Kategorie erlauben.",
		embedNeedConsent: "Um diese Einbettung zu laden, erlauben Sie die passende Kategorie in den Cookie-Einstellungen.",
		vendorsHeading: "Was diese Website verwendet",
		whatWeUse: "Was wir verwenden",
	},
	fr: {
		acceptAll: "Tout accepter",
		rejectNonEssential: "Refuser les non essentiels",
		customize: "Personnaliser",
		saveChoices: "Enregistrer",
		close: "Fermer",
		essential: "Essentiels",
		functional: "Fonctionnels",
		analytics: "Mesure d’audience",
		marketing: "Marketing",
		essentialNote: "Toujours actifs — nécessaires au site et à ce choix.",
		privacyPolicy: "Politique de confidentialité",
		cookiePolicy: "Politique cookies",
		cookieSettings: "Paramètres des cookies et de confidentialité",
		loadEmbed: "Autoriser les contenus intégrés",
		embedBlocked: "Ce contenu est bloqué tant que vous n’avez pas autorisé la catégorie correspondante.",
		embedNeedConsent: "Pour charger ce contenu, autorisez la catégorie correspondante dans les paramètres des cookies.",
		vendorsHeading: "Ce que ce site utilise",
		whatWeUse: "Ce que nous utilisons",
	},
	es: {
		acceptAll: "Aceptar todo",
		rejectNonEssential: "Rechazar no esenciales",
		customize: "Personalizar",
		saveChoices: "Guardar",
		close: "Cerrar",
		essential: "Esenciales",
		functional: "Funcionales",
		analytics: "Analítica",
		marketing: "Marketing",
		essentialNote: "Siempre activos — necesarios para el sitio y esta elección.",
		privacyPolicy: "Política de privacidad",
		cookiePolicy: "Política de cookies",
		cookieSettings: "Ajustes de cookies y privacidad",
		loadEmbed: "Permitir incrustaciones y cargar",
		embedBlocked: "Este contenido está bloqueado hasta que permita la categoría correspondiente.",
		embedNeedConsent: "Para cargar este contenido, permita la categoría correspondiente en los ajustes de cookies.",
		vendorsHeading: "Qué usa este sitio",
		whatWeUse: "Qué usamos",
	},
	it: {
		acceptAll: "Accetta tutto",
		rejectNonEssential: "Rifiuta non essenziali",
		customize: "Personalizza",
		saveChoices: "Salva",
		close: "Chiudi",
		essential: "Essenziali",
		functional: "Funzionali",
		analytics: "Statistiche",
		marketing: "Marketing",
		essentialNote: "Sempre attivi — necessari al sito e a questa scelta.",
		privacyPolicy: "Informativa sulla privacy",
		cookiePolicy: "Informativa cookie",
		cookieSettings: "Impostazioni cookie e privacy",
		loadEmbed: "Consenti gli embed e carica",
		embedBlocked: "Questo contenuto è bloccato finché non consenti la categoria corrispondente.",
		embedNeedConsent: "Per caricare questo contenuto, consenti la categoria corrispondente nelle impostazioni cookie.",
		vendorsHeading: "Cosa usa questo sito",
		whatWeUse: "Cosa usiamo",
	},
	nl: {
		acceptAll: "Alles accepteren",
		rejectNonEssential: "Niet-essentieel weigeren",
		customize: "Aanpassen",
		saveChoices: "Opslaan",
		close: "Sluiten",
		essential: "Essentieel",
		functional: "Functioneel",
		analytics: "Statistieken",
		marketing: "Marketing",
		essentialNote: "Altijd aan — nodig voor de site en deze keuze.",
		privacyPolicy: "Privacybeleid",
		cookiePolicy: "Cookiebeleid",
		cookieSettings: "Cookie- en privacyinstellingen",
		loadEmbed: "Embeds toestaan en laden",
		embedBlocked: "Deze embed is geblokkeerd tot u de bijbehorende categorie toestaat.",
		embedNeedConsent: "Om deze embed te laden, sta de bijbehorende categorie toe in de cookie-instellingen.",
		vendorsHeading: "Wat deze site gebruikt",
		whatWeUse: "Wat wij gebruiken",
	},
	pt: {
		acceptAll: "Aceitar tudo",
		rejectNonEssential: "Recusar não essenciais",
		customize: "Personalizar",
		saveChoices: "Guardar",
		close: "Fechar",
		essential: "Essenciais",
		functional: "Funcionais",
		analytics: "Analítica",
		marketing: "Marketing",
		essentialNote: "Sempre ativos — necessários para o site e esta escolha.",
		privacyPolicy: "Política de privacidade",
		cookiePolicy: "Política de cookies",
		cookieSettings: "Definições de cookies e privacidade",
		loadEmbed: "Permitir embeds e carregar",
		embedBlocked: "Este conteúdo está bloqueado até autorizar a categoria correspondente.",
		embedNeedConsent: "Para carregar este conteúdo, autorize a categoria correspondente nas definições de cookies.",
		vendorsHeading: "O que este site usa",
		whatWeUse: "O que usamos",
	},
	pl: {
		acceptAll: "Zaakceptuj wszystkie",
		rejectNonEssential: "Odrzuć niepotrzebne",
		customize: "Dostosuj",
		saveChoices: "Zapisz",
		close: "Zamknij",
		essential: "Niezbędne",
		functional: "Funkcjonalne",
		analytics: "Analityczne",
		marketing: "Marketingowe",
		essentialNote: "Zawsze włączone — potrzebne do działania witryny i zapamiętania wyboru.",
		privacyPolicy: "Polityka prywatności",
		cookiePolicy: "Polityka cookies",
		cookieSettings: "Ustawienia plików cookie i prywatności",
		loadEmbed: "Zezwól na osadzenia i wczytaj",
		embedBlocked: "Ta treść jest zablokowana, dopóki nie zezwolisz na odpowiednią kategorię.",
		embedNeedConsent: "Aby wczytać tę treść, zezwól na odpowiednią kategorię w ustawieniach plików cookie.",
		vendorsHeading: "Czego używa ta witryna",
		whatWeUse: "Czego używamy",
	},
};

export function isLocaleKey(s: string): boolean {
	return LOCALE_KEY.test(s.trim());
}

/** `de-DE` → `["de-de", "de"]` (case-normalized). */
export function localeFallbackKeys(locale: string | null | undefined): string[] {
	if (!locale) return [];
	const t = locale.trim();
	if (!t || t.length > 16) return [];
	const lower = t.toLowerCase();
	const parts = lower.split("-");
	const keys: string[] = [];
	if (parts.length >= 2) keys.push(`${parts[0]}-${parts[1]}`);
	keys.push(parts[0] ?? lower);
	return keys.filter((k, i, a) => isLocaleKey(k) && a.indexOf(k) === i);
}

export function chromeForLocale(locale: string | null | undefined): EmprivacyChromeStrings {
	for (const key of localeFallbackKeys(locale)) {
		const found = CHROME[key] ?? CHROME[key.split("-")[0] ?? ""];
		if (found) return found;
	}
	return CHROME[DEFAULT_LOCALE]!;
}

export type LocaleOverrides = Record<string, Partial<EmprivacyLocaleCopy>>;

export function parseLocaleOverrides(raw: unknown): LocaleOverrides {
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
	const out: LocaleOverrides = {};
	for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
		if (!isLocaleKey(k)) continue;
		if (!v || typeof v !== "object" || Array.isArray(v)) continue;
		const o = v as Record<string, unknown>;
		const entry: Partial<EmprivacyLocaleCopy> = {};
		if (typeof o.bannerTitle === "string") entry.bannerTitle = o.bannerTitle;
		if (typeof o.bannerMessage === "string") entry.bannerMessage = o.bannerMessage;
		if (entry.bannerTitle !== undefined || entry.bannerMessage !== undefined) {
			out[k.toLowerCase()] = entry;
		}
		if (Object.keys(out).length >= 32) break;
	}
	return out;
}

export function parseLocaleOverridesText(text: string): LocaleOverrides {
	const t = text.trim();
	if (!t) return {};
	let parsed: unknown;
	try {
		parsed = JSON.parse(t);
	} catch {
		throw new Error(
			"Translations must be JSON: {\"de\":{\"bannerTitle\":\"…\",\"bannerMessage\":\"…\"}}.",
		);
	}
	if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
		throw new Error("Translations JSON must be an object keyed by locale (e.g. de, fr).");
	}
	for (const key of Object.keys(parsed as object)) {
		if (!isLocaleKey(key)) {
			throw new Error(`Invalid locale key "${key}". Use codes like en, de, or pt-BR.`);
		}
	}
	return parseLocaleOverrides(parsed);
}

export function resolveBannerCopy(
	defaults: EmprivacyLocaleCopy,
	overrides: LocaleOverrides,
	locale: string | null | undefined,
): EmprivacyLocaleCopy {
	let title = defaults.bannerTitle;
	let message = defaults.bannerMessage;
	for (const key of localeFallbackKeys(locale)) {
		const o = overrides[key] ?? overrides[key.split("-")[0] ?? ""];
		if (!o) continue;
		if (typeof o.bannerTitle === "string" && o.bannerTitle.trim()) title = o.bannerTitle;
		if (typeof o.bannerMessage === "string" && o.bannerMessage.trim()) message = o.bannerMessage;
		break;
	}
	return { bannerTitle: title, bannerMessage: message };
}
