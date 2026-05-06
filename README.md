# AgentOS — WASM Swarm Agent Operating System

> **A production-grade WASM-powered multi-agent system that optimizes prompts autonomously, executes across multiple AI models, scores best outputs, and evolves via feedback loops.**

[![CI](https://github.com/Algodons/agentos/actions/workflows/ci.yml/badge.svg)](https://github.com/Algodons/agentos/actions/workflows/ci.yml)

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

> **Backward compatibility:** `import { PromptOS } from '@/core'` still works — `PromptOS` is aliased to `AgentOS`.

---

## 🏗️ Architecture

```
/core
├── agents/          # 7 stateless typed agents
│   ├── InputAgent
│   ├── PromptArchitect
│   ├── ExecutionAgent
│   ├── EvaluationAgent
│   ├── OptimizationAgent
│   ├── SecurityAgent
│   └── DeploymentAgent
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

## 🌐 API

### `POST /api/optimize`

**Request:**
```json
{ "input": "Summarize the history of the internet." }
```

**Response:**
```json
{
  "optimizedPrompt": "...",
  "score": 0.91,
  "model": "mock",
  "versionId": "uuid",
  "iterations": 3,
  "scoreBreakdown": { "accuracy": 0.85, "completeness": 1.0 },
  "threatDetected": false
}
```

---

## 🎨 Dashboard

Route: `/dashboard`

- **Score Index** — real-time score with sparkline
- **Agent Swarm Panel** — live agent status (idle / running / failed)
- **Prompt Timeline** — version history with scores
- **Model Comparison** — GPT vs Claude vs Gemini vs Llama
- **Live Logs** — terminal-style streaming log view

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

The system works **without any API keys** — all models fall back to a deterministic mock provider.

---

## 🧪 Testing

```bash
npm test              # run all tests
npm run test:coverage # with coverage report
```

- `tests/swarm.test.ts` — end-to-end swarm pipeline
- `tests/agents.test.ts` — unit tests for all 7 agents
- `tests/scoring.test.ts` — scoring engine formula tests

---

## 🛡️ Security

- **PromptSanitizer** — strips jailbreak and injection patterns before execution
- **InjectionDetector** — detects `instruction_override`, `jailbreak`, `xss_injection`, `code_injection`, `system_prompt_injection`
- No secrets hardcoded anywhere
- Server-side validation on all API inputs

---

## 🔧 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run type-check` | TypeScript strict check |
| `npm run lint` | ESLint |
| `npm test` | Jest tests |

---

## 📄 License

MIT — see [LICENSE](./LICENSE)
