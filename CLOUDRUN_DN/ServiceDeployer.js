/**
 * ServiceDeployer - Infrastructure DN that Deploys Cloud Run Services
 * 
 * EXERCISE: 1-1 Cloud Run as a Design Node (REVISED)
 * REFERENCE: Intention Space CPUX Reference Manual v1.1, Section 1.3
 * 
 * CRITICAL DISTINCTION:
 * 
 * This file contains TWO SEPARATE ENTITIES:
 * 
 * 1. APPLICATION CODE (hello-app):
 *    - Regular Express.js application
 *    - Runs INSIDE Cloud Run container
 *    - NOT a Design Node
 *    - Handles HTTP requests
 * 
 * 2. INFRASTRUCTURE DN (ServiceDeployer):
 *    - CPUX-aware Design Node
 *    - DEPLOYS the hello-app to Cloud Run
 *    - Orchestrates Cloud Run API
 *    - Returns deployment state as pulses
 * 
 * ┌────────────────────────────────────────────────────────┐
 * │  Infrastructure Domain (IS_INFRA)                      │
 * │  ┌──────────────────────────────────────────────────┐  │
 * │  │ DN_ServiceDeployer (This Design Node)           │  │
 * │  │ - Gatekeeper: Check deployment config           │  │
 * │  │ - Perform: Call Cloud Run API                   │  │
 * │  │ - Flowout: Return deployed service URL          │  │
 * │  └──────────────────────────────────────────────────┘  │
 * └────────────────────────────────────────────────────────┘
 *                       ↓ deploys
 * ┌────────────────────────────────────────────────────────┐
 * │  Cloud Run                                             │
 * │  ┌──────────────────────────────────────────────────┐  │
 * │  │ hello-app (Application Code)                    │  │
 * │  │ - Express.js server                             │  │
 * │  │ - Routes: GET /                                 │  │
 * │  │ - NOT a Design Node                             │  │
 * │  └──────────────────────────────────────────────────┘  │
 * └────────────────────────────────────────────────────────┘
 * 
 * ⚠️ NOTE: Uses SIMULATED Cloud Run API calls for learning
 * Real implementation (Exercise 2.1+) will use @google-cloud/run package
 */

const { DNBase } = require('./DNBase_Infrastructure');

// ============================================================
// PART 1: APPLICATION CODE (hello-app)
// ============================================================

/**
 * This is the hello-app that will be DEPLOYED to Cloud Run
 * 
 * In real implementation, this would be:
 * - Separate Git repository
 * - Built into container image
 * - Pushed to Container Registry (gcr.io)
 * - Deployed by the ServiceDeployer DN
 * 
 * For learning: We show the code here to understand what's being deployed
 */
const helloAppSource = `
// File: hello-app/index.js
// This is NOT a Design Node - it's a regular Express.js app

const express = require('express');
const app = express();

// Route: GET /
app.get('/', (req, res) => {
  res.json({
    message: 'Hello from Cloud Run!',
    service: 'hello-app',
    timestamp: new Date().toISOString()
  });
});

// Route: GET /health
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(\`hello-app listening on port \${PORT}\`);
});
`;

// ============================================================
// PART 2: SIMULATED CLOUD RUN API (for learning)
// ============================================================

/**
 * Simulates: gcloud run deploy <service-name>
 * 
 * In real implementation (Exercise 2.1+), this becomes:
 * 
 * const {CloudRunClient} = require('@google-cloud/run');
 * 
 * async function realGcloudDeploy(serviceSpec) {
 *   const client = new CloudRunClient();
 *   const request = {
 *     parent: `projects/${PROJECT}/locations/${serviceSpec.region}`,
 *     service: {
 *       name: serviceSpec.name,
 *       template: {
 *         containers: [{
 *           image: serviceSpec.image,
 *           resources: {
 *             limits: {
 *               memory: serviceSpec.memory,
 *               cpu: serviceSpec.cpu
 *             }
 *           }
 *         }]
 *       }
 *     }
 *   };
 *   
 *   const [operation] = await client.createService(request);
 *   const [response] = await operation.promise();
 *   return response;
 * }
 */
function simulateGcloudDeploy(serviceSpec) {
  console.log(`\n📡 [SIMULATED] gcloud run deploy ${serviceSpec.name}`);
  console.log(`   Region: ${serviceSpec.region}`);
  console.log(`   Image: ${serviceSpec.image}`);
  console.log(`   Memory: ${serviceSpec.memory}`);
  console.log(`   CPU: ${serviceSpec.cpu}`);
  console.log(`   ⏳ Deploying... (simulated - instant in reality takes 30-60s)`);
  
  // Simulate successful deployment
  const deployedUrl = `https://${serviceSpec.name}-xyz123-${serviceSpec.region}.a.run.app`;
  const revision = `${serviceSpec.name}-00001-abc`;
  
  console.log(`   ✅ Deployment complete!`);
  console.log(`   Service URL: ${deployedUrl}`);
  console.log(`   Revision: ${revision}`);
  
  return {
    success: true,
    url: deployedUrl,
    revision: revision,
    status: 'READY'
  };
}

/**
 * Simulates: gcloud run services describe <service-name>
 * 
 * Returns initial metrics (all zeros for new deployment)
 */
function simulateGetServiceMetrics(serviceName) {
  return {
    request_count: 0,
    avg_latency_ms: 0,
    instance_count: 0,
    error_rate: 0.0
  };
}

// ============================================================
// PART 3: INFRASTRUCTURE DN (ServiceDeployer)
// ============================================================

/**
 * ServiceDeployer Design Node
 * 
 * This DN orchestrates Cloud Run service deployments.
 * 
 * Key Characteristics:
 * - Absorbs: INT_DeployService (with target service config)
 * - Performs: Deploys target service to Cloud Run
 * - Emits: INT_ServiceReady (with deployed service URL)
 * 
 * This DN does NOT deploy itself.
 * This DN deploys EXTERNAL applications (like hello-app).
 */
class ServiceDeployer extends DNBase {
  constructor() {
    super(
      'DN_ServiceDeployer',
      'ServiceDeployer',
      
      // ============================================================
      // GATEKEEPER: What pulses are required to deploy?
      // ============================================================
      {
        'INT_DeployService': {
          // Target service configuration (what to deploy)
          'target_service_name': [null, 'Y'],    // e.g., 'hello-app'
          'target_service_image': [null, 'Y'],   // e.g., 'gcr.io/project/hello'
          'deployment_region': [null, 'Y']       // e.g., 'us-central1'
        }
      },
      
      // ============================================================
      // FLOWIN: Input pulses (from Field)
      // ============================================================
      [
        'target_service_name',      // Name of app to deploy
        'target_service_image',     // Container image URL
        'deployment_region',        // Cloud Run region
        'service_memory',           // Optional: memory limit
        'service_cpu'               // Optional: CPU allocation
      ],
      
      // ============================================================
      // FLOWOUT: Output pulses (to Field)
      // ============================================================
      [
        'deployed_service_name',    // Name of deployed service
        'deployed_service_url',     // Where the service is running
        'deployment_status',        // READY | DEPLOYING | FAILED
        'deployment_revision',      // Cloud Run revision ID
        'deployment_timestamp'      // When deployment completed
      ]
    );
  }

  /**
   * PERFORM: Core deployment logic
   * 
   * This function:
   * 1. Prepares deployment configuration for TARGET service
   * 2. Calls Cloud Run API to deploy TARGET service
   * 3. Waits for deployment completion (simulated)
   * 4. Fetches deployed service URL
   * 5. Returns deployment state as pulses
   * 
   * @param {Object} workingSet - Flowin pulses extracted from Field
   * @returns {Object} - Flowout pulses to merge back into Field
   */
  perform(workingSet) {
    console.log(`\n🔧 ServiceDeployer.perform() executing...`);
    console.log(`   Target Service: ${workingSet.target_service_name}`);
    console.log(`   Input (flowin):`, workingSet);
    
    // ============================================================
    // STEP 1: Prepare target service configuration
    // ============================================================
    const targetServiceSpec = {
      name: workingSet.target_service_name,
      image: workingSet.target_service_image,
      region: workingSet.deployment_region,
      memory: workingSet.service_memory || '512Mi',
      cpu: workingSet.service_cpu || '1'
    };
    
    console.log(`\n📋 Target Service Configuration:`);
    console.log(JSON.stringify(targetServiceSpec, null, 2));
    
    // ============================================================
    // STEP 2: Deploy target service to Cloud Run
    // ============================================================
    console.log(`\n🚀 Deploying ${targetServiceSpec.name} to Cloud Run...`);
    
    const deploymentResult = simulateGcloudDeploy(targetServiceSpec);
    
    if (!deploymentResult.success) {
      throw new Error('Deployment failed');
    }
    
    // ============================================================
    // STEP 3: Fetch initial metrics (simulated)
    // ============================================================
    const metrics = simulateGetServiceMetrics(targetServiceSpec.name);
    
    console.log(`\n📊 Initial Metrics:`);
    console.log(`   Request Count: ${metrics.request_count}`);
    console.log(`   Avg Latency: ${metrics.avg_latency_ms}ms`);
    console.log(`   Instances: ${metrics.instance_count}`);
    
    // ============================================================
    // STEP 4: Prepare flowout pulses
    // ============================================================
    const flowoutPulses = {
      deployed_service_name: targetServiceSpec.name,
      deployed_service_url: deploymentResult.url,
      deployment_status: deploymentResult.status,
      deployment_revision: deploymentResult.revision,
      deployment_timestamp: new Date().toISOString(),
      
      // Include metrics (not in flowout spec, but useful)
      _metrics: metrics
    };
    
    console.log(`\n📤 Output (flowout):`, flowoutPulses);
    
    return flowoutPulses;
  }

  /**
   * Determine next intention to emit
   * 
   * After successful deployment, emit INT_ServiceReady
   * This allows downstream DNs to react (e.g., DN_HealthCheck, DN_TrafficSplit)
   */
  getNextIntention(result) {
    if (result.deployment_status === 'READY') {
      return 'INT_ServiceReady';
    } else if (result.deployment_status === 'FAILED') {
      return 'INT_DeploymentFailed';
    }
    return null;
  }
}

// ============================================================
// DEMONSTRATION: Showing the Separation
// ============================================================

function demonstrateLayerSeparation() {
  console.log('='.repeat(70));
  console.log('🎯 DEMONSTRATION: Two Separate Layers');
  console.log('='.repeat(70));
  
  // ============================================================
  // LAYER 1: Application Code (hello-app)
  // ============================================================
  console.log('\n📦 LAYER 1: Application Code (hello-app)');
  console.log('─'.repeat(70));
  console.log('This is what RUNS inside Cloud Run:');
  console.log(helloAppSource);
  
  console.log('\nCharacteristics:');
  console.log('  ✓ Regular Express.js application');
  console.log('  ✓ NOT a Design Node');
  console.log('  ✓ NOT CPUX-aware');
  console.log('  ✓ Handles HTTP requests (GET /, GET /health)');
  console.log('  ✓ Runs inside container on Cloud Run');
  
  // ============================================================
  // LAYER 2: Infrastructure DN (ServiceDeployer)
  // ============================================================
  console.log('\n🏗️  LAYER 2: Infrastructure DN (ServiceDeployer)');
  console.log('─'.repeat(70));
  console.log('This DEPLOYS the hello-app:');
  
  const deployer = new ServiceDeployer();
  
  console.log('\nDN Structure:');
  console.log(`  ID: ${deployer.id}`);
  console.log(`  Name: ${deployer.name}`);
  console.log(`  Gatekeeper:`, deployer.gatekeeper);
  console.log(`  Flowin:`, deployer.flowin);
  console.log(`  Flowout:`, deployer.flowout);
  
  console.log('\nCharacteristics:');
  console.log('  ✓ CPUX-aware Design Node');
  console.log('  ✓ Extends DNBase');
  console.log('  ✓ Has gatekeeper (entry condition)');
  console.log('  ✓ Has perform (deployment logic)');
  console.log('  ✓ Has flowout (deployment state)');
  console.log('  ✓ Orchestrates Cloud Run API');
  
  // ============================================================
  // Execute Deployment
  // ============================================================
  console.log('\n' + '='.repeat(70));
  console.log('🚀 EXECUTING DEPLOYMENT');
  console.log('='.repeat(70));
  
  // ============================================================
  // 🔧 TRY IT YOURSELF: Modify these values!
  // ============================================================
  // Task 1: Change 'us-central1' to 'europe-west1'
  // Task 2: Change '256Mi' to '1Gi'
  // Task 3: Change service name to 'my-api' and image to 'gcr.io/my-project/api-server'
  // Task 4: Comment out 'target_service_image' to see what happens
  // ============================================================
  
  const deploymentConfig = {
    target_service_name: 'hello-app',              // ← Task 3: Try 'my-api'
    target_service_image: 'gcr.io/my-project/hello-app',  // ← Task 4: Try commenting out
    deployment_region: 'us-central1',              // ← Task 1: Try 'europe-west1'
    service_memory: '256Mi',                       // ← Task 2: Try '1Gi'
    service_cpu: '1'                               // ← Bonus: Try '2' or '4'
  };
  
  console.log('\n📥 Input from Field (flowin pulses):');
  console.log(JSON.stringify(deploymentConfig, null, 2));
  
  try {
    const result = deployer.executeStandalone(deploymentConfig);
    
    console.log('\n✅ SUCCESS: ServiceDeployer executed');
    console.log('\n📤 Output to Field (flowout pulses):');
    console.log(JSON.stringify(result, null, 2));
    
    console.log('\n🎉 Next Intention:', deployer.getNextIntention(result));
    
    console.log('\n' + '='.repeat(70));
    console.log('📊 SUMMARY');
    console.log('='.repeat(70));
    console.log(`\n✓ Application "hello-app" deployed to Cloud Run`);
    console.log(`✓ Running at: ${result.deployed_service_url}`);
    console.log(`✓ Revision: ${result.deployment_revision}`);
    console.log(`✓ Status: ${result.deployment_status}`);
    
  } catch (error) {
    console.error('\n❌ FAILED:', error.message);
  }
  
  console.log('\n' + '='.repeat(70));
}

// ============================================================
// COMPARISON: What's Different?
// ============================================================

function showWhatsDifferent() {
  console.log('\n' + '='.repeat(70));
  console.log('📚 KEY DIFFERENCES: Application vs Infrastructure DN');
  console.log('='.repeat(70));
  
  console.log(`
┌─────────────────────────────────────────────────────────────────────┐
│                    Application Code (hello-app)                     │
├─────────────────────────────────────────────────────────────────────┤
│ Location:        Separate Git repo / Container image                │
│ Language:        Any (JavaScript, Go, Python, Java, etc.)           │
│ Framework:       Express.js (or any web framework)                  │
│ Purpose:         Handle HTTP requests                               │
│ CPUX-aware:      ❌ NO - regular application code                   │
│ Deployed by:     ServiceDeployer DN                                 │
│ Runs in:         Cloud Run container                                │
│ Example code:    app.get('/', (req, res) => {...})                  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│              Infrastructure DN (ServiceDeployer)                     │
├─────────────────────────────────────────────────────────────────────┤
│ Location:        Infrastructure automation repo                     │
│ Language:        JavaScript (Node.js) - for our exercises           │
│ Framework:       CPUX (extends DNBase)                              │
│ Purpose:         Deploy Cloud Run services                          │
│ CPUX-aware:      ✅ YES - implements gatekeeper/flowin/flowout      │
│ Deploys:         hello-app (and other services)                     │
│ Runs in:         Local machine / CI/CD pipeline                     │
│ Example code:    perform(workingSet) { gcloudDeploy(...) }          │
└─────────────────────────────────────────────────────────────────────┘

🔑 KEY INSIGHT:
   ServiceDeployer DN is like a "deployment robot"
   hello-app is like a "restaurant" that serves food
   
   The robot doesn't become the restaurant!
   The robot DEPLOYS the restaurant to a location (Cloud Run)
`);
  
  console.log('='.repeat(70) + '\n');
}

// ============================================================
// SIMULATED VS REAL IMPLEMENTATION
// ============================================================

function showSimulatedVsReal() {
  console.log('\n' + '='.repeat(70));
  console.log('🔄 SIMULATED vs REAL Implementation');
  console.log('='.repeat(70));
  
  console.log(`
🔹 CURRENT (Simulated - Exercise 1.1):

   function simulateGcloudDeploy(serviceSpec) {
     console.log('📡 [SIMULATED] gcloud run deploy...');
     return {
       success: true,
       url: 'https://...',
       status: 'READY'
     };
   }
   
   ✅ Good for: Learning DN structure without GCP
   ⏱️  Speed: Instant
   💰 Cost: Free
   
🔹 REAL (Production - Exercise 2.1+):

   const {CloudRunClient} = require('@google-cloud/run');
   
   async function realGcloudDeploy(serviceSpec) {
     const client = new CloudRunClient();
     const [operation] = await client.createService({
       parent: \`projects/\${PROJECT}/locations/\${REGION}\`,
       service: {
         name: serviceSpec.name,
         template: {
           containers: [{ image: serviceSpec.image }]
         }
       }
     });
     
     return await operation.promise();
   }
   
   ✅ Production-ready
   ⏱️  Speed: 30-60 seconds
   💰 Cost: ~$0.0001 per deployment
   🔑 Requires: GCP credentials, billing enabled

🔹 WHAT STAYS THE SAME:

   class ServiceDeployer extends DNBase {
     constructor() {
       super(
         'DN_ServiceDeployer',
         'ServiceDeployer',
         gatekeeper,  // ✅ Same
         flowin,      // ✅ Same
         flowout      // ✅ Same
       );
     }
     
     perform(workingSet) {
       // Only this implementation changes
       // Simulated → Real API call
     }
   }
   
   🎯 The CPUX pattern is IDENTICAL in both!
`);
  
  console.log('='.repeat(70) + '\n');
}

// ============================================================
// EXPORT & RUN DEMO
// ============================================================

module.exports = { ServiceDeployer };

// Run demonstrations if executed directly
if (require.main === module) {
  demonstrateLayerSeparation();
  showWhatsDifferent();
  showSimulatedVsReal();
}
