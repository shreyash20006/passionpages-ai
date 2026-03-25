# 📚 PassionPages.ai - Complete API Response Format

## New Comprehensive Format

The AI now returns a complete study package with **Summary**, **Flashcards**, **Quiz**, **Diagram**, and **PPT Slides** in one response!

---

## 🎯 Response Schema:

```json
{
  "title": "Topic Name",
  "summary": "Clear explanation",
  "flashcards": [...],
  "quiz": [...],
  "diagram": "mermaid code",
  "ppt": [...]
}
```

---

## 📋 Detailed Format:

### 1. Title
```json
"title": "Introduction to React Hooks"
```

### 2. Summary
Clear, concise explanation of the topic
```json
"summary": "React Hooks are functions that let you use state and other React features in functional components without writing a class."
```

### 3. Flashcards
Two types: **good** (correct concepts) and **bad** (common mistakes)

```json
"flashcards": [
  {
    "question": "What is useState?",
    "answer": "A Hook that lets you add state to functional components",
    "type": "good"
  },
  {
    "question": "Can you use Hooks in class components?",
    "answer": "No, Hooks only work in functional components",
    "type": "bad"
  }
]
```

**Types:**
- `"good"` - Green card - Correct concept
- `"bad"` - Red/Orange card - Common misconception

### 4. Quiz
MCQ format with 4 options

```json
"quiz": [
  {
    "question": "Which Hook is used for side effects?",
    "options": [
      "useState",
      "useEffect",
      "useContext",
      "useRef"
    ],
    "answer": "useEffect"
  }
]
```

### 5. Diagram
Mermaid.js syntax for flowcharts/diagrams

```json
"diagram": "graph TD;\n  A[Component Mount] --> B[Render];\n  B --> C[useEffect];\n  C --> D[Update];\n  D --> B;"
```

**Supported Mermaid Types:**
- `graph TD` - Top-down flowchart
- `graph LR` - Left-right flowchart
- `flowchart` - Advanced flowchart
- `sequenceDiagram` - Sequence diagram
- `classDiagram` - Class diagram

### 6. PPT Slides
Presentation-ready slides with themes

```json
"ppt": [
  {
    "title": "What are React Hooks?",
    "points": [
      "Functions for functional components",
      "No need for classes",
      "Introduced in React 16.8"
    ],
    "theme": "gradient-purple"
  },
  {
    "title": "Common Hooks",
    "points": [
      "useState - State management",
      "useEffect - Side effects",
      "useContext - Context values"
    ],
    "theme": "gradient-pink"
  }
]
```

**Available Themes:**
- `"gradient-purple"` - Purple gradient
- `"gradient-pink"` - Pink gradient
- `"gradient-blue"` - Blue gradient
- `"dark"` - Dark background
- `"light"` - Light background

---

## 📦 Complete Example Response:

```json
{
  "title": "Photosynthesis Basics",
  
  "summary": "Photosynthesis is the process by which plants convert light energy into chemical energy (glucose). It occurs in chloroplasts and requires sunlight, water, and carbon dioxide.",
  
  "flashcards": [
    {
      "question": "What is the main product of photosynthesis?",
      "answer": "Glucose (C6H12O6) and Oxygen (O2)",
      "type": "good"
    },
    {
      "question": "Where does photosynthesis occur?",
      "answer": "In the chloroplasts of plant cells",
      "type": "good"
    },
    {
      "question": "Do plants perform photosynthesis at night?",
      "answer": "No, photosynthesis requires light and only occurs during the day. At night, plants only perform respiration.",
      "type": "bad"
    },
    {
      "question": "Is photosynthesis the same as cellular respiration?",
      "answer": "No, they are opposite processes. Photosynthesis produces glucose using light, while respiration breaks down glucose to release energy.",
      "type": "bad"
    }
  ],
  
  "quiz": [
    {
      "question": "What is the primary pigment involved in photosynthesis?",
      "options": [
        "Carotene",
        "Chlorophyll",
        "Xanthophyll",
        "Anthocyanin"
      ],
      "answer": "Chlorophyll"
    },
    {
      "question": "Which of the following is NOT a requirement for photosynthesis?",
      "options": [
        "Sunlight",
        "Water",
        "Oxygen",
        "Carbon dioxide"
      ],
      "answer": "Oxygen"
    },
    {
      "question": "In which part of the chloroplast does the light-dependent reaction occur?",
      "options": [
        "Stroma",
        "Thylakoid membrane",
        "Outer membrane",
        "Intermembrane space"
      ],
      "answer": "Thylakoid membrane"
    }
  ],
  
  "diagram": "graph TD;\n  A[Light Energy] --> B[Chloroplast];\n  B --> C[Light Reactions];\n  B --> D[Calvin Cycle];\n  C --> E[ATP + NADPH];\n  E --> D;\n  D --> F[Glucose];\n  G[CO2] --> D;\n  H[H2O] --> C;\n  C --> I[O2];",
  
  "ppt": [
    {
      "title": "What is Photosynthesis?",
      "points": [
        "Process converting light → chemical energy",
        "Occurs in plant chloroplasts",
        "Produces glucose and oxygen"
      ],
      "theme": "gradient-purple"
    },
    {
      "title": "Key Requirements",
      "points": [
        "☀️ Sunlight - Energy source",
        "💧 Water - Electron donor",
        "💨 CO2 - Carbon source"
      ],
      "theme": "gradient-blue"
    },
    {
      "title": "Two Main Stages",
      "points": [
        "Light-dependent reactions (Thylakoid)",
        "Calvin cycle (Stroma)",
        "Both are essential for glucose production"
      ],
      "theme": "gradient-pink"
    },
    {
      "title": "Products & Importance",
      "points": [
        "Glucose → Food for plants and animals",
        "Oxygen → Essential for respiration",
        "Foundation of food chains"
      ],
      "theme": "gradient-purple"
    }
  ]
}
```

---

## 🎨 Frontend Rendering Guide:

### Summary Tab:
```tsx
<div className="summary-section">
  <h2>{data.title}</h2>
  <p>{data.summary}</p>
</div>
```

### Flashcards Tab:
```tsx
{data.flashcards.map((card, i) => (
  <div 
    key={i} 
    className={card.type === 'good' ? 'card-good' : 'card-bad'}
  >
    <div className="question">{card.question}</div>
    <div className="answer">{card.answer}</div>
  </div>
))}
```

**Styling:**
- `type: "good"` → Green/Success theme
- `type: "bad"` → Red/Warning theme

### Quiz Tab:
```tsx
{data.quiz.map((q, i) => (
  <div key={i} className="quiz-question">
    <h3>{q.question}</h3>
    {q.options.map((opt, j) => (
      <button 
        key={j}
        className={opt === q.answer ? 'correct' : ''}
      >
        {opt}
      </button>
    ))}
  </div>
))}
```

### Diagram Tab:
```tsx
import mermaid from 'mermaid';

// Initialize once
mermaid.initialize({ theme: 'dark' });

// Render
<div className="mermaid">
  {data.diagram}
</div>
```

### PPT Slide Deck:
```tsx
{data.ppt.map((slide, i) => (
  <div key={i} className={`slide ${slide.theme}`}>
    <h1>{slide.title}</h1>
    <ul>
      {slide.points.map((point, j) => (
        <li key={j}>{point}</li>
      ))}
    </ul>
  </div>
))}
```

---

## 🔍 Validation:

### Check Response Structure:
```typescript
function validateResponse(data: any): boolean {
  return (
    data.title &&
    data.summary &&
    Array.isArray(data.flashcards) &&
    Array.isArray(data.quiz) &&
    data.diagram &&
    Array.isArray(data.ppt)
  );
}
```

### Handle Errors:
```typescript
try {
  const parsed = JSON.parse(response.text);
  if (!validateResponse(parsed)) {
    throw new Error('Invalid response format');
  }
  setData(parsed);
} catch (error) {
  console.error('Parse error:', error);
  showError('Failed to generate study guide');
}
```

---

## ✅ Benefits of New Format:

1. **Complete Package** - Everything in one API call
2. **Tab-Ready** - Maps directly to UI tabs
3. **Flashcard Types** - Good vs Bad for better learning
4. **Quiz Format** - Ready for testing
5. **Visual Diagrams** - Mermaid support
6. **Presentation Mode** - PPT slides with themes
7. **Consistent Structure** - Easy to parse and display

---

## 🚀 Usage:

```typescript
// API Call
const response = await fetch('/api/upload', {
  method: 'POST',
  body: JSON.stringify({
    text: 'Explain photosynthesis',
    modelId: 'hf:meta-llama/Llama-3.3-70B-Instruct'
  })
});

const data = await response.json();
const studyGuide = JSON.parse(data.text);

// Now you have:
studyGuide.title       // "Photosynthesis Basics"
studyGuide.summary     // Clear explanation
studyGuide.flashcards  // Array of cards
studyGuide.quiz        // Array of MCQs
studyGuide.diagram     // Mermaid code
studyGuide.ppt         // Array of slides
```

---

**Perfect for all tabs in your UI: Summary, Flashcards, Quiz, Diagram, Slide Deck! 🎯**
