# High-Output Permanent Magnet Generator Concepts – eestikeelne ülevaade

## Eestikeelne kokkuvõte kontseptsioonidest (LLM-A/B/C)

### LLM-A: Dual-Halbach aksiaalvoo generaator
- Kaks vastastikku paigutatud Halbachi magnetrõngast ja keskele paigutatud staator.
- Halbachi paigutus koondab magnetvälja staatori suunas, mis aitab tõsta võimsustihedust ja kasutegurit.
- Tugevus: kõrge efektiivsus ja hea sobivus otsedrive rakendustele (nt maa-pealsed tuule- või hüdrolahendused).
- Kompromiss: termiline koormus ja mehaaniline pinge kasvavad koos pöörlemiskiirusega.

### LLM-B: Voolusuunatud toroidgeneraator
- Kompaktne toroidne staator C-raami sees ning reguleeritavad magnetmoodulid.
- Õhuvahe ja magnetvoo tee on häälestatavad, mis aitab hoida kasutegurit eri tööpunktides.
- Tugevus: väike mass, modulaarne ehitus, sobiv kergetele/mobiilsetele süsteemidele.
- Kompromiss: absoluutne pöördemoment ja tippvõimsus on üldiselt madalamad kui suurematel lahendustel.

### LLM-C: Mitmeastmeline vastassuunaliselt pöörlev generaator
- Kaks aksiaalvoo rootorit pöörlevad vastassuundades ühise staatori suhtes.
- Relatiivne nurkkiirus staatori suhtes suureneb, mis võimaldab kõrgemat elektrilist sagedust ja võimsustihedust.
- Tugevus: suurim potentsiaalne väljund samas gabariidis.
- Kompromiss: suurem mehaaniline keerukus (nt käigukast, vibratsioon, balansseerimine).

## Terminiseletused

- **Rim speed (rootori servakiirus)** – rootori välisserva lineaarne kiirus (km/h või m/s), millest saab raadiuse kaudu leida nurkkiiruse.
- **Air gap (õhuvahe)** – rootori ja staatori vaheline lõtk; väiksem ja stabiilne õhuvahe parandab tavaliselt magnetilist sidestust.
- **Flux density (magnetvoo tihedus)** – magnetvälja tugevus õhuvahes, mõõdetakse teslades (T); mõjutab otseselt tekitatavat pöördemomenti.
- **Back EMF (vastuelektromotoorjõud)** – mähises pöörlemisel indutseeritud pinge, mis kasvab koos kiiruse ja magnetvooga.
- **Halbach array (Halbachi magnetiarr)** – magnetite eripaigutus, mis koondab välja ühele poole ja vähendab lekkimist teisele poole.
- **Fill factor (täitefaktor)** – vaskjuhtmete osakaal mähise ristlõikes; kõrgem täitefaktor tähendab tavaliselt väiksemat vaskkadu.
- **Counter-rotation (vastassuunaline pöörlemine)** – rootorid pöörlevad teineteisele vastupidises suunas, kasvatades staatori suhtelist kiirust.
- **FEA (lõplike elementide analüüs)** – numbriline simulatsioonimeetod elektromagnetika ja mehaanika täpsemaks hindamiseks.

## Orienteeruvad väljundtasemed (hinnangulised)

Allolevad väärtused on **orienteeruvad** ja kokkuvõtlikud:
- **LLM-A**: kuni ~20,7 kW netoväljund (75 km/h servakiirusel).
- **LLM-B**: kuni ~13,4 kW netoväljund (65 km/h servakiirusel).
- **LLM-C**: kuni ~34,0 kW netoväljund (50 km/h rootori servakiirusel per rootor, relatiivkiiruse efektiga).

## Oluline märkus valideerimise kohta

Kõik numbrid on esialgsed insenerhinnangud. Enne projekteerimisotsuseid tuleb need valideerida:
1. **Elektromagnetiline FEA** (vootihedus, pöördemoment, küllastus, kaod).
2. **Termiline analüüs** (mähise temperatuurid, jahutuse piisavus, pidevkoormuse piirid).
3. **Mehaaniline kontroll** (vibratsioon, laagrite koormus, rootori pinged ja turvategurid).

Ilma FEA ja termilise valideerimiseta ei tohi neid väärtusi käsitleda lõplike jõudlusnäitajatena.
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
