import "./styles.css";

import React from "react";
import { createRoot } from "react-dom/client";

// The type of messages we'll be receiving from the server
import type {
  ActionLogEntry,
  ActionRequest,
  IncomingMessage,
  OutgoingMessage,
} from "../shared";
import type { LegacyRef } from "react";

function App() {
  // A reference to the canvas element where we'll render the globe
  const canvasRef = useRef<HTMLCanvasElement>();
  // The number of markers we're currently displaying
  const [counter, setCounter] = useState(0);
  const [pendingActions, setPendingActions] = useState<ActionRequest[]>([]);
  const [actionLog, setActionLog] = useState<ActionLogEntry[]>([]);
  const [deletePath, setDeletePath] = useState("/tmp/example.txt");
  const [packageName, setPackageName] = useState("lodash");
  // A map of marker IDs to their positions
  // Note that we use a ref because the globe's `onRender` callback
  // is called on every animation frame, and we don't want to re-render
  // the component on every frame.
  const positions = useRef<
    Map<
      string,
      {
        location: [number, number];
        size: number;
      }
    >
  >(new Map());
  // Connect to the PartyServer server
  const socket = usePartySocket({
    room: "default",
    party: "globe",
    onMessage(evt) {
      const message = JSON.parse(evt.data as string) as
        | OutgoingMessage
        | IncomingMessage;
      if (message.type === "add-marker") {
        // Add the marker to our map
        positions.current.set(message.position.id, {
          location: [message.position.lat, message.position.lng],
          size: message.position.id === socket.id ? 0.1 : 0.05,
        });
        // Update the counter
        setCounter((c) => c + 1);
      } else if (message.type === "remove-marker") {
        // Remove the marker from our map
        positions.current.delete(message.id);
        // Update the counter
        setCounter((c) => c - 1);
      } else if (message.type === "action:state") {
        setPendingActions(message.pending);
        setActionLog(message.log);
      } else if (message.type === "action:request") {
        setPendingActions((current) => {
          if (current.some((action) => action.id === message.action.id)) {
            return current;
          }
          return [message.action, ...current];
        });
      }
    },
  });
}

function formatNumber(value: number, fractionDigits = 1) {
  return value.toLocaleString("et-EE", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

  const submitDeleteAction = () => {
    socket.send(
      JSON.stringify({
        type: "action:submit",
        action: {
          kind: "delete-file",
          payload: { path: deletePath },
        },
      } satisfies IncomingMessage),
    );
  };

  const submitInstallAction = () => {
    socket.send(
      JSON.stringify({
        type: "action:submit",
        action: {
          kind: "install-package",
          payload: { packageName },
        },
      } satisfies IncomingMessage),
    );
  };

  const decideAction = (id: string, decision: "approved" | "rejected") => {
    socket.send(
      JSON.stringify({
        type: "action:decision",
        id,
        decision,
      } satisfies IncomingMessage),
    );
  };

  useEffect(() => {
    // The angle of rotation of the globe
    // We'll update this on every frame to make the globe spin
    let phi = 0;

    const globe = createGlobe(canvasRef.current as HTMLCanvasElement, {
      devicePixelRatio: 2,
      width: 400 * 2,
      height: 400 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 0.8,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.8, 0.1, 0.1],
      glowColor: [0.2, 0.2, 0.2],
      markers: [],
      opacity: 0.7,
      onRender: (state) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.

        // Get the current positions from our map
        state.markers = [...positions.current.values()];

        // Rotate the globe
        state.phi = phi;
        phi += 0.01;
      },
      {
        label: "Tippvõimsus",
        detail: "Annab üle 310 kW elektrilist võimsust 45 km/h tuule juures.",
      },
    ],
    innovationPoints: [
      "Kiirelt vahetatavad staatorimoodulid, mis võimaldavad välitingimustes rullimiseta remonti.",
      "Integreeritud superkondensaatorid siluvad kolmekordse impulss-väljundi, enne kui see jõuab alalditesse.",
      "Asümmeetriline magnetite kalle vähendab akustilist müra 8 dB võrra võrreldes traditsioonilise aksiaal-fluksiga.",
    ],
    svg: AxialFluxSvg,
    assumptions: [
      "Rootori aktiivne ala 5,3 m² (liigendatud komposiitlaba).",
      "Rakendatud otsesõit ilma ülekandeta, seega võetakse kogu pöördemoment vastu laagriraami poolt.",
      "Välisringi magnetvoo tihedus 1,1 T juures.",
    ],
  },
  {
    id: "dual-stage",
    llmName: "Claude 3.5 Sonnet",
    title: "Mitme rootoriga flux-switching torn",
    tagline:
      "Nelja 1,6 meetrise rootori virn vahelduvate staatoritega loob kõrge voolutihenduse ja võimaldab dünaamilist labade sammuhaldust.",
    summary:
      "Claude pakkus agressiivset koormuse jaotust: igat rootorit juhib oma flux-switching staator, mis laseb süsteemil dünaamiliselt kaasa töötada kogu tuuleprofiiliga ning vähendab rootori inertsi.",
    rotorDiameter: 1.6,
    cp: 0.46,
    generatorEfficiency: 0.9,
    tsr: 6,
    stages: 4,
    effectiveArea: rotorSweptArea(1.6) * 4,
    insights: [
      {
        label: "Flux-switching",
        detail:
          "Kolmefaasilised staatorid lülitavad magnetvoogu mehaanilise rootori asendi järgi, mis vähendab harjade vajadust.",
      },
      {
        label: "Koormuse jagamine",
        detail:
          "Mitme rootori koormusjaotus tähendab, et iga üksus annab ligikaudu 82 kW 45 km/h juures.",
      },
      {
        label: "Modulaarsus",
        detail: "Üksiku mooduli seiskamine ei katkesta ülejäänud torni tootmist.",
      },
    ],
    innovationPoints: [
      "Digitaalne sammukontroller reguleerib iga rootori labade nurka reaalajas ning minimeerib seiskumise riski.",
      "Staatilised süsinikkiust difuusorid juhivad õhuvoolu igasse staatorisse, mis tõstab efektiivset C<sub>p</sub> väärtust 4%.",
      "Integreeritud ülijuhtivad rõngaslülitid vähendavad vaseresistentsi ja võimaldavad hetkega koormust muuta.",
    ],
    svg: DualRotorSvg,
    assumptions: [
      "Nelja rootori kombineeritud projitseeritud ala 8,0 m².",
      "Iga rootori tipukiiruse suhe 6, kasutades aktiivset sammumootorit.",
      "Flux-switching staatori täiskoormusvool 680 A faasi kohta.",
    ],
  },
  {
    id: "superconductor",
    llmName: "Gemini 2.0",
    title: "Supraduktiivne vertikaalteljelise lineaar-generatsiooni kontuur",
    tagline:
      "Kaheastmeline Darrieus-H rekas, mille staator on ülijuhtiva jahutusega – mõeldud ülemistele tuulevoogudele ja 24/7 baseload'iks.",
    summary:
      "Gemini lähenes probleemile tulevikutehnoloogiast lähtudes: vertikaalteljeline turbiin, mille kahes astmes töötavad lineaarse generaatori kelgud. Süsteem sobib hästi linnade katustele, kus tuule suund muutub kiiresti.",
    rotorDiameter: 3.0,
    cp: 0.41,
    generatorEfficiency: 0.95,
    tsr: 4,
    stages: 2,
    insights: [
      {
        label: "Lineaarne generaator",
        detail:
          "Kahe vastanduva kelgu vahel ringlev magnetvoog võimaldab pingeid tõsta ilma ülekandesüsteemi kaodeta.",
      },
      {
        label: "Ülijahutus",
        detail:
          "Azotoopilise jahutuse abil hoitakse MgB₂ mähised 25 K juures, mis lubab 1,5 kA voolu.",
      },
      {
        label: "Tippvõimsus",
        detail:
          "Saavutab kuni 360 kW elektrilist väljundit 45 km/h tuule korral.",
      },
    ],
    innovationPoints: [
      "Õõnes süsinikkomposiitmast kannab lineaar-generaatori rööpaid ja juhib krüogeenset vedelikku.",
      "Energia salvestamiseks kasutatav lendratas tasandab vertikaalteljelise turbiini pulsatsiooni.",
      "Hübriidne aerodünaamiline profiil ühendab Darrieus-labade lifti ning Savoniuse drag-elemendi käivituseks.",
    ],
    svg: SuperconductorSvg,
    assumptions: [
      "Kaheastmeline kelgustruktuur kahekordistab kasutatavat rootoriala (10,6 m²).",
      "Töötab 12 kV DC-bussi peal, mida toetab ülijuhtiv lüliti.",
      "Krüogeense süsteemi elektritarve 12 kW arvestatakse üldisest efektiivsusest.",
    ],
  },
].map((design) => ({
  ...design,
  outputs: computeOutputs(design),
  sweptArea: design.effectiveArea ?? rotorSweptArea(design.rotorDiameter),
}));

function AxialFluxSvg() {
  return (
    <svg
      className="diagram"
      viewBox="0 0 180 180"
      role="img"
      aria-labelledby="axial-flux-title"
    >
      <title id="axial-flux-title">
        Aksiaal-fluksi topelt-rotori skeem
      </title>
      <circle cx="90" cy="90" r="80" fill="#101726" stroke="#2c8dd6" strokeWidth="4" />
      <circle cx="90" cy="90" r="58" fill="#18263a" />
      <circle cx="90" cy="90" r="28" fill="#0d1320" stroke="#3aa5f2" strokeWidth="2" />
      {[...Array(12)].map((_, index) => {
        const angle = (index / 12) * Math.PI * 2;
        const x = 90 + Math.cos(angle) * 64;
        const y = 90 + Math.sin(angle) * 64;
        const rotation = (angle * 180) / Math.PI + 15;
        return (
          <rect
            key={index}
            x={x - 6}
            y={y - 16}
            width={12}
            height={32}
            rx={3}
            ry={3}
            fill="#7dd3fc"
            transform={`rotate(${rotation} ${x} ${y})`}
            opacity={0.85}
          />
        );
      })}
      {[...Array(12)].map((_, index) => {
        const angle = (index / 12) * Math.PI * 2;
        const x = 90 + Math.cos(angle) * 40;
        const y = 90 + Math.sin(angle) * 40;
        return <circle key={index} cx={x} cy={y} r={6} fill="#f8fafc" opacity={0.7} />;
      })}
      <path
        d="M90 18 A72 72 0 0 1 158 90"
        fill="none"
        stroke="#38bdf8"
        strokeWidth={4}
        strokeDasharray="8 8"
        strokeLinecap="round"
      />
      <path
        d="M90 162 A72 72 0 0 1 22 90"
        fill="none"
        stroke="#38bdf8"
        strokeWidth={4}
        strokeDasharray="8 8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DualRotorSvg() {
  return (
    <svg
      className="diagram"
      viewBox="0 0 200 180"
      role="img"
      aria-labelledby="dual-rotor-title"
    >
      <title id="dual-rotor-title">Mitme rootoriga flux-switching torn</title>
      {[...Array(4)].map((_, stackIndex) => {
        const y = 30 + stackIndex * 35;
        return (
          <g key={stackIndex}>
            <rect
              x={32}
              y={y}
              width={136}
              height={26}
              rx={8}
              fill="#132033"
              stroke="#60a5fa"
              strokeWidth={2}
            />
            {[...Array(8)].map((__, magnetIndex) => {
              const x = 44 + magnetIndex * 16;
              return (
                <rect
                  key={magnetIndex}
                  x={x}
                  y={y + 5}
                  width={10}
                  height={16}
                  rx={2}
                  fill={magnetIndex % 2 === 0 ? "#fb7185" : "#38bdf8"}
                  opacity={0.9}
                />
              );
            })}
            <rect
              x={16}
              y={y - 6}
              width={12}
              height={38}
              fill="#0b1120"
              stroke="#38bdf8"
              strokeWidth={2}
            />
            <rect
              x={172}
              y={y - 6}
              width={12}
              height={38}
              fill="#0b1120"
              stroke="#38bdf8"
              strokeWidth={2}
            />
          </g>
        );
      })}
      <rect x={90} y={20} width={20} height={140} fill="#1f2937" />
      <path d="M40 170 L160 170" stroke="#60a5fa" strokeWidth={4} strokeLinecap="round" />
      <circle cx={100} cy={170} r={6} fill="#f8fafc" />
    </svg>
  );
}

function SuperconductorSvg() {
  return (
    <svg
      className="diagram"
      viewBox="0 0 200 180"
      role="img"
      aria-labelledby="superconductor-title"
    >
      <title id="superconductor-title">Supraduktiivne vertikaalteljeline generaator</title>
      <rect
        x={20}
        y={20}
        width={160}
        height={140}
        rx={24}
        fill="#111827"
        stroke="#67e8f9"
        strokeWidth={3}
      />
      <path
        d="M60 40 C60 100 140 80 140 140"
        stroke="#f97316"
        strokeWidth={6}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M140 40 C140 100 60 80 60 140"
        stroke="#38bdf8"
        strokeWidth={6}
        fill="none"
        strokeLinecap="round"
      />
      <rect x={86} y={20} width={28} height={140} fill="#1f2937" />
      <circle cx={100} cy={40} r={14} fill="#0ea5e9" opacity={0.8} />
      <circle cx={100} cy={90} r={18} fill="#fbbf24" opacity={0.7} />
      <circle cx={100} cy={140} r={14} fill="#22d3ee" opacity={0.8} />
      <path d="M40 20 L160 20" stroke="#0ea5e9" strokeWidth={3} strokeLinecap="round" strokeDasharray="6 6" />
      <path d="M40 160 L160 160" stroke="#0ea5e9" strokeWidth={3} strokeLinecap="round" strokeDasharray="6 6" />
    </svg>
  );
}

function InsightList({ insights }: { insights: Insight[] }) {
  return (
    <dl className="insight-list">
      {insights.map((insight) => (
        <div key={insight.label} className="insight-item">
          <dt>{insight.label}</dt>
          <dd>{insight.detail}</dd>
        </div>
      ))}
    </dl>
  );
}

function OutputTable({ outputs }: { outputs: OutputRow[] }) {
  return (
    <table className="detail-table">
      <thead>
        <tr>
          <th>Tuul (km/h)</th>
          <th>Tuul (m/s)</th>
          <th>Rootori RPM</th>
          <th>Mehaaniline kW</th>
          <th>Elektriline kW</th>
          <th>Pöördemoment (Nm)</th>
        </tr>
      </thead>
      <tbody>
        {outputs.map((row) => (
          <tr key={row.speedKmh}>
            <td>{row.speedKmh}</td>
            <td>{formatNumber(row.windMs, 2)}</td>
            <td>{formatNumber(row.rpm, 0)}</td>
            <td>{formatNumber(row.mechanicalKw)}</td>
            <td>{formatNumber(row.electricalKw)}</td>
            <td>{formatNumber(row.torqueNm)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DesignCard({ design }: { design: (typeof designs)[number] }) {
  const peak = design.outputs[design.outputs.length - 1];

  return (
    <section className="design-card" id={design.id}>
      <div className="design-header">
        <span className="llm-badge">{design.llmName}</span>
        <h2>{design.title}</h2>
        <p className="tagline">{design.tagline}</p>
      </div>
      <div className="design-body">
        <div className="design-summary">
          <p>{design.summary}</p>
          <InsightList insights={design.insights} />
          <ul className="assumption-list">
            {design.assumptions.map((assumption) => (
              <li key={assumption}>{assumption}</li>
            ))}
          </ul>
        </div>
        <div className="design-visual">
          {design.svg()}
          <div className="highlight">
            <p className="highlight-label">Tippväljastus (45 km/h)</p>
            <p className="highlight-value">{formatNumber(peak.electricalKw)} kW</p>
            <p className="highlight-sub">
              Pöörded {formatNumber(peak.rpm, 0)} rpm · {formatNumber(peak.torqueNm)} Nm
            </p>
          </div>
        </div>
      </div>
      <div className="design-footer">
        <h3>Peamised uuendused</h3>
        <ul className="innovation-list">
          {design.innovationPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <OutputTable outputs={design.outputs} />
      </div>
    </section>
  );
}

function ComparisonTable() {
  return (
    <section className="comparison" id="comparison">
      <h2>Võrdlus: milline lahendus annab kõige enam kW?</h2>
      <p>
        Allolev tabel liidab LLM-ide välja pakutud konstruktsioonid ja näitab nende
        tootlikkust nelja levinud tuuleolukorra korral. Kõik tulemused on arvutatud
        sama õhutiheduse (1,225 kg/m³) ja valemi P = ½ ρ A C<sub>p</sub> v³ alusel.
      </p>
      <table className="comparison-table">
        <thead>
          <tr>
            <th>Lahendus</th>
            {SPEED_POINTS.map((speed) => (
              <th key={speed}>{speed} km/h</th>
            ))}
            <th>Parim kW</th>
          </tr>
        </thead>
        <tbody>
          {designs.map((design) => {
            const best = design.outputs.reduce((max, row) =>
              row.electricalKw > max.electricalKw ? row : max,
            design.outputs[0]);
            return (
              <tr key={design.id}>
                <td>
                  <strong>{design.title}</strong>
                  <span className="llm-inline">{design.llmName}</span>
                </td>
                {design.outputs.map((row) => (
                  <td key={row.speedKmh}>{formatNumber(row.electricalKw)}</td>
                ))}
                <td className="best-cell">
                  {formatNumber(best.electricalKw)} kW @ {best.speedKmh} km/h
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

function ProductivityExplainer() {
  const referenceDesign = designs[0];
  const referenceOutput = referenceDesign.outputs[2]; // 36 km/h

  return (
    <section className="productivity" id="productivity">
      <h2>Kuidas arvutasime KM/h põhise tootlikkuse?</h2>
      <p>
        Tuuleenergeetikas on standardseks lähenemiseks tuule kiiruse teisendamine meetriteks sekundis ning seejärel mehaanilise
        võimsuse leidmine valemiga
        <span className="formula">P = ½ · ρ · A · C<sub>p</sub> · v³</span>.
        Allpool toome näite GPT-4o aksiaal-fluksi disaini kohta 36 km/h tuulekorral.
      </p>
      <ol className="calculation-steps">
        <li>
          <strong>Teisendus:</strong> 36 km/h ≈ {formatNumber(referenceOutput.windMs, 2)} m/s.
        </li>
        <li>
          <strong>Rootori pindala:</strong> A = π · (2,6 m / 2)² ≈ {formatNumber(referenceDesign.sweptArea, 2)} m².
        </li>
        <li>
          <strong>Mehaaniline võimsus:</strong> ½ · 1,225 · A · 0,48 · v³ ≈ {formatNumber(referenceOutput.mechanicalKw)} kW.
        </li>
        <li>
          <strong>Elektriline väljund:</strong> η = 92% → {formatNumber(referenceOutput.electricalKw)} kW generaatori klemmidel.
        </li>
        <li>
          <strong>Rootori kiirus:</strong> TSR 7 → {formatNumber(referenceOutput.rpm, 0)} rpm ja pöördemoment {formatNumber(referenceOutput.torqueNm)} Nm.
        </li>
      </ol>
      <p>
        Sama protsessi rakendati kõigile LLM-ide kontseptsioonidele, arvestades nende pakutud geomeetriat, η väärtusi ja
        mitmeastmelisust. Nii saame võrrelda tootlikkust otse erinevatel tuulekiirustel (km/h).
      </p>

      <section className="dashboard">
        <h2>Action approvals</h2>
        <p className="dashboard__subtitle">
          Sensitive actions emit an approval request before they execute.
        </p>

        <div className="dashboard__panels">
          <div className="dashboard__panel">
            <h3>Request an action</h3>
            <div className="dashboard__form">
              <label className="dashboard__field">
                Delete file path
                <input
                  value={deletePath}
                  onChange={(event) => setDeletePath(event.target.value)}
                />
                <button type="button" onClick={submitDeleteAction}>
                  Request delete
                </button>
              </label>
              <label className="dashboard__field">
                Install package
                <input
                  value={packageName}
                  onChange={(event) => setPackageName(event.target.value)}
                />
                <button type="button" onClick={submitInstallAction}>
                  Request install
                </button>
              </label>
            </div>
          </div>

          <div className="dashboard__panel">
            <h3>Pending approvals</h3>
            {pendingActions.length === 0 ? (
              <p className="dashboard__empty">No pending approvals.</p>
            ) : (
              <ul className="dashboard__list">
                {pendingActions.map((action) => (
                  <li key={action.id} className="dashboard__item">
                    <div>
                      <strong>{action.kind}</strong>
                      <span className="dashboard__meta">
                        Requested by {action.requestedBy}
                      </span>
                      {"path" in action.payload ? (
                        <span className="dashboard__detail">
                          Path: {action.payload.path}
                        </span>
                      ) : (
                        <span className="dashboard__detail">
                          Package: {action.payload.packageName}
                        </span>
                      )}
                    </div>
                    <div className="dashboard__actions">
                      <button
                        type="button"
                        onClick={() => decideAction(action.id, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => decideAction(action.id, "rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="dashboard__panel">
          <h3>Decision log</h3>
          {actionLog.length === 0 ? (
            <p className="dashboard__empty">No actions have been reviewed.</p>
          ) : (
            <ul className="dashboard__list">
              {actionLog.map((entry) => (
                <li key={entry.id} className="dashboard__item">
                  <div>
                    <strong>
                      {entry.kind} ({entry.status})
                    </strong>
                    <span className="dashboard__meta">
                      Reviewed by {entry.decidedBy}
                    </span>
                    {"path" in entry.payload ? (
                      <span className="dashboard__detail">
                        Path: {entry.payload.path}
                      </span>
                    ) : (
                      <span className="dashboard__detail">
                        Package: {entry.payload.packageName}
                      </span>
                    )}
                    {entry.result ? (
                      <span className="dashboard__detail">
                        Result: {entry.result}
                      </span>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById("root")!).render(<App />);
