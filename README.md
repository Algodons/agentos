# AgentOS — WASM Swarm Agent Operating System

> **A production-grade WASM-powered multi-agent system that optimizes prompts autonomously, executes across multiple AI models, scores best outputs, and evolves via feedback loops.**

[![CI](https://github.com/Algodons/agentos/actions/workflows/ci.yml/badge.svg)](https://github.com/Algodons/agentos/actions/workflows/ci.yml)
[![Security](https://github.com/Algodons/agentos/actions/workflows/security.yml/badge.svg)](https://github.com/Algodons/agentos/actions/workflows/security.yml)

---

## 🚀 Quick Start

```bash
npm install
npm run dev        # http://localhost:3000
```

Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard) to see the cyberpunk control panel.

---

## ✨ What is AgentOS?

AgentOS is an autonomous prompt optimization operating system — a self-evolving AI execution layer that:

- 🤖 **Optimizes prompts** through a 7-agent swarm pipeline
- ⚡ **Executes across multiple AI models** (OpenAI, Claude, Gemini, Llama)
- 📊 **Scores and selects** the best outputs via weighted evaluation
- 🔁 **Evolves prompts** via feedback loops (up to 10 iterations)
- 🛡️ **Secures execution** against prompt injection & jailbreaks
- 🧠 **Stores and versions** high-performing prompts
- 🌐 **WASM execution layer** for parallel, deterministic agent tasks

> **Backward compatibility:** `import { PromptOS } from '@/core'` still works — `PromptOS` is aliased to `SwarmOrchestrator`.

---

## 🏗️ Architecture

```
/core
├── agents/          # 7 stateless typed agents
├── swarm/           # SwarmOrchestrator — pipeline coordinator
├── wasm/            # WasmRunner + WorkerPool
├── models/          # ModelRouter (OpenAI / Claude / Gemini / Llama)
├── evaluation/      # ScoringEngine (weighted formula)
├── memory/          # MemorySystem (short + long-term)
├── security/        # PromptSanitizer + InjectionDetector
└── prompt/          # Prompt DNA standard enforcement
```

### Swarm Pipeline

```
Input → PromptArchitect → Security → Execute → Evaluate → [Optimize loop] → Deploy
```

### Scoring Formula

```
score = (accuracy × 0.40) + (completeness × 0.25) + (determinism × 0.15)
      + (cost × 0.10)     + (latency × 0.10)
```

---

## 🧪 Testing

```bash
npm test               # run all tests
npm run test:coverage  # with coverage report
```

Coverage now includes:

- Unit tests for all swarm agents
- End-to-end swarm orchestration tests
- Determinism tests for WASM execution
- Worker-pool load and queue saturation tests

---

## 🔐 Enterprise CI/CD and Security

### CI/CD Workflows

- **CI (`.github/workflows/ci.yml`)**
  - Deterministic `npm ci`
  - Node.js matrix validation (20, 22)
  - Type-check, lint, tests, build
  - Coverage artifact upload
- **Release (`.github/workflows/release.yml`)**
  - Triggered by semantic tags (`v*.*.*`)
  - Full pre-release validation
  - Reproducible package artifact + checksums
  - Automated GitHub release creation
- **Deploy (`.github/workflows/deploy.yml`)**
  - Human-triggered deployment path
  - Staging then production gating via environments

### Security Governance

- **Security workflow (`.github/workflows/security.yml`)**
  - CodeQL analysis
  - Dependency review for pull requests
  - Scheduled and branch-based `npm audit`
- Prompt injection and XSS sanitization built into core runtime
- No embedded secrets in codebase

---

## 🚢 Deployment Playbooks

- Docker: [`docs/deployment/docker.md`](docs/deployment/docker.md)
- Kubernetes: [`docs/deployment/kubernetes.md`](docs/deployment/kubernetes.md)
- Vercel: [`docs/deployment/vercel.md`](docs/deployment/vercel.md)

Kubernetes base manifests are provided in `deploy/k8s/base/` with secure defaults:

- Non-root execution
- Read-only root filesystem
- Capability drop (`ALL`)
- Liveness/readiness probes
- HorizontalPodAutoscaler

---

## 📈 Observability, Scaling, and Recovery

- Monitoring and alerting: [`docs/operations/monitoring-alerting.md`](docs/operations/monitoring-alerting.md)
- Scaling strategy: [`docs/operations/scaling-playbook.md`](docs/operations/scaling-playbook.md)
- Disaster recovery: [`docs/operations/disaster-recovery.md`](docs/operations/disaster-recovery.md)

`GET /api/status` now returns health and operational metadata:

- status
- timestamp
- uptime
- model and score snapshot
- version count

---

## ⚙️ Configuration

Copy `.env.example` to `.env.local` and fill in your API keys:

```env
OPENAI_API_KEY=
CLAUDE_API_KEY=
GEMINI_API_KEY=
LLAMA_API_KEY=
MARKETPLACE_ENABLED=true
```

The system works **without any API keys** — models can run through deterministic mock behavior.

---

## 🔧 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run type-check` | TypeScript strict check |
| `npm run lint` | ESLint |
| `npm test` | Jest suite |
| `npm run test:coverage` | Jest coverage |

---

## 📄 License

MIT — see [LICENSE](./LICENSE)
