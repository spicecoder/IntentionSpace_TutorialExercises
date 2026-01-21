# 📘 Exercise 4.2 — Objects & Pure Transformations (Summary)

## 🎯 Purpose of This Exercise

Exercise 4.2 teaches the most critical rule of **Objects in CPUX**:

> **Objects reshape data structure, NOT data meaning.**

This exercise clearly separates:

- **Pure structural transformations** (allowed in Objects)
- **Value-based computation** (forbidden in Objects, belongs in Design Nodes)

---

## 🧠 Core Concept

### Objects map **PULSES**, not **VALUES**

Objects are **pure reflectors**.  
They can:

- Create new pulses  
- Rename pulses  
- Copy pulse values  
- Aggregate pulse values blindly  

But they must **never change the value itself**.

---

## ❌ WRONG Approach — Value Transformation

**Example:**

```text
dish_name: "Pasta"
↓ Object
dish_name: "Fideos"



✅ RIGHT Approach — Pulse-to-Pulse Mapping

item_dish: "Pasta"
↓ Object
item_dish: "Pasta"        (unchanged)
table_dish: "Pasta"       (new pulse)


Why this is correct:

Original pulse remains immutable

New pulse is created with the same value

Only structure changes, not meaning

Object does not “understand” the value



🧩 Pure Operations Objects CAN Perform
Operation	Description
COPY	Duplicate pulse with same value
RENAME	Change pulse name only
FILTER	Select subset of pulses
AGGREGATE	Append values as opaque strings (CSV)
MAP (pulse name)	Map pulse names, not values

All operations are:

Deterministic

Side-effect free

Non-computational

🚫 What Objects MUST NEVER Do
Forbidden Action	Reason
Change values	Computation
Translate meanings	Business logic
Calculate totals	Processing
Validate rules	Decision making
Parse values	Interpretation
Query DB / APIs	External dependency

👉 These responsibilities belong to Design Nodes (DNs).

🔑 Why Pulse Immutability Matters
Traceability

Original data is never lost

Predictability

Same input → same output structure

Architectural Safety

Objects never evolve into “smart” processors

Clear Responsibility Boundary

Objects = structure reshaping

Design Nodes = computation & logic

🧠 Key Insight

If an Object needs to understand or interpret a value, it is already doing computation — and is therefore wrong.

🏁 Final Takeaway

Objects are mirrors with rules, not processors.

They:

Receive intentions

Hold pulses temporarily

Reshape pulse structures

Reflect data forward

They never:

Compute

Decide

Interpret

Apply business logic

This strict purity rule is foundational to CPUX architecture.