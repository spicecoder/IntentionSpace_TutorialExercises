# Exercise 1.1: Cloud Run Service Deployment as a Design Node

**Series**: CPUX for Cloud Run  
**Level**: 1 (Cloud Run Basics with CPUX Lens)  
**Time**: 25 minutes  
**Reference**: Intention Space CPUX Reference Manual v1.1, Section 1.3

---

## ⏱️ Time Breakdown

- **Theory** (Real-World Analogy + Two-Layer Model): 7 minutes
- **Practice** (Run ServiceDeployer Demo): 3 minutes
- **Try It Yourself** (Hands-on Tasks): 5 minutes
- **Check Your Understanding** (Quiz): 3 minutes
- **Key Takeaways + Next Steps**: 2 minutes
- **Total**: 25 minutes

---

## 🎯 What You'll Learn (2 min)

By the end of this exercise, you will understand:

- ✅ **TWO-LAYER SEPARATION**: Application code (hello-app) vs Infrastructure DN (ServiceDeployer)
- ✅ Infrastructure DNs **deploy external services**, not themselves
- ✅ Design Nodes have **three key parts**: Gatekeeper, Perform, Flowout
- ✅ The same CPUX patterns from frontend apps work for infrastructure
- ✅ Why simulated gcloud calls help learning

**Reference Manual Alignment**:
- Section 1.3: Design Node (DN) definition
- Section 2.1: DN State Model (Ready, Busy, Stopped)
- Section 3.2: DN Visit Sequence

---

## 🌍 Real-World Analogy (2 min)

**Infrastructure DN = Chef (Deploys Food)**  
**Application Code = Meal (Gets Deployed)**

Think of deploying a Cloud Run service like a restaurant:

| Restaurant | Cloud Run | CPUX Concept |
|-----------|-----------|--------------|
| **Chef** (person) | ServiceDeployer DN | Infrastructure orchestrator |
| **Meal** (food) | hello-app (Express.js) | Application code |
| **Check ingredients** | Validate config | **Gatekeeper** syncTest |
| **Cooking process** | Deployment to Cloud Run | **Perform** function |
| **Serve dish** | Service URL ready | **Flowout** pulses |

**Critical distinction**:
- The **chef** doesn't cook themselves → they cook a **meal**
- The **DN** doesn't deploy itself → it deploys an **application**
- Chef ≠ Meal (separate entities)
- DN ≠ Application (separate layers)

---

## 📖 Theory: The Two-Layer Model (5 min)

### Layer 1: Application Code (hello-app)

**What it is**:
- Regular Express.js application
- Handles HTTP requests (`GET /`, `GET /health`)
- Runs **INSIDE** Cloud Run container
- **NOT a Design Node** - just normal code

**Code**:
```javascript
// File: hello-app/index.js
// This code runs INSIDE Cloud Run

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ 
    message: 'Hello from Cloud Run!',
    service: 'hello-app'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(8080);
```

**Characteristics**:
- ❌ No awareness of CPUX
- ❌ No gatekeeper, flowin, flowout
- ❌ No Design Node structure
- ✅ Just a regular web server

---

### Layer 2: Infrastructure DN (ServiceDeployer)

**What it is**:
- CPUX-aware Design Node
- **Deploys** hello-app to Cloud Run
- Orchestrates Cloud Run API
- Returns deployment state as pulses

**Architecture**:
```
┌─────────────────────────────────────────┐
│  ServiceDeployer (Infrastructure DN)   │
│  ┌───────────────────────────────────┐  │
│  │ Gatekeeper: Check deployment      │  │
│  │             config exists         │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ Perform: Deploy hello-app         │  │
│  │          to Cloud Run             │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ Flowout: Return service URL,      │  │
│  │          status, revision         │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
                  │
                  │ deploys
                  ↓
┌─────────────────────────────────────────┐
│  Cloud Run                              │
│  ┌───────────────────────────────────┐  │
│  │ hello-app (Express.js)            │  │
│  │ - Handles HTTP requests           │  │
│  │ - Returns JSON responses          │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

### Design Node Structure (Reference Manual 1.3)

> **"A black-box computation unit that absorbs Intention+Signal and emits Intention+Signal"**

**Applied to ServiceDeployer**:

```
INT_DeployService (Intention)
    + target service config pulses (Signal)
        ↓
   [DN_ServiceDeployer]  ← Infrastructure orchestrator
        ↓ deploys hello-app
   [Cloud Run: hello-app running]
        ↓
INT_ServiceReady (Intention)
    + deployed service runtime pulses (Signal)
```

---

### Three Critical Components

#### 1. **Gatekeeper** (Entry Condition)

**Question**: *When should deployment happen?*

```javascript
gatekeeper: {
  'INT_DeployService': {
    'target_service_name': [null, 'Y'],    // Must have app name
    'target_service_image': [null, 'Y'],   // Must have app image
    'deployment_region': [null, 'Y']       // Must have region
  }
}
```

**syncTest Logic**: "Do all required pulses exist in Field?"

- If **YES** → DN executes (deploys hello-app)
- If **NO** → DN skips (nothing happens)

---

#### 2. **Perform** (Core Logic)

**Question**: *What does deployment actually do?*

```javascript
perform(workingSet) {
  // 1. Prepare TARGET service configuration
  const targetServiceConfig = {
    name: workingSet.target_service_name,     // 'hello-app'
    image: workingSet.target_service_image,   // 'gcr.io/.../hello'
    region: workingSet.deployment_region      // 'us-central1'
  };
  
  // 2. Deploy TARGET service to Cloud Run (API call)
  const result = deployToCloudRun(targetServiceConfig);
  
  // 3. Return deployed service runtime state
  return {
    deployed_service_name: targetServiceConfig.name,
    deployed_service_url: result.url,
    deployment_status: result.status
  };
}
```

**In this exercise**: We **simulate** the deployment (console.log).  
**In Exercise 2.1+**: We use real Cloud Run API.

---

#### 3. **Flowout** (Output Pulses)

**Question**: *What information about the deployed service do we return?*

```javascript
flowout: [
  'deployed_service_name',  // 'hello-app'
  'deployed_service_url',   // 'https://hello-app-xyz.run.app'
  'deployment_status',      // 'READY'
  'deployment_revision',    // 'hello-app-00001-abc'
  'deployment_timestamp'    // '2024-01-15T10:30:00Z'
]
```

These pulses go back into **Field** for other DNs to react to.

---

## 💻 Practice: ServiceDeployer Design Node (10 min)

### Setup

1. **Create project directory**:
```bash
mkdir cpux-cloudrun-exercise-1-1
cd cpux-cloudrun-exercise-1-1
```

2. **Copy base files**:
```bash
# You need:
# - DNBase_Infrastructure.js (DN base class)
# - ServiceDeployer.js (renamed from HelloService.js)
```

3. **Verify Node.js**:
```bash
node --version  # Should be v18+
```

---

### Step 1: Examine Application Code (2 min)

Open `ServiceDeployer.js` and find the **Layer 1** section:

```javascript
// ============================================================
// LAYER 1: APPLICATION CODE (hello-app)
// ============================================================

const helloAppSource = `
// File: hello-app/index.js
// This code runs INSIDE the Cloud Run container

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ 
    message: 'Hello from Cloud Run!',
    service: 'hello-app',
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
`;
```

**Questions**:
1. Is hello-app a Design Node? **NO** - it's regular Express.js code
2. Does hello-app have gatekeeper/flowin/flowout? **NO** - not CPUX-aware
3. What does hello-app do? **Handles HTTP requests** inside Cloud Run

---

### Step 2: Examine Infrastructure DN (3 min)

Find the **ServiceDeployer class**:

**A. Gatekeeper**:
```javascript
gatekeeper: {
  'INT_DeployService': {
    'target_service_name': [null, 'Y'],
    'target_service_image': [null, 'Y'],
    'deployment_region': [null, 'Y']
  }
}
```

**Q**: What happens if `target_service_image` is missing?  
**A**: syncTest returns `false`, DN won't execute (deployment blocked).

---

**B. Perform**:
```javascript
perform(workingSet) {
  // TARGET service configuration
  const targetServiceConfig = {
    name: workingSet.target_service_name,      // 'hello-app'
    image: workingSet.target_service_image,    
    region: workingSet.deployment_region
  };
  
  // Deploy the TARGET service (simulated)
  const deployResult = simulateGcloudDeploy(targetServiceConfig);
  
  return {
    deployed_service_name: targetServiceConfig.name,
    deployed_service_url: deployResult.url,
    deployment_status: deployResult.status
  };
}
```

**Q**: What is being deployed?  
**A**: **hello-app** (the external application), NOT the DN itself!

---

**C. Flowout**:
```javascript
flowout: [
  'deployed_service_name',   // What we deployed
  'deployed_service_url',    // Where it's running
  'deployment_status',       // READY | DEPLOYING | FAILED
  'deployment_revision',     // Cloud Run revision
  'deployment_timestamp'     // When deployed
]
```

**Q**: Where do these pulses go?  
**A**: Back into **Field** (infrastructure state), for other DNs to react.

---

### Step 3: Run ServiceDeployer (5 min)

**Execute the demonstration**:
```bash
node ServiceDeployer.js
```

**Expected Output** (abbreviated):
```
============================================================
🎯 DEMONSTRATION: ServiceDeployer Design Node
============================================================

📚 UNDERSTANDING THE TWO LAYERS:
────────────────────────────────────────────────────────────

📦 Layer 1: APPLICATION CODE (hello-app)
   Type: Regular Express.js application
   Location: hello-app/index.js
   Purpose: Handles HTTP requests
   NOT a Design Node!

   Code:
   const express = require('express');
   app.get('/', (req, res) => {
     res.json({ message: 'Hello from Cloud Run!' });
   });
   ...

🏗️  Layer 2: INFRASTRUCTURE DN (ServiceDeployer)
   Type: CPUX Design Node
   Purpose: DEPLOYS hello-app to Cloud Run
   Pattern: DN-I-O-I-DN

📊 ARCHITECTURE:

  ┌─────────────────────────────────────┐
  │  ServiceDeployer (Infrastructure DN)│
  │  ┌───────────────────────────────┐  │
  │  │ Gatekeeper: Check config      │  │
  │  │ Perform: Deploy hello-app     │  │
  │  │ Flowout: Return URL           │  │
  │  └───────────────────────────────┘  │
  └─────────────────────────────────────┘
                  │ deploys
                  ↓
  ┌─────────────────────────────────────┐
  │  Cloud Run                          │
  │  ┌───────────────────────────────┐  │
  │  │ hello-app (Express.js)        │  │
  │  │ - Handles /                   │  │
  │  │ - Handles /health             │  │
  │  └───────────────────────────────┘  │
  └─────────────────────────────────────┘


============================================================
🚀 EXECUTING DEPLOYMENT
============================================================

📥 Input from Field (flowin pulses):
{
  "target_service_name": "hello-app",
  "target_service_image": "gcr.io/cloudrun/hello",
  "deployment_region": "us-central1",
  "service_memory": "256Mi",
  "service_cpu": "1"
}

🔧 ServiceDeployer.perform() executing...
   Purpose: Deploy TARGET service to Cloud Run
   Target Service: hello-app

📋 Target Service Configuration: {
  name: 'hello-app',
  image: 'gcr.io/cloudrun/hello',
  region: 'us-central1',
  memory: '256Mi',
  cpu: '1'
}

📡 [SIMULATED] gcloud run deploy hello-app
   Target Service: hello-app
   Region: us-central1
   Image: gcr.io/cloudrun/hello
   Memory: 256Mi
   CPU: 1
   ⏳ Deploying target service... (simulated 3s delay)

✅ Target Service Deployed Successfully!
   Service Name: hello-app
   Service URL: https://hello-app-xyz123-uc.a.run.app
   Revision: hello-app-00001-abc

📤 Output (flowout): {
  deployed_service_name: 'hello-app',
  deployed_service_url: 'https://hello-app-xyz123-uc.a.run.app',
  deployment_status: 'READY',
  deployment_revision: 'hello-app-00001-abc',
  deployment_timestamp: '2024-01-15T10:30:00.000Z'
}

✅ SUCCESS: ServiceDeployer executed

🔍 WHAT HAPPENED:
   1. ServiceDeployer checked gatekeeper (passed)
   2. ServiceDeployer deployed hello-app to Cloud Run
   3. hello-app is now running at: https://hello-app-xyz123-uc.a.run.app
   4. ServiceDeployer emitted INT_ServiceReady

============================================================
```

---

## 🔧 Try It Yourself (5 min)

Now that you've seen ServiceDeployer in action, it's time to get hands-on!

### Task 1: Change Deployment Region (2 min)

**Goal**: Deploy to a different Cloud Run region

**Steps**:

1. Open `ServiceDeployer.js` in your editor
2. Scroll to the `demonstrateLayerSeparation()` function
3. Find this section:
   ```javascript
   const deploymentConfig = {
     target_service_name: 'hello-app',
     target_service_image: 'gcr.io/my-project/hello-app',
     deployment_region: 'us-central1',  // ← Change this line
     service_memory: '256Mi',
     service_cpu: '1'
   };
   ```
4. Change `'us-central1'` to `'europe-west1'`
5. Save the file
6. Run: `node ServiceDeployer.js`

**Expected Output Change**:
```diff
📡 [SIMULATED] gcloud run deploy hello-app
-   Region: us-central1
+   Region: europe-west1
   Image: gcr.io/my-project/hello-app
   ...

✓ Application "hello-app" deployed to Cloud Run
-✓ Running at: https://hello-app-xyz123-us-central1.a.run.app
+✓ Running at: https://hello-app-xyz123-europe-west1.a.run.app
```

**✅ Success Check**: The service URL should contain `europe-west1` instead of `us-central1`

**What you learned**: 
- Flowin pulses (`deployment_region`) flow through the DN
- The `perform()` function uses these pulses to configure deployment
- Flowout pulses (`deployed_service_url`) reflect the region choice

---

### Task 2: Increase Memory Allocation (2 min)

**Goal**: Understand how resource configuration flows through the DN

**Steps**:

1. In the same `deploymentConfig` object, change:
   ```javascript
   service_memory: '256Mi',  // ← Change to '1Gi'
   ```
2. Save and run: `node ServiceDeployer.js`

**Questions to Answer**:

**Q1**: Where does the memory value appear in the output?

<details>
<summary>Show Answer</summary>

The memory value appears in **two places**:

1. **Target Service Configuration** (input to perform):
   ```
   📋 Target Service Configuration:
   {
     "name": "hello-app",
     "image": "gcr.io/my-project/hello-app",
     "region": "europe-west1",
     "memory": "1Gi",  ← Here
     "cpu": "1"
   }
   ```

2. **Simulated gcloud deploy command**:
   ```
   📡 [SIMULATED] gcloud run deploy hello-app
      Region: europe-west1
      Image: gcr.io/my-project/hello-app
      Memory: 1Gi  ← Here
      CPU: 1
   ```

This shows the **flowin → perform → Cloud Run API** flow!
</details>

---

**Q2**: Does this change affect the deployed service URL?

<details>
<summary>Show Answer</summary>

**No**, the service URL does NOT change:
```
deployed_service_url: 'https://hello-app-xyz123-europe-west1.a.run.app'
```

**Why?** The URL is determined by:
- Service name (`hello-app`)
- Region (`europe-west1`)
- Cloud Run domain (`a.run.app`)

Memory and CPU are **internal configuration** (how the container runs), not part of the external URL.

**Key insight**: Some pulses affect infrastructure **behavior** (memory), others affect **identity** (name, region).
</details>

---

### Task 3: Deploy a Different Application (2 min)

**Goal**: Understand DN vs Application separation

**Steps**:

1. Change the target service name and image:
   ```javascript
   const deploymentConfig = {
     target_service_name: 'my-api',  // ← Changed
     target_service_image: 'gcr.io/my-project/api-server',  // ← Changed
     deployment_region: 'europe-west1',
     service_memory: '1Gi',
     service_cpu: '2'
   };
   ```
2. Run: `node ServiceDeployer.js`

**Question**: Did the ServiceDeployer DN code change?

<details>
<summary>Show Answer</summary>

**No!** The ServiceDeployer DN code (gatekeeper, flowin, flowout, perform logic) did NOT change.

**Only the INPUT (deployment config) changed.**

This demonstrates the **separation of concerns**:

```
┌──────────────────────────────────────┐
│  ServiceDeployer DN (Infrastructure) │
│  - Same code                         │ ← NO CHANGE
│  - Same gatekeeper                   │
│  - Same perform() logic              │
└──────────────────────────────────────┘
                ↓ deploys
┌──────────────────────────────────────┐
│  Target Application                  │
│  - 'hello-app' → 'my-api'            │ ← CHANGED
│  - Different container image         │
└──────────────────────────────────────┘
```

**Key insight**: One DN can deploy **many different applications** just by changing the input pulses. The DN is **reusable infrastructure**.

</details>

---

### Task 4: Break the Gatekeeper (Optional - 2 min)

**Goal**: See what happens when required pulses are missing

**Steps**:

1. Comment out `target_service_image`:
   ```javascript
   const deploymentConfig = {
     target_service_name: 'my-api',
     // target_service_image: 'gcr.io/my-project/api-server',  // ← Commented out
     deployment_region: 'europe-west1',
     service_memory: '1Gi',
     service_cpu: '2'
   };
   ```
2. Run: `node ServiceDeployer.js`

**What happens?**

<details>
<summary>Show Answer</summary>

**Current behavior** (Exercise 1.1 - simplified):
The code will throw an error during `perform()` when trying to use `workingSet.target_service_image` (which is `undefined`).

**Expected behavior** (Exercise 2.1+ - with proper gatekeeper):
The gatekeeper should **block execution** before `perform()` even runs:

```
❌ Gatekeeper Failed for DN_ServiceDeployer
   Required pulse missing: 'target_service_image'
   syncTest result: false
   
   DN will NOT execute (skipped)
```

**Why the difference?**
- Exercise 1.1: Focuses on understanding the pattern (simplified)
- Exercise 2.1+: Full implementation with proper validation

**Key insight**: The gatekeeper is a **protection mechanism**. It ensures the DN only executes when it has everything it needs.
</details>

---

### ✅ Task Completion Checklist

After completing these tasks, you should understand:

- [ ] How to modify deployment configuration (region, memory, CPU)
- [ ] How flowin pulses flow from Field → perform() → Cloud Run API
- [ ] How flowout pulses capture deployment state
- [ ] Why the same DN can deploy different applications (reusability)
- [ ] What the gatekeeper protects against (missing configuration)

**Bonus**: Try combining changes!
- Deploy `'my-api'` to `'asia-east1'` with `'2Gi'` memory and `'4'` CPUs
- Observe all the changes in the output
- Notice the DN code itself never changes!

---

## ✅ Check Your Understanding (3 min)

### Question 1: Two Layers

**What are the two layers in this architecture?**

- [ ] A. Frontend and Backend
- [ ] B. Application Code and Infrastructure DN
- [ ] C. Gatekeeper and Perform
- [ ] D. Cloud Run and Kubernetes

<details>
<summary>Show Answer</summary>

**Answer: B. Application Code and Infrastructure DN**

```
Layer 1: hello-app (Application Code)
  - Regular Express.js server
  - Runs INSIDE Cloud Run
  - NOT a Design Node

Layer 2: ServiceDeployer (Infrastructure DN)
  - CPUX-aware orchestrator
  - DEPLOYS hello-app
  - IS a Design Node
```

**Key insight**: The DN deploys the app, it doesn't deploy itself!
</details>

---

### Question 2: What Gets Deployed?

**When ServiceDeployer.perform() executes, what gets deployed to Cloud Run?**

- [ ] A. ServiceDeployer itself
- [ ] B. hello-app (the Express.js application)
- [ ] C. The gatekeeper
- [ ] D. The Field state

<details>
<summary>Show Answer</summary>

**Answer: B. hello-app (the Express.js application)**

```javascript
perform(workingSet) {
  const targetServiceConfig = {
    name: workingSet.target_service_name,  // 'hello-app' ← This!
    image: workingSet.target_service_image // Container with hello-app code
  };
  
  // Deploy the TARGET service (hello-app)
  const result = simulateGcloudDeploy(targetServiceConfig);
}
```

**ServiceDeployer** is the orchestrator (runs locally/on your machine).  
**hello-app** is what gets deployed (runs in Cloud Run).
</details>

---

### Question 3: Simulated vs Real

**Why do we use simulated gcloud calls in Exercise 1.1?**

- [ ] A. Real Cloud Run API doesn't exist
- [ ] B. To learn CPUX patterns without GCP complexity
- [ ] C. Simulated is better than real
- [ ] D. We can't call APIs from JavaScript

<details>
<summary>Show Answer</summary>

**Answer: B. To learn CPUX patterns without GCP complexity**

**Benefits of simulated approach**:
- ✅ No GCP account needed
- ✅ Instant feedback (< 1 second)
- ✅ No cloud costs
- ✅ Focus on CPUX concepts (gatekeeper, flowin, flowout)
- ✅ Same DN structure works for both simulated and real!

**In Exercise 2.1+**: We'll switch to real Cloud Run API by only changing the `perform()` function. Gatekeeper, flowin, flowout stay identical!
</details>

---

## 🔍 Deep Dive: Why Separation Matters

### Without Separation (Confusing)

```javascript
// Bad: Ambiguous - what is HelloService?
class HelloService extends DNBase {
  perform(workingSet) {
    // Is this deploying itself? Or something else?
    const result = deploy("HelloService", config);
  }
}
```

**Problems**:
- ❌ Unclear if DN is deploying itself
- ❌ Mixes infrastructure and application concerns
- ❌ Hard to test independently
- ❌ Violates single responsibility principle

---

### With Separation (Clear)

```javascript
// Layer 1: Application (regular code)
const helloApp = `
  const express = require('express');
  app.get('/', (req, res) => {
    res.send('Hello!');
  });
`;

// Layer 2: Infrastructure DN (CPUX-aware)
class ServiceDeployer extends DNBase {
  perform(workingSet) {
    // Crystal clear: deploying EXTERNAL service
    const targetService = {
      name: workingSet.target_service_name,  // 'hello-app'
      code: helloApp
    };
    
    return deployToCloudRun(targetService);
  }
}
```

**Benefits**:
- ✅ Clear responsibility: DN deploys external services
- ✅ Application code is regular, not CPUX-aware
- ✅ Easy to test: test hello-app separately from deployment
- ✅ Follows CPUX principle: infrastructure DNs orchestrate

---

## 🎯 Key Takeaways

1. **Two-Layer Separation is Critical**
   - **Layer 1**: Application code (hello-app) - regular code
   - **Layer 2**: Infrastructure DN (ServiceDeployer) - CPUX-aware orchestrator
   - DN deploys the application, doesn't deploy itself

2. **Same Pattern as Frontend**
   - Frontend DN: Processes user input
   - Infrastructure DN: Deploys services
   - Both follow: flowin → perform → flowout

3. **Simulated Learning First**
   - Learn CPUX patterns without GCP complexity
   - Exercise 2.1+ will add real Cloud Run API
   - Only perform() changes, structure stays identical

4. **Infrastructure as Design Nodes**
   - Cloud Run deployments follow DN pattern
   - Every deployment is addressable
   - Can inspect Field before/after
   - Can replay/test in isolation

---

## ➡️ Next Steps (1 min)

**Exercise 1.2: Cloud Run Metrics as Infrastructure Pulses**

Now that you understand:
- ✅ Application vs Infrastructure DN separation
- ✅ DNs deploy external services
- ✅ Simulated vs real implementation

We'll learn:
- Cloud Run **metrics** (request count, latency) are **Pulses**
- How to observe infrastructure state through Field
- How other DNs react to metric changes (auto-scaling!)

**Preview**:
```javascript
// Metrics as pulses in Field
field = {
  'deployed_service_name': ['hello-app', 'Y'],
  'service_request_count': ['142', 'Y'],
  'service_avg_latency_ms': ['85', 'Y'],
  'service_instance_count': ['2', 'Y']
}

// Another DN can react
class DN_ScaleDecision extends DNBase {
  gatekeeper: {
    'INT_CheckMetrics': {
      'service_request_count': [null, 'Y'],  // Need request count
      'service_avg_latency_ms': [null, 'Y']  // Need latency
    }
  }
  
  perform(workingSet) {
    if (workingSet.service_request_count > 100) {
      return { scale_decision: 'SCALE_UP' };
    }
  }
}
```

**See you in Exercise 1.2!** 🚀

---

## 📚 Additional Resources

- **Reference Manual**: Section 1.3 (Design Nodes), 2.1 (DN State Model)
- **Frontend Exercises**: Exercise 5.1-5.3 (DN execution patterns)
- **Cloud Run Docs**: https://cloud.google.com/run/docs/deploying
- **SIMULATED_VS_REAL_STRATEGY.md**: Detailed comparison document
- **Next Exercise**: Exercise 1.2 (Metrics as Pulses)

---

**End of Exercise 1.1** ✅
