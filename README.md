# IntraOps — Cloud-Native Employee Platform

IntraOps is a Spring Boot employee portal being developed into a cloud-native platform focused on CI/CD, Kubernetes, reliability, and observability. The current application is a prototype for company news, announcements, HR policies, and holidays; the infrastructure foundation is further along than the employee-facing features.

## Current Stack

- Java 25, Spring Boot 4.1.0, Maven
- Static HTML, CSS, and JavaScript served by Spring Boot
- Docker and Jenkins CI
- Kubernetes / Minikube
- Spring Boot Actuator, Micrometer, Prometheus, and Grafana

PostgreSQL, authentication, autoscaling, centralized logs/tracing, Helm, and Argo CD are planned, not implemented.

## What Is Done So Far

- **Application:** controller/service/model structure, seeded demo data, and GET/POST endpoints for `/api/news`, `/api/announcements`, `/api/policy`, and `/api/holidays`.
- **Frontend:** a dashboard that fetches and displays the four content types.
- **Containerization:** Dockerfile for running the packaged application on port `8081`.
- **CI:** Jenkins runs `mvn clean package`, builds a Docker image, and lists local images. The test suite currently contains only a Spring context-load test.
- **Kubernetes:** two replicas, CPU/memory requests and limits, a NodePort service, readiness/liveness probes, and rolling updates configured with `maxUnavailable: 0` and `maxSurge: 1`.
- **Metrics:** `/actuator/prometheus` exposed through Actuator and Micrometer; Prometheus scrape configuration and Kubernetes manifests for Prometheus and Grafana are committed.
- **Dashboard:** six panels covering application uptime, application CPU usage, JVM heap used, HTTP request rate, average response time, and 5xx error rate. The export is in [monitoring/grafana/dashboard.json](monitoring/grafana/dashboard.json), with screenshots in [dashboard_ss](dashboard_ss/).

**Reported Minikube validation:** self-healing has been tested, Prometheus and Grafana are deployed, the Prometheus target is UP, and the live dashboard is named `IntraOps - System Health`. These are project-owner-reported runtime results; this repository review did not re-run cluster checks. The committed dashboard export currently uses the title `System health`.

## Current Architecture

```text
Source checkout → Jenkins → Maven package/tests → local Docker image

Minikube (deployment managed separately from Jenkins)
  NodePort service → Spring Boot deployment (2 replicas)
                      ├── Static employee dashboard
                      ├── REST API with per-pod in-memory data
                      └── Actuator health and Prometheus metrics

  Prometheus → intraops-service:8081/actuator/prometheus
  Grafana → Prometheus
```

## Current Limitations

- Each service stores data in a mutable `ArrayList`. Writes are lost on restart, are not shared between replicas, and are not protected against concurrent access. A successful POST to one pod may be absent from a GET served by the other pod.
- APIs accept client-supplied IDs and unvalidated request bodies. There is no database, authentication, role enforcement, update/delete flow, or application-wide error handling.
- Frontend search, navigation, “Mark All As Read,” and quick links are placeholders. Policy details are not displayed, and the operational status is hardcoded.
- Fetch calls lack HTTP-status checks, loading/empty states, and error recovery. API values are interpolated into `innerHTML`, creating an XSS risk with submitted content.
- Layout uses large fixed left margins, has no responsive breakpoints, and the HTML lacks a mobile viewport declaration.
- Jenkins does not push to a registry or deploy to Kubernetes. It builds `companyintranet:v1`, while Kubernetes expects `companyintranet:v2` with `imagePullPolicy: Never`.
- Prometheus scrapes one service address rather than discovering each replica separately. The current metrics do not reliably represent both pods independently.
- Monitoring manifests do not configure persistent storage. Grafana provisions its datasource, but the exported dashboard is not automatically provisioned.

## What To Do Next

### 1. Build one complete employee workflow

Start with **announcements**: an HR/admin user creates, edits, publishes, and archives an announcement; an employee views it and marks it as read. Finish this end to end before expanding the other modules.

- Replace in-memory storage with PostgreSQL repositories and versioned database migrations. Generate IDs on the server and use typed dates/timestamps.
- Add validated request/response DTOs, consistent error responses, and list/detail/create/update/delete endpoints with pagination and sorting where needed.
- Add authentication and server-side employee/HR/admin authorization. Derive authorship from the authenticated user and store read acknowledgements per employee.
- Add meaningful tests for invalid input, denied writes, persistence across restarts, and shared data across replicas.

### 2. Make the frontend useful and reliable

- Apply consistent IntraOps branding, responsive navigation, accessible labels/focus states, and layouts that work on mobile and desktop.
- Add an announcement list/detail view and admin forms; then extend the same patterns to news, policies, and holidays.
- Implement search/filtering and read state; connect quick links to real destinations or clearly mark them as unavailable.
- Centralize API calls with status checks and loading, empty, error, and retry states.
- Render plain API content with `textContent` instead of HTML interpolation. See [MDN's innerHTML security guidance](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML#security_considerations).
- Replace the hardcoded operational indicator with a truthful state, or remove it. The existing static frontend can support this first milestone; a framework migration is optional.

### 3. Strengthen delivery and observability

- Scrape each application pod separately using [Prometheus Kubernetes discovery](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#kubernetes_sd_config), retain pod labels, and scope dashboard queries to IntraOps.
- Provision the dashboard reproducibly, align its title and datasource reference, and add monitoring persistence, useful alert thresholds, and latency percentiles.
- Align image naming, use immutable build tags, and extend Jenkins with registry publishing, deployment, rollout verification, and a rollback procedure.
- Review unrestricted CORS and exposed Actuator details when adding authentication; keep necessary probe and scrape access working.

### Later Milestones

- Employee directory, policy acknowledgements, and an IT request workflow.
- k6 load tests, Horizontal Pod Autoscaling, and recorded recovery/rolling-update experiments under traffic.
- Centralized logging with Loki, distributed tracing with OpenTelemetry, and request correlation.
- Helm packaging and GitOps with Argo CD.

The next milestone is complete when an authorized HR user can publish an announcement, employees can read and acknowledge it, and the data remains consistent across both replicas and pod restarts.
