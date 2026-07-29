# GirGuard AI — Problem Statement & Solution Architecture

**Project Title:** GirGuard AI — Human-Wildlife Conflict Prediction & Mitigation Platform  
**Authority:** Gujarat Forest Department & Ministry of Environment, Forest and Climate Change (MoEFCC)  
**Target Region:** Gir Protected Area Network (Junagadh, Amreli, Gir Somnath, Bhavnagar Districts, Gujarat, India)

---

## 1. Executive Summary & Background Context

The Gir Forest and surrounding sanctuary landscape in Gujarat is the **sole natural habitat on Earth of the endangered Asiatic Lion** (*Panthera leo persica*). According to recent censuses, the Asiatic lion population exceeds 674 individuals, with an additional population of over 300 Asiatic leopards.

Due to successful conservation efforts, the lion population has grown beyond the carrying capacity of the 1,412 km² core sanctuary area. Today, **over 70% of Asiatic lions range outside protected national park boundaries**, occupying human-dominated agricultural landscapes, mango orchards, and village fringes.

This spatial overlap leads to frequent human-carnivore encounters, causing:
1. **Livestock Depredation:** Cattle, goats, and buffaloes killed near village pastures.
2. **Accidental Human Encounter:** Human injury or casualty during night farming operations.
3. **Transport Corridor Hazards:** Lions hit by trains along the Pipavav-Dhari railway line or vehicles on state highways.
4. **Retaliatory Action:** Risk of villagers placing electric snares or poison to protect livestock.

---

## 2. Core Problem Statement

Traditional wildlife management relies on **manual foot patrols, phone calls from villagers, and delayed camera trap retrieval**. This legacy approach faces 4 critical operational bottlenecks:

1. **High Warning Latency:** Villagers are alerted hours after carnivores stray into agricultural fields, rendering preventative measures useless.
2. **Uncoordinated Emergency Response:** Rapid Response Teams (RRT) are dispatched without real-time GPS telemetry or movement trajectory data, causing delayed intercepts.
3. **Compensation Resentment:** Verification of livestock damage takes 30–45 days, causing severe financial strain on farmers and inciting retaliatory anger.
4. **Data Silos:** GPS collar data, thermal camera traps, and weather/waterhole sensors are disconnected across separate departments.

---

## 3. The GirGuard AI Solution

**GirGuard AI** is an enterprise-grade, real-time **Defense & Wildlife Command & Control Web Application**. It unifies telemetry streams, applies predictive machine learning for carnivore trajectory forecasting, automates early warning broadcasts, and coordinates rapid squad dispatch.

### Key Architectural Modules

- **📡 Live Telemetry & GIS Command:** Real-time spatial tracking of collared carnivores (#GIR-07, #LEP-03) on Leaflet satellite map tiles.
- **🤖 Trajectory Forecasting:** Machine learning models predicting 6-hour carnivore movement corridors with 87%+ accuracy.
- **🚨 Automated Village Warnings:** Multilingual SMS, WhatsApp API notifications, and automated village sirens triggered within sub-30 seconds of perimeter breach.
- **🚓 Rapid Squad Dispatch System:** Intercept routing portal calculating real-time vehicle ETAs for Rapid Response Teams.
- **💰 AI Direct Compensation Hub:** Computer vision damage verification accelerating claim disbursal to under 48 hours via Direct Benefit Transfer (DBT).

---

## 4. Key Performance Metrics & Impact

| Operational Metric | Legacy Baseline | GirGuard AI Target |
| ------------------ | --------------- | ------------------ |
| **Early Warning Dispatch Latency** | 2 – 4 Hours | **< 30 Seconds** |
| **Rapid Response Intercept Time** | 45 Minutes | **< 15 Minutes** |
| **Movement Forecast Accuracy** | Reactive Only | **87.4% (6-Hr Window)** |
| **Compensation Disbursal Cycle** | 30 – 45 Days | **< 48 Hours** |
| **Human Casualties in Fringe Villages** | At Risk | **Zero Casualty Target** |

---
*Created for Gujarat Forest Department — Project Lion Division.*
