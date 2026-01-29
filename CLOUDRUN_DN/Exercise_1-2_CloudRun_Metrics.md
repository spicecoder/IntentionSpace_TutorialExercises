# Exercise 1.2: Cloud Run Metrics as Infrastructure Pulses

**Series**: CPUX for Cloud Run  
**Level**: 1 (Cloud Run Basics with CPUX Lens)  
**Time**: 25 minutes  
**Reference**: Intention Space CPUX Reference Manual v1.1, Section 1.7 (Pulse), 1.8 (Field)

---

## ⏱️ Time Breakdown

- **Theory** (Real-World Analogy + Pulse Structure): 7 minutes
- **Practice** (Run MetricsObserver Demo): 3 minutes
- **Try It Yourself** (Hands-on Tasks): 5 minutes
- **Check Your Understanding** (Quiz): 3 minutes
- **Key Takeaways + Next Steps**: 2 minutes
- **Total**: 25 minutes

---

## 🎯 What You'll Learn (2 min)

By the end of this exercise, you will understand:

- ✅ **Cloud Run metrics ARE infrastructure pulses** (request_count, latency, etc.)
- ✅ Pulses have **trivalent state** (Y/N/U) representing observation confidence
- ✅ Metrics flow into **Field** for other DNs to consume
- ✅ The new **MetricsObserver utility** for reading Cloud Run metrics
- ✅ How pulses enable **reactive infrastructure** (metrics → decisions)

**Reference Manual Alignment**:
- Section 1.7: Pulse definition (prompt, trivalence, responses)
- Section 1.8: Field (FIS + FPS) as state container
- Section 2.3: Infrastructure pulses as observable state

---

## 🌍 Real-World Analogy (2 min)

**Metrics = Restaurant Kitchen Monitoring System**

Think of Cloud Run metrics like monitoring a restaurant kitchen:

| Restaurant | Cloud Run | CPUX Concept |
|-----------|-----------|--------------|
| **Order counter** | request_count | **Pulse** with numeric response |
| **Average cook time** | avg_latency_ms | **Pulse** with millisecond response |
| **Chefs available** | instance_count | **Pulse** with integer response |
| **Failed orders** | error_rate | **Pulse** with percentage response |
| **Kitchen status board** | Field (FPS) | Container for all metric pulses |
| **Manager checking board** | DN_ScaleDecision | Design Node consuming pulses |

**Critical insight**:
- The **monitoring system** doesn't cause orders → it **observes** orders
- The **metrics** don't cause traffic → they **reflect** traffic
- Metrics are **passive observations** that become **active signals** in Field

---

## 📖 Theory: Metrics as Pulses (5 min)

### What is a Pulse? (Reference Manual 1.7)

> **"Atomic data unit with prompt, trivalence, and optional responses"**

**Structure**:
```javascript
Pulse = {
  id: string,               // Unique identifier
  phrase: string,           // Prompt/question
  trivalence: 'Y' | 'N' | 'UN',  // Observation state
  responses: string[]       // Array of values
}
```

**Trivalence Values**:
- **'Y'** (Yes/Confirmed): Metric is observable and valid
- **'N'** (No/Denied): Metric is unavailable or invalid
- **'UN'** (Unknown): Metric not yet observed

---

### Cloud Run Metrics as Pulses

**Traditional Approach** (gcloud monitoring):
```bash
gcloud run services describe hello-app --region=us-central1 --format=json
```
Returns JSON blob → Hard to react to changes

**CPUX Approach** (metrics as pulses):
```javascript
// Each metric is a Pulse in Field
field.FPS = {
  'service_request_count': {
    phrase: 'How many requests has the service received?',
    responses: ['142'],
    trivalence: 'Y'  // Confirmed observation
  },
  'service_avg_latency_ms': {
    phrase: 'What is the average response latency?',
    responses: ['85'],
    trivalence: 'Y'
  },
  'service_instance_count': {
    phrase: 'How many instances are running?',
    responses: ['2'],
    trivalence: 'Y'
  },
  'service_error_rate': {
    phrase: 'What percentage of requests failed?',
    responses: ['0.5'],
    trivalence: 'Y'
  }
}
```

**Key difference**: Metrics are now **first-class data** that other DNs can consume!

---

### Anatomy of an Infrastructure Pulse

Let's examine `service_request_count` in detail:

```javascript
{
  // Unique identifier (auto-generated or explicit)
  id: 'pulse_req_count_001',
  
  // Human-readable question/prompt
  phrase: 'How many requests has the service received?',
  
  // Array of response values (often single value for metrics)
  responses: ['142'],
  
  // Trivalence: Observation confidence
  // Y = "We observed this value from Cloud Run API"
  // N = "Service doesn't exist or API failed"
  // UN = "Not yet polled"
  trivalence: 'Y',
  
  // Optional: Source attribution
  source: 'DN_MetricsObserver',
  
  // Optional: Timestamp
  timestamp: '2024-01-28T10:30:00.000Z'
}
```

---

### Field as Metrics Container (Reference Manual 1.8)

> **"State container for Intentions and Pulses during CPUX execution"**

**Field Structure**:
```javascript
Field = {
  FIS: Set<Intention>,  // Field Intention Set
  FPS: Set<Pulse>       // Field Pulse Set
}
```

**For Infrastructure**:
```javascript
InfrastructureField = {
  FIS: [
    'INT_DeployService',
    'INT_ObserveMetrics',
    'INT_CheckHealth'
  ],
  
  FPS: {
    // Deployment pulses (from Exercise 1.1)
    'deployed_service_name': { responses: ['hello-app'], trivalence: 'Y' },
    'deployed_service_url': { responses: ['https://...'], trivalence: 'Y' },
    
    // NEW: Runtime metric pulses
    'service_request_count': { responses: ['142'], trivalence: 'Y' },
    'service_avg_latency_ms': { responses: ['85'], trivalence: 'Y' },
    'service_instance_count': { responses: ['2'], trivalence: 'Y' },
    'service_error_rate': { responses: ['0.5'], trivalence: 'Y' }
  }
}
```

---

### Why Trivalence Matters for Metrics

**Problem with boolean/null**:
```javascript
// Traditional approach
const requestCount = null;  // What does null mean?
// - Service doesn't exist?
// - Haven't polled yet?
// - API failed?
// Ambiguous!
```

**Solution with trivalence**:
```javascript
// CPUX approach
{
  phrase: 'service_request_count',
  responses: ['142'],
  trivalence: 'Y'  // Explicitly "confirmed observation"
}

// Or if service doesn't exist:
{
  phrase: 'service_request_count',
  responses: [],
  trivalence: 'N'  // Explicitly "denied/unavailable"
}

// Or if not yet polled:
{
  phrase: 'service_request_count',
  responses: [],
  trivalence: 'UN'  // Explicitly "unknown/not observed"
}
```

**This enables DNs to react differently**:
- `trivalence === 'Y'` → Use value for scaling decisions
- `trivalence === 'N'` → Service down, emit alert
- `trivalence === 'UN'` → Still polling, wait

---

## 💻 Practice: MetricsObserver Design Node (10 min)

### Setup

1. **Create project directory**:
```bash
mkdir cpux-cloudrun-exercise-1-2
cd cpux-cloudrun-exercise-1-2
```

2. **Copy base files**:
```bash
# You need:
# - DNBase_Infrastructure.js (from Exercise 1.1)
# - MetricsObserver.js (new for this exercise)
```

3. **Verify Node.js**:
```bash
node --version  # Should be v18+
```

---

### Step 1: Understand MetricsObserver (3 min)

Open `MetricsObserver.js` and examine the structure:

**A. Gatekeeper** (What triggers observation?):
```javascript
gatekeeper: {
  'INT_ObserveMetrics': {
    'deployed_service_name': [null, 'Y'],  // Must have service name
    'deployment_region': [null, 'Y']       // Must have region
  }
}
```

**syncTest Logic**: "Is there a deployed service to observe?"

**B. Perform** (How are metrics collected?):
```javascript
perform(workingSet) {
  const serviceName = workingSet.deployed_service_name;
  const region = workingSet.deployment_region;
  
  // In this exercise: Simulated API call
  // In Exercise 2.2+: Real Cloud Monitoring API
  const metrics = simulateGetMetrics(serviceName, region);
  
  return {
    service_request_count: metrics.request_count,
    service_avg_latency_ms: metrics.avg_latency_ms,
    service_instance_count: metrics.instance_count,
    service_error_rate: metrics.error_rate,
    metrics_timestamp: new Date().toISOString()
  };
}
```

**C. Flowout** (Which pulses are emitted?):
```javascript
flowout: [
  'service_request_count',    // Number of requests
  'service_avg_latency_ms',   // Average response time
  'service_instance_count',   // How many containers
  'service_error_rate',       // Percentage of errors
  'metrics_timestamp'         // When observed
]
```

These pulses go into **Field (FPS)** for other DNs!

---

### Step 2: Run the Demo (2 min)

**Execute**:
```bash
node MetricsObserver.js
```

**Expected Output**:
```
======================================================================
🎯 DEMONSTRATION: Metrics as Infrastructure Pulses
======================================================================

📊 WHAT ARE WE OBSERVING?
──────────────────────────────────────────────────────────────────────
Service: hello-app
Region: us-central1
Deployed at: https://hello-app-xyz123-us-central1.a.run.app

📡 SIMULATING METRICS OBSERVATION
──────────────────────────────────────────────────────────────────────
[SIMULATED] Calling Cloud Monitoring API...
  gcloud monitoring read "run.googleapis.com/request_count" \
    --filter="resource.labels.service_name=hello-app"

✅ Metrics Retrieved!

📤 METRICS AS PULSES (Flowout to Field)
──────────────────────────────────────────────────────────────────────
{
  "service_request_count": "142",
  "service_avg_latency_ms": "85",
  "service_instance_count": "2",
  "service_error_rate": "0.5",
  "metrics_timestamp": "2024-01-28T10:30:00.000Z"
}

🔍 PULSE DETAILS
──────────────────────────────────────────────────────────────────────
Pulse: service_request_count
  Phrase: "How many requests has the service received?"
  Response: ["142"]
  Trivalence: Y (Confirmed observation)
  Source: DN_MetricsObserver

Pulse: service_avg_latency_ms
  Phrase: "What is the average response latency?"
  Response: ["85"]
  Trivalence: Y (Confirmed observation)
  Source: DN_MetricsObserver

Pulse: service_instance_count
  Phrase: "How many instances are running?"
  Response: ["2"]
  Trivalence: Y (Confirmed observation)
  Source: DN_MetricsObserver

Pulse: service_error_rate
  Phrase: "What percentage of requests failed?"
  Response: ["0.5"]
  Trivalence: Y (Confirmed observation)
  Source: DN_MetricsObserver

======================================================================
🧠 NEXT: These pulses are now in Field (FPS)
    Other DNs can react:
    - DN_ScaleDecision: Check if request_count > 100
    - DN_HealthCheck: Check if error_rate > 1.0
    - DN_AlertManager: Check if latency_ms > 200
======================================================================
```

---

### Step 3: Examine Pulse Trivalence (2 min)

**Key observation**: Every metric pulse has `trivalence: 'Y'`

**What would cause `trivalence: 'N'`?**
```javascript
// Service doesn't exist
{
  phrase: 'service_request_count',
  responses: [],
  trivalence: 'N',  // "Denied" - service not found
  error_message: 'Service "hello-app" not found in us-central1'
}

// API call failed
{
  phrase: 'service_avg_latency_ms',
  responses: [],
  trivalence: 'N',  // "Denied" - cannot observe
  error_message: 'Cloud Monitoring API error: PERMISSION_DENIED'
}
```

**What would cause `trivalence: 'UN'`?**
```javascript
// Not yet polled
{
  phrase: 'service_instance_count',
  responses: [],
  trivalence: 'UN'  // "Unknown" - haven't observed yet
}

// Service just deployed, metrics not available yet
{
  phrase: 'service_request_count',
  responses: ['0'],  // Has value
  trivalence: 'UN'   // But confidence is low (just started)
}
```

---

### Try It Yourself (5 min)

#### Task 1: Observe Different Service (2 min)

**Goal**: Understand how flowin changes produce different flowout

**Steps**:

1. Open `MetricsObserver.js`
2. Find the demonstration code (bottom of file)
3. Change the service name:
   ```javascript
   const observationConfig = {
     deployed_service_name: 'my-api',  // ← Changed from 'hello-app'
     deployment_region: 'us-central1',
     deployed_service_url: 'https://my-api-xyz123-us-central1.a.run.app'
   };
   ```
4. Run: `node MetricsObserver.js`

**What changes?**
<details>
<summary>Show Answer</summary>

**Changes**:
```diff
- Service: hello-app
+ Service: my-api

- Deployed at: https://hello-app-xyz123...
+ Deployed at: https://my-api-xyz123...

  Metrics values stay same (simulated)
  But in reality, different services have different metrics!
```

**Key insight**: The same DN (MetricsObserver) can observe **any service** just by changing flowin pulses. The DN is **reusable infrastructure**.
</details>

---

#### Task 2: Examine Simulated Metric Generation (2 min)

**Goal**: Understand how metrics vary over time

**Steps**:

1. Find the `simulateGetMetrics()` function:
   ```javascript
   function simulateGetMetrics(serviceName, region) {
     // Random variations to simulate real metrics
     const baseRequests = 100;
     const variation = Math.floor(Math.random() * 50);
     
     return {
       request_count: baseRequests + variation,  // 100-150
       avg_latency_ms: 50 + Math.floor(Math.random() * 100),  // 50-150ms
       instance_count: Math.random() > 0.5 ? 2 : 3,  // 2 or 3 instances
       error_rate: (Math.random() * 2).toFixed(2)  // 0.00-2.00%
     };
   }
   ```

2. Run `node MetricsObserver.js` multiple times
3. Observe different metric values each time

**What varies?**
<details>
<summary>Show Answer</summary>

**Each execution shows different values**:
```
Run 1:
  service_request_count: 142
  service_avg_latency_ms: 85
  service_instance_count: 2
  service_error_rate: 0.5

Run 2:
  service_request_count: 137
  service_avg_latency_ms: 121
  service_instance_count: 3
  service_error_rate: 1.2

Run 3:
  service_request_count: 105
  service_avg_latency_ms: 67
  service_instance_count: 2
  service_error_rate: 0.3
```

**Key insight**: Real metrics change constantly. In Exercise 2.2, we'll use real Cloud Monitoring API to get actual values. The DN structure stays identical!
</details>

---

#### Task 3: Add a New Metric Pulse (3 min)

**Goal**: Extend the DN to observe additional metrics

**Steps**:

1. Add `service_cpu_utilization` to flowout:
   ```javascript
   flowout: [
     'service_request_count',
     'service_avg_latency_ms',
     'service_instance_count',
     'service_error_rate',
     'service_cpu_utilization',  // ← NEW
     'metrics_timestamp'
   ]
   ```

2. Update `simulateGetMetrics()`:
   ```javascript
   return {
     request_count: baseRequests + variation,
     avg_latency_ms: 50 + Math.floor(Math.random() * 100),
     instance_count: Math.random() > 0.5 ? 2 : 3,
     error_rate: (Math.random() * 2).toFixed(2),
     cpu_utilization: (Math.random() * 80 + 20).toFixed(1)  // ← NEW: 20-100%
   };
   ```

3. Update `perform()` to return it:
   ```javascript
   return {
     service_request_count: metrics.request_count,
     service_avg_latency_ms: metrics.avg_latency_ms,
     service_instance_count: metrics.instance_count,
     service_error_rate: metrics.error_rate,
     service_cpu_utilization: metrics.cpu_utilization,  // ← NEW
     metrics_timestamp: new Date().toISOString()
   };
   ```

4. Run: `node MetricsObserver.js`

**What appears?**
<details>
<summary>Show Answer</summary>

**New pulse in output**:
```javascript
{
  "service_request_count": "142",
  "service_avg_latency_ms": "85",
  "service_instance_count": "2",
  "service_error_rate": "0.5",
  "service_cpu_utilization": "67.3",  // ← NEW!
  "metrics_timestamp": "2024-01-28T10:30:00.000Z"
}

Pulse: service_cpu_utilization
  Phrase: "What is the service CPU utilization?"
  Response: ["67.3"]
  Trivalence: Y (Confirmed observation)
  Source: DN_MetricsObserver
```

**Key insight**: Adding new metrics is just:
1. Add to flowout (what pulses to emit)
2. Add to perform (how to compute)
3. No other changes needed!

This is the power of declarative DN structure.
</details>

---

### ✅ Task Completion Checklist

After completing these tasks, you should understand:

- [ ] How to observe different services (change flowin)
- [ ] How metrics vary over time (simulated variation)
- [ ] How to add new metric pulses (extend flowout/perform)
- [ ] Why trivalence matters (Y = confirmed, N = denied, UN = unknown)
- [ ] How pulses flow into Field for other DNs

---

## 🧩 Challenge Yourself (5-10 min)

**Goal**: Apply what you've learned by solving real scenarios independently

These challenges have no provided answers - solve them on your own to deepen understanding!

---

### Challenge 1: Multi-Service Observer

**Scenario**: You have 3 microservices deployed: `auth-service`, `api-gateway`, `data-processor`

**Task**: Modify `MetricsObserver.js` to observe all 3 services in a single execution

**Hints**:
- Should flowin accept an array of service names?
- Should perform() loop through services?
- How should flowout change? (e.g., `auth_service_request_count`, `api_gateway_request_count`)
- What happens if one service fails but others succeed?

**Expected Behavior**:
```javascript
const config = {
  deployed_service_names: ['auth-service', 'api-gateway', 'data-processor'],
  deployment_region: 'us-central1'
};

// Output should have pulses for each service:
// auth_service_request_count, auth_service_avg_latency_ms, ...
// api_gateway_request_count, api_gateway_avg_latency_ms, ...
// data_processor_request_count, data_processor_avg_latency_ms, ...
```

**Questions to Consider**:
1. Should this be one DN or three separate DN instances?
2. How do you handle partial failures (2 services succeed, 1 fails)?
3. What should trivalence be for the failed service?

---

### Challenge 2: Threshold-Based Trivalence

**Scenario**: Metrics for newly deployed services aren't reliable for the first 2 minutes

**Task**: Modify `perform()` to set trivalence based on service age

**Hints**:
- Add `deployment_timestamp` to flowin (from Exercise 1.1)
- Calculate: `serviceAge = now - deployment_timestamp`
- If `serviceAge < 120 seconds` → trivalence = 'UN'
- Otherwise → trivalence = 'Y'

**Expected Behavior**:
```javascript
// Service deployed 1 minute ago
{
  phrase: 'service_request_count',
  responses: ['5'],
  trivalence: 'UN'  // Still warming up
}

// Same service deployed 5 minutes ago
{
  phrase: 'service_request_count',
  responses: ['142'],
  trivalence: 'Y'  // Reliable now
}
```

**Questions to Consider**:
1. Should the threshold be configurable (flowin pulse)?
2. How do you handle missing `deployment_timestamp`?
3. Should different metrics have different warm-up periods?

---

### Challenge 3: Metric Delta (Change Detection)

**Scenario**: You want to emit not just current values, but also **change from last observation**

**Task**: Enhance `MetricsObserver` to track previous metrics and emit deltas

**Hints**:
- Add instance variable: `this.previousMetrics = {}`
- In perform(): compare current vs previous
- Add new flowout pulses: `request_count_delta`, `latency_delta`, etc.
- Store current metrics as previous for next run

**Expected Behavior**:
```javascript
// First observation
{
  service_request_count: '100',
  request_count_delta: 'N/A'  // No previous data
}

// Second observation (2 minutes later)
{
  service_request_count: '150',
  request_count_delta: '+50'  // Increased by 50
}

// Third observation
{
  service_request_count: '145',
  request_count_delta: '-5'  // Decreased by 5
}
```

**Questions to Consider**:
1. Should delta have a different trivalence (UN for first observation)?
2. How do you handle service restarts (metrics reset to 0)?
3. Should you emit percentage change or absolute change?

---

### Challenge 4: Error Rate Alert Pulse

**Scenario**: Create a new pulse `error_rate_status` that categorizes error rates

**Task**: Add derived pulse based on `service_error_rate` thresholds

**Hints**:
- In perform(), after getting metrics, add logic:
  - If `error_rate < 0.5%` → 'HEALTHY'
  - If `0.5% ≤ error_rate < 2%` → 'DEGRADED'
  - If `error_rate ≥ 2%` → 'CRITICAL'
- Add `error_rate_status` to flowout
- This is a **derived pulse** (computed from another pulse)

**Expected Behavior**:
```javascript
// Metrics
{
  service_error_rate: '0.3',
  error_rate_status: 'HEALTHY'
}

// Later
{
  service_error_rate: '1.2',
  error_rate_status: 'DEGRADED'
}

// Crisis!
{
  service_error_rate: '5.8',
  error_rate_status: 'CRITICAL'
}
```

**Questions to Consider**:
1. Should thresholds be configurable via flowin?
2. Is this the right DN for this logic, or should it be a separate DN?
3. What's the trivalence of `error_rate_status`?

---

### Challenge 5: Metrics History Window

**Scenario**: Instead of point-in-time metrics, emit aggregates over last 5 minutes

**Task**: Simulate time-series data and compute: min, max, avg, p95 latency

**Hints**:
- Modify `simulateGetMetrics()` to return array of samples
- Add new flowout pulses: `latency_min`, `latency_max`, `latency_p95`
- Use array operations to compute aggregates

**Expected Behavior**:
```javascript
// Instead of single latency value
{
  service_avg_latency_ms: '85',  // Average over 5 min
  service_min_latency_ms: '12',  // Fastest request
  service_max_latency_ms: '456', // Slowest request
  service_p95_latency_ms: '145'  // 95th percentile
}
```

**Questions to Consider**:
1. Should the time window be configurable?
2. How do you handle services with < 5 minutes of data?
3. Should you include sample count in the pulses?

---

### ✅ Challenge Completion Tips

**How to Verify Your Solution**:
1. Run `node MetricsObserver.js` - does it execute without errors?
2. Check output - do new pulses appear with correct values?
3. Test edge cases - what happens with invalid input?
4. Review gatekeeper - does it protect against bad data?

**Common Pitfalls**:
- ❌ Forgetting to add new pulses to flowout
- ❌ Not handling null/undefined values
- ❌ Hardcoding values instead of computing from flowin
- ❌ Mixing concerns (observation vs decision logic)

**CPUX Principles to Remember**:
- Gatekeeper = "When should this DN execute?"
- Flowin = "What data do I need?"
- Perform = "What computation do I do?"
- Flowout = "What pulses do I emit?"
- Trivalence = "How confident am I in this observation?"

**Next Steps After Challenges**:
- Compare your solutions with peers
- Consider: "Is this one DN or multiple DNs?"
- Think: "Where does this pulse get consumed?"
- Prepare for Exercise 1.3 where these metrics trigger actions!

---

## ✅ Check Your Understanding (3 min)

### Question 1: Pulse vs Metric

**What's the difference between a "Cloud Run metric" and a "CPUX pulse"?**

- [ ] A. They're the same thing
- [ ] B. Pulse adds trivalence (Y/N/UN) to metrics
- [ ] C. Pulse is only for frontend, metric is for backend
- [ ] D. Pulse is deprecated, use metrics

<details>
<summary>Show Answer</summary>

**Answer: B. Pulse adds trivalence (Y/N/UN) to metrics**

```javascript
// Cloud Run metric (traditional)
const requestCount = 142;  // Just a number

// CPUX pulse (enhanced)
{
  phrase: 'service_request_count',
  responses: ['142'],  // Same value
  trivalence: 'Y'      // Plus confidence!
}
```

**Why it matters**:
- Traditional: `null` is ambiguous (error? not polled? service down?)
- CPUX: Trivalence is explicit (Y = observed, N = unavailable, UN = unknown)
- Enables DNs to react differently based on observation confidence
</details>

---

### Question 2: Field Role

**Where do metric pulses go after MetricsObserver emits them?**

- [ ] A. Back to Cloud Run API
- [ ] B. Into Field (FPS)
- [ ] C. Directly to scaling decisions
- [ ] D. Nowhere, they're just printed

<details>
<summary>Show Answer</summary>

**Answer: B. Into Field (FPS)**

```javascript
// After MetricsObserver executes
Field = {
  FIS: ['INT_ObserveMetrics'],
  
  FPS: {  // ← Metric pulses go here!
    'service_request_count': { responses: ['142'], trivalence: 'Y' },
    'service_avg_latency_ms': { responses: ['85'], trivalence: 'Y' },
    'service_instance_count': { responses: ['2'], trivalence: 'Y' }
  }
}

// Other DNs can now consume these pulses
class DN_ScaleDecision {
  gatekeeper: {
    'INT_CheckScaling': {
      'service_request_count': [null, 'Y']  // ← Requires this pulse!
    }
  }
}
```

**Key insight**: Field is the central state container. All DNs read from and write to Field.
</details>

---

### Question 3: Trivalence Use Case

**A service was just deployed. Metrics API returns 0 requests. What should trivalence be?**

- [ ] A. Y (we observed the value)
- [ ] B. N (zero means failed)
- [ ] C. UN (not enough data yet)
- [ ] D. Either A or C depending on context

<details>
<summary>Show Answer</summary>

**Answer: D. Either A or C depending on context**

**Option 1: trivalence = 'Y'**
```javascript
{
  phrase: 'service_request_count',
  responses: ['0'],
  trivalence: 'Y'  // "We successfully observed 0 requests"
}
```
Use when: API call succeeded, value is definitive

**Option 2: trivalence = 'UN'**
```javascript
{
  phrase: 'service_request_count',
  responses: ['0'],
  trivalence: 'UN'  // "Service just started, data not reliable yet"
}
```
Use when: Service too new, need warm-up period

**Key insight**: Trivalence isn't just about API success/failure. It's about **confidence in the observation**. Same value ('0') can have different confidence levels!

**Practical rule**:
- First 1-2 minutes after deployment → 'UN' (warm-up)
- After warm-up → 'Y' (even if value is 0)
</details>

---

## 🔍 Deep Dive: Why Metrics as Pulses?

### Problem: Traditional Monitoring

```javascript
// Imperative monitoring loop
setInterval(async () => {
  const metrics = await getMetrics('hello-app');
  
  if (metrics.requestCount > 100) {
    scaleUp('hello-app');
  } else if (metrics.requestCount < 10) {
    scaleDown('hello-app');
  }
  
  if (metrics.errorRate > 1.0) {
    sendAlert('hello-app');
  }
}, 60000);  // Every 60 seconds
```

**Problems**:
- ❌ Scaling logic mixed with polling logic
- ❌ Hard to test (need real service + timer)
- ❌ Can't replay historical metrics
- ❌ No visibility into "why" decisions were made
- ❌ Can't trace: "what metrics led to this scale decision?"

---

### Solution: Metrics as Pulses in Field

```javascript
// Stage 1: Observe metrics (DN_MetricsObserver)
Field.FPS = {
  'service_request_count': { responses: ['142'], trivalence: 'Y' },
  'service_error_rate': { responses: ['0.5'], trivalence: 'Y' }
}

// Stage 2: Scale decision (DN_ScaleDecision)
class DN_ScaleDecision {
  gatekeeper: {
    'INT_CheckScaling': {
      'service_request_count': [null, 'Y']  // Requires observed metrics
    }
  }
  
  perform(workingSet) {
    const count = parseInt(workingSet.service_request_count);
    
    if (count > 100) {
      return { scale_decision: 'SCALE_UP' };
    } else if (count < 10) {
      return { scale_decision: 'SCALE_DOWN' };
    }
    
    return { scale_decision: 'MAINTAIN' };
  }
}

// Stage 3: Alert decision (DN_AlertManager)
class DN_AlertManager {
  gatekeeper: {
    'INT_CheckAlerts': {
      'service_error_rate': [null, 'Y']
    }
  }
  
  perform(workingSet) {
    const errorRate = parseFloat(workingSet.service_error_rate);
    
    if (errorRate > 1.0) {
      return { alert_level: 'CRITICAL' };
    }
    
    return { alert_level: 'OK' };
  }
}
```

**Benefits**:
- ✅ Separation of concerns (observe vs decide vs act)
- ✅ Each DN testable in isolation
- ✅ Can replay: inject historical metrics into Field
- ✅ Full traceability: "decision X because pulse Y had value Z"
- ✅ Declarative: gatekeeper shows exact dependencies

---

## 🎯 Key Takeaways

1. **Metrics Are Pulses**
   - Every Cloud Run metric maps to a pulse
   - Pulse = prompt + responses + trivalence
   - Trivalence adds observation confidence (Y/N/UN)

2. **Pulses Flow Through Field**
   - MetricsObserver emits pulses → Field (FPS)
   - Other DNs consume from Field → Make decisions
   - Field is the central state container

3. **Trivalence Enables Nuance**
   - Y = "Confirmed observation"
   - N = "Denied/unavailable"
   - UN = "Unknown/not yet observed"
   - Same value can have different confidence!

4. **Reactive Infrastructure**
   - Metrics as pulses enable event-driven infrastructure
   - DNs react to metric changes (via gatekeeper syncTest)
   - No polling loops needed (Field-based subscription)

---

## ➡️ Next Steps (1 min)

**Exercise 1.3: gcloud deploy as Intention Emission**

Now that you understand:
- ✅ Services are DNs (Exercise 1.1)
- ✅ Metrics are pulses (Exercise 1.2)

We'll learn:
- `gcloud run deploy` **emits Intentions** (INT_DeployService)
- How CLI commands map to Intention+Signal pairs
- The complete flow: Command → Intention → DN → Object → DN

**Preview**:
```bash
# Traditional
gcloud run deploy hello-app --image=gcr.io/project/hello

# CPUX interpretation
INT_DeployService + Signal {
  'target_service_name': { responses: ['hello-app'], trivalence: 'Y' },
  'target_service_image': { responses: ['gcr.io/project/hello'], trivalence: 'Y' }
}

# This Intention+Signal triggers DN_ServiceDeployer (Exercise 1.1)
# Which then emits INT_ServiceReady + deployment metrics (Exercise 1.2)
```

**See you in Exercise 1.3!** 🚀

---

## 📚 Additional Resources

- **Reference Manual**: Section 1.7 (Pulses), 1.8 (Field)
- **Exercise 1.1**: ServiceDeployer (context for metrics)
- **Exercise 2.2**: Real Cloud Monitoring API (next level)
- **Cloud Run Docs**: https://cloud.google.com/run/docs/monitoring
- **Next Exercise**: Exercise 1.3 (CLI as Intentions)

---

**End of Exercise 1.2** ✅
