# ML Interni ja GitHubi autonoomsuse audit

**Auditi kuupäev:** 23.10.2026

## Lühijäreldus

1. Hugging Face'i eraldiseisev `huggingface/ml-intern` repositoorium ja CLI on lõpetatud ning repositoorium on arhiveeritud. Aktiivne ML Intern elab edasi HuggingChati režiimina.
2. GitHubi-sisene autonoomsus on tootena olemas: Copilot cloud agent ning Claude'i ja Codexi partneragendid saavad issue'st alustada, pilves töötada ja draft-PR-i koostada.
3. Selle projekti puhul ei saanud GitHubi-poolset käivitust auditi keskkonnast lõpuni tõendada, sest lokaalsel checkout'il puudusid Git remote ja autentitud `gh` sessioon. Seega vastus küsimusele „kas see meil töötab?” on: **repo on nüüd tehniliselt ette valmistatud, kuid konto-/organisatsiooniõiguste ja päris agendisessiooni kontroll on veel tegemata**.

## ML Interni arenguseis

### Mis lõpetati

- Algne `huggingface/ml-intern` projekt on read-only arhiiv.
- Eraldiseisvat hostitud veebirakendust ja `ml-intern` CLI-d enam ei hooldata.
- Arhiivi ei lisata turvaparandusi ega kasutajatuge; uut kasutuselevõttu selle koodi peale ei soovitata.

### Mis töötab edasi

ML Intern on integreeritud HuggingChati. Praegune töövoog suudab:

- lugeda ML-artikleid, mudeleid ja andmestikke;
- koostada tööplaani ning kirjutada treeningu/evalveerimise skripte;
- käivitada Hugging Face Jobse ja liivakaste;
- avaldada mudeli, andmestiku või Space'i Hubi;
- näidata jooksvaid ressursse, logisid ja Trackio mõõdikuid;
- jätkata katkestatud sammu funktsiooniga **Resume**.

See on ML-töö autonoomsus Hugging Face'i ökosüsteemis, mitte GitHubi repositooriumi üldotstarbeline issue-to-merge agent.

## GitHubi-sisese autonoomsuse seis

GitHubis on kaks eri taset, mida ei tohiks segi ajada:

### 1. Cloud coding agent

Copilot, Claude või Codex saab:

1. võtta vastu GitHub Issue või Agents-vaates antud ülesande;
2. töötada isoleeritud GitHub Actionsi keskkonnas;
3. muuta faile ning käivitada buildi, teste ja lintimist;
4. avada draft pull request'i;
5. reageerida PR-i kommentaaridele ja jätkata iteratsiooni.

See on järelevalvega autonoomsus: agent ei peaks kaitstud harusse otse merge'ima ning inimene vastutab ülevaatuse ja merge'i eest.

### 2. Autopilot ja agentic workflows

- Autopilot jätkab ühe sessiooni sees mitut sammu ilma iga sammu järel kinnitust küsimata.
- Õigused on Autopilotist eraldi: režiimi sisselülitamine ei anna automaatselt ligipääsu failidele, võrgule ega kirjutavatele GitHubi operatsioonidele.
- GitHub Agentic Workflows võimaldab ajastatud või sündmusepõhist agenditööd, kuid write-operatsioonid tuleb piirata deklareeritud safe-output'idega.

## Selle repositooriumi audit

| Kontroll | Enne auditit | Pärast muudatust | Tähendus |
|---|---|---|---|
| Git remote | Puudus | Puudub lokaalses checkout'is | GitHubi omanikku/repositooriumi ega serveriseadeid ei saanud tuvastada. |
| `gh` autentimine | Puudus | Puudub auditi keskkonnas | Issue määramist agendile ja agendisessiooni ei saanud API kaudu proovida. |
| Tavaline CI | Puudus | `.github/workflows/ci.yml` | PR ja põhiharu push käivitavad `npm ci` ning `npm run check`. |
| Agendi keskkonna setup | Puudus | `.github/workflows/copilot-setup-steps.yml` | Cloud agent saab deterministliku Node 20 keskkonna ja sõltuvused. |
| Repo agendijuhised | Puudus | `.github/copilot-instructions.md` | Agent teab struktuuri, valideerimiskäsku ja PR-i nõudeid. |
| Automaatne merge | Puudus | Tahtlikult lisamata | Inimese review jääb turvapiiriks. |

## Aktiveerimise kontrollnimekiri GitHubis

Repo omanik või organisatsiooni administraator peab tegema järgmised sammud:

- [ ] Push'ima selle muudatuse vaikimisi harusse; Copiloti setup-faili kasutatakse ainult siis, kui see on default branch'is.
- [ ] Kontrollima, et Actions on repositooriumis lubatud ja `CI` ning `Copilot Setup Steps` lõpetavad roheliselt.
- [ ] Kontrollima, et kasutajal on tasuline Copiloti plaan, repo write-õigus ja cloud agent on konto või organisatsiooni poliitikas lubatud.
- [ ] Lubama soovitud partneragendid (Codex/Claude) Copilot coding agent settings all, kui neid kasutatakse.
- [ ] Seadistama branch protection'i nii, et `validate` kontroll ja vähemalt üks inimreview on enne merge'i nõutud.
- [ ] Hoidma agendi tulemused draft-PR-is; production-deploy ja merge ei tohi olla agendi tokeniga vaikimisi lubatud.
- [ ] Kontrollima interneti tulemüüri allowlist'i; npm-i sõltuvuste install peab töötama, kuid tarbetut väljaminevat võrguühendust ei tohiks lubada.

## Minimaalne tõendustest

Pärast failide jõudmist default branch'i:

1. Käivita Actions-vaates käsitsi **Copilot Setup Steps** ja kontrolli, et `npm run check` on roheline.
2. Loo piiratud test-issue: „Lisa README-sse üks lause ja valideeri `npm run check`.”
3. Määra issue Copilotile või käivita Agents-vaatest Codex/Copilot.
4. Kontrolli, et agent loob eraldi haru ja draft-PR-i, CI käivitub ning PR-is on päris käsutulemused.
5. Lisa review-kommentaar väikese parandusega ja kontrolli, et agent teeb uue commiti samasse PR-i.
6. Merge'i teeb inimene alles pärast diffi ja kontrollide ülevaatust.

Kõik kuus sammu peavad õnnestuma, enne kui võib öelda, et GitHubi-sisene autonoomsus „meil töötab”. Praeguse auditi põhjal on konfiguratsiooni eeldused repos olemas, kuid serveripoolne end-to-end tõend puudub.

## Allikad

- [Hugging Face ML Interni arhiveeritud repositoorium](https://github.com/huggingface/ml-intern)
- [ML Intern HuggingChatis: alustamine](https://github.com/huggingface/chat-ui/blob/main/docs/source/ml-intern/getting-started.md)
- [GitHub: Agents panel ja Copilot coding agent](https://github.blog/news-insights/product-news/agents-panel-launch-copilot-coding-agent-tasks-anywhere-on-github/)
- [GitHub: Claude ja Codex coding agents](https://github.blog/changelog/2026-02-04-claude-and-codex-are-now-available-in-public-preview-on-github/)
- [GitHub Docs: cloud agenti keskkonna seadistamine](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment)
- [GitHub Docs: Autopilot ja õigused](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/autopilot)
