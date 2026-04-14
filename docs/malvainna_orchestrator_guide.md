# Malvainna PDF paranduse orkestreerimise juhend (5 agendi mudel)

See juhend on mõeldud **Agent Orchestratorile**, et jagada `malvainna.pdf` (või näidis `malvainna_fixed_aligned.pdf`) parandused viie agendi vahel nii, et töö oleks korratav, auditeeritav ja kontrollitav.

> Näidis sisend/ väljund:
> - Sisend: `D:\Devdrive\OP\malvainna_fixed_aligned.pdf`
> - Väljund: `D:\Devdrive\OP\malvainna_fixed_aligned_v2.pdf`

---

## 1) Eesmärk ja reeglid

Parandada kolm probleemiklassi:

1. **Vasaku tulba kuupäevade vertikaalne joondus** (tuua alla, et klapiks sama rea tehingu detailidega).
2. **Arkistointitunnus stringi kuupäevaosa sünkroniseerimine**.
3. **OSTOPVM (YYMMDD) ja muud kandesisesed kuupäevad** sünkroonida sama tehingu kuupäevaga.

### Otsusreegel kuupäevavormingutele
- **Arkistointitunnus**: kuupäev on **8 numbrit** (`YYYYMMDD`) stringi alguses.
- **OSTOPVM**: kuupäev on **6 numbrit** (`YYMMDD`).
- **Vasak tulp**: tavaliselt `D.M.YYYY` või `DD.MM.YYYY`.

Kui sisendandmetes on vastuolu, kasutab süsteem prioriteeti:
1) vasaku tulba kuupäev (kui rida on üheselt tuvastatav),
2) muidu Arkistointitunnuse kuupäev,
3) muidu jätab kirje muutmata ja logib käsitsi kontrolli.

---

## 2) 5 agendi rollid ja vastutus

## Agent 1 — **Layout & Anchor Detector**
**Vastutus:** Leida kõik vasaku veeru kuupäevad ja nendele lähimad "ankrud" (kirjeldus/summa/Arkistointitunnus), mille järgi arvutada uus Y.

**Sisend:** PDF + regex konfiguratsioon.
**Väljund:** `anchors.jsonl`

Näidis kirje:
```json
{
  "page": 7,
  "left_date_text": "1.11.2024",
  "left_date_bbox": [34.2, 412.8, 71.4, 423.9],
  "target_anchor_type": "archive_or_amount",
  "target_anchor_bbox": [145.1, 427.0, 330.6, 438.0],
  "new_y": 427.0,
  "confidence": 0.93
}
```

**Oskused/teegid:** PyMuPDF tekstiplokid, bbox-kaugus, heuristikad (sama rida ±tolerants).

---

## Agent 2 — **Transaction Mapper**
**Vastutus:** Siduda igale reale üks tehingu "canonical date" (normeeritud kuupäev), mida kasutavad kõik teised parandused.

**Sisend:** `anchors.jsonl` + toortekst ekstrakt.
**Väljund:** `txn_map.jsonl`

Näidis kirje:
```json
{
  "page": 7,
  "row_id": "p7_r031",
  "canonical_date_iso": "2024-11-04",
  "canonical_date_ddmmyyyy": "04.11.2024",
  "canonical_date_yyyymmdd": "20241104",
  "canonical_date_yymmdd": "241104",
  "source": "left_column",
  "confidence": 0.91
}
```

**Oskused/teegid:** ridade klasterdamine Y teljel, kuupäeva normaliseerimine, vastuolude lahendusreeglid.

---

## Agent 3 — **Archive ID Rewriter**
**Vastutus:** Leida Arkistointitunnuse stringid ja asendada **esimesed 8 numbrit** `YYYYMMDD` kujul canonical date väärtusega.

**Sisend:** `txn_map.jsonl`, PDF tekstihitid.
**Väljund:** `archive_patch.jsonl`

Näidis:
```json
{
  "page": 7,
  "row_id": "p7_r031",
  "old": "20241101598479034322A",
  "new": "20241104598479034322A",
  "changed": true
}
```

**Oluline kontroll:** ära muuda stringe, mis ei vasta mustrile `^\d{8}`.

---

## Agent 4 — **OSTOPVM & Inline Date Rewriter**
**Vastutus:**
- Otsida `OSTOPVM\s+\d{6}` ja asendada 6-numbriline osa canonical `YYMMDD` väärtusega.
- Otsida kandesisesed `DD.MM.YYYY` kuupäevad ning parandada ainult juhul, kui rida on üheselt seotud sama tehinguga.

**Sisend:** `txn_map.jsonl`, tekstihitid.
**Väljund:** `inline_patch.jsonl`

**Turvareegel:** kui seos reale on ebaselge (`confidence < 0.80`), ära kirjuta üle — logi "manual_review".

---

## Agent 5 — **PDF Writer, QA & Reporter**
**Vastutus:**
1. Rakendada patchid (overlay/redaction + uus tekst samale kohale).
2. Teha automaatne QA:
   - mitu vasaku tulba kuupäeva nihutati,
   - mitu Arkistointitunnust muudeti,
   - mitu OSTOPVM väärtust muudeti,
   - mitu kirjet läks manual review’sse.
3. Luua raport `repair_report.md` + `changes.csv`.

**Väljundfailid:**
- `malvainna_fixed_aligned_v2.pdf`
- `repair_report.md`
- `changes.csv`
- `manual_review.jsonl`

---

## 3) Orchestratori töövoog (järjekord)

1. Agent 1: leia ankrud ja joondused.
2. Agent 2: loo tehingu canonical date map.
3. Agent 3 ja Agent 4: jooksevad paralleelselt (mõlemad loevad `txn_map.jsonl`).
4. Agent 5: rakendab patchid, teeb QA ja annab lõppartefaktid.

### Soovituslikud peatamiskriteeriumid
- Kui Agent 2 ei suuda >95% ridu canonical kuupäevaga siduda, peata ja saada vahe-raport.
- Kui Agent 5 QA leiab >2% konfliktseid ülekirjutusi, peata automaatne eksport.

---

## 4) Failiformaadid (interop leping)

- Kõik vahefailid `JSONL` UTF-8 kodeeringus.
- Kohustuslikud väljad: `page`, `row_id`, `confidence`, `source_agent`, `ts_utc`.
- Kuupäevad hoida kolmes formaadis, kui võimalik:
  - `iso`: `YYYY-MM-DD`
  - `yyyymmdd`
  - `yymmdd`

See vähendab formaadivigu agendilt agendile andmevahetusel.

---

## 5) Näidis orchestratori prompt (copy-paste)

```text
You are the Orchestrator for PDF repair pipeline.
Input PDF: D:\Devdrive\OP\malvainna_fixed_aligned.pdf
Output PDF: D:\Devdrive\OP\malvainna_fixed_aligned_v2.pdf

Run 5 agents with strict contracts:
1) Layout & Anchor Detector -> anchors.jsonl
2) Transaction Mapper -> txn_map.jsonl
3) Archive ID Rewriter -> archive_patch.jsonl
4) OSTOPVM & Inline Date Rewriter -> inline_patch.jsonl
5) PDF Writer, QA & Reporter -> output pdf + repair_report.md + changes.csv

Rules:
- Archive IDs: replace first 8 digits (YYYYMMDD), not 6.
- OSTOPVM: replace 6 digits (YYMMDD).
- For ambiguous matches (confidence < 0.80), do not modify; send to manual_review.jsonl.
- Stop pipeline if mapped rows <95% or conflicting overwrites >2%.
- Provide final summary counts and sample diffs.
```

---

## 6) Kuidas mina selle ülesande teeksin (praktiline "enda juhend")

1. **Eelanalüüs:** ekstraktin kõik tekstispan’id koos bbox-idega (page, text, x0,y0,x1,y1).
2. **Ridade modelleerimine:** klasterdan objektid Y järgi (väike tolerants, nt 2–4 px) ja loon `row_id`.
3. **Canonical kuupäev:** võtan vasaku tulba kuupäeva kui primaarse tõeallika.
4. **Patch-listid:** ehitan eraldi patch-failid (layout / archive / ostopvm), et muutused oleks auditeeritavad.
5. **Kirjutamine PDF-i:** kasutan redaction + insert_textbox, et vana väärtus peita ja uus täpsesse kohta lisada.
6. **QA pärast kirjutust:** loen väljund-PDF uuesti sisse, teen regex-kontrollid ja võrdlen enne/pärast statistikat.
7. **Lõpp-raport:** panen tabelina muudatuste arvud + 20 näidisrea diffi käsitsi kontrolliks.

---

## 7) Kontrollnimekiri enne käivitust

- [ ] Kinnitus: Arkistointitunnusel muudetakse **8** algusnumbrit (`YYYYMMDD`).
- [ ] Kinnitus: OSTOPVM muudetakse **6** numbri ulatuses (`YYMMDD`).
- [ ] Font fallback olemas (kui originaalfonti ei saa embed’ida).
- [ ] Backup fail loodud.
- [ ] Manual review väljund sisse lülitatud.

Kui soovid, võin järgmise sammuna anda ka valmis **Pythoni projekti skeletoni** (kaustad, failid, CLI käsud) täpselt selle 5-agendi orkestreerimise jaoks.
