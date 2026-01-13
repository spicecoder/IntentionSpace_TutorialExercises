# Field Design – Exercise 3.1

The Field is a centralized passive container.

It holds:
- Pulses (data snapshots)
- Intentions (activity traces)

It does NOT:
- Execute logic
- Mutate business rules
- Compute values

Example (Shopping Cart):

Pulses:
- cart_items
- cart_total
- item_count

Intentions:
- INT_ADD_TO_CART
- INT_REMOVE_FROM_CART

Objects reflect Intentions before they reach the Field.
This enables filtering, retries, and compensation.

This document describes state design, not implementation.
