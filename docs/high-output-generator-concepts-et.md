# Kõrge võimsusega püsimagnetgeneraatori kontseptsioonid (ET)

## Lühike ülevaade
See dokument koondab mõtted kõrge võimsustihedusega püsimagnetgeneraatorite kohta ning toob välja järgmised strateegilised arengusammud.

## Tuleviku võimalused ja 20 sammu ette
### 5–10 aasta arengud
- **Uued magnetmaterjalid**: suurema energiatihedusega haruldaste muldmetallide sulamid ja ferriidi/hübriidlahendused, mis vähendavad sõltuvust kriitilistest tarneahelatest.
- **HTS‑mähised (high-temperature superconductors)**: madalama kaoga mähised võimaldavad sama gabariidiga suuremat võimsust, eriti aeglastel pöörlemiskiirustel.
- **Paremini juhitav jahutus**: mikrokanneldusega vedelikjahutused, faasimuutusega materjalid ja digitaalne termiline kaksik, mis hoiab mähised optimaalses tööaknas.

### AI roll
- **FEA optimeerimine**: parameetrite automaatne häälestus, et leida optimaalne õhupilu, magneti kuju ja mähise geomeetria.
- **Topoloogia‑generatsioon**: algoritmiline disain otsib kergeid, kuid jäiku rootori ja staatori struktuure.
- **Rikete prognoos**: andmepõhine mudel tuvastab kuumenemise, vibratsiooni ja magneti degradatsiooni varajasi mustreid.

### Inimese roll
- **Ohutus**: mehaaniliste ja elektriliste kaitsete valideerimine, sh ülepinge ja termokaitsed.
- **Mehhaaniline tolerants**: kriitiliste õhupilude, laagrite ja tasakaalustuse piiride tagamine.
- **Sertifitseerimine**: vastavus standarditele (nt IEC/ISO) ning dokumenteeritud testiplaanid.
- **Tootmiskvaliteet**: protsessikontroll, jälgitavus ja kvaliteedi tagamise mõõdikud.

### Järgmise 20 sammu teejuht
1. **Andmekogumine → Mudel → Prototüüp → Test → Iteratsioon**
   - Alusta mõõtmistega (temperatuur, vibratsioon, pinge), loo mudel, ehita prototüüp, testi ja korrigeeri.
2. **Magnetmaterjalide võrdlus → FEA → Tootetolerantside määramine → Töökindluse test**
   - Võrdle materjale, valideeri arvutustega, lukusta tolerantsid ja stress-testid.
3. **Jahutuskontseptsioon → CFD → Termiline prototüüp → Pikaajaline tsüklitest**
   - Disaini jahutus, simuleeri voolud, ehita termiline makett ja katseta elutsüklit.
4. **AI‑diagnostika → Reaalandmed → Veamudeli koolitus → Hooldusstrateegia**
   - Loo diagnostika, toida reaalandmetega, treeni rikete mudelid ja planeeri hooldus.
5. **Tootmisliin → Kvaliteedikontroll → Sertifitseerimine → Skaala‑kordistamine**
   - Käivita liin, lukusta QC, vii läbi sertifitseerimine ja skaleeri tootmine.
# High-Output Permanent Magnet Generator Concepts – Eesti keel

## Eestikeelne kokkuvõte (LLM-A/B/C)

**LLM-A – Kahepoolne Halbachi aksiaalvoolugeneraator**  
Kahel vastamisi asuval aksiaalvoolurootoril on Halbachi magnetmustrid, mis koondavad magnetvoo statori suunas ja vähendavad tagarauda vajadust. See annab kõrge kasuteguri ja suure võimsustiheduse, kuid nõuab täpset mehhaanilist tolerantsi (eriti õhupilu) ja head jahutust. Sobib otsedrive tuule- või hüdrogeneraatoriteks, kus mass ei ole kriitiline.

**LLM-B – Voolujoontele fokusseeritud toroidgeneraator**  
Toroidstator koos reguleeritavate magnetmoodulitega võimaldab optimeerida õhupilua kuuma või koormuse muutuse korral. Disain rõhub kompaktsusele ja massi vähendamisele; see on kasulik kergetes või õhku tõstetavates rakendustes. Võimsus on veidi väiksem kui LLM-A, kuid paindlik fluxi “tuning” ja hooldatavus on tugevad eelised.

**LLM-C – Mitmeastmeline vasturööbastuv (counter-rotating) kontseptsioon**  
Kaks rootorit pöörlevad vastassuunas, mis kahekordistab suhtelise kiiruse statori suhtes ilma, et labatippude kiirus kasvaks. See tõstab võimsustiheduse kõrgeks, kuid lisab käigukasti/planeetmehhanismi keerukuse ning vibratsiooni juhtimise nõude. Sobib kõrge energianõudlusega rakendustele, kus ruum on piiratud (nt mereturbiiinid).

---

## Terminiseletused (Eesti keeles)

* **Rim speed (labatipu lineaarne kiirus)** – Rootori ääre (labatipu) lineaarne kiirus, millega see liigub ümber telje; mõjutab otseselt nurkkiirust ja seega elektrilist sagedust.  
* **Air gap (õhupilu)** – Rootori magnetite ja statori vahel olev väike vahe; väiksem õhupilu suurendab magnetilist sidestust, kuid nõuab täpsemat mehhaanilist tolerantsi.  
* **Flux density (magnetvoo tihedus)** – Magnetvälja tugevus (teslates), mis iseloomustab kui palju magnetvoogu läbib ühikpindala; kõrgem väärtus tähendab suuremat võimalikku pöördemomenti.  
* **Shear stress (nihkepinged õhupiluas)** – Magnetväljast ja voolust tulenev nihkejõu tihedus õhupiluas, mida kasutatakse pöördemomendi hinnangutes.  
* **Pole pair (poolpaar)** – N+S pooluste paar; rohkem poolpaare tähendab kõrgemat elektrilist sagedust sama mehaanilise kiiruse juures.  
* **Back iron (tagaraud)** – Magnetvoogu sulgev ferromagnetiline tagarõngas; vähendab lekkevoogu, kuid lisab massi.  
* **SMC (soft magnetic composite)** – Pehme magnetkomposiit, mida kasutatakse statorites keerukate kujude ja väikeste pöörisvoolukadude saavutamiseks.  
* **Copper fill factor (mähise täitetegur)** – Protsentuaalne osa mähise akna ristlõikest, mis on tegelikult vasest; kõrgem täitetegur vähendab takistust, kuid raskendab tootmist.  

---

## Märkus hinnangute kohta

Esitatud võimsused, pöördemomendid ja magnetvälja parameetrid on **hinnangulised** ning vajavad **FEA (lõplike elementide analüüs)** ja **termilise modelleerimise** valideerimist. Praktikas võivad tootmistolerantsid, materjalide tegelikud omadused, jahutuse efektiivsus ja vibratsioon mõjutada lõpptulemusi märkimisväärselt.
