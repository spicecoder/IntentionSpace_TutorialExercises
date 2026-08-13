CPUX / LEAN DESIGN ANALYSIS
===========================
The commentary below explains each DN status from the relation
between the current Field and that DN's SyncTest.


F0 — initial Signal received
  Field Intentions : I_params
  Field Pulses     : scenario=Y, year=Y, region=Y
  Admission commentary:
  DN_population : ENABLED because Intention 'I_params' is present and all required Pulses are present
  DN_traffic : BLOCKED because Intention 'I_pop_out' is absent and required Pulse(s) are missing: population_spread=Y
  DN_hospital : BLOCKED because Intention 'I_traffic_out' is absent and required Pulse(s) are missing: population_total=Y, traffic_volume=Y
  Quiescent : false — at least one configured DN is currently admissible.
  Commentary:
    The initial Signal places region, year and scenario in the Field.
    This satisfies Population's SyncTest, so Population may execute.
    Traffic and Hospital remain blocked because their prerequisite
    result Pulses have not yet been emitted.

F1 — after Population
  Field Intentions : I_pop_out, I_params
  Field Pulses     : population_spread=Y, population_total=Y
  Admission commentary:
  DN_population : BLOCKED because required Pulse(s) are missing: region=Y, year=Y, scenario=Y
  DN_traffic : ENABLED because Intention 'I_pop_out' is present and all required Pulses are present
  DN_hospital : BLOCKED because Intention 'I_traffic_out' is absent and required Pulse(s) are missing: traffic_volume=Y
  Quiescent : false — at least one configured DN is currently admissible.
  Commentary:
    Population has emitted population_total and population_spread.
    Because Population uses pull mode, its original input Pulses were
    consumed, preventing Population from immediately re-firing.
    population_spread now satisfies Traffic's SyncTest.
    Hospital remains blocked because traffic_volume is still absent.

F2 — after Traffic
  Field Intentions : I_traffic_out, I_pop_out, I_params
  Field Pulses     : congestion_index=Y, traffic_volume=Y, population_total=Y
  Admission commentary:
  DN_population : BLOCKED because required Pulse(s) are missing: region=Y, year=Y, scenario=Y
  DN_traffic : BLOCKED because required Pulse(s) are missing: population_spread=Y
  DN_hospital : ENABLED because Intention 'I_traffic_out' is present and all required Pulses are present
  Quiescent : false — at least one configured DN is currently admissible.
  Commentary:
    Traffic has consumed population_spread and emitted traffic_volume.
    population_total remains available in the Field.
    Together, population_total and traffic_volume satisfy Hospital's
    SyncTest, making Hospital the admissible next computation.

F3 — after Hospital
  Field Intentions : I_hosp_out, I_traffic_out, I_pop_out, I_params
  Field Pulses     : capacity_status=Y, beds_required=Y, congestion_index=Y
  Admission commentary:
  DN_population : BLOCKED because required Pulse(s) are missing: region=Y, year=Y, scenario=Y
  DN_traffic : BLOCKED because required Pulse(s) are missing: population_spread=Y
  DN_hospital : BLOCKED because required Pulse(s) are missing: population_total=Y, traffic_volume=Y
  Quiescent : true — the current Field satisfies no configured DN SyncTest.
  Commentary:
    Hospital has consumed its prerequisite Pulses and emitted the final
    result Pulses. No configured DN now has a satisfied SyncTest.
    The Field is therefore quiescent.

Logical-data handle
  Commentary:
    The Pulse 'population_spread=Y' is the logical handle used by
    SyncTest, while its response carries the associated data.
  population_spread response at F1:
  some "{\"north\":0.35,\"south\":0.25,\"east\":0.20,\"west\":0.20}"

Configuration-derived support
  Commentary:
    These relations are derived from emitted Pulse handles and
    downstream SyncTest requirements, rather than an explicit DAG.
  Population ≺ Traffic : true
  Traffic ≺ Hospital   : true

Stable quiescence
  F3 first quiescent pass : true
    No DN is admissible from F3.
  F4 next quiescent pass  : true
    Rechecking produces no new admissible DN.
  Field unchanged          : true
    The perceived operational state is stable across the two passes.
  GOLDEN PASS              : true
    Golden Pass therefore represents stable quiescence, not merely
    a momentary absence of execution.

Quiescence quality
  F3 successful quiescence  : true
    The Field is quiescent and the declared completion condition holds.
  Unknown-case quiescence   : true
    No available DN SyncTest admits the unresolved Field.
  Unknown-case complete     : false
    The application-level completion condition is still false.
  UNRESOLVED QUIESCENCE     : true
    This exposes the boundary of currently configured capability:
    the Field is stable, but no configured DN knows how to progress it.


es — convert them to 4–5 highlight slides, not the full log.

Best structure:

Field decides admissibility
F0: Population enabled; Traffic/Hospital blocked.
Logic handle moves data forward
F1: population_spread=Y enables Traffic and carries response data.
Sequence emerges from SyncTest
Population ≺ Traffic ≺ Hospital, derived from emitted Pulses and downstream requirements.
Quiescence is logical, not accidental
F3: no configured DN SyncTest is satisfied, so Field is quiescent.
Golden Pass vs unresolved quiescence
Golden Pass = stable quiescence; unresolved quiescence = stable Field but missing configured capability.

This would be a strong bridge from demo to logic paper.