# CPUX for Cloud Run: Learning Series
## Baby Steps to Understanding Intention-Driven Infrastructure

**Target Audience**: Developers familiar with Cloud Run  
**Prerequisite**: Completed frontend Intention Tunnel exercises (Levels 1-5)  
**Format**: 15-20 minute tutorials with working examples  
**Alignment**: Follows Intention Space CPUX Reference Manual v1.1

---

## 🎯 Learning Path Overview

```
Level 1: CLOUD RUN BASICS WITH CPUX LENS
  ↓
Level 2: INFRASTRUCTURE PULSES
  ↓
Level 3: BOUNDARY INTENTIONS (App ↔ Infra)
  ↓
Level 4: AUTO-SCALING WITH DESIGN NODES
  ↓
Level 5: COMPLETE DEPLOYMENT FLOW
```

**Key Constraint**: Cloud Run abstracts more than Kubernetes, so we focus on:
- Service-level operations (not pod-level)
- Declarative scaling (not complex orchestration)
- Intent-based deployment (Cloud Run's strength)
- Monitoring pulses (Cloud Run metrics)

---

## 📚 Series Structure

### Level 1: Cloud Run Basics with CPUX Lens (3 exercises)
**Goal**: Map familiar Cloud Run concepts to CPUX terminology

1.1 **What is a Cloud Run Service?** → It's a Design Node!  
1.2 **Cloud Run Metrics** → They're Infrastructure Pulses!  
1.3 **gcloud run deploy** → It emits Intentions!

### Level 2: Infrastructure Pulses (4 exercises)
**Goal**: Understand infrastructure state as pulses

2.1 **Service Configuration Pulses** (CPU, memory, concurrency)  
2.2 **Runtime Metrics Pulses** (request count, latency, errors)  
2.3 **Scaling Decision Pulses** (min/max instances, target)  
2.4 **Deployment Status Pulses** (revisions, traffic splits)

### Level 3: Boundary Intentions (4 exercises)
**Goal**: Learn domain separation (IS_APP ↔ IS_INFRA)

3.1 **INT_RequestResources**: App declares needs  
3.2 **INT_ReportMetrics**: Infra reports state  
3.3 **Intent Declaration File** (cpux.yaml for services)  
3.4 **Observing Infrastructure Pulses** from application code

### Level 4: Auto-Scaling with Design Nodes (4 exercises)
**Goal**: Implement CPUX-based scaling logic

4.1 **DN_ScaleDecision**: When to scale up/down?  
4.2 **Gatekeeper for Scaling**: syncTest with metric pulses  
4.3 **Flowout Scaling Intentions**: Emit INT_UpdateService  
4.4 **Testing DN_ScaleDecision** in isolation

### Level 5: Complete Deployment Flow (3 exercises)
**Goal**: End-to-end CPUX deployment on Cloud Run

5.1 **cpux deploy**: Declarative service deployment  
5.2 **Tracing CPUX Flow**: From intent to running service  
5.3 **Production Pattern**: Multi-region with traffic splits

---

## 🔄 Alignment with Reference Manual

### Design Node (DN) Mapping

**Reference Manual Definition**:
> "A black-box computation unit that absorbs Intention+Signal and emits Intention+Signal"

**Cloud Run Mapping**:
- **Cloud Run Service** = Design Node (DN_Service)
- **Absorbs**: INT_DeployService with configuration pulses
- **Emits**: INT_ServiceReady with runtime pulses
- **States**: Ready, Busy/Executing (deploying), Stopped (deleted)

### Object (O) Mapping

**Reference Manual Definition**:
> "A reflector of Intentions with field-based state, acting as valve or pass-through"

**Cloud Run Mapping**:
- **Service Configuration Object** (O_ServiceConfig)
  - Absorbs INT_RequestDeploy
  - Reflects INT_ApplyConfig (after validation)
  - Persists: service name, region, image, resources
  
### Intention (I) Mapping

**Reference Manual Types**:
- Trigger Intention, Emitted Intention, Reflected Intention, Final Emission

**Cloud Run Intentions**:
- **INT_DeployService** (Trigger): Start deployment
- **INT_UpdateResources** (Emitted): Modify running service
- **INT_ServiceReady** (Reflected): Deployment complete
- **INT_ScaleDecision** (Internal): Auto-scaling trigger

### Field Mapping

**Reference Manual**:
- CPUX-Field (Visitor Field): FIS + FPS
- Object-Field: OIS + OPS

**Cloud Run Field**:
- **Global Infrastructure Field**: All Cloud Run services + metrics
- **Service-Specific Field**: Per-service configuration + runtime state

---

## 🚧 Cloud Run Limitations (vs Kubernetes)

| Aspect | Kubernetes CPUX | Cloud Run CPUX |
|--------|-----------------|----------------|
| **Granularity** | Pod-level pulses | Service-level pulses |
| **Control** | Full (CRDs, Operators) | Limited (gcloud API) |
| **Persistence** | etcd-backed | Managed (no direct access) |
| **Networking** | Full mesh control | Simplified (ingress only) |
| **Storage** | Volumes, PVCs | Cloud Storage buckets |
| **Observability** | Custom metrics | Cloud Monitoring only |

**Design Decision**: We'll focus on what Cloud Run does well (service-level operations) and teach CPUX principles within those constraints.

---

## 📋 Exercise Format

Each exercise follows this structure:

### 1. 🎯 What You'll Learn (2 min)
- Bullet points of concepts covered
- Reference Manual section alignment

### 2. 🌍 Real-World Analogy (2 min)
- Simple metaphor explaining the concept
- Example: "Service = Restaurant Kitchen (Design Node)"

### 3. 📖 Theory (3 min)
- CPUX concept explanation
- Reference Manual definitions
- Diagram showing relationships

### 4. 💻 Practice (8 min)
- Hands-on code/commands
- Step-by-step instructions
- Expected output shown

### 5. ✅ Check Your Understanding (3 min)
- 2-3 questions with answers
- Reinforces key concepts

### 6. ➡️ Next Steps (1 min)
- Preview of next exercise
- Connection to bigger picture

**Total**: 15-20 minutes per exercise

---

## 🔧 Prerequisites

Before starting, ensure you have:

1. ✅ **Completed Frontend Exercises**: Levels 1-5 (Pulses → DNs)
2. ✅ **Google Cloud Account**: With Cloud Run enabled
3. ✅ **gcloud CLI installed**: Version 400.0.0+
4. ✅ **Basic Cloud Run Experience**: Deployed at least one service
5. ✅ **Node.js installed**: For local testing (v18+)

---

## 🚀 Getting Started

**Option A**: Jump to Exercise 1.1 (Recommended)
```bash
# Start with the first exercise
open Exercise_1-1_CloudRun_As_DesignNode.md
```



---

## 📚 Additional Resources

- **Reference Manual**: See `Intention_Space_CPUX_Reference_Manual_Updated.md`
- **Frontend Exercises**: Complete these first for foundational concepts
- **Cloud Run Docs**: https://cloud.google.com/run/docs
- **CPUX Theory**: 

---

## 🎓 Learning Outcomes

By completing this series, you will:

1. ✅ **Map Cloud Run concepts to CPUX terminology**
   - Services = Design Nodes
   - Metrics = Infrastructure Pulses
   - gcloud commands = Intention emissions

2. ✅ **Understand domain separation** (IS_APP ↔ IS_INFRA)
   - Clear boundaries between application and infrastructure
   - Intention-based communication
   - Hybrid visibility and control

3. ✅ **Write CPUX-based scaling logic**
   - Design Nodes for auto-scaling decisions
   - Gatekeepers with syncTest
   - Testable in isolation

4. ✅ **Deploy services declaratively**
   - cpux.yaml intent files
   - Trace complete deployment flows
   - Enterprise-grade reliability patterns

5. ✅ **Prepare for Kubernetes migration** (optional)
   - Same CPUX concepts scale to K8s
   - Understand what changes (granularity, control)
   - Portable mental model

---

## 🎯 Key Principle

> **Cloud Run services are Design Nodes in the infrastructure domain**
> 
> They:
> - Absorb deployment Intentions
> - Execute code (perform function)
> - Emit runtime metrics as Pulses
> - Follow the same DN-I-O-I-DN pattern as application code

**The beauty**: You already understand CPUX from frontend exercises. Now we apply the SAME concepts to infrastructure!

---

## 💡 Why Learn CPUX for Cloud Run?

**Traditional Approach**:
```bash
gcloud run deploy myservice \
  --image gcr.io/myproject/app \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10
```
- Imperative commands
- No traceability
- Hard to test scaling logic
- Unclear intent

**CPUX Approach**:
```bash
cpux service deploy myservice \
  --intent "Auto-scaling web API for 100-1000 users" \
  --target-latency 200ms \
  --cost-priority medium
```
- Declarative intent
- Full trace (cpux trace flow myservice)
- Testable DNs for scaling decisions
- Clear business intent captured

**Same service, better architecture!**

---

## 🗺️ Series Roadmap

```
Week 1: Level 1 (Mapping concepts)
  Day 1: Exercise 1.1 - Cloud Run = Design Node
  Day 2: Exercise 1.2 - Metrics = Pulses
  Day 3: Exercise 1.3 - gcloud = Intentions
  
Week 2: Level 2 (Infrastructure Pulses)
  Day 1: Exercise 2.1 - Service Config Pulses
  Day 2: Exercise 2.2 - Runtime Metrics Pulses
  Day 3: Exercise 2.3 - Scaling Pulses
  Day 4: Exercise 2.4 - Deployment Status Pulses
  
Week 3: Level 3 (Boundary Intentions)
  Day 1: Exercise 3.1 - INT_RequestResources
  Day 2: Exercise 3.2 - INT_ReportMetrics
  Day 3: Exercise 3.3 - Intent Declaration Files
  Day 4: Exercise 3.4 - Observing Infra Pulses
  
Week 4: Level 4 (Auto-Scaling DNs)
  Day 1: Exercise 4.1 - DN_ScaleDecision
  Day 2: Exercise 4.2 - Gatekeeper for Scaling
  Day 3: Exercise 4.3 - Flowout Intentions
  Day 4: Exercise 4.4 - Testing in Isolation
  
Week 5: Level 5 (Complete Flows)
  Day 1: Exercise 5.1 - cpux deploy
  Day 2: Exercise 5.2 - Tracing Flows
  Day 3: Exercise 5.3 - Production Patterns
```

**Recommended Pace**: 1 exercise per day, practice on weekends

---

## ⚠️ Important Notes

### Terminology Alignment

This series uses **exact terminology from the Reference Manual**:

| Reference Manual Term | Cloud Run Equivalent |
|----------------------|---------------------|
| Design Node (DN) | Cloud Run Service |
| Intention (I) | gcloud API call / cpux command |
| Signal (S) | Service configuration + metrics |
| Pulse | Individual config/metric value |
| Field (CPUX-Field) | Infrastructure state |
| Gatekeeper | Scaling trigger condition |
| flowin | Current service config |
| flowout | Updated service config |
| syncTest | Condition evaluation |

### Cloud Run Specifics

**What Cloud Run abstracts**:
- Container orchestration (no pods visible)
- Networking (automatic HTTPS)
- Load balancing (managed)
- Certificate management (automatic)

**What we still control via CPUX**:
- Service configuration (DN container)
- Scaling parameters (Gatekeeper thresholds)
- Deployment strategy (Object reflection)
- Observability (Pulse subscriptions)

---

## 🎉 Ready to Begin?

**Start here**: [Exercise 1.1 - Cloud Run as a Design Node](Exercise_1-1_CloudRun_As_DesignNode.md)

**Questions?** Review the Reference Manual or frontend exercises first.

**Let's build infrastructure the CPUX way!** 🚀

---

**End of Introduction**
