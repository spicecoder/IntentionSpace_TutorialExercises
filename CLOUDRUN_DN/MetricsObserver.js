/**
 * MetricsObserver - Infrastructure DN that Observes Cloud Run Metrics
 * 
 * EXERCISE: 1-2 Cloud Run Metrics as Infrastructure Pulses
 * REFERENCE: Intention Space CPUX Reference Manual v1.1, Section 1.7 (Pulse), 1.8 (Field)
 * 
 * WHAT THIS DN DOES:
 * 
 * 1. Absorbs: INT_ObserveMetrics (with deployed service info)
 * 2. Performs: Queries Cloud Run/Monitoring API for metrics
 * 3. Emits: Metric pulses (request_count, latency, etc.) into Field
 * 
 * KEY CONCEPTS:
 * - Metrics are PULSES (prompt + responses + trivalence)
 * - Trivalence represents observation confidence (Y/N/UN)
 * - Pulses flow into Field (FPS) for other DNs to consume
 * - This DN is PASSIVE (observes, doesn't change anything)
 * 
 * ┌────────────────────────────────────────────────────────┐
 * │  Infrastructure Domain (IS_INFRA)                      │
 * │  ┌──────────────────────────────────────────────────┐  │
 * │  │ DN_MetricsObserver (This Design Node)           │  │
 * │  │ - Gatekeeper: Check service exists              │  │
 * │  │ - Perform: Query Cloud Monitoring API           │  │
 * │  │ - Flowout: Metric pulses                        │  │
 * │  └──────────────────────────────────────────────────┘  │
 * └────────────────────────────────────────────────────────┘
 *                       ↓ observes
 * ┌────────────────────────────────────────────────────────┐
 * │  Cloud Run                                             │
 * │  ┌──────────────────────────────────────────────────┐  │
 * │  │ hello-app (Running Service)                     │  │
 * │  │ - Handling requests                             │  │
 * │  │ - Generating metrics                            │  │
 * │  └──────────────────────────────────────────────────┘  │
 * └────────────────────────────────────────────────────────┘
 * 
 * ⚠️ NOTE: Uses SIMULATED Cloud Monitoring API calls for learning
 * Real implementation (Exercise 2.2+) will use @google-cloud/monitoring package
 */

const { DNBase } = require('./DNBase_Infrastructure');

// ============================================================
// PART 1: SIMULATED CLOUD MONITORING API (for learning)
// ============================================================

/**
 * Simulates: gcloud monitoring read <metric-type>
 * 
 * In real implementation (Exercise 2.2+), this becomes:
 * 
 * const {MetricServiceClient} = require('@google-cloud/monitoring');
 * 
 * async function realGetMetrics(serviceName, region) {
 *   const client = new MetricServiceClient();
 *   
 *   const request = {
 *     name: client.projectPath(PROJECT_ID),
 *     filter: `resource.type="cloud_run_revision"
 *              AND resource.labels.service_name="${serviceName}"`,
 *     interval: {
 *       startTime: { seconds: Date.now() / 1000 - 300 },  // Last 5 min
 *       endTime: { seconds: Date.now() / 1000 }
 *     },
 *     aggregation: {
 *       alignmentPeriod: { seconds: 60 },
 *       perSeriesAligner: 'ALIGN_MEAN'
 *     }
 *   };
 *   
 *   const [timeSeries] = await client.listTimeSeries(request);
 *   return parseTimeSeriesData(timeSeries);
 * }
 */
function simulateGetMetrics(serviceName, region) {
  console.log(`\n📡 [SIMULATED] Calling Cloud Monitoring API...`);
  console.log(`   gcloud monitoring read "run.googleapis.com/request_count" \\`);
  console.log(`     --filter="resource.labels.service_name=${serviceName}"`);
  console.log(`   ⏳ Fetching... (simulated - instant, in reality takes 1-2s)`);
  
  // Simulate realistic metric variations
  const baseRequests = 100;
  const requestVariation = Math.floor(Math.random() * 50);
  
  const metrics = {
    request_count: baseRequests + requestVariation,  // 100-150
    avg_latency_ms: 50 + Math.floor(Math.random() * 100),  // 50-150ms
    instance_count: Math.random() > 0.5 ? 2 : 3,  // 2 or 3 instances
    error_rate: (Math.random() * 2).toFixed(2)  // 0.00-2.00%
  };
  
  console.log(`   ✅ Metrics Retrieved!`);
  
  return metrics;
}

/**
 * Helper: Convert metric to Pulse structure
 * 
 * This shows the CPUX perspective: metrics aren't just values,
 * they're structured observations with confidence levels
 */
function createMetricPulse(name, value, phraseTemplate) {
  return {
    id: `pulse_${name}_${Date.now()}`,
    phrase: phraseTemplate,
    responses: [String(value)],
    trivalence: 'Y',  // Confirmed observation
    source: 'DN_MetricsObserver',
    timestamp: new Date().toISOString()
  };
}

// ============================================================
// PART 2: INFRASTRUCTURE DN (MetricsObserver)
// ============================================================

/**
 * MetricsObserver Design Node
 * 
 * This DN observes Cloud Run service metrics and emits them as pulses.
 * 
 * Key Characteristics:
 * - Absorbs: INT_ObserveMetrics (with service identification)
 * - Performs: Queries Cloud Monitoring API
 * - Emits: Metric pulses with trivalence
 * 
 * This DN is PASSIVE - it observes without changing anything.
 * Other DNs (like DN_ScaleDecision) will consume these pulses.
 */
class MetricsObserver extends DNBase {
  constructor() {
    super(
      'DN_MetricsObserver',
      'MetricsObserver',
      
      // ============================================================
      // GATEKEEPER: What pulses are required to observe metrics?
      // ============================================================
      {
        'INT_ObserveMetrics': {
          // Need to know WHICH service to observe
          'deployed_service_name': [null, 'Y'],    // e.g., 'hello-app'
          'deployment_region': [null, 'Y']         // e.g., 'us-central1'
        }
      },
      
      // ============================================================
      // FLOWIN: Input pulses (from Field)
      // ============================================================
      [
        'deployed_service_name',    // Which service?
        'deployment_region',        // Which region?
        'deployed_service_url'      // Optional: for display
      ],
      
      // ============================================================
      // FLOWOUT: Output pulses (to Field)
      // ============================================================
      [
        'service_request_count',    // How many requests?
        'service_avg_latency_ms',   // Average response time?
        'service_instance_count',   // How many containers?
        'service_error_rate',       // Percentage of errors?
        'metrics_timestamp'         // When were these observed?
      ]
    );
  }

  /**
   * PERFORM: Core observation logic
   * 
   * This function:
   * 1. Extracts service identification from workingSet
   * 2. Queries Cloud Monitoring API (simulated)
   * 3. Returns metrics as pulses
   * 
   * In Exercise 2.2+: Real Cloud Monitoring API
   * Here: Simulated for learning
   */
  perform(workingSet) {
    const serviceName = workingSet.deployed_service_name;
    const region = workingSet.deployment_region;
    
    console.log(`\n🔍 Observing Service: ${serviceName} in ${region}`);
    
    // SIMULATED: Get metrics from Cloud Monitoring
    // In reality: async call to Google Cloud Monitoring API
    const metrics = simulateGetMetrics(serviceName, region);
    
    // Convert to CPUX pulses
    // Each metric becomes a pulse with trivalence
    const metricPulses = {
      service_request_count: metrics.request_count,
      service_avg_latency_ms: metrics.avg_latency_ms,
      service_instance_count: metrics.instance_count,
      service_error_rate: metrics.error_rate,
      metrics_timestamp: new Date().toISOString()
    };
    
    console.log(`\n📊 Metrics Observed:`, metricPulses);
    
    return metricPulses;
  }

  /**
   * Helper: Get detailed pulse information
   * 
   * This shows the full Pulse structure (Reference Manual 1.7)
   */
  getDetailedPulses(workingSet) {
    const results = this.perform(workingSet);
    
    return {
      'service_request_count': createMetricPulse(
        'service_request_count',
        results.service_request_count,
        'How many requests has the service received?'
      ),
      'service_avg_latency_ms': createMetricPulse(
        'service_avg_latency_ms',
        results.service_avg_latency_ms,
        'What is the average response latency?'
      ),
      'service_instance_count': createMetricPulse(
        'service_instance_count',
        results.service_instance_count,
        'How many instances are running?'
      ),
      'service_error_rate': createMetricPulse(
        'service_error_rate',
        results.service_error_rate,
        'What percentage of requests failed?'
      )
    };
  }
}

// ============================================================
// PART 3: DEMONSTRATION
// ============================================================

function demonstrateMetricsAsPulses() {
  console.log('='.repeat(70));
  console.log('🎯 DEMONSTRATION: Metrics as Infrastructure Pulses');
  console.log('='.repeat(70));
  
  // ============================================================
  // SETUP: Service context (from Exercise 1.1)
  // ============================================================
  console.log('\n📊 WHAT ARE WE OBSERVING?');
  console.log('─'.repeat(70));
  console.log('Service: hello-app');
  console.log('Region: us-central1');
  console.log('Deployed at: https://hello-app-xyz123-us-central1.a.run.app');
  
  // ============================================================
  // LAYER: MetricsObserver DN
  // ============================================================
  console.log('\n📡 SIMULATING METRICS OBSERVATION');
  console.log('─'.repeat(70));
  
  const observer = new MetricsObserver();
  
  // ============================================================
  // 🔧 TRY IT YOURSELF: Modify these values!
  // ============================================================
  // Task 1: Change 'hello-app' to 'my-api'
  // Task 2: Change region to 'europe-west1'
  // Task 3: Run multiple times to see metric variations
  // ============================================================
  
  const observationConfig = {
    deployed_service_name: 'hello-app',  // ← Task 1: Try 'my-api'
    deployment_region: 'us-central1',     // ← Task 2: Try 'europe-west1'
    deployed_service_url: 'https://hello-app-xyz123-us-central1.a.run.app'
  };
  
  try {
    const result = observer.executeStandalone(observationConfig);
    
    console.log('\n✅ SUCCESS: MetricsObserver executed');
    console.log('\n📤 METRICS AS PULSES (Flowout to Field)');
    console.log('─'.repeat(70));
    console.log(JSON.stringify(result, null, 2));
    
    // ============================================================
    // Show detailed pulse structure
    // ============================================================
    console.log('\n🔍 PULSE DETAILS');
    console.log('─'.repeat(70));
    
    const detailedPulses = observer.getDetailedPulses(observationConfig);
    
    for (const [name, pulse] of Object.entries(detailedPulses)) {
      console.log(`\nPulse: ${name}`);
      console.log(`  Phrase: "${pulse.phrase}"`);
      console.log(`  Response: ${JSON.stringify(pulse.responses)}`);
      console.log(`  Trivalence: ${pulse.trivalence} (Confirmed observation)`);
      console.log(`  Source: ${pulse.source}`);
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('📊 SUMMARY');
    console.log('='.repeat(70));
    console.log(`\n✓ Observed ${Object.keys(detailedPulses).length} metric pulses`);
    console.log(`✓ All pulses have trivalence 'Y' (confirmed)`);
    console.log(`✓ Pulses now in Field (FPS) for other DNs`);
    
    console.log('\n🧠 NEXT: These pulses enable reactive infrastructure!');
    console.log('   Other DNs can react to these metrics:');
    console.log('   - DN_ScaleDecision: Check if request_count > 100');
    console.log('   - DN_HealthCheck: Check if error_rate > 1.0');
    console.log('   - DN_AlertManager: Check if latency_ms > 200');
    
  } catch (error) {
    console.error('\n❌ FAILED:', error.message);
  }
  
  console.log('\n' + '='.repeat(70));
}

// ============================================================
// COMPARISON: Traditional vs CPUX Metrics
// ============================================================

function showMetricsComparison() {
  console.log('\n' + '='.repeat(70));
  console.log('📚 TRADITIONAL vs CPUX Metrics');
  console.log('='.repeat(70));
  
  console.log(`
┌─────────────────────────────────────────────────────────────────────┐
│                    Traditional Approach                             │
├─────────────────────────────────────────────────────────────────────┤
│ API Response:                                                        │
│   {                                                                  │
│     "requestCount": 142,                                            │
│     "avgLatency": 85,                                               │
│     "instances": 2                                                  │
│   }                                                                  │
│                                                                      │
│ Problems:                                                            │
│   ❌ Just numbers - no observation confidence                       │
│   ❌ null is ambiguous (error? not polled? service down?)          │
│   ❌ Hard to track "when was this observed?"                        │
│   ❌ Difficult to test (need real API + service)                    │
│   ❌ Can't replay historical metrics                                │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    CPUX Approach (Pulses)                           │
├─────────────────────────────────────────────────────────────────────┤
│ Field (FPS):                                                         │
│   {                                                                  │
│     "service_request_count": {                                      │
│       phrase: "How many requests?",                                 │
│       responses: ["142"],                                           │
│       trivalence: "Y",  // Confirmed observation                    │
│       source: "DN_MetricsObserver",                                 │
│       timestamp: "2024-01-28T10:30:00Z"                            │
│     },                                                               │
│     "service_avg_latency_ms": {                                     │
│       phrase: "What is latency?",                                   │
│       responses: ["85"],                                            │
│       trivalence: "Y",                                              │
│       source: "DN_MetricsObserver",                                 │
│       timestamp: "2024-01-28T10:30:00Z"                            │
│     }                                                                │
│   }                                                                  │
│                                                                      │
│ Benefits:                                                            │
│   ✅ Trivalence shows confidence (Y/N/UN)                          │
│   ✅ Timestamps enable temporal reasoning                          │
│   ✅ Source attribution for traceability                           │
│   ✅ Easy to test (inject pulses into Field)                        │
│   ✅ Can replay (reconstruct Field state)                          │
│   ✅ Other DNs react via gatekeeper                                │
└─────────────────────────────────────────────────────────────────────┘

🔑 KEY INSIGHT:
   Traditional metrics are "read-only observations"
   CPUX pulses are "first-class reactive data"
   
   Other DNs can declare dependencies on metric pulses:
   
   class DN_ScaleDecision {
     gatekeeper: {
       'INT_CheckScaling': {
         'service_request_count': [null, 'Y']  // Requires this pulse!
       }
     }
   }
`);
  
  console.log('='.repeat(70) + '\n');
}

// ============================================================
// TRIVALENCE EXAMPLES
// ============================================================

function showTrivalenceExamples() {
  console.log('\n' + '='.repeat(70));
  console.log('🔀 TRIVALENCE: Y vs N vs UN');
  console.log('='.repeat(70));
  
  console.log(`
📗 TRIVALENCE = 'Y' (Confirmed)
   Use when: Successfully observed metric

   {
     phrase: "service_request_count",
     responses: ["142"],
     trivalence: "Y"
   }
   
   Meaning: "We observed 142 requests with confidence"
   DN reaction: Use value for scaling decision

─────────────────────────────────────────────────────────────────────

📕 TRIVALENCE = 'N' (Denied)
   Use when: Service doesn't exist or API failed

   {
     phrase: "service_request_count",
     responses: [],
     trivalence: "N",
     error_message: "Service 'hello-app' not found in region"
   }
   
   Meaning: "We tried to observe but service is unavailable"
   DN reaction: Emit alert, don't attempt scaling

─────────────────────────────────────────────────────────────────────

📙 TRIVALENCE = 'UN' (Unknown)
   Use when: Not yet polled or data unreliable

   {
     phrase: "service_request_count",
     responses: ["0"],
     trivalence: "UN"
   }
   
   Meaning: "Service just deployed, metrics not reliable yet"
   DN reaction: Wait for warm-up period

─────────────────────────────────────────────────────────────────────

🔑 CRITICAL DISTINCTION:

   Same Value, Different Trivalence:
   
   {
     responses: ["0"],
     trivalence: "Y"     // "Definitely zero requests"
   }
   
   vs
   
   {
     responses: ["0"],
     trivalence: "UN"    // "Zero, but service just started"
   }
   
   DNs can react differently based on confidence!
`);
  
  console.log('='.repeat(70) + '\n');
}

// ============================================================
// EXPORT & RUN DEMO
// ============================================================

module.exports = { MetricsObserver };

// Run demonstrations if executed directly
if (require.main === module) {
  demonstrateMetricsAsPulses();
  showMetricsComparison();
  showTrivalenceExamples();
}
