/-
CPUXCore.lean
Lean 4 executable model of:

  Field + Signal + SyncTest + emitted Pulses + transition
  + pull-mode consumption + quiescence + Golden Pass
  + successful/unresolved quiescence
  + Population -> Traffic -> Hospital example

The model deliberately separates:
  Pulse logical handle = (name, TV)
  Pulse response       = associated data

Run in a Lean 4 project:

  lake env lean CPUXCore.lean

To execute the demo main:

  lake env lean --run CPUXCore.lean

No Mathlib dependency is required; only Std is imported.
-/

import Std

namespace CPUX

/- ============================================================
   1. Generic algebraic domain
   ============================================================ -/

inductive TV where
  | Y
  | N
  | UN
  deriving Repr, DecidableEq, BEq

inductive ExtractMode where
  | copy
  | pull
  deriving Repr, DecidableEq, BEq

/-- Pulse = logical handle + response data.
    SyncTest uses only (name,tv); computation may use response. -/
structure Pulse (α : Type) where
  name     : String
  tv       : TV
  response : α
  deriving Repr, DecidableEq, BEq

structure PulseKey where
  name : String
  tv   : TV
  deriving Repr, DecidableEq, BEq

def Pulse.key (p : Pulse α) : PulseKey :=
  ⟨p.name, p.tv⟩

/-- Signal = directed communication Intention + Pulses. -/
structure Signal (α : Type) where
  intention : String
  pulses    : List (Pulse α)
  deriving Repr, DecidableEq, BEq

/-- Field = currently perceived logical state. -/
structure Field (α : Type) where
  intentions : List String
  pulses     : List (Pulse α)
  deriving Repr, DecidableEq, BEq

/-- SyncTest = admission predicate for a Design Node. -/
structure SyncTest where
  intention      : String
  requiredPulses : List PulseKey
  deriving Repr, DecidableEq, BEq

/-- DN is represented by its execution contract.
    The real implementation can remain Go/Python/R/Docker/etc. -/
structure DN (α : Type) where
  id                : String
  sync              : SyncTest
  designatedOutputs : List (Signal α)
  extractMode       : ExtractMode := .copy
  deriving Repr, DecidableEq, BEq

/- ============================================================
   2. Field / SyncTest algebra
   ============================================================ -/

def hasIntention (f : Field α) (i : String) : Bool :=
  f.intentions.contains i

def hasPulseKey (f : Field α) (k : PulseKey) : Bool :=
  f.pulses.any (fun p => p.key == k)

/-- The Field simultaneously activates matching DNs and blocks
    non-matching DNs through the same admission contract. -/
def enabled (f : Field α) (s : SyncTest) : Bool :=
  hasIntention f s.intention &&
  s.requiredPulses.all (hasPulseKey f)

/-- Remove the Pulse values consumed by a pull-mode SyncTest. -/
def removePulseKeys (ps : List (Pulse α)) (ks : List PulseKey) : List (Pulse α) :=
  ps.filter (fun p => !(ks.contains p.key))

def extractFor (f : Field α) (s : SyncTest) (mode : ExtractMode) : Field α :=
  match mode with
  | .copy => f
  | .pull =>
      { f with pulses := removePulseKeys f.pulses s.requiredPulses }

/-- "replace by Pulse name" policy for active Field state. -/
def replacePulse (ps : List (Pulse α)) (p : Pulse α) : List (Pulse α) :=
  p :: ps.filter (fun q => q.name != p.name)

/-- Reflect an emitted Signal into the Field. -/
def reflect (f : Field α) (s : Signal α) : Field α :=
  let newIntentions :=
    if f.intentions.contains s.intention then
      f.intentions
    else
      s.intention :: f.intentions
  let newPulses := s.pulses.foldl replacePulse f.pulses
  ⟨newIntentions, newPulses⟩

/-- One symbolic CPUX transition.
    1. SyncTest must pass.
    2. pull/copy extraction is applied.
    3. only a designated output may be reflected.
-/
def transition? (f : Field α) (dn : DN α) (outputIndex : Nat) : Option (Field α) :=
  if enabled f dn.sync then
    match dn.designatedOutputs[outputIndex]? with
    | none => none
    | some out =>
        let afterExtract := extractFor f dn.sync dn.extractMode
        some (reflect afterExtract out)
  else
    none

def Steps (f : Field α) (dn : DN α) (idx : Nat) (f' : Field α) : Prop :=
  transition? f dn idx = some f'

theorem disabled_has_no_transition
    (f : Field α) (dn : DN α) (idx : Nat)
    (h : enabled f dn.sync = false) :
    transition? f dn idx = none := by
  simp [transition?, h]

/- ============================================================
   3. Quiescence algebra
   ============================================================ -/

/-- Executable quiescence:
    no configured DN has an admissible transition from this Field. -/
def quiescent (f : Field α) (dns : List (DN α)) : Bool :=
  dns.all (fun dn => !(enabled f dn.sync))

/-- Proposition-level form useful in proofs/papers. -/
def Quiescent (f : Field α) (dns : List (DN α)) : Prop :=
  ∀ dn ∈ dns, enabled f dn.sync = false

/-- A concrete Bool quiescence result implies the proposition form. -/
theorem quiescent_true_implies_Quiescent
    (f : Field α) (dns : List (DN α))
    (h : quiescent f dns = true) :
    Quiescent f dns := by
  intro dn hmem
  unfold quiescent at h
  have hall := List.all_eq_true.mp h dn hmem
  simpa using hall

/-- Golden Pass is represented here as stable quiescence:
    two consecutive observations are quiescent and the Field is unchanged.

    This deliberately formalises the CPUX design rule without claiming
    general program termination.
-/
def goldenPass [BEq α]
    (first second : Field α)
    (dns : List (DN α)) : Bool :=
  quiescent first dns &&
  quiescent second dns &&
  (first == second)

/-- Completion is application-specific, so it is supplied as a predicate. -/
def successfulQuiescence
    (f : Field α)
    (dns : List (DN α))
    (complete : Field α → Bool) : Bool :=
  quiescent f dns && complete f

def unresolvedQuiescence
    (f : Field α)
    (dns : List (DN α))
    (complete : Field α → Bool) : Bool :=
  quiescent f dns && !(complete f)

/- ============================================================
   4. Example: Population -> Traffic -> Hospital
   ============================================================ -/

abbrev Data := String

def pulse (name : String) (tv : TV) (r : Data := "") : Pulse Data :=
  ⟨name, tv, r⟩

def key (name : String) (tv : TV := .Y) : PulseKey :=
  ⟨name, tv⟩

def initialSignal : Signal Data :=
  {
    intention := "I_params"
    pulses := [
      pulse "region" .Y "melbourne",
      pulse "year" .Y "2030",
      pulse "scenario" .Y "high_growth"
    ]
  }

def F0 : Field Data :=
  reflect ⟨[], []⟩ initialSignal

/- Population -/

def popSync : SyncTest :=
  {
    intention := "I_params"
    requiredPulses := [
      key "region",
      key "year",
      key "scenario"
    ]
  }

def popOut : Signal Data :=
  {
    intention := "I_pop_out"
    pulses := [
      pulse "population_total" .Y "5100000",
      pulse "population_spread" .Y
        "{\"north\":0.35,\"south\":0.25,\"east\":0.20,\"west\":0.20}"
    ]
  }

def dnPopulation : DN Data :=
  {
    id := "DN_population"
    sync := popSync
    designatedOutputs := [popOut]
    extractMode := .pull
  }

/- Traffic -/

def trafficSync : SyncTest :=
  {
    intention := "I_pop_out"
    requiredPulses := [
      key "population_spread"
    ]
  }

def trafficOut : Signal Data :=
  {
    intention := "I_traffic_out"
    pulses := [
      pulse "traffic_volume" .Y "2800000",
      pulse "congestion_index" .Y "0.72"
    ]
  }

def dnTraffic : DN Data :=
  {
    id := "DN_traffic"
    sync := trafficSync
    designatedOutputs := [trafficOut]
    extractMode := .pull
  }

/- Hospital -/

def hospitalSync : SyncTest :=
  {
    intention := "I_traffic_out"
    requiredPulses := [
      key "population_total",
      key "traffic_volume"
    ]
  }

def hospitalOut : Signal Data :=
  {
    intention := "I_hosp_out"
    pulses := [
      pulse "beds_required" .Y "12400",
      pulse "capacity_status" .Y "adequate"
    ]
  }

def dnHospital : DN Data :=
  {
    id := "DN_hospital"
    sync := hospitalSync
    designatedOutputs := [hospitalOut]
    extractMode := .pull
  }

def allDNs : List (DN Data) :=
  [dnPopulation, dnTraffic, dnHospital]

/- Derive Fields through actual transition semantics rather than
   hand-constructing them. -/

def F1 : Field Data :=
  match transition? F0 dnPopulation 0 with
  | some f => f
  | none   => F0

def F2 : Field Data :=
  match transition? F1 dnTraffic 0 with
  | some f => f
  | none   => F1

def F3 : Field Data :=
  match transition? F2 dnHospital 0 with
  | some f => f
  | none   => F2

/- ============================================================
   5. Design-decision proofs
   ============================================================ -/

theorem population_enabled_at_start :
    enabled F0 popSync = true := by
  native_decide

theorem traffic_blocked_at_start :
    enabled F0 trafficSync = false := by
  native_decide

theorem hospital_blocked_at_start :
    enabled F0 hospitalSync = false := by
  native_decide

theorem traffic_enabled_after_population :
    enabled F1 trafficSync = true := by
  native_decide

theorem population_blocked_after_pull :
    enabled F1 popSync = false := by
  native_decide

theorem hospital_blocked_after_population :
    enabled F1 hospitalSync = false := by
  native_decide

theorem hospital_enabled_after_traffic :
    enabled F2 hospitalSync = true := by
  native_decide

theorem traffic_blocked_after_pull :
    enabled F2 trafficSync = false := by
  native_decide

theorem projected_sequence :
    transition? F0 dnPopulation 0 = some F1 ∧
    transition? F1 dnTraffic 0 = some F2 ∧
    transition? F2 dnHospital 0 = some F3 := by
  native_decide

/- ============================================================
   6. Logic as handle to data
   ============================================================ -/

def responseOf? (f : Field α) (name : String) : Option α :=
  match f.pulses.find? (fun p => p.name == name) with
  | some p => some p.response
  | none   => none

theorem traffic_handle_has_data :
    enabled F1 trafficSync = true ∧
    responseOf? F1 "population_spread" =
      some "{\"north\":0.35,\"south\":0.25,\"east\":0.20,\"west\":0.20}" := by
  native_decide

/- ============================================================
   7. Configuration-derived causal support
   ============================================================ -/

def outputSupports (out : Signal α) (s : SyncTest) : Bool :=
  s.requiredPulses.any (fun req =>
    out.pulses.any (fun p => p.key == req))

def precedes (a b : DN α) : Bool :=
  a.designatedOutputs.any (fun out => outputSupports out b.sync)

theorem population_supports_traffic :
    precedes dnPopulation dnTraffic = true := by
  native_decide

theorem traffic_supports_hospital :
    precedes dnTraffic dnHospital = true := by
  native_decide

/- ============================================================
   8. Quiescence and Golden Pass proofs
   ============================================================ -/

theorem F0_not_quiescent :
    quiescent F0 allDNs = false := by
  native_decide

theorem F1_not_quiescent :
    quiescent F1 allDNs = false := by
  native_decide

theorem F2_not_quiescent :
    quiescent F2 allDNs = false := by
  native_decide

theorem F3_is_quiescent :
    quiescent F3 allDNs = true := by
  native_decide

theorem F3_Quiescent :
    Quiescent F3 allDNs := by
  apply quiescent_true_implies_Quiescent
  exact F3_is_quiescent

/-- A no-activity pass leaves F3 unchanged in this abstraction. -/
def stablePass (f : Field α) (dns : List (DN α)) : Field α :=
  if quiescent f dns then f else f

theorem F3_golden_pass :
    goldenPass F3 (stablePass F3 allDNs) allDNs = true := by
  native_decide

/- ============================================================
   9. Successful vs unresolved quiescence
   ============================================================ -/

def simulationComplete (f : Field Data) : Bool :=
  hasIntention f "I_hosp_out" &&
  hasPulseKey f (key "beds_required") &&
  hasPulseKey f (key "capacity_status")

theorem F3_successfully_quiescent :
    successfulQuiescence F3 allDNs simulationComplete = true := by
  native_decide

/- A deliberately unresolved Field:
   no configured DN can consume "mobility_model_required",
   and completion is still absent. -/
def unresolvedSignal : Signal Data :=
  {
    intention := "I_unresolved"
    pulses := [
      pulse "mobility_model_required" .Y "new-model-needed"
    ]
  }

def F_unresolved : Field Data :=
  reflect ⟨[], []⟩ unresolvedSignal

theorem unknown_case_quiescent :
    quiescent F_unresolved allDNs = true := by
  native_decide

theorem unknown_case_not_complete :
    simulationComplete F_unresolved = false := by
  native_decide

theorem unknown_case_is_unresolved_quiescence :
    unresolvedQuiescence F_unresolved allDNs simulationComplete = true := by
  native_decide

/- ============================================================
   10. Human-readable executable report
   ============================================================ -/

def yesNo (b : Bool) : String :=
  if b then "true" else "false"

def status (f : Field Data) (dn : DN Data) : String :=
  if enabled f dn.sync then "ENABLED" else "BLOCKED"

def printState (label : String) (f : Field Data) : IO Unit := do
  IO.println s!"\n{label}"
  IO.println s!"  DN_population : {status f dnPopulation}"
  IO.println s!"  DN_traffic    : {status f dnTraffic}"
  IO.println s!"  DN_hospital   : {status f dnHospital}"
  IO.println s!"  Quiescent     : {yesNo (quiescent f allDNs)}"

def demo : IO Unit := do
  IO.println "CPUX / LEAN DESIGN ANALYSIS"
  IO.println "==========================="
  printState "F0 — initial Signal received" F0
  printState "F1 — after Population" F1
  printState "F2 — after Traffic" F2
  printState "F3 — after Hospital" F3

  IO.println "\nLogical-data handle"
  IO.println s!"  population_spread response at F1:"
  IO.println s!"  {repr (responseOf? F1 "population_spread")}"

  IO.println "\nConfiguration-derived support"
  IO.println s!"  Population ≺ Traffic : {yesNo (precedes dnPopulation dnTraffic)}"
  IO.println s!"  Traffic ≺ Hospital   : {yesNo (precedes dnTraffic dnHospital)}"

  IO.println "\nStable quiescence"
  IO.println s!"  F3 first quiescent pass : {yesNo (quiescent F3 allDNs)}"
  let F4 := stablePass F3 allDNs
  IO.println s!"  F4 next quiescent pass  : {yesNo (quiescent F4 allDNs)}"
  IO.println s!"  Field unchanged          : {yesNo (F3 == F4)}"
  IO.println s!"  GOLDEN PASS              : {yesNo (goldenPass F3 F4 allDNs)}"

  IO.println "\nQuiescence quality"
  IO.println s!"  F3 successful quiescence  : {yesNo (successfulQuiescence F3 allDNs simulationComplete)}"
  IO.println s!"  Unknown-case quiescence   : {yesNo (quiescent F_unresolved allDNs)}"
  IO.println s!"  Unknown-case complete     : {yesNo (simulationComplete F_unresolved)}"
  IO.println s!"  UNRESOLVED QUIESCENCE     : {yesNo (unresolvedQuiescence F_unresolved allDNs simulationComplete)}"

end CPUX

def main : IO Unit :=
  CPUX.demo
