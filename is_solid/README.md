# Solid Intention Space Demo

**Executable Intent over Solid Pods**

A small working demo exploring whether runtime intent and execution can be made **explicit, structured, and user-owned**.

---

## 🌐 Motivation

The Web enabled **document sharing**.  
The Semantic Web introduced **structured data relationships**.

However:

> Runtime execution and interaction between software components remain **implicit and platform-dependent**.

This demo explores:

> Can **intent and execution** themselves become **first-class, user-owned artifacts**?

---

## 🧠 Core Idea

### Intention
Represents *what is being attempted*

```
todo:create
```

### Pulse
A **minimal unit of perceived relevance**

Each pulse contains:
- `name`
- `tv` (Y / N / UN)
- `responses` (self-describing data)

Example:

```json
{
  "name": "p_todo_text",
  "tv": "Y",
  "responses": [
    ["META", "text", "priority"],
    ["Buy milk", "high"]
  ]
}
```

### Field
The **runtime state**
- intentions
- pulses

---

## ⚙️ What This Demo Does

- Solid login (WebID)
- Pod storage (`intentions.json`, `pulses.json`, `field.json`)
- Client-side execution (CPUX-style)
- Writes updated state back to Pod

---

## 🔁 Example Flow

```
p_todo_text (Y)
    ↓
p_todo_valid (Y)
    ↓
p_todo_created (Y)
```

---

## 📦 Pod Storage

```
/intention-space/
  intentions.json
  pulses.json
  field.json
```

Example:

```json
{
  "intentions": ["todo:create"],
  "pulses": [
    {
      "name": "p_todo_text",
      "tv": "Y",
      "responses": [
        ["META", "text", "priority"],
        ["Buy milk", "high"]
      ]
    },
    {
      "name": "p_todo_created",
      "tv": "Y",
      "responses": ["created"]
    }
  ]
}
```

---

## 🔍 Key Insight

> The system stores not just data, but the **progression of intent**.

---

## 🔗 Alignment with Solid

From:
- data ownership

To:
- **execution ownership**

---

## 🚀 Run

```
npm install
npm run dev
```

---

## 🧠 Closing

> If RDF made data relationships explicit,  
> this explores making **intent explicit**.
