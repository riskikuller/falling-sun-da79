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
