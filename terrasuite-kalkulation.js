// =============================================================================
// Terrasuite · Kalkulationsmodul Sportplatzbau · UI als Web Component
//
//   <script type="module" src="./terrasuite-kalkulation.js"></script>
//   <terrasuite-kalkulation></terrasuite-kalkulation>
//
// Funktioniert in jeder HTML-Seite und in Frameworks (React/Vue/Angular).
// Rechnet komplett über kalk-engine.js – keine weiteren Abhängigkeiten.
//
// API:
//   el.getInputs() / el.setInputs({...})   Eingaben lesen / patchen
//   el.getResult()                          aktuelles Ergebnis (Engine-Objekt)
//   el.reset()                              zurück auf Datenbank-Standard
//   el.exportCSV()                          CSV-Download auslösen
//   Event 'kalkulation-change'              detail = Ergebnisobjekt (bei jeder Änderung)
// =============================================================================

import { calculate, toCSV, DEFAULT_INPUTS, PREISNIVEAUS, META } from './kalk-engine.js';

const BICON = {'Baustelleneinrichtung':'🚧','Rückbau':'♻️','Erdarbeiten':'⛏️','Unterbau':'🧱','Entwässerung':'💧','Einfassungen':'📏','Kunstrasen':'🟢','Naturrasen':'🌱','Tenne':'🟤','Zaunbau':'🛡️','Ausstattung':'🥅','Flutlicht':'💡','Beregnung':'🚿','Abschluss':'✅'};
const RCOLOR = {'Niedrig':'#57c274','Mittel':'#e0a33e','Hoch':'#e0803e','Sehr hoch':'#e05a5a'};
const EUR = v => v.toLocaleString('de-DE',{style:'currency',currency:'EUR',maximumFractionDigits:0});

const STYLE = `
  :host{--bg:#0f1512;--surface:#182420;--surface2:#1f2f28;--line:#2b3f36;--text:#e8f0ea;--muted:#93a89b;
    --accent:#57c274;--warn:#e0a33e;--radius:14px;
    display:block;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
    color:var(--text);background:var(--bg);padding:14px;box-sizing:border-box}
  *{box-sizing:border-box}
  .card{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:14px;margin-bottom:12px}
  h3{margin:0 0 10px;font-size:14.5px}
  label{display:block;font-size:11px;color:var(--muted);margin:10px 0 4px;font-weight:600;text-transform:uppercase;letter-spacing:.4px}
  input,select{width:100%;background:var(--surface2);color:var(--text);border:1px solid var(--line);border-radius:10px;padding:10px;font-size:14px;font-family:inherit}
  .inline{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .kv{display:flex;justify-content:space-between;font-size:12.5px;padding:6px 0;border-bottom:1px dashed var(--line);gap:8px}
  .kv:last-child{border-bottom:none}.kv span{color:var(--muted)}
  .khead,.krow{display:grid;grid-template-columns:20px 1fr 56px 66px 78px;gap:6px;align-items:center}
  .khead{font-size:9.5px;color:var(--muted);text-transform:uppercase;letter-spacing:.4px;padding-bottom:5px;border-bottom:1px solid var(--line)}
  .khead div:not(:nth-child(2)){text-align:right}
  .krow{padding:6px 0;border-bottom:1px dashed var(--line)}
  .kname{font-size:12.5px;font-weight:600;line-height:1.25}
  .kname span{color:var(--muted);font-weight:500;font-size:10px;display:block}
  .krow input[type=number]{padding:7px 5px;font-size:12.5px;text-align:right;border-radius:8px}
  .krow input[type=checkbox]{width:15px;height:15px;padding:0;margin:0;accent-color:var(--accent)}
  .ksum{font-size:12px;font-weight:700;text-align:right;white-space:nowrap}
  .koff .kname,.koff .ksum,.koff input[type=number]{opacity:.38}
  .gsub{display:flex;justify-content:space-between;padding-top:9px;font-size:13px;font-weight:800;color:var(--accent)}
  .ktotal{display:flex;justify-content:space-between;padding:8px 0;font-size:13.5px;border-bottom:1px dashed var(--line);gap:8px}
  .ktotal span{color:var(--muted)}.ktotal.big{font-size:16px;font-weight:800;border-bottom:none}
  .ktotal.big b{color:var(--accent)}
  .btn{border:none;border-radius:11px;padding:12px;font-size:14px;font-weight:700;cursor:pointer;width:100%;
    background:linear-gradient(135deg,#57c274,#3fa85e);color:#06140b;margin-top:6px}
  .btn.ghost{background:var(--surface2);color:var(--text);border:1px solid var(--line)}
  .note{font-size:10.5px;color:var(--muted);padding-top:6px}
`;

class TerrasuiteKalkulation extends HTMLElement {
  constructor(){
    super();
    this._inputs = structuredClone ? structuredClone(DEFAULT_INPUTS) : JSON.parse(JSON.stringify(DEFAULT_INPUTS));
    this._ov = { menge:{}, preis:{}, aktiv:{} };
    this._meta = { projekt:'', bauherr:'', bauleiter:'', datum:new Date().toISOString().slice(0,10) };
    this.attachShadow({mode:'open'});
  }
  connectedCallback(){ this._render(); }

  // ---------- öffentliche API ----------
  getInputs(){ return JSON.parse(JSON.stringify(this._inputs)); }
  setInputs(patch){ Object.assign(this._inputs, patch); this._render(); }
  getResult(){ return this._result; }
  reset(){
    this._inputs = JSON.parse(JSON.stringify(DEFAULT_INPUTS));
    this._ov = { menge:{}, preis:{}, aktiv:{} };
    this._render();
  }
  exportCSV(){
    const csv = toCSV(this._result, this._meta);
    const url = URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
    const a = document.createElement('a');
    a.href = url; a.download = 'kalkulation_'+(this._meta.projekt||'sportplatz').replace(/\s+/g,'_')+'.csv';
    a.click(); URL.revokeObjectURL(url);
  }

  // ---------- intern ----------
  _calc(){
    this._result = calculate(this._inputs, this._ov);
    this.dispatchEvent(new CustomEvent('kalkulation-change',{detail:this._result, bubbles:true, composed:true}));
    return this._result;
  }

  _render(){
    const r = this._calc(), inp = this._inputs, geo = r.geometrie;
    const num = (id,label,val,step='1') =>
      `<div><label>${label}</label><input type="number" min="0" step="${step}" data-in="${id}" value="${val}"></div>`;
    const sel = (id,label,opts,val) =>
      `<div><label>${label}</label><select data-in="${id}">${opts.map(([v,t])=>`<option value="${v}"${String(v)===String(val)?' selected':''}>${t}</option>`).join('')}</select></div>`;

    this.shadowRoot.innerHTML = `<style>${STYLE}</style>
    <div class="card">
      <h3>🧮 Kalkulation Sportplatzbau</h3>
      <div class="kv"><span>Preisdatenbank</span><b>${META.system}</b></div>
      <div class="kv"><span>Region · Preisstand</span><b>${META.region} · ${META.preisstand}</b></div>
      <div class="inline">
        ${sel('projektart','Projektart',[['Neubau','Neubau'],['Sanierung','Sanierung']],inp.projektart)}
        ${sel('platztyp','Platztyp',[['kunstrasen','Kunstrasen'],['naturrasen','Naturrasen'],['tenne','Tenne']],inp.platztyp)}
      </div>
      <div class="inline">
        ${sel('preisniveau','Preisniveau',PREISNIVEAUS.map((n,i)=>[i,n]),inp.preisniveau)}
        ${sel('bodenrisiko','Bodenrisiko',[['Niedrig','Niedrig'],['Mittel','Mittel'],['Hoch','Hoch']],inp.bodenrisiko)}
      </div>
      <div class="inline">
        ${sel('entsorgungsklasse','Entsorgungsklasse',[['Z0','Z0 unbelastet'],['Z1','Z1 belastet'],['Z2','>Z1.2 stark belastet']],inp.entsorgungsklasse)}
        ${sel('flutlicht','Flutlicht',[['true','Ja'],['false','Nein']],String(inp.flutlicht))}
      </div>
      <div class="inline">
        ${sel('beregnung','Beregnung',[['true','Ja'],['false','Nein']],String(inp.beregnung))}
        ${inp.projektart==='Sanierung' ? sel('sanierungsgrad','Sanierungsgrad',[['komplett','Komplett'],['belag','Nur Belag']],inp.sanierungsgrad) : '<div></div>'}
      </div>
    </div>

    <div class="card">
      <h3>📐 Eingaben</h3>
      <div class="inline">${num('laenge','Spielfeld Länge (m)',inp.laenge)}${num('breite','Spielfeld Breite (m)',inp.breite)}</div>
      <div class="inline">${num('randLaengs','Randstreifen längs (m)',inp.randLaengs)}${num('randStirn','Randstr. stirnseitig (m)',inp.randStirn)}</div>
      <div class="inline">${num('frostschutz','Frostschutz (m)',inp.frostschutz,'0.01')}${num('tragschicht','Tragschicht (m)',inp.tragschicht,'0.01')}</div>
      <div class="inline">${num('bodenaustausch','Bodenaustausch (m)',inp.bodenaustausch,'0.01')}${num('drainageRaster','Drainage-Raster (m)',inp.drainageRaster)}</div>
      <div class="inline">${num('ballfang','Ballfangzaun (lfm)',inp.ballfang)}${num('aussenzaun','Außenzaun (lfm)',inp.aussenzaun)}</div>
      <div class="inline">${num('bauzeit','Bauzeit (Wochen)',inp.bauzeit)}${num('baustrasse','Baustraße (m²)',inp.baustrasse)}</div>
      <div class="inline">${num('schutzbaeume','Schutzbäume (Stk)',inp.schutzbaeume)}${num('barriere','Spielfeldbarriere (lfm)',inp.barriere)}</div>
      <div class="inline">${num('rigolen','Rigole (m³)',inp.rigolen)}${inp.projektart==='Sanierung'?num('rueckbauMineralisch','Rückbau mineral. (t)',inp.rueckbauMineralisch):'<div></div>'}</div>
      ${inp.projektart==='Sanierung'?`<div class="inline">${num('rueckbauGemischt','Rückbau gemischt (t)',inp.rueckbauGemischt)}<div></div></div>`:''}
      <div style="height:10px"></div>
      <div class="kv"><span>Spielfeldfläche</span><b>${geo.spielflaeche.toLocaleString('de-DE')} m²</b></div>
      <div class="kv"><span>Gesamtbaufläche</span><b>${Math.round(geo.gesamtflaeche).toLocaleString('de-DE')} m²</b></div>
      <div class="kv"><span>Umfang</span><b>${Math.round(geo.umfang).toLocaleString('de-DE')} lfm</b></div>
      <div class="kv"><span>Drainagelänge (autom.)</span><b>${Math.round(geo.drainagelaenge).toLocaleString('de-DE')} lfm</b></div>
    </div>

    ${r.gruppen.map(gr=>`
    <div class="card">
      <h3>${BICON[gr.bereich]||''} ${gr.bereich}</h3>
      <div class="khead"><div></div><div>Position</div><div>Menge</div><div>EP €</div><div>Summe</div></div>
      ${gr.positionen.map(p=>{
        const risk = (p.risk==='Hoch'||p.risk==='Sehr hoch')?` · <b style="color:${RCOLOR[p.risk]}">Risiko ${p.risk}</b>`:'';
        return `<div class="krow ${p.aktiv?'':'koff'}">
          <input type="checkbox" data-on="${p.id}" ${p.aktiv?'checked':''}>
          <div class="kname">${p.n}<span>${p.ub} · ${p.u} · ${p.formel}${p.opt?' · optional':''}${risk}</span></div>
          <input type="number" min="0" data-q="${p.id}" value="${p.menge}">
          <input type="number" min="0" step="0.5" data-p="${p.id}" value="${p.epAktuell}">
          <div class="ksum">${p.summe?EUR(p.summe):'–'}</div>
        </div>`;}).join('')}
      <div class="gsub"><span>Zwischensumme</span><span>${EUR(gr.zwischensumme)}</span></div>
    </div>`).join('')}

    <div class="card">
      <h3>➕ Zuschläge (%) / ➖ Nachlässe (€)</h3>
      <div class="inline">${num('z.baustellengemeinkosten','BGK %',inp.zuschlaege.baustellengemeinkosten,'0.5')}${num('z.wagnis','Wagnis %',inp.zuschlaege.wagnis,'0.5')}</div>
      <div class="inline">${num('z.gewinn','Gewinn %',inp.zuschlaege.gewinn,'0.5')}${num('z.unvorhergesehenes','Unvorherges. %',inp.zuschlaege.unvorhergesehenes,'0.5')}</div>
      <div class="inline">${num('n.nachlass','Nachlass €',inp.nachlaesse.nachlass,'1000')}${num('n.sonderrabatt','Sonderrabatt €',inp.nachlaesse.sonderrabatt,'1000')}</div>
    </div>

    <div class="card">
      <h3>💶 Gesamtkalkulation</h3>
      <div id="sums"></div>
      <button class="btn" data-act="csv">⬇ Kalkulation als CSV</button>
      <button class="btn ghost" data-act="reset">↺ Zurücksetzen</button>
    </div>`;

    this._renderSums();
    this.shadowRoot.addEventListener('input', this._onInput = this._onInput || (e=>this._handle(e)));
    this.shadowRoot.addEventListener('click', this._onClick = this._onClick || (e=>{
      const act = e.target.dataset && e.target.dataset.act;
      if(act==='csv') this.exportCSV();
      if(act==='reset') this.reset();
    }));
  }

  _renderSums(){
    const r = this._result, s = r.summen;
    let h = `<div class="ktotal"><span>Zwischensumme (netto, ${PREISNIVEAUS[r.inputs.preisniveau]})</span><b>${EUR(s.netto)}</b></div>`;
    s.zuschlaege.forEach(z=>h+=`<div class="ktotal"><span>${z.name} (${z.prozent} %)</span><b>${EUR(z.betrag)}</b></div>`);
    if(s.nachlass) h+=`<div class="ktotal"><span>Nachlass</span><b>− ${EUR(s.nachlass)}</b></div>`;
    if(s.sonderrabatt) h+=`<div class="ktotal"><span>Sonderrabatt</span><b>− ${EUR(s.sonderrabatt)}</b></div>`;
    h+=`<div class="ktotal"><span>Endpreis netto</span><b style="color:var(--accent)">${EUR(s.endpreisNetto)}</b></div>`;
    h+=`<div class="ktotal"><span>MwSt. 19 %</span><b>${EUR(s.mwst)}</b></div>`;
    h+=`<div class="ktotal big"><span>Gesamt brutto</span><b>${EUR(s.brutto)}</b></div>`;
    h+=`<div class="ktotal"><span>Szenario-Spanne netto</span><b>${EUR(s.szenarioNiedrig)} – ${EUR(s.szenarioHoch)}</b></div>`;
    if(s.netto>0){
      const pc=v=>Math.round(v/s.netto*100);
      h+=`<div class="ktotal"><span>Kostenstruktur</span><b style="font-size:12px">Lohn ${pc(s.lohn)} % · Material ${pc(s.material)} % · Geräte ${pc(s.maschine)} %</b></div>`;
      h+=`<div class="ktotal"><span>Risiko hoch/sehr hoch</span><b style="color:${RCOLOR['Hoch']}">${EUR(s.risikoAnteil)} (${pc(s.risikoAnteil)} %)</b></div>`;
    }
    if(r.kennzahlen) h+=`<div class="note"><b style="color:var(--text)">Kennzahlen:</b> ${Math.round(r.kennzahlen.proQmSpielfeld)} €/m² Spielfläche · ${Math.round(r.kennzahlen.proQmGesamt)} €/m² Baufläche</div>`;
    if(r.benchmark){
      const d=r.benchmark.abweichungProzent;
      h+=`<div class="note"><b style="color:var(--text)">Benchmark:</b> ${r.benchmark.referenz.name} = ${Math.round(r.benchmark.referenz.proQmSpielfeld)} €/m² · Abweichung <b style="color:${Math.abs(d)<=15?'var(--accent)':'var(--warn)'}">${d>=0?'+':''}${d.toFixed(1).replace('.',',')} %</b></div>`;
    }
    h+=`<div class="note">${META.system} · ${META.region} · Preisstand ${META.preisstand} · netto ohne Planung/Baunebenkosten · Budgetreserve ${META.budgetreserve} empfohlen.</div>`;
    this.shadowRoot.getElementById('sums').innerHTML = h;
  }

  _handle(e){
    const t = e.target, d = t.dataset || {};
    if(d.on){ this._ov.aktiv[d.on] = t.checked; t.closest('.krow').classList.toggle('koff',!t.checked); this._softUpdate(); return; }
    if(d.q){ this._ov.menge[d.q] = +t.value||0; this._softUpdate(); return; }
    if(d.p){ this._ov.preis[d.p] = +t.value||0; this._softUpdate(); return; }
    if(!d.in) return;
    const id = d.in, v = t.value;
    if(id.startsWith('z.')){ this._inputs.zuschlaege[id.slice(2)] = +v||0; this._softUpdate(); return; }
    if(id.startsWith('n.')){ this._inputs.nachlaesse[id.slice(2)] = +v||0; this._softUpdate(); return; }
    const structural = ['projektart','platztyp','preisniveau','bodenrisiko','entsorgungsklasse','flutlicht','beregnung','sanierungsgrad'].includes(id);
    this._inputs[id] = (id==='flutlicht'||id==='beregnung') ? v==='true'
      : (id==='preisniveau') ? +v
      : (['projektart','platztyp','bodenrisiko','entsorgungsklasse','sanierungsgrad'].includes(id)) ? v : (+v||0);
    if(structural){ this._render(); }               // Struktur ändert sich -> komplett neu
    else { this._syncQuantities(); this._softUpdate(); }  // nur Zahlen -> weich aktualisieren
  }

  _syncQuantities(){
    const r = this._calc();
    r.positionen.forEach(p=>{
      if(this._ov.menge[p.id]!==undefined) return;
      const el = this.shadowRoot.querySelector(`[data-q="${p.id}"]`);
      if(el) el.value = p.menge;
    });
    // Geometrie-Anzeige aktualisieren (im Eingaben-Block, 2. Karte)
    const kvs = this.shadowRoot.querySelectorAll('.card:nth-of-type(2) .kv b');
    const geo = r.geometrie;
    if(kvs.length>=4){
      kvs[0].textContent = geo.spielflaeche.toLocaleString('de-DE')+' m²';
      kvs[1].textContent = Math.round(geo.gesamtflaeche).toLocaleString('de-DE')+' m²';
      kvs[2].textContent = Math.round(geo.umfang).toLocaleString('de-DE')+' lfm';
      kvs[3].textContent = Math.round(geo.drainagelaenge).toLocaleString('de-DE')+' lfm';
    }
  }

  _softUpdate(){
    const r = this._calc();
    r.positionen.forEach(p=>{
      const row = this.shadowRoot.querySelector(`[data-q="${p.id}"]`);
      if(row){ const sumEl = row.parentElement.querySelector('.ksum'); if(sumEl) sumEl.textContent = p.summe?EUR(p.summe):'–'; }
    });
    // Gruppen-Zwischensummen
    this.shadowRoot.querySelectorAll('.gsub span:last-child').forEach((el,i)=>{
      if(r.gruppen[i]) el.textContent = EUR(r.gruppen[i].zwischensumme);
    });
    this._renderSums();
  }
}

customElements.define('terrasuite-kalkulation', TerrasuiteKalkulation);
export { TerrasuiteKalkulation };
