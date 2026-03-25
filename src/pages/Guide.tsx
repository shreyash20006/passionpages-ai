import { useState } from "react";

const SYSTEM_PROMPT = `You are PassionPages AI — a smart study assistant for college students (B.Tech, B.Pharm, etc).

CRITICAL RULE: Return ONLY a valid JSON object. No extra text. No markdown. No backticks. Just raw JSON.

When user asks about any topic, return this EXACT structure:

{
  "title": "Topic Name Here",
  "subject": "Subject Name",
  "emoji": "📚",
  "sections": [
    {
      "heading": "Section Heading",
      "icon": "💊",
      "color": "#06b6d4",
      "body": "2-3 line explanation in simple language",
      "keyPoints": [
        "Important point 1",
        "Important point 2",
        "Important point 3"
      ],
      "table": {
        "headers": ["Column 1", "Column 2", "Column 3"],
        "rows": [
          ["Row 1 A", "Row 1 B", "Row 1 C"],
          ["Row 2 A", "Row 2 B", "Row 2 C"]
        ]
      },
      "highlight": {
        "text": "Important tip or warning for exam",
        "type": "tip"
      }
    }
  ],
  "mnemonic": "A memory trick to remember this topic",
  "summary": "One line summary of the entire topic"
}

RULES:
1. Use a DIFFERENT color for each section: #06b6d4, #a855f7, #10b981, #f59e0b, #ef4444, #3b82f6
2. Add relevant emoji icon for each section
3. highlight type can be: "tip", "warning", or "important"
4. Add table ONLY when comparing things (drugs, types, formulas, etc.)
5. table field is OPTIONAL — skip it if not needed
6. Keep keyPoints short — exam-focused bullets
7. Mnemonic should be creative and memorable
8. Write in simple English for college students`;

const FULL_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>PassionPages.ai</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono&display=swap" rel="stylesheet"/>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: #070d1a;
      color: #e2e8f0;
      min-height: 100vh;
    }

    /* ── HEADER ── */
    .header {
      background: #0c1526;
      border-bottom: 1px solid #1e2d45;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .logo {
      background: linear-gradient(135deg, #7c3aed, #06b6d4);
      color: white;
      font-weight: 800;
      font-size: 15px;
      padding: 6px 14px;
      border-radius: 8px;
      letter-spacing: -0.3px;
    }
    .header-title {
      font-size: 13px;
      color: #475569;
    }

    /* ── MAIN LAYOUT ── */
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 32px 24px;
    }

    /* ── INPUT AREA ── */
    .input-section {
      background: linear-gradient(135deg, #0f1e38, #0d1521);
      border: 1px solid #1e3a5f;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 32px;
    }
    .input-section h2 {
      font-size: 22px;
      font-weight: 800;
      margin-bottom: 6px;
      background: linear-gradient(90deg, #a78bfa, #38bdf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .input-section p {
      color: #475569;
      font-size: 13px;
      margin-bottom: 16px;
    }

    /* Mode selector */
    .mode-selector {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }
    .mode-btn {
      padding: 7px 16px;
      border-radius: 20px;
      border: 1px solid #1e293b;
      background: #1e293b;
      color: #64748b;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
    }
    .mode-btn.active {
      background: #7c3aed22;
      border-color: #7c3aed66;
      color: #a78bfa;
    }

    /* Input row */
    .input-row {
      display: flex;
      gap: 10px;
    }
    .topic-input {
      flex: 1;
      background: #0a1628;
      border: 1px solid #1e3a5f;
      border-radius: 12px;
      padding: 14px 18px;
      color: #e2e8f0;
      font-size: 14px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s;
    }
    .topic-input:focus { border-color: #7c3aed88; }
    .topic-input::placeholder { color: #334155; }

    .generate-btn {
      background: linear-gradient(135deg, #7c3aed, #06b6d4);
      border: none;
      border-radius: 12px;
      padding: 14px 24px;
      color: white;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      font-family: inherit;
      transition: opacity 0.2s, transform 0.1s;
      white-space: nowrap;
    }
    .generate-btn:hover { opacity: 0.9; transform: translateY(-1px); }
    .generate-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

    /* ── LOADING ── */
    .loading {
      display: none;
      text-align: center;
      padding: 40px;
    }
    .loading.show { display: block; }
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #1e293b;
      border-top-color: #7c3aed;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 16px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .loading p { color: #475569; font-size: 14px; }

    /* ── OUTPUT CARD ── */
    .output { display: none; animation: fadeUp 0.4s ease; }
    .output.show { display: block; }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Note card header */
    .card-header {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      margin-bottom: 6px;
    }
    .card-emoji {
      font-size: 36px;
      line-height: 1;
      margin-top: 2px;
    }
    .card-meta { flex: 1; }
    .card-subject {
      display: inline-block;
      background: linear-gradient(135deg, #7c3aed, #06b6d4);
      color: white;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 12px;
      border-radius: 20px;
      margin-bottom: 6px;
      letter-spacing: 0.5px;
    }
    .card-title {
      font-size: 22px;
      font-weight: 800;
      color: #f1f5f9;
      line-height: 1.3;
    }
    .card-summary {
      color: #64748b;
      font-size: 13px;
      margin: 10px 0 24px;
      padding: 10px 14px;
      background: #0f1e38;
      border-left: 3px solid #7c3aed;
      border-radius: 0 8px 8px 0;
      line-height: 1.7;
    }

    /* Section */
    .section {
      background: #0d1825;
      border-radius: 12px;
      margin-bottom: 14px;
      overflow: hidden;
      border: 1px solid transparent;
      animation: fadeUp 0.4s ease both;
    }
    .section-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 18px;
    }
    .section-icon { font-size: 20px; }
    .section-heading {
      font-weight: 700;
      font-size: 15px;
      color: #e2e8f0;
    }
    .section-body {
      padding: 0 18px 14px;
      color: #94a3b8;
      font-size: 13px;
      line-height: 1.8;
    }

    /* Key points */
    .key-points { padding: 0 18px 14px; }
    .key-points-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 8px;
    }
    .key-point {
      display: flex;
      gap: 8px;
      align-items: flex-start;
      margin-bottom: 6px;
    }
    .key-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-top: 6px;
      flex-shrink: 0;
    }
    .key-text { color: #cbd5e1; font-size: 13px; line-height: 1.6; }

    /* Table */
    .table-wrap { padding: 0 18px 14px; overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { padding: 9px 12px; text-align: left; font-weight: 700; }
    td { padding: 9px 12px; color: #94a3b8; border-top: 1px solid #1e293b; }

    /* Highlight box */
    .highlight-box {
      margin: 0 18px 14px;
      padding: 11px 14px;
      border-radius: 8px;
      font-size: 13px;
      border-left: 3px solid;
      line-height: 1.6;
    }
    .highlight-label { font-weight: 700; margin-right: 4px; }

    /* Mnemonic */
    .mnemonic {
      background: #1a1400;
      border: 1px solid #f59e0b33;
      border-radius: 12px;
      padding: 16px 20px;
      margin-top: 8px;
    }
    .mnemonic-label {
      font-size: 11px;
      font-weight: 700;
      color: #f59e0b;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 6px;
    }
    .mnemonic-text { color: #d97706; font-size: 14px; line-height: 1.6; }

    /* Error */
    .error-box {
      display: none;
      background: #1a0808;
      border: 1px solid #ef444433;
      border-radius: 12px;
      padding: 16px 20px;
      color: #f87171;
      font-size: 14px;
      margin-bottom: 16px;
    }
    .error-box.show { display: block; }

    /* Responsive */
    @media (max-width: 600px) {
      .input-row { flex-direction: column; }
      .generate-btn { width: 100%; }
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div class="header">
    <div class="logo">PP.ai</div>
    <div class="header-title">PassionPages — AI Study Assistant</div>
  </div>

  <div class="container">

    <!-- INPUT SECTION -->
    <div class="input-section">
      <h2>✦ What do you want to study?</h2>
      <p>Enter any topic — get structured notes, tables, and memory tricks instantly.</p>

      <!-- Mode Selector -->
      <div class="mode-selector">
        <button class="mode-btn active" onclick="setMode(this,'notes')">📝 Notes</button>
        <button class="mode-btn" onclick="setMode(this,'flashcards')">🃏 Flashcards</button>
        <button class="mode-btn" onclick="setMode(this,'quiz')">❓ Quiz</button>
        <button class="mode-btn" onclick="setMode(this,'diagram')">🔮 Diagram Code</button>
      </div>

      <!-- Input -->
      <div class="input-row">
        <input class="topic-input" id="topicInput"
          placeholder="e.g. Beta Blockers, Newton's Laws, Data Structures..."
          onkeydown="if(event.key==='Enter') generate()" />
        <button class="generate-btn" id="genBtn" onclick="generate()">
          ⚡ Generate
        </button>
      </div>
    </div>

    <!-- ERROR -->
    <div class="error-box" id="errorBox"></div>

    <!-- LOADING -->
    <div class="loading" id="loading">
      <div class="spinner"></div>
      <p>AI is generating your study material...</p>
    </div>

    <!-- OUTPUT -->
    <div class="output" id="output"></div>

  </div>

  <script>
    // ─────────────────────────────────────────────
    // ⚠️  APNI API KEY YAHAN DAALO
    // aistudio.google.com > Get API Key
    // ─────────────────────────────────────────────
    const API_KEY = "APNI_GEMINI_API_KEY_YAHAN_DAALO";

    let currentMode = "notes";

    function setMode(btn, mode) {
      currentMode = mode;
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }

    // ── SYSTEM PROMPT ──────────────────────────────
    const SYSTEM = \`You are PassionPages AI — a smart study assistant for college students.
CRITICAL RULE: Return ONLY a valid JSON object. No extra text. No backticks. Just raw JSON.

Return this structure:
{
  "title": "...",
  "subject": "...",
  "emoji": "📚",
  "sections": [
    {
      "heading": "...",
      "icon": "emoji",
      "color": "#hexcolor",
      "body": "2-3 line explanation",
      "keyPoints": ["point1","point2","point3"],
      "table": { "headers": [...], "rows": [[...]] },
      "highlight": { "text": "...", "type": "tip" }
    }
  ],
  "mnemonic": "memory trick",
  "summary": "one line summary"
}

Rules:
- Different color each section: #06b6d4, #a855f7, #10b981, #f59e0b, #ef4444, #3b82f6
- table is OPTIONAL — only add when comparing things
- highlight type: "tip", "warning", or "important"
- Keep simple for college students\`;

    // ── MAIN GENERATE FUNCTION ────────────────────
    async function generate() {
      const topic = document.getElementById('topicInput').value.trim();
      if (!topic) return alert("Kuch toh likho bhai! 😄");

      // Show loading
      document.getElementById('loading').classList.add('show');
      document.getElementById('output').classList.remove('show');
      document.getElementById('errorBox').classList.remove('show');
      document.getElementById('genBtn').disabled = true;

      try {
        const res = await fetch(
          \`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=\${API_KEY}\`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: SYSTEM }] },
              contents: [{
                parts: [{ text: \`Generate \${currentMode} for: \${topic}\` }]
              }]
            })
          }
        );

        const data = await res.json();

        if (!res.ok) throw new Error(data.error?.message || 'API Error');

        // Extract and clean the JSON text
        let raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        raw = raw.replace(/\`\`\`json/g,'').replace(/\`\`\`/g,'').trim();

        let parsed;
        try {
          parsed = JSON.parse(raw);
        } catch(e) {
          throw new Error("AI ne galat format diya. Dobara try karo!");
        }

        renderOutput(parsed);

      } catch (err) {
        const errBox = document.getElementById('errorBox');
        errBox.textContent = '⚠️ Error: ' + err.message;
        errBox.classList.add('show');
      } finally {
        document.getElementById('loading').classList.remove('show');
        document.getElementById('genBtn').disabled = false;
      }
    }

    // ── RENDER FUNCTION ───────────────────────────
    function renderOutput(d) {
      const hlStyles = {
        tip:       { bg:'#10b98115', border:'#10b981', icon:'💡', label:'Pro Tip' },
        warning:   { bg:'#f59e0b15', border:'#f59e0b', icon:'⚠️', label:'Warning' },
        important: { bg:'#ef444415', border:'#ef4444', icon:'🔴', label:'Important' },
      };

      let html = '';

      // Header
      html += \`
        <div class="card-header">
          <div class="card-emoji">\${d.emoji || '📖'}</div>
          <div class="card-meta">
            <div class="card-subject">\${d.subject || 'Study Material'}</div>
            <div class="card-title">\${d.title}</div>
          </div>
        </div>
      \`;
      if (d.summary) {
        html += \`<div class="card-summary">\${d.summary}</div>\`;
      }

      // Sections
      (d.sections || []).forEach((s, i) => {
        const c = s.color || '#06b6d4';
        html += \`
          <div class="section" style="border-color:\${c}22; animation-delay:\${i*0.08}s">
            <div class="section-header" style="background:\${c}0d; border-bottom:1px solid \${c}22">
              <span class="section-icon">\${s.icon || '📌'}</span>
              <span class="section-heading" style="color:\${c}">\${s.heading}</span>
            </div>
        \`;

        if (s.body) html += \`<div class="section-body">\${s.body}</div>\`;

        if (s.keyPoints?.length) {
          html += \`<div class="key-points">
            <div class="key-points-label" style="color:\${c}">✦ Key Points</div>
          \`;
          s.keyPoints.forEach(p => {
            html += \`<div class="key-point">
              <div class="key-dot" style="background:\${c}"></div>
              <div class="key-text">\${p}</div>
            </div>\`;
          });
          html += '</div>';
        }

        if (s.table?.headers) {
          html += \`<div class="table-wrap"><table>\`;
          html += '<thead><tr>' + s.table.headers.map(h =>
            \`<th style="background:\${c}22;color:\${c};border:1px solid \${c}33">\${h}</th>\`
          ).join('') + '</tr></thead><tbody>';
          s.table.rows.forEach(row => {
            html += '<tr>' + row.map(cell => \`<td>\${cell}</td>\`).join('') + '</tr>';
          });
          html += '</tbody></table></div>';
        }

        if (s.highlight) {
          const st = hlStyles[s.highlight.type] || hlStyles.tip;
          html += \`<div class="highlight-box"
            style="background:\${st.bg};border-color:\${st.border};color:#cbd5e1">
            <span class="highlight-label" style="color:\${st.border}">\${st.icon} \${st.label}:</span>
            \${s.highlight.text}
          </div>\`;
        }

        html += '</div>';
      });

      // Mnemonic
      if (d.mnemonic) {
        html += \`<div class="mnemonic">
          <div class="mnemonic-label">🧠 Memory Trick</div>
          <div class="mnemonic-text">\${d.mnemonic}</div>
        </div>\`;
      }

      const out = document.getElementById('output');
      out.innerHTML = html;
      out.classList.add('show');
      out.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  </script>
</body>
</html>`;

const steps = [
  {
    num: "01",
    title: "API Key lo Google AI Studio se",
    color: "#10b981",
    emoji: "🔑",
    content: (
      <div>
        <p style={{color:"#94a3b8",fontSize:"14px",lineHeight:1.8,marginBottom:"12px"}}>
          Google AI Studio sirf ek <strong style={{color:"#e2e8f0"}}>testing + API key tool</strong> hai. Actual website alag HTML file mein banegi. Yeh steps follow karo:
        </p>
        <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
          {[
            ["1.", "aistudio.google.com pe jao", "#10b981"],
            ["2.", "Sign in karo apne Google account se", "#10b981"],
            ["3.", "Left sidebar mein 'Get API Key' click karo", "#10b981"],
            ["4.", "'Create API Key' button dabao", "#10b981"],
            ["5.", "Key copy karo — safe jagah save karo", "#f59e0b"],
          ].map(([n,t,c])=>(
            <div key={n} style={{display:"flex",gap:"10px",alignItems:"center",background:"#1e293b",borderRadius:"8px",padding:"10px 14px"}}>
              <span style={{fontWeight:800,color:c,fontSize:"13px",minWidth:"20px"}}>{n}</span>
              <span style={{color:"#e2e8f0",fontSize:"13px"}}>{t}</span>
            </div>
          ))}
        </div>
        <div style={{background:"#1a1000",border:"1px solid #f59e0b33",borderRadius:"8px",padding:"12px 14px",marginTop:"12px"}}>
          <span style={{color:"#f59e0b",fontWeight:700,fontSize:"13px"}}>⚠️ Important: </span>
          <span style={{color:"#92400e",fontSize:"13px"}}>API Key kisi ke saath share mat karo. HTML file mein daalo but public GitHub pe mat daalna.</span>
        </div>
      </div>
    )
  },
  {
    num: "02",
    title: "Naya HTML file banao",
    color: "#06b6d4",
    emoji: "📄",
    content: (
      <div>
        <p style={{color:"#94a3b8",fontSize:"14px",lineHeight:1.8,marginBottom:"12px"}}>
          Apne computer mein koi bhi folder mein ek naya file banao:
        </p>
        <div style={{display:"flex",flexDirection:"column",gap:"8px",marginBottom:"14px"}}>
          {[
            ["1.", "Desktop ya koi bhi folder open karo"],
            ["2.", "Right click → New → Text Document"],
            ["3.", "Naam do: passionpages.html"],
            ["4.", "VS Code ya Notepad++ mein open karo"],
          ].map(([n,t])=>(
            <div key={n} style={{display:"flex",gap:"10px",alignItems:"center",background:"#1e293b",borderRadius:"8px",padding:"10px 14px"}}>
              <span style={{fontWeight:800,color:"#06b6d4",fontSize:"13px",minWidth:"20px"}}>{n}</span>
              <span style={{color:"#e2e8f0",fontSize:"13px"}}>{t}</span>
            </div>
          ))}
        </div>
        <div style={{background:"#0d1a12",border:"1px solid #10b98133",borderRadius:"8px",padding:"12px 14px"}}>
          <span style={{color:"#10b981",fontWeight:700,fontSize:"13px"}}>💡 Tip: </span>
          <span style={{color:"#6ee7b7",fontSize:"13px"}}>VS Code free mein download kar lo — code.visualstudio.com. Bahut helpful hai.</span>
        </div>
      </div>
    )
  },
  {
    num: "03",
    title: "Poora code paste karo",
    color: "#a855f7",
    emoji: "📋",
    content: (
      <div>
        <p style={{color:"#94a3b8",fontSize:"14px",lineHeight:1.8,marginBottom:"12px"}}>
          Upar <strong style={{color:"#e2e8f0"}}>"📋 Copy Full Code"</strong> button se poora code copy karo aur apni file mein paste karo. Phir sirf ek cheez change karni hai:
        </p>
        <div style={{background:"#060d18",border:"1px solid #a855f733",borderRadius:"10px",padding:"16px",fontFamily:"'JetBrains Mono',monospace",fontSize:"13px",lineHeight:"1.8"}}>
          <div style={{color:"#64748b",marginBottom:"4px"}}>{"// Line ~150 mein dhundho:"}</div>
          <div style={{color:"#ef4444"}}>{"const API_KEY = \"APNI_GEMINI_API_KEY_YAHAN_DAALO\";"}</div>
          <div style={{color:"#64748b",margin:"8px 0 4px"}}>{"// Apni actual key se replace karo:"}</div>
          <div style={{color:"#10b981"}}>{"const API_KEY = \"AIzaSyXXXXXXXXXXXXXXXXXXXXX\";"}</div>
        </div>
        <div style={{background:"#0d1a12",border:"1px solid #10b98133",borderRadius:"8px",padding:"12px 14px",marginTop:"12px"}}>
          <span style={{color:"#10b981",fontWeight:700,fontSize:"13px"}}>✅ Bas itna hi! </span>
          <span style={{color:"#6ee7b7",fontSize:"13px"}}>Koi aur change karne ki zaroorat nahi. Ek line change = poora system ready.</span>
        </div>
      </div>
    )
  },
  {
    num: "04",
    title: "Browser mein open karo",
    color: "#f59e0b",
    emoji: "🌐",
    content: (
      <div>
        <p style={{color:"#94a3b8",fontSize:"14px",lineHeight:1.8,marginBottom:"12px"}}>
          Ab apni HTML file directly browser mein open karo:
        </p>
        <div style={{display:"flex",flexDirection:"column",gap:"8px",marginBottom:"14px"}}>
          {[
            ["1.", "passionpages.html file pe double click karo"],
            ["2.", "Browser mein automatically khul jayegi"],
            ["3.", "Koi topic type karo (e.g. 'Beta Blockers')"],
            ["4.", "⚡ Generate button dabao"],
            ["5.", "Beautiful cards appear honge! 🎉"],
          ].map(([n,t])=>(
            <div key={n} style={{display:"flex",gap:"10px",alignItems:"center",background:"#1e293b",borderRadius:"8px",padding:"10px 14px"}}>
              <span style={{fontWeight:800,color:"#f59e0b",fontSize:"13px",minWidth:"20px"}}>{n}</span>
              <span style={{color:"#e2e8f0",fontSize:"13px"}}>{t}</span>
            </div>
          ))}
        </div>
        <div style={{background:"#1a1000",border:"1px solid #f59e0b33",borderRadius:"8px",padding:"12px 14px"}}>
          <span style={{color:"#f59e0b",fontWeight:700,fontSize:"13px"}}>🚀 Deploy karna hai? </span>
          <span style={{color:"#92400e",fontSize:"13px"}}>netlify.com pe FREE mein host karo — drag & drop karke apni HTML file upload karo. Done!</span>
        </div>
      </div>
    )
  },
];

export default function GoogleAIStudioGuide() {
  const [activeStep, setActiveStep] = useState(0);
  const [copied, setCopied] = useState(false);

  function copyCode() {
    navigator.clipboard.writeText(FULL_HTML).then(()=>{
      setCopied(true);
      setTimeout(()=>setCopied(false), 2500);
    });
  }

  return (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:"#070d1a",minHeight:"100vh",color:"#e2e8f0"}}>
      
      {/* Header */}
      <div style={{background:"#0c1526",borderBottom:"1px solid #1e2d45",padding:"16px 28px",display:"flex",alignItems:"center",gap:"14px"}}>
        <div style={{background:"linear-gradient(135deg,#7c3aed,#06b6d4)",color:"#fff",fontWeight:800,fontSize:"15px",padding:"6px 14px",borderRadius:"8px"}}>PP.ai</div>
        <div>
          <div style={{fontWeight:700,fontSize:"15px",color:"#f1f5f9"}}>Google AI Studio → Real Website</div>
          <div style={{fontSize:"12px",color:"#334155"}}>4 simple steps — copy paste aur done</div>
        </div>
      </div>

      <div style={{maxWidth:"820px",margin:"0 auto",padding:"28px 24px"}}>

        {/* Top Banner */}
        <div style={{background:"linear-gradient(135deg,#1e1b4b,#0f1e38)",border:"1px solid #7c3aed44",borderRadius:"14px",padding:"20px 24px",marginBottom:"28px",display:"flex",gap:"16px",alignItems:"flex-start"}}>
          <span style={{fontSize:"28px"}}>💡</span>
          <div>
            <div style={{fontWeight:800,color:"#a78bfa",fontSize:"15px",marginBottom:"6px"}}>Samajh lo pehle — Google AI Studio kya hai?</div>
            <p style={{color:"#64748b",fontSize:"13px",lineHeight:1.8,margin:0}}>
              Google AI Studio sirf ek <strong style={{color:"#e2e8f0"}}>testing tool + API key generator</strong> hai — yahan se seedha website nahi banti। <br/>
              Tera actual website ek <strong style={{color:"#10b981"}}>HTML file</strong> hoga jo Gemini API ko call karega। <br/>
              Neeche diya code woh kaam karega — <strong style={{color:"#f59e0b"}}>sirf API key daalo, baaki sab ready hai।</strong>
            </p>
          </div>
        </div>

        {/* Copy Code Button — prominent */}
        <div style={{background:"linear-gradient(135deg,#1a0d2e,#0f1e38)",border:"1px solid #a855f744",borderRadius:"14px",padding:"20px 24px",marginBottom:"28px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"16px",flexWrap:"wrap"}}>
          <div>
            <div style={{fontWeight:800,color:"#e2e8f0",fontSize:"16px",marginBottom:"4px"}}>📋 Complete Website Code — Ready Hai</div>
            <div style={{color:"#64748b",fontSize:"13px"}}>Poora HTML + CSS + JS + Gemini API integration — ek file, copy paste, done.</div>
          </div>
          <button onClick={copyCode} style={{background:copied?"#10b98120":"linear-gradient(135deg,#7c3aed,#06b6d4)",border:copied?"1px solid #10b98166":"none",borderRadius:"10px",padding:"12px 24px",color:copied?"#10b981":"#fff",fontWeight:700,fontSize:"14px",cursor:"pointer",transition:"all 0.3s",flexShrink:0,fontFamily:"inherit"}}>
            {copied ? "✅ Copied!" : "📋 Copy Full Code"}
          </button>
        </div>

        {/* Steps */}
        <div style={{marginBottom:"8px",fontWeight:700,color:"#475569",fontSize:"12px",textTransform:"uppercase",letterSpacing:"1.5px"}}>Step by Step Guide</div>
        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          {steps.map((s,i)=>(
            <div key={i}>
              <button onClick={()=>setActiveStep(activeStep===i?-1:i)}
                style={{width:"100%",display:"flex",alignItems:"center",gap:"14px",padding:"16px 20px",background:activeStep===i?"#1e293b":"#0d1521",border:`1px solid ${activeStep===i?s.color+"55":"#1e2d45"}`,borderRadius:activeStep===i?"12px 12px 0 0":"12px",cursor:"pointer",textAlign:"left",transition:"all 0.2s",fontFamily:"inherit"}}>
                <div style={{width:"36px",height:"36px",borderRadius:"50%",background:s.color+"20",border:`2px solid ${s.color}55`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:"13px",fontWeight:800,color:s.color}}>
                  {s.num}
                </div>
                <span style={{fontSize:"18px"}}>{s.emoji}</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,color:"#e2e8f0",fontSize:"14px"}}>{s.title}</div>
                </div>
                <span style={{color:"#334155",fontSize:"18px",transform:activeStep===i?"rotate(180deg)":"none",transition:"transform 0.2s"}}>⌄</span>
              </button>
              {activeStep===i && (
                <div style={{background:"#0d1521",border:`1px solid ${s.color}33`,borderTop:"none",borderRadius:"0 0 12px 12px",padding:"20px"}}>
                  {s.content}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* What's inside the code */}
        <div style={{marginTop:"24px",background:"#0c1526",border:"1px solid #1e2d45",borderRadius:"14px",padding:"20px 24px"}}>
          <div style={{fontWeight:800,color:"#e2e8f0",fontSize:"15px",marginBottom:"14px"}}>✦ Is Code Mein Kya Kya Hai?</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
            {[
              ["🎨 Dark UI","Professional dark theme, gradient logo, smooth animations"],
              ["🤖 Gemini AI","Direct Gemini 1.5 Flash API call — no extra setup"],
              ["📝 4 Modes","Notes / Flashcards / Quiz / Diagram Code selector"],
              ["🃏 Visual Cards","Color-coded sections, emoji icons, key point bullets"],
              ["📊 Auto Tables","AI decides when to show tables — drug comparisons, etc."],
              ["💡 Highlight Boxes","Tip / Warning / Important — color coded"],
              ["🧠 Mnemonics","Memory tricks at the bottom of every response"],
              ["⚡ Loading State","Spinner while AI generates — no blank screen"],
            ].map(([title,desc])=>(
              <div key={title} style={{background:"#1e293b",borderRadius:"8px",padding:"12px 14px"}}>
                <div style={{fontWeight:700,color:"#e2e8f0",fontSize:"13px",marginBottom:"3px"}}>{title}</div>
                <div style={{color:"#475569",fontSize:"12px",lineHeight:1.5}}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* System Prompt section */}
        <div style={{marginTop:"16px",background:"#0c1526",border:"1px solid #1e2d45",borderRadius:"14px",padding:"20px 24px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
            <div style={{fontWeight:800,color:"#e2e8f0",fontSize:"15px"}}>🧠 System Prompt (Code ke Andar Hai Already)</div>
          </div>
          <p style={{color:"#64748b",fontSize:"13px",lineHeight:1.7,marginBottom:"12px"}}>
            Yeh prompt AI ko instruct karta hai ki JSON format mein jawab do. Code mein already included hai — alag se kuch nahi karna. Agar improve karna ho toh yeh prompt edit karo HTML file mein (SYSTEM variable):
          </p>
          <pre style={{background:"#060d18",border:"1px solid #1e3a5f",borderRadius:"10px",padding:"16px",overflowX:"auto",fontSize:"11.5px",lineHeight:"1.8",color:"#94a3b8",margin:0,fontFamily:"'JetBrains Mono',monospace",maxHeight:"200px",overflowY:"auto"}}>
            <code>{SYSTEM_PROMPT}</code>
          </pre>
        </div>

      </div>
    </div>
  );
}
