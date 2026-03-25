# 🎨 Study Guide Renderer - Integration Guide

## Overview

The `StudyGuideRenderer` component beautifully displays AI-generated study guides with support for text, lists, tables, and diagrams (Mermaid).

---

## 📦 Components Created:

### 1. **StudyGuideRenderer.tsx**
Main component for rendering structured study guides

**Location:** `/app/src/components/StudyGuideRenderer.tsx`

**Features:**
- ✅ Text sections with proper formatting
- ✅ Numbered lists with gradient bullets
- ✅ Beautiful tables with hover effects
- ✅ Mermaid diagram rendering
- ✅ Section type icons
- ✅ Gradient headers and borders
- ✅ Dark theme optimized

### 2. **GenerateContent.tsx** (Example Page)
Example implementation showing how to use the renderer

**Location:** `/app/src/pages/GenerateContent.tsx`

---

## 🎯 How to Use:

### Option 1: Use in Upload Page

Update your existing `/app/src/pages/Upload.tsx`:

```tsx
import StudyGuideRenderer from "../components/StudyGuideRenderer";

// After getting response from API:
const data = await response.json();
const parsedData = JSON.parse(data.text);

// Render it:
<StudyGuideRenderer data={parsedData} />
```

### Option 2: Use in Results Page

Update `/app/src/pages/Results.tsx`:

```tsx
import StudyGuideRenderer from "../components/StudyGuideRenderer";

// If you have study guide data:
<StudyGuideRenderer data={studyGuideData} />
```

### Option 3: Create New Page (Already Done!)

Use the example page `/app/src/pages/GenerateContent.tsx` directly or as reference.

---

## 📋 Required Dependencies:

### Install Mermaid (if not already installed):

```bash
cd /app
yarn add mermaid
```

### Icons (Already installed - lucide-react):
- ✅ `lucide-react` package

---

## 🎨 Component Props:

```typescript
interface StudyGuideRendererProps {
  data: {
    title: string;
    sections: Array<{
      heading: string;
      content: string | string[] | string[][];
      type: "text" | "list" | "table" | "diagram";
      diagram?: string; // Only for diagram type
    }>;
  };
}
```

---

## 💡 Example Data Format:

```json
{
  "title": "Introduction to React Hooks",
  "sections": [
    {
      "heading": "What are React Hooks?",
      "content": "React Hooks are functions that let you use state...",
      "type": "text"
    },
    {
      "heading": "Common Hooks",
      "content": [
        "useState - Manage component state",
        "useEffect - Handle side effects",
        "useContext - Access context values"
      ],
      "type": "list"
    },
    {
      "heading": "Comparison Table",
      "content": [
        ["Feature", "Hooks", "Classes"],
        ["State", "useState", "this.state"],
        ["Lifecycle", "useEffect", "componentDidMount"]
      ],
      "type": "table"
    },
    {
      "heading": "Component Lifecycle",
      "diagram": "graph LR\n  A[Mount] --> B[Render]\n  B --> C[Update]",
      "type": "diagram"
    }
  ]
}
```

---

## 🎭 Visual Features:

### Section Types & Icons:

1. **Text** 📄
   - Purple file icon
   - Clean paragraph formatting
   - Proper line spacing

2. **List** 📝
   - Pink list icon
   - Gradient numbered bullets
   - Flex layout for alignment

3. **Table** 📊
   - Blue table icon
   - Gradient header row
   - Hover effects on rows
   - Responsive horizontal scroll

4. **Diagram** 🔷
   - Green network icon
   - Dark background container
   - Mermaid.js rendering
   - Auto-theming (purple/pink)

---

## 🔧 Customization:

### Change Colors:

Edit the gradient colors in `StudyGuideRenderer.tsx`:

```tsx
// Title gradient:
className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600"

// Button gradient:
className="bg-gradient-to-r from-purple-500 to-pink-500"

// Icon backgrounds:
className="from-purple-500/20 to-pink-500/20"
```

### Change Mermaid Theme:

In the `mermaid.initialize()` call:

```tsx
mermaid.initialize({ 
  theme: 'dark', // or 'default', 'forest', 'neutral'
  themeVariables: {
    primaryColor: '#a855f7', // Change colors
    primaryTextColor: '#fff',
    lineColor: '#ec4899'
  }
});
```

---

## 🚀 Integration Steps:

### Step 1: Install Dependencies
```bash
cd /app
yarn add mermaid
```

### Step 2: Copy Components
Both files are already created:
- ✅ `/app/src/components/StudyGuideRenderer.tsx`
- ✅ `/app/src/pages/GenerateContent.tsx`

### Step 3: Add Route (Optional)
If using the example page, add to App.tsx:

```tsx
import GenerateContent from "./pages/GenerateContent";

// In routes:
<Route path="/generate" element={
  <DashboardLayout>
    <GenerateContent />
  </DashboardLayout>
} />
```

### Step 4: Update Sidebar (Optional)
Add link in DashboardLayout.tsx:

```tsx
{ name: "Generate Study Guide", path: "/generate", icon: BookOpen }
```

---

## 🎬 Usage Example:

### Basic Usage:
```tsx
import StudyGuideRenderer from "../components/StudyGuideRenderer";

function MyComponent() {
  const [data, setData] = useState(null);

  // Fetch data from API
  const fetchStudyGuide = async () => {
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: JSON.stringify({ text: "Study material..." })
    });
    const json = await res.json();
    setData(JSON.parse(json.text));
  };

  return (
    <div>
      {data && <StudyGuideRenderer data={data} />}
    </div>
  );
}
```

---

## 📱 Responsive Design:

The component is fully responsive:
- ✅ Mobile-friendly tables (horizontal scroll)
- ✅ Flexible layouts
- ✅ Touch-friendly spacing
- ✅ Adaptive font sizes

---

## ⚡ Performance:

- **Mermaid Lazy Loading:** Diagrams render on demand
- **Optimized Re-renders:** React.memo can be added if needed
- **Smooth Animations:** CSS transitions for hover effects

---

## 🐛 Troubleshooting:

### Mermaid Not Rendering?
```tsx
// Add this to force render:
useEffect(() => {
  mermaid.contentLoaded();
}, []);
```

### Diagram Syntax Error?
Check Mermaid syntax: https://mermaid.js.org/intro/

### Styling Issues?
Make sure Tailwind CSS is configured properly.

---

## 🎯 Next Steps:

1. **Install mermaid:** `yarn add mermaid`
2. **Test the component** with sample data
3. **Integrate** into your existing pages
4. **Customize** colors/styles as needed
5. **Deploy** and enjoy! 🎉

---

**Your study guides will look AMAZING! 🚀**
