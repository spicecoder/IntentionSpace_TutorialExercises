# Exercise 3.1 – Field Initialization (Frontend Intention Tunnel)

## What is happening in this app?

This React app demonstrates the **Field**, which is the central shared
state container in the Frontend Intention Tunnel architecture.

At this stage:
- The Field exists
- Components can read from it
- No business logic is executed yet

This is intentional.

---

## Why does the UI show an empty array?


This means:
- The `todos` pulse does not exist yet
- No Intentions have been emitted
- No Objects have reflected any state into the Field

The Field starts **empty by default**.

This confirms:
- Field is passive
- Field does not create data
- Field only holds data when something writes to it

---

## What components exist right now?

### 1. IntentionTunnelProvider
- Creates the Field
- Stores pulses and intentions
- Exposes Field via React Context
- Does NOT contain business logic

### 2. FieldContext
- Allows any component to access the Field

### 3. TodoList component
- Subscribes to the Field
- Reads the `todos` pulse
- Renders whatever exists in the Field

---

## Why is the Field passive?

The Field:
- Does not calculate
- Does not validate
- Does not mutate business rules
- Only stores and notifies

All logic will live in:
- Design Nodes (DNs)
- Objects (state holders)

This separation keeps the system:
- Predictable
- Debuggable
- Scalable

---

## What is missing to make this a real Todo app?

The following will be added in upcoming exercises:

- Emitting Intentions (user actions)
- Objects reflecting Pulses into the Field
- Design Nodes handling logic
- Intent lifecycle management
- Derived pulses (counts)
- Retry and traceability

This file documents the **starting point** of the architecture.
