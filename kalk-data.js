// =============================================================================
// Terrasuite · Kalkulationsmodul Sportplatzbau · Datenbasis
// Quelle: Sportplatz_Kalkulationssystem_Phase1_Kreis_Kassel.xlsx
// Regionalkalibrierung Landkreis Kassel / Nordhessen · Preisstand Juli 2026 · netto
// ep = [niedrig, Standard, hoch] · lo/ma/mi = Lohn-/Material-/Geräteanteil in %
// =============================================================================

export const META = {
  system: 'Kalkulationssystem Phase 1',
  region: 'Landkreis Kassel / Nordhessen',
  preisstand: 'Juli 2026',
  preisart: 'Netto, ohne Planung und Baunebenkosten',
  szenarioNiedrig: -0.15,
  szenarioHoch: 0.35,
  budgetreserve: '10-20 %',
  regionalniveau: 0.96,
};

export const LV = [
  {id:'BE-001', ber:'Baustelleneinrichtung', ub:'Allgemein', n:'Baustelle einrichten', u:'psch', base:'Pauschal', fac:1, ep:[18000,26000,38000], art:'Alle', typ:'Alle', opt:false, risk:'Mittel', lo:45, ma:35, mi:20},
  {id:'BE-002', ber:'Baustelleneinrichtung', ub:'Allgemein', n:'Baustelle räumen', u:'psch', base:'Pauschal', fac:1, ep:[8000,12000,18000], art:'Alle', typ:'Alle', opt:false, risk:'Niedrig', lo:60, ma:20, mi:20},
  {id:'BE-003', ber:'Baustelleneinrichtung', ub:'Container', n:'Büro-/Mannschaftscontainer', u:'Wo', base:'Bauzeit Wochen', fac:1, ep:[280,390,560], art:'Alle', typ:'Alle', opt:true, risk:'Niedrig', lo:10, ma:75, mi:15},
  {id:'BE-004', ber:'Baustelleneinrichtung', ub:'Sicherung', n:'Bauzaun mobil', u:'lfm', base:'Umfang', fac:0.7, ep:[8,12,18], art:'Alle', typ:'Alle', opt:true, risk:'Niedrig', lo:45, ma:45, mi:10},
  {id:'BE-005', ber:'Baustelleneinrichtung', ub:'Versorgung', n:'Baustromanschluss und Verbrauch', u:'psch', base:'Pauschal', fac:1, ep:[4500,7000,11000], art:'Alle', typ:'Alle', opt:true, risk:'Mittel', lo:20, ma:65, mi:15},
  {id:'BE-006', ber:'Baustelleneinrichtung', ub:'Versorgung', n:'Bauwasseranschluss und Verbrauch', u:'psch', base:'Pauschal', fac:1, ep:[2500,4500,7500], art:'Alle', typ:'Alle', opt:true, risk:'Mittel', lo:20, ma:65, mi:15},
  {id:'BE-007', ber:'Baustelleneinrichtung', ub:'Vermessung', n:'Absteckung und Höhenkontrolle', u:'psch', base:'Pauschal', fac:1, ep:[6500,9500,14500], art:'Alle', typ:'Alle', opt:false, risk:'Mittel', lo:85, ma:5, mi:10},
  {id:'BE-008', ber:'Baustelleneinrichtung', ub:'Dokumentation', n:'Fotodokumentation und Bautagebuch', u:'psch', base:'Pauschal', fac:1, ep:[2500,4200,7000], art:'Alle', typ:'Alle', opt:true, risk:'Niedrig', lo:90, ma:5, mi:5},
  {id:'BE-009', ber:'Baustelleneinrichtung', ub:'Verkehr', n:'Baustraße aus Schotter herstellen', u:'m²', base:'Baustraße Fläche', fac:1, ep:[18,27,42], art:'Alle', typ:'Alle', opt:true, risk:'Mittel', lo:20, ma:55, mi:25},
  {id:'BE-010', ber:'Baustelleneinrichtung', ub:'Verkehr', n:'Baustraße zurückbauen', u:'m²', base:'Baustraße Fläche', fac:1, ep:[9,14,22], art:'Alle', typ:'Alle', opt:true, risk:'Mittel', lo:35, ma:25, mi:40},
  {id:'BE-011', ber:'Baustelleneinrichtung', ub:'Schutz', n:'Baumschutz / Wurzelschutz', u:'Stk', base:'Eingabe Schutzbäume', fac:1, ep:[380,620,980], art:'Alle', typ:'Alle', opt:true, risk:'Mittel', lo:55, ma:35, mi:10},
  {id:'BE-012', ber:'Baustelleneinrichtung', ub:'Winterbau', n:'Winterbauschutzmaßnahmen', u:'psch', base:'Pauschal', fac:1, ep:[0,18000,45000], art:'Alle', typ:'Alle', opt:true, risk:'Hoch', lo:45, ma:35, mi:20},
  {id:'RB-001', ber:'Rückbau', ub:'Belag', n:'Kunstrasen aufnehmen', u:'m²', base:'Spielfeldfläche', fac:1.04, ep:[5.5,8.5,13], art:'Sanierung', typ:'Kunstrasen', opt:false, risk:'Mittel', lo:55, ma:5, mi:40},
  {id:'RB-002', ber:'Rückbau', ub:'Belag', n:'Kunstrasen verwerten/entsorgen', u:'t', base:'Spielfeldfläche', fac:0.0035, ep:[240,390,650], art:'Sanierung', typ:'Kunstrasen', opt:false, risk:'Hoch', lo:15, ma:10, mi:75},
  {id:'RB-003', ber:'Rückbau', ub:'Belag', n:'Infill absaugen und separieren', u:'m²', base:'Spielfeldfläche', fac:1.04, ep:[3.5,5.5,8.5], art:'Sanierung', typ:'Kunstrasen', opt:false, risk:'Mittel', lo:40, ma:10, mi:50},
  {id:'RB-004', ber:'Rückbau', ub:'Naturrasen', n:'Rasennarbe abtragen', u:'m²', base:'Spielfeldfläche', fac:1, ep:[1.8,3,4.8], art:'Sanierung', typ:'Naturrasen', opt:false, risk:'Niedrig', lo:35, ma:5, mi:60},
  {id:'RB-005', ber:'Rückbau', ub:'Tenne', n:'Tennendecke aufnehmen', u:'m³', base:'Spielfeldfläche', fac:0.04, ep:[22,34,52], art:'Sanierung', typ:'Tenne', opt:false, risk:'Mittel', lo:25, ma:5, mi:70},
  {id:'RB-006', ber:'Rückbau', ub:'Unterbau', n:'Ungebundene Tragschicht aufnehmen', u:'m³', base:'Gesamtfläche', fac:0.18, ep:[20,31,48], art:'Sanierung', typ:'Alle', opt:true, risk:'Mittel', lo:25, ma:5, mi:70},
  {id:'RB-007', ber:'Rückbau', ub:'Einfassung', n:'Betonbord abbrechen', u:'lfm', base:'Umfang', fac:1, ep:[12,19,30], art:'Sanierung', typ:'Alle', opt:true, risk:'Niedrig', lo:45, ma:5, mi:50},
  {id:'RB-008', ber:'Rückbau', ub:'Entwässerung', n:'Entwässerungsrinne ausbauen', u:'lfm', base:'Umfang', fac:0.45, ep:[18,29,46], art:'Sanierung', typ:'Alle', opt:true, risk:'Mittel', lo:45, ma:5, mi:50},
  {id:'RB-009', ber:'Rückbau', ub:'Drainage', n:'Drainageleitungen ausbauen', u:'lfm', base:'Drainage Länge', fac:1, ep:[8,13,21], art:'Sanierung', typ:'Alle', opt:true, risk:'Mittel', lo:45, ma:5, mi:50},
  {id:'RB-010', ber:'Rückbau', ub:'Zaun', n:'Doppelstabmattenzaun demontieren', u:'lfm', base:'Außenzaun Länge', fac:1, ep:[12,18,28], art:'Sanierung', typ:'Alle', opt:true, risk:'Niedrig', lo:65, ma:5, mi:30},
  {id:'RB-011', ber:'Rückbau', ub:'Zaun', n:'Ballfangzaun demontieren', u:'lfm', base:'Ballfang Länge', fac:1, ep:[25,38,58], art:'Sanierung', typ:'Alle', opt:true, risk:'Mittel', lo:65, ma:5, mi:30},
  {id:'RB-012', ber:'Rückbau', ub:'Ausstattung', n:'Tore und Sportausstattung demontieren', u:'psch', base:'Pauschal', fac:1, ep:[2500,4200,7000], art:'Sanierung', typ:'Alle', opt:true, risk:'Niedrig', lo:75, ma:5, mi:20},
  {id:'RB-013', ber:'Rückbau', ub:'Entsorgung', n:'Mineralische Baustoffe entsorgen', u:'t', base:'Rückbau mineralisch t', fac:1, ep:[22,38,72], art:'Sanierung', typ:'Alle', opt:true, risk:'Hoch', lo:10, ma:5, mi:85},
  {id:'RB-014', ber:'Rückbau', ub:'Entsorgung', n:'Gemischte Baustoffe entsorgen', u:'t', base:'Rückbau gemischt t', fac:1, ep:[95,165,290], art:'Sanierung', typ:'Alle', opt:true, risk:'Hoch', lo:10, ma:5, mi:85},
  {id:'ER-001', ber:'Erdarbeiten', ub:'Oberboden', n:'Oberboden abtragen', u:'m³', base:'Gesamtfläche', fac:0.2, ep:[10,14,20], art:'Neubau', typ:'Alle', opt:false, risk:'Mittel', lo:25, ma:5, mi:70},
  {id:'ER-002', ber:'Erdarbeiten', ub:'Oberboden', n:'Oberboden seitlich lagern', u:'m³', base:'Gesamtfläche', fac:0.12, ep:[4,6.5,10], art:'Neubau', typ:'Alle', opt:true, risk:'Niedrig', lo:25, ma:5, mi:70},
  {id:'ER-003', ber:'Erdarbeiten', ub:'Oberboden', n:'Oberboden laden und abfahren', u:'m³', base:'Gesamtfläche', fac:0.08, ep:[9,14,22], art:'Neubau', typ:'Alle', opt:true, risk:'Mittel', lo:15, ma:5, mi:80},
  {id:'ER-004', ber:'Erdarbeiten', ub:'Aushub', n:'Boden lösen und laden', u:'m³', base:'Bodenaustausch Volumen', fac:1, ep:[17,24,35], art:'Alle', typ:'Alle', opt:true, risk:'Mittel', lo:20, ma:5, mi:75},
  {id:'ER-005', ber:'Erdarbeiten', ub:'Transport', n:'Boden transportieren bis 10 km', u:'m³', base:'Entsorgungsvolumen', fac:1, ep:[12,18,28], art:'Alle', typ:'Alle', opt:true, risk:'Mittel', lo:10, ma:5, mi:85},
  {id:'ER-006', ber:'Erdarbeiten', ub:'Transport', n:'Mehrweg je weitere 10 km', u:'m³', base:'Entsorgungsvolumen', fac:1, ep:[4,6.5,10], art:'Alle', typ:'Alle', opt:true, risk:'Mittel', lo:5, ma:5, mi:90},
  {id:'ER-007', ber:'Erdarbeiten', ub:'Entsorgung', n:'Boden Z0/Z0* verwerten', u:'t', base:'Entsorgungsvolumen', fac:1.8, ep:[8,16,30], art:'Alle', typ:'Alle', opt:true, risk:'Hoch', lo:5, ma:5, mi:90},
  {id:'ER-008', ber:'Erdarbeiten', ub:'Entsorgung', n:'Boden Z1.1/Z1.2 entsorgen', u:'t', base:'Entsorgungsvolumen', fac:1.8, ep:[28,48,85], art:'Alle', typ:'Alle', opt:true, risk:'Hoch', lo:5, ma:5, mi:90},
  {id:'ER-009', ber:'Erdarbeiten', ub:'Entsorgung', n:'Boden >Z1.2 entsorgen', u:'t', base:'Entsorgungsvolumen', fac:1.8, ep:[75,135,240], art:'Alle', typ:'Alle', opt:true, risk:'Sehr hoch', lo:5, ma:5, mi:90},
  {id:'ER-010', ber:'Erdarbeiten', ub:'Planum', n:'Erdplanum herstellen', u:'m²', base:'Gesamtfläche', fac:1, ep:[3.2,4.8,7], art:'Alle', typ:'Alle', opt:false, risk:'Niedrig', lo:30, ma:5, mi:65},
  {id:'ER-011', ber:'Erdarbeiten', ub:'Verdichtung', n:'Planum nachverdichten', u:'m²', base:'Gesamtfläche', fac:1, ep:[1.4,2.2,3.5], art:'Alle', typ:'Alle', opt:true, risk:'Niedrig', lo:20, ma:5, mi:75},
  {id:'ER-012', ber:'Erdarbeiten', ub:'Bodenverbesserung', n:'Kalk-/Zementstabilisierung', u:'m²', base:'Gesamtfläche', fac:1, ep:[9,14,22], art:'Alle', typ:'Alle', opt:true, risk:'Hoch', lo:20, ma:55, mi:25},
  {id:'ER-013', ber:'Erdarbeiten', ub:'Bodenaustausch', n:'Austauschboden liefern', u:'m³', base:'Bodenaustausch Volumen', fac:1, ep:[32,46,68], art:'Alle', typ:'Alle', opt:true, risk:'Mittel', lo:10, ma:65, mi:25},
  {id:'ER-014', ber:'Erdarbeiten', ub:'Bodenaustausch', n:'Austauschboden einbauen', u:'m³', base:'Bodenaustausch Volumen', fac:1, ep:[11,17,26], art:'Alle', typ:'Alle', opt:true, risk:'Mittel', lo:25, ma:10, mi:65},
  {id:'ER-015', ber:'Erdarbeiten', ub:'Geotextil', n:'Trennvlies 200–300 g/m²', u:'m²', base:'Gesamtfläche', fac:1.08, ep:[2.2,3.4,5.2], art:'Alle', typ:'Alle', opt:true, risk:'Niedrig', lo:25, ma:65, mi:10},
  {id:'ER-016', ber:'Erdarbeiten', ub:'Geogitter', n:'Geogitter zur Tragfähigkeitsverbesserung', u:'m²', base:'Gesamtfläche', fac:1.08, ep:[4.5,7.5,12], art:'Alle', typ:'Alle', opt:true, risk:'Mittel', lo:25, ma:65, mi:10},
  {id:'ER-017', ber:'Erdarbeiten', ub:'Prüfung', n:'Plattendruckversuche', u:'Stk', base:'Fix', fac:6, ep:[450,650,950], art:'Alle', typ:'Alle', opt:true, risk:'Niedrig', lo:70, ma:10, mi:20},
  {id:'ER-018', ber:'Erdarbeiten', ub:'Wasserhaltung', n:'Offene Wasserhaltung', u:'Wo', base:'Bauzeit Wochen', fac:1, ep:[1200,2200,4200], art:'Alle', typ:'Alle', opt:true, risk:'Hoch', lo:30, ma:25, mi:45},
  {id:'UB-001', ber:'Unterbau', ub:'Frostschutz', n:'Frostschutz 0/45 liefern und einbauen', u:'m³', base:'Frostschutz Volumen', fac:1, ep:[44,56,73], art:'Alle', typ:'Alle', opt:false, risk:'Mittel', lo:15, ma:60, mi:25},
  {id:'UB-002', ber:'Unterbau', ub:'Frostschutz', n:'Frostschutz profilgerecht verdichten', u:'m²', base:'Gesamtfläche', fac:1, ep:[2.2,3.4,5.2], art:'Alle', typ:'Alle', opt:false, risk:'Niedrig', lo:20, ma:5, mi:75},
  {id:'UB-003', ber:'Unterbau', ub:'Tragschicht', n:'Schottertragschicht 0/32 liefern/einbauen', u:'m³', base:'Tragschicht Volumen', fac:1, ep:[52,67,88], art:'Alle', typ:'Alle', opt:false, risk:'Mittel', lo:15, ma:60, mi:25},
  {id:'UB-004', ber:'Unterbau', ub:'Tragschicht', n:'Tragschicht profilieren und verdichten', u:'m²', base:'Gesamtfläche', fac:1, ep:[2.8,4.2,6.4], art:'Alle', typ:'Alle', opt:false, risk:'Niedrig', lo:25, ma:5, mi:70},
  {id:'UB-005', ber:'Unterbau', ub:'Feinplanum', n:'Feinplanum Sportfläche', u:'m²', base:'Spielfeldfläche', fac:1.04, ep:[3.8,5.5,8.5], art:'Alle', typ:'Alle', opt:false, risk:'Mittel', lo:35, ma:10, mi:55},
  {id:'UB-006', ber:'Unterbau', ub:'Dynamik', n:'Dynamische Schicht 0/16', u:'m³', base:'Spielfeldfläche', fac:0.06, ep:[58,76,103], art:'Alle', typ:'Tenne', opt:false, risk:'Mittel', lo:15, ma:60, mi:25},
  {id:'EN-001', ber:'Entwässerung', ub:'Drainage', n:'Drainrohr DN 100 inkl. Graben', u:'lfm', base:'Drainage Länge', fac:1, ep:[20,28,40], art:'Alle', typ:'Alle', opt:false, risk:'Mittel', lo:35, ma:35, mi:30},
  {id:'EN-002', ber:'Entwässerung', ub:'Sammler', n:'Sammler DN 150–200', u:'lfm', base:'Sammler Länge', fac:1, ep:[34,47,68], art:'Alle', typ:'Alle', opt:false, risk:'Mittel', lo:35, ma:35, mi:30},
  {id:'EN-003', ber:'Entwässerung', ub:'Schächte', n:'Spül-/Kontrollschacht', u:'Stk', base:'Schächte', fac:1, ep:[750,1050,1550], art:'Alle', typ:'Alle', opt:false, risk:'Mittel', lo:35, ma:50, mi:15},
  {id:'EN-004', ber:'Entwässerung', ub:'Rinnen', n:'Schlitz-/Kastenrinne Sportanlage', u:'lfm', base:'Rinnen Länge', fac:1, ep:[48,66,95], art:'Alle', typ:'Alle', opt:true, risk:'Mittel', lo:35, ma:50, mi:15},
  {id:'EN-005', ber:'Entwässerung', ub:'Rigole', n:'Versickerungsrigole', u:'m³', base:'Rigolen Volumen', fac:1, ep:[180,280,440], art:'Alle', typ:'Alle', opt:true, risk:'Hoch', lo:25, ma:55, mi:20},
  {id:'RA-001', ber:'Einfassungen', ub:'Borde', n:'Tiefbord 8/25', u:'lfm', base:'Umfang', fac:1, ep:[34,48,70], art:'Alle', typ:'Alle', opt:false, risk:'Niedrig', lo:45, ma:45, mi:10},
  {id:'RA-002', ber:'Einfassungen', ub:'Pflaster', n:'Betonpflaster Nebenflächen', u:'m²', base:'Wegefläche', fac:1, ep:[65,88,125], art:'Alle', typ:'Alle', opt:true, risk:'Mittel', lo:45, ma:45, mi:10},
  {id:'KR-001', ber:'Kunstrasen', ub:'Elastik', n:'Elastikschicht Ortseinbau', u:'m²', base:'Kunstrasenfläche', fac:1, ep:[12,17,24], art:'Alle', typ:'Kunstrasen', opt:true, risk:'Mittel', lo:25, ma:60, mi:15},
  {id:'KR-002', ber:'Kunstrasen', ub:'Belag', n:'Kunstrasenteppich liefern/verlegen', u:'m²', base:'Kunstrasenfläche', fac:1, ep:[29,39,54], art:'Alle', typ:'Kunstrasen', opt:false, risk:'Mittel', lo:25, ma:70, mi:5},
  {id:'KR-003', ber:'Kunstrasen', ub:'Verfüllung', n:'Quarzsand einbringen', u:'m²', base:'Kunstrasenfläche', fac:1, ep:[3.5,5,7.5], art:'Alle', typ:'Kunstrasen', opt:false, risk:'Mittel', lo:25, ma:65, mi:10},
  {id:'KR-004', ber:'Kunstrasen', ub:'Verfüllung', n:'Organisches/mineralisches Infill', u:'m²', base:'Kunstrasenfläche', fac:1, ep:[4.5,7.5,12], art:'Alle', typ:'Kunstrasen', opt:true, risk:'Hoch', lo:20, ma:75, mi:5},
  {id:'KR-005', ber:'Kunstrasen', ub:'Linierung', n:'Linierung Fußball', u:'psch', base:'Pauschal', fac:1, ep:[6500,9000,13500], art:'Alle', typ:'Kunstrasen', opt:false, risk:'Niedrig', lo:55, ma:40, mi:5},
  {id:'NR-001', ber:'Naturrasen', ub:'Tragschicht', n:'Rasentragschicht 12 cm', u:'m³', base:'Rasentragschicht Volumen', fac:1, ep:[44,59,82], art:'Alle', typ:'Naturrasen', opt:false, risk:'Mittel', lo:15, ma:65, mi:20},
  {id:'NR-002', ber:'Naturrasen', ub:'Belag', n:'Fertigrasen liefern/verlegen', u:'m²', base:'Naturrasenfläche', fac:1, ep:[9,13,19], art:'Alle', typ:'Naturrasen', opt:true, risk:'Mittel', lo:40, ma:55, mi:5},
  {id:'NR-003', ber:'Naturrasen', ub:'Belag', n:'Ansaat Sportrasen', u:'m²', base:'Naturrasenfläche', fac:1, ep:[3.5,5.5,9], art:'Alle', typ:'Naturrasen', opt:true, risk:'Mittel', lo:45, ma:45, mi:10},
  {id:'NR-004', ber:'Naturrasen', ub:'Pflege', n:'Fertigstellungspflege 12 Wochen', u:'m²', base:'Naturrasenfläche', fac:1, ep:[2.2,3.8,6], art:'Alle', typ:'Naturrasen', opt:false, risk:'Mittel', lo:65, ma:25, mi:10},
  {id:'TN-001', ber:'Tenne', ub:'Belag', n:'Tennendecke 0/3', u:'m³', base:'Tennen Volumen', fac:1, ep:[70,92,128], art:'Alle', typ:'Tenne', opt:false, risk:'Mittel', lo:15, ma:65, mi:20},
  {id:'ZA-001', ber:'Zaunbau', ub:'Ballfang', n:'Ballfangzaun 6 m', u:'lfm', base:'Ballfang Länge', fac:1, ep:[205,275,390], art:'Alle', typ:'Alle', opt:true, risk:'Mittel', lo:35, ma:55, mi:10},
  {id:'ZA-002', ber:'Zaunbau', ub:'Außenzaun', n:'Doppelstabmattenzaun 2 m', u:'lfm', base:'Außenzaun Länge', fac:1, ep:[82,120,185], art:'Alle', typ:'Alle', opt:true, risk:'Mittel', lo:40, ma:50, mi:10},
  {id:'AU-001', ber:'Ausstattung', ub:'Tore', n:'Großfeldtor inkl. Netz', u:'Stk', base:'Fix', fac:2, ep:[2800,3900,5700], art:'Alle', typ:'Alle', opt:false, risk:'Niedrig', lo:20, ma:75, mi:5},
  {id:'AU-002', ber:'Ausstattung', ub:'Kabinen', n:'Spielerkabine 8–10 Personen', u:'Stk', base:'Fix', fac:2, ep:[5800,8200,12500], art:'Alle', typ:'Alle', opt:true, risk:'Niedrig', lo:20, ma:75, mi:5},
  {id:'AU-003', ber:'Ausstattung', ub:'Barriere', n:'Spielfeldbarriere', u:'lfm', base:'Barrieren Länge', fac:1, ep:[95,145,220], art:'Alle', typ:'Alle', opt:true, risk:'Mittel', lo:40, ma:50, mi:10},
  {id:'FL-001', ber:'Flutlicht', ub:'Komplettanlage', n:'LED-Flutlicht 4–6 Masten', u:'psch', base:'Pauschal', fac:1, ep:[120000,160000,235000], art:'Alle', typ:'Alle', opt:true, risk:'Hoch', lo:25, ma:65, mi:10},
  {id:'BEW-001', ber:'Beregnung', ub:'Komplettanlage', n:'Beregnungsanlage Sportplatz', u:'psch', base:'Pauschal', fac:1, ep:[58000,82000,125000], art:'Alle', typ:'Alle', opt:true, risk:'Hoch', lo:30, ma:55, mi:15},
  {id:'AB-001', ber:'Abschluss', ub:'Prüfung', n:'Dokumentation, Prüfungen und Abnahme', u:'psch', base:'Pauschal', fac:1, ep:[7000,10500,17000], art:'Alle', typ:'Alle', opt:false, risk:'Niedrig', lo:80, ma:10, mi:10},
];


export const REFERENZPROJEKTE = [
  {id:'REF-KS-001', name:'Kunstrasen-Neubau Standard', projektart:'Neubau', platztyp:'kunstrasen',
   kostenNetto:1468641, proQmSpielfeld:205.69, hinweis:'Vollausbau mit Flutlicht'},
  {id:'REF-KS-002', name:'Naturrasen-Neubau kommunal', projektart:'Neubau', platztyp:'naturrasen',
   kostenNetto:895000, proQmSpielfeld:125.35, hinweis:'Ansaat statt Fertigrasen; Beregnung enthalten'},
  {id:'REF-KS-003', name:'Kunstrasen-Sanierung Bestand', projektart:'Sanierung', platztyp:'kunstrasen',
   kostenNetto:635000, proQmSpielfeld:88.94, hinweis:'Belag/Infill, punktuelle Unterbau-/Drainagesanierung'},
];

// Regelwerk (R-001 bis R-010 aus dem Blatt "Regelwerk")
export const REGELN = {
  // Optionale Positionen, die im ueblichen Vollausbau standardmaessig aktiv sind
  DEFAULT_ON: ['KR-001','KR-004','NR-003','ER-004','ER-005','ER-011','ZA-001','ZA-002','BE-003','BE-005','BE-006','BE-008'],
  // R-008: bei Bodenrisiko "Hoch" automatisch aktivieren
  BODENRISIKO_HOCH: ['ER-012','ER-013','ER-014','ER-015','ER-016','ER-018'],
  // R-009: Entsorgungsklasse -> Position
  ENTSORGUNG: { Z0:'ER-007', Z1:'ER-008', Z2:'ER-009' },
  // R-010: Sanierungsgrad "nur Belag" -> nur diese Positionen bleiben aktiv
  NUR_BELAG: ['BE-001','BE-002','BE-007','BE-008','RB-001','RB-002','RB-003','KR-002','KR-003','KR-004','KR-005','AB-001'],
};
