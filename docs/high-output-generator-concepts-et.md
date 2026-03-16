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
