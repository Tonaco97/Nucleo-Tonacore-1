Sentinela Tonaco - Resilience Aggregator
<img width="1024" height="1024" alt="lla" src="https://github.com/user-attachments/assets/68163062-31a0-4c7f-a573-54dbfe038fe3" />

High-performance API composition microservice engineered for 2k req/s throughput with 350ms p99 stability.

## Technical Specifications
- Engine: Node.js with Worker Threads for CPU offloading.
- Data Management: Weighted Quick Union for real-time grouping.
- Infrastructure: Fixed-capacity deployment strategy.
<img width="1024" height="1024" alt="Tonacore Linkedin" src="https://github.com/user-attachments/assets/566b20ee-1fb1-4f30-b181-296f767b300d" />

## Incident Management and Resilience
This architecture addresses behavioral anomalies often detected by XDR platforms. In high-latency network scenarios (VPC/VPN), standard application retry patterns can mimic C2 beaconing. This service implements deterministic resource handling to maintain network stability.
<img width="486" height="422" alt="Tonacore data flow" src="https://github.com/user-attachments/assets/9ad6b2c8-443b-4d79-8120-89b4de28f4be" />

### Strategic Pillars:
1. Spot Instance Preemption Mitigation: Hard affinity rules to ensure node persistence.
2. Low-Latency Data Transfer: Optimized inter-thread communication via ArrayBuffers.
3. Task Sequencing: Managed concurrency to handle downstream variability.


<img width="247" height="128" alt="ascii-art-text (1)" src="https://github.com/user-attachments/assets/0bd6fa77-9b1a-4239-aaf6-96c6602c44d4" />

