# IntraOps — Cloud-Native Employee Platform

IntraOps is a Spring Boot employee portal being developed into a cloud-native DevOps project focused on CI/CD, Kubernetes, reliability, and observability.

The application provides company news, announcements, HR policies, and holiday information through REST APIs and a web dashboard.

## Tech Stack

- Java + Spring Boot
- HTML, CSS, JavaScript
- Maven
- Docker
- Jenkins
- Kubernetes / Minikube
- PostgreSQL
- Prometheus + Grafana
- Loki + OpenTelemetry
- Helm / Argo CD

## Architecture

GitHub
   ↓
Jenkins CI/CD
   ↓
Maven → Tests → Docker
   ↓
Kubernetes
   ├── Multiple Pods
   ├── Health Probes
   ├── Rolling Updates
   └── Autoscaling
   ↓
IntraOps Portal

Planned Features
PostgreSQL-backed persistent data
HR/Admin CRUD dashboard
Authentication and role-based access
Kubernetes multi-pod deployment
Liveness and readiness probes
Self-healing and rolling updates
Horizontal Pod Autoscaling
Automated Jenkins deployment pipeline
Prometheus metrics and Grafana dashboards
Centralized logs and tracing
Load testing with k6
Helm charts and GitOps with Argo CD
Reliability Experiments

The project will also demonstrate:

Automatic recovery after pod failures
Zero/minimal-downtime rolling deployments
Autoscaling under generated load
Monitoring CPU, memory, latency, errors, and application health