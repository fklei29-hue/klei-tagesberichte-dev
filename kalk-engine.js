// =============================================================================
// Terrasuite · Kalkulationsmodul Sportplatzbau · Rechen-Engine
// Reine Logik ohne DOM-/Framework-Abhängigkeiten.
// Einsetzbar im Browser (ES-Module), in Node.js (Backend/Tests) und in React & Co.
// =============================================================================

import { LV, REFERENZPROJEKTE, REGELN, META } from './kalk-data.js';

export { LV, REFERENZPROJEKTE, REGELN, META };

export const PREISNIVEAUS = ['niedrig', 'Standard', 'hoch'];
export const MWST_SATZ = 0.19;

/** Standard-Eingaben (entsprechen dem Referenzfall REF-KS-001, Kunstrasen-Neubau).
 *  Alle Stärken in Metern (wie in der Excel-Vorlage). */
export const DEFAULT_INPUTS = Object.freeze({
  projektart: 'Neubau',            // 'Neubau' | 'Sanierung'
  platztyp: 'kunstrasen',          // 'kunstrasen' | 'naturrasen' | 'tenne'
  preisniveau: 1,                  // 0 = niedrig, 1 = Standard, 2 = hoch
  laenge: 105, breite: 68,         // Spielfeld (m)
  randLaengs: 3, randStirn: 5,     // Randstreifen beidseitig (m)
  frostschutz: 0.40,               // Stärken (m)
  tragschicht: 0.18,
  bodenaustausch: 0.15,            // 0 bei tragfähigem Baugrund
  drainageRaster: 6,               // Rasterabstand (m)
  ballfang: 140, aussenzaun: 420, barriere: 0,   // Zaun-/Barrierenlängen (lfm)
  bauzeit: 18,                     // Wochen
  baustrasse: 0,                   // m²
  schutzbaeume: 0,                 // Stk
  rigolen: 0,                      // m³
  rueckbauMineralisch: 0,          // t (nur Sanierung)
  rueckbauGemischt: 0,             // t (nur Sanierung)
  flutlicht: true,                 // R-006
  beregnung: false,                // R-007
  bodenrisiko: 'Mittel',           // 'Niedrig' | 'Mittel' | 'Hoch'  (R-008)
  entsorgungsklasse: 'Z0',         // 'Z0' | 'Z1' | 'Z2'             (R-009)
  sanierungsgrad: 'komplett',      // 'komplett' | 'belag'           (R-010)
  zuschlaege: { baustellengemeinkosten: 0, wagnis: 0, gewinn: 0, preissteigerung: 0, unvorhergesehenes: 0 }, // %
  nachlaesse: { nachlass: 0, sonderrabatt: 0, verhandlung: 0 },                                              // €
});

const ZUSCHLAG_LABELS = {
  baustellengemeinkosten: 'Baustellengemeinkosten', wagnis: 'Wagnis', gewinn: 'Gewinn',
  preissteigerung: 'Preissteigerung', unvorhergesehenes: 'Unvorhergesehenes',
};

/** Abgeleitete Geometrie aus den Eingaben. */
export function computeGeometry(inp) {
  const gesamtlaenge = inp.laenge + 2 * inp.randStirn;
  const gesamtbreite = inp.breite + 2 * inp.randLaengs;
  const gesamtflaeche = gesamtlaenge * gesamtbreite;
  return {
    spielflaeche: inp.laenge * inp.breite,
    gesamtlaenge, gesamtbreite, gesamtflaeche,
    umfang: 2 * (gesamtlaenge + gesamtbreite),
    drainagelaenge: inp.drainageRaster > 0 ? gesamtflaeche / inp.drainageRaster : 0,
    entsorgungsvolumen: gesamtflaeche * 0.12,
  };
}

/** Automatische Menge einer Position nach ihrer Mengenbasis. */
export function computeQuantity(pos, inp, geo) {
  switch (pos.base) {
    case 'Pauschal': case 'Fix':      return pos.fac;
    case 'Bauzeit Wochen':            return inp.bauzeit * pos.fac;
    case 'Umfang':                    return geo.umfang * pos.fac;
    case 'Gesamtfläche':              return geo.gesamtflaeche * pos.fac;
    case 'Spielfeldfläche':           return geo.spielflaeche * pos.fac;
    case 'Baustraße Fläche':          return inp.baustrasse * pos.fac;
    case 'Eingabe Schutzbäume':       return inp.schutzbaeume;
    case 'Bodenaustausch Volumen':    return geo.gesamtflaeche * inp.bodenaustausch * pos.fac;
    case 'Entsorgungsvolumen':        return geo.entsorgungsvolumen * pos.fac;
    case 'Frostschutz Volumen':       return geo.gesamtflaeche * inp.frostschutz * pos.fac;
    case 'Tragschicht Volumen':       return geo.gesamtflaeche * inp.tragschicht * pos.fac;
    case 'Drainage Länge':            return geo.drainagelaenge * pos.fac;
    case 'Sammler Länge':             return geo.umfang * 0.55 * pos.fac;
    case 'Schächte':                  return geo.drainagelaenge * 0.008 * pos.fac;
    case 'Rinnen Länge':              return geo.umfang * 0.45 * pos.fac;
    case 'Rigolen Volumen':           return inp.rigolen * pos.fac;
    case 'Wegefläche':                return geo.gesamtflaeche * 0.1 * pos.fac;
    case 'Kunstrasenfläche':          return geo.spielflaeche * 1.04 * pos.fac;
    case 'Naturrasenfläche':          return geo.spielflaeche * 1.03 * pos.fac;
    case 'Rasentragschicht Volumen':  return geo.spielflaeche * 0.12 * pos.fac;
    case 'Tennen Volumen':            return geo.spielflaeche * 0.04 * pos.fac;
    case 'Ballfang Länge':            return inp.ballfang * pos.fac;
    case 'Außenzaun Länge':           return inp.aussenzaun * pos.fac;
    case 'Barrieren Länge':           return inp.barriere * pos.fac;
    case 'Rückbau mineralisch t':     return inp.rueckbauMineralisch * pos.fac;
    case 'Rückbau gemischt t':        return inp.rueckbauGemischt * pos.fac;
    default:                          return 0;
  }
}

/** Lesbare Beschreibung der Mengenformel (für UI / Dokumentation). */
export function formulaText(pos) {
  const x = pos.fac !== 1 ? ' × ' + String(pos.fac).replace('.', ',') : '';
  const map = {
    'Pauschal':'pauschal', 'Fix':'fix', 'Bauzeit Wochen':'Bauzeit (Wo)'+x, 'Umfang':'Umfang'+x,
    'Gesamtfläche':'Gesamtfläche'+x, 'Spielfeldfläche':'Spielfeld'+x, 'Baustraße Fläche':'Eingabe Baustraße',
    'Eingabe Schutzbäume':'Eingabe Schutzbäume', 'Bodenaustausch Volumen':'GF × Austauschstärke',
    'Entsorgungsvolumen':'Entsorgungsvol.'+x, 'Frostschutz Volumen':'GF × Frostschutzstärke',
    'Tragschicht Volumen':'GF × Tragschichtstärke', 'Drainage Länge':'GF ÷ Raster'+x,
    'Sammler Länge':'Umfang × 0,55', 'Schächte':'Drainagelänge × 0,008', 'Rinnen Länge':'Umfang × 0,45',
    'Rigolen Volumen':'Eingabe Rigolen', 'Wegefläche':'GF × 0,10', 'Kunstrasenfläche':'Spielfeld × 1,04',
    'Naturrasenfläche':'Spielfeld × 1,03', 'Rasentragschicht Volumen':'Spielfeld × 0,12',
    'Tennen Volumen':'Spielfeld × 0,04', 'Ballfang Länge':'Eingabe Ballfang',
    'Außenzaun Länge':'Eingabe Außenzaun', 'Barrieren Länge':'Eingabe Barriere',
    'Rückbau mineralisch t':'Eingabe Rückbau min.', 'Rückbau gemischt t':'Eingabe Rückbau gem.',
  };
  return map[pos.base] || pos.base;
}

/** Ist die Position für Projektart/Platztyp überhaupt relevant? (inkl. R-010) */
export function isActive(pos, inp) {
  if (pos.art !== 'Alle' && pos.art !== inp.projektart) return false;
  if (pos.typ !== 'Alle' && pos.typ.toLowerCase() !== inp.platztyp) return false;
  if (inp.projektart === 'Sanierung' && inp.sanierungsgrad === 'belag'
      && !REGELN.NUR_BELAG.includes(pos.id)) return false;               // R-010
  return true;
}

/** Ist die Position standardmäßig angehakt? (Pflicht + Regelwerk + Vollausbau-Defaults) */
export function defaultOn(pos, inp) {
  if (!pos.opt) return true;
  if (pos.id === 'FL-001') return !!inp.flutlicht;                        // R-006
  if (pos.id === 'BEW-001') return !!inp.beregnung;                       // R-007
  if (Object.values(REGELN.ENTSORGUNG).includes(pos.id))
    return REGELN.ENTSORGUNG[inp.entsorgungsklasse] === pos.id;           // R-009
  if (REGELN.BODENRISIKO_HOCH.includes(pos.id))
    return inp.bodenrisiko === 'Hoch';                                    // R-008
  return REGELN.DEFAULT_ON.includes(pos.id);
}

/**
 * Komplette Kalkulation berechnen.
 * @param {object} inputs    Teilmenge von DEFAULT_INPUTS (Rest wird ergänzt)
 * @param {object} overrides { menge:{[id]:number}, preis:{[id]:number}, aktiv:{[id]:boolean} }
 * @returns Ergebnisobjekt mit geometrie, gruppen, positionen, summen, kennzahlen, benchmark
 */
export function calculate(inputs = {}, overrides = {}) {
  const inp = { ...DEFAULT_INPUTS, ...inputs,
    zuschlaege: { ...DEFAULT_INPUTS.zuschlaege, ...(inputs.zuschlaege || {}) },
    nachlaesse: { ...DEFAULT_INPUTS.nachlaesse, ...(inputs.nachlaesse || {}) } };
  const ov = { menge: {}, preis: {}, aktiv: {}, ...overrides };
  const geo = computeGeometry(inp);
  const lvIdx = Math.min(2, Math.max(0, inp.preisniveau | 0));

  let netto = 0, szenarioNiedrig = 0, szenarioHoch = 0;
  let lohn = 0, material = 0, maschine = 0, risikoAnteil = 0;
  const positionen = [], gruppen = [];

  for (const pos of LV) {
    if (!isActive(pos, inp)) continue;
    const aktiv = ov.aktiv[pos.id] !== undefined ? !!ov.aktiv[pos.id] : defaultOn(pos, inp);
    const menge = ov.menge[pos.id] !== undefined
      ? ov.menge[pos.id] : Math.round(computeQuantity(pos, inp, geo) * 100) / 100;
    const ep = ov.preis[pos.id] !== undefined ? ov.preis[pos.id] : pos.ep[lvIdx];
    const summe = aktiv ? menge * ep : 0;

    if (aktiv) {
      netto += summe;
      szenarioNiedrig += menge * pos.ep[0];
      szenarioHoch += menge * pos.ep[2];
      lohn += summe * pos.lo / 100;
      material += summe * pos.ma / 100;
      maschine += summe * pos.mi / 100;
      if (pos.risk === 'Hoch' || pos.risk === 'Sehr hoch') risikoAnteil += summe;
    }
    const eintrag = { ...pos, aktiv, menge, epAktuell: ep, summe, formel: formulaText(pos) };
    positionen.push(eintrag);
    let gruppe = gruppen.find(g => g.bereich === pos.ber);
    if (!gruppe) { gruppe = { bereich: pos.ber, positionen: [], zwischensumme: 0 }; gruppen.push(gruppe); }
    gruppe.positionen.push(eintrag);
    gruppe.zwischensumme += summe;
  }

  // Zuschläge (%) auf die Positionssumme
  const zuschlaege = Object.entries(inp.zuschlaege)
    .filter(([, p]) => p > 0)
    .map(([k, p]) => ({ key: k, name: ZUSCHLAG_LABELS[k] || k, prozent: p, betrag: netto * p / 100 }));
  const gesamt = netto + zuschlaege.reduce((s, z) => s + z.betrag, 0);

  // Nachlass-Kette (€)
  const { nachlass = 0, sonderrabatt = 0, verhandlung = 0 } = inp.nachlaesse;
  const angebotssumme = gesamt - nachlass;
  const auftragssumme = angebotssumme - sonderrabatt;
  const endpreisNetto = auftragssumme - verhandlung;
  const mwst = endpreisNetto * MWST_SATZ;

  // Kennzahlen + Benchmark gegen das passende Referenzprojekt
  const kennzahlen = geo.spielflaeche > 0 ? {
    proQmSpielfeld: endpreisNetto / geo.spielflaeche,
    proQmGesamt: endpreisNetto / geo.gesamtflaeche,
  } : null;
  const ref = REFERENZPROJEKTE.find(r => r.projektart === inp.projektart && r.platztyp === inp.platztyp);
  const benchmark = (ref && kennzahlen) ? {
    referenz: ref,
    abweichungProzent: (kennzahlen.proQmSpielfeld / ref.proQmSpielfeld - 1) * 100,
  } : null;

  return {
    inputs: inp, geometrie: geo, gruppen, positionen,
    summen: {
      netto, zuschlaege, gesamt,
      nachlass, sonderrabatt, verhandlung,
      angebotssumme, auftragssumme, endpreisNetto, mwst,
      brutto: endpreisNetto + mwst,
      szenarioNiedrig, szenarioHoch,
      lohn, material, maschine, risikoAnteil,
    },
    kennzahlen, benchmark,
  };
}

/** Kalkulationsergebnis als CSV (Semikolon, deutsche Dezimalzeichen, Excel-tauglich mit BOM). */
export function toCSV(result, meta = {}) {
  const de = v => v.toFixed(2).replace('.', ',');
  const s = result.summen;
  const kopf = [
    'Projekt;' + (meta.projekt || '-'), 'Bauherr;' + (meta.bauherr || '-'),
    'Bauleiter;' + (meta.bauleiter || '-'), 'Datum;' + (meta.datum || '-'),
    'Projektart;' + result.inputs.projektart, 'Platztyp;' + result.inputs.platztyp,
    'Preisniveau;' + PREISNIVEAUS[result.inputs.preisniveau],
    'Bodenrisiko;' + result.inputs.bodenrisiko, 'Entsorgungsklasse;' + result.inputs.entsorgungsklasse,
    'Preisdatenbank;' + META.system + ', ' + META.region + ', Preisstand ' + META.preisstand, '',
    'Bereich;Position;Menge;Einheit;EP (EUR);Summe (EUR);Risiko',
  ];
  const zeilen = result.positionen.filter(p => p.aktiv && p.summe > 0).map(p =>
    [p.ber, p.n, String(p.menge).replace('.', ','), p.u, de(p.epAktuell), de(p.summe), p.risk].join(';'));
  zeilen.push('', 'Zwischensumme Positionen (netto);;;;;' + de(s.netto));
  s.zuschlaege.forEach(z => zeilen.push(`${z.name} (${String(z.prozent).replace('.', ',')} %);;;;;` + de(z.betrag)));
  if (s.nachlass) zeilen.push('Nachlass;;;;;-' + de(s.nachlass), 'Angebotssumme netto;;;;;' + de(s.angebotssumme));
  if (s.sonderrabatt) zeilen.push('Sonderrabatt Projekt;;;;;-' + de(s.sonderrabatt), 'Auftragssumme netto;;;;;' + de(s.auftragssumme));
  if (s.verhandlung) zeilen.push('Weiterer Nachlass (Verhandlung);;;;;-' + de(s.verhandlung));
  zeilen.push('Endpreis netto;;;;;' + de(s.endpreisNetto),
    'MwSt. ' + (MWST_SATZ * 100) + ' %;;;;;' + de(s.mwst), 'Gesamt brutto;;;;;' + de(s.brutto),
    'Szenario niedrig (netto);;;;;' + de(s.szenarioNiedrig), 'Szenario hoch (netto);;;;;' + de(s.szenarioHoch),
    'Kostenanteil Lohn;;;;;' + de(s.lohn), 'Kostenanteil Material;;;;;' + de(s.material),
    'Kostenanteil Geräte;;;;;' + de(s.maschine), 'Anteil Risiko hoch/sehr hoch;;;;;' + de(s.risikoAnteil));
  return '﻿' + kopf.concat(zeilen).join('\r\n');
}
