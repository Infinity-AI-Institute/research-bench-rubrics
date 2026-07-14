# Unified Harness V2

This README is the harness-specific report for the completed clean-baseline full 20-paper run on `researchbench_inference20_h100`. It compares [`20260630-gpt-5-codex-cleanbaseline-inf20`](../../../data/frozen_benchmarks/researchbench_inference20_h100/_runs/codex/gpt-5-codex/20260630-gpt-5-codex-cleanbaseline-inf20/BENCHMARK_RUN_SUMMARY.json) against [`20260629-claude-opus-4-7-cleanbaseline-inf20`](../../../data/frozen_benchmarks/researchbench_inference20_h100/_runs/claude-code/claude-opus-4-7/20260629-claude-opus-4-7-cleanbaseline-inf20/BENCHMARK_RUN_SUMMARY.json).

## Score Tables

**Implementable Tasks Closed by Paper**

| Paper | Codex | Claude |
| --- | --- | --- |
| `llmservingsim` | `  8.0% █░░░░░░░░░░░░░░░` | `  0.0% ░░░░░░░░░░░░░░░░` |
| `FOCUS_autokernel` | `  0.0% ░░░░░░░░░░░░░░░░` | `  3.1% █░░░░░░░░░░░░░░░` |
| `fp16-equivalence` | `  0.0% ░░░░░░░░░░░░░░░░` | `  0.0% ░░░░░░░░░░░░░░░░` |
| `nexus` | `  0.0% ░░░░░░░░░░░░░░░░` | `  8.2% █░░░░░░░░░░░░░░░` |
| `adaserve` | `  9.1% █░░░░░░░░░░░░░░░` | `  0.0% ░░░░░░░░░░░░░░░░` |
| `asynctls` | `  0.0% ░░░░░░░░░░░░░░░░` | ` 15.7% ███░░░░░░░░░░░░░` |
| `cacheflow` | `  0.0% ░░░░░░░░░░░░░░░░` | `  9.1% █░░░░░░░░░░░░░░░` |
| `contiguouskv` | `  0.0% ░░░░░░░░░░░░░░░░` | ` 17.4% ███░░░░░░░░░░░░░` |
| `duetserve` | `  0.0% ░░░░░░░░░░░░░░░░` | `  0.7% █░░░░░░░░░░░░░░░` |
| `fast-heterogeneous` | `n/a` | `n/a` |
| `flexicache` | `n/a` | `n/a` |
| `hexgen-flow` | `n/a` | `n/a` |
| `icecache` | `  5.7% █░░░░░░░░░░░░░░░` | `  5.7% █░░░░░░░░░░░░░░░` |
| `lamp` | `  0.0% ░░░░░░░░░░░░░░░░` | ` 10.3% ██░░░░░░░░░░░░░░` |
| `niyama` | `  0.0% ░░░░░░░░░░░░░░░░` | ` 28.6% █████░░░░░░░░░░░` |
| `prefill-as-a-service` | `  0.0% ░░░░░░░░░░░░░░░░` | `  1.6% █░░░░░░░░░░░░░░░` |
| `ragged-paged-attention` | `  0.0% ░░░░░░░░░░░░░░░░` | ` 10.8% ██░░░░░░░░░░░░░░` |
| `shift-parallelism` | `  0.0% ░░░░░░░░░░░░░░░░` | `100.0% ████████████████` |
| `ttkv` | `  7.3% █░░░░░░░░░░░░░░░` | `  7.3% █░░░░░░░░░░░░░░░` |
| `tutti` | `  0.0% ░░░░░░░░░░░░░░░░` | ` 12.2% ██░░░░░░░░░░░░░░` |

**Total Implemented by Paper**

| Paper | Codex | Claude |
| --- | --- | --- |
| `llmservingsim` | `  1.9% █░░░░░░░░░░░░░░░` | `  0.0% ░░░░░░░░░░░░░░░░` |
| `FOCUS_autokernel` | `  0.0% ░░░░░░░░░░░░░░░░` | `  1.5% █░░░░░░░░░░░░░░░` |
| `fp16-equivalence` | `  0.0% ░░░░░░░░░░░░░░░░` | `  0.0% ░░░░░░░░░░░░░░░░` |
| `nexus` | `  0.0% ░░░░░░░░░░░░░░░░` | `  1.3% █░░░░░░░░░░░░░░░` |
| `adaserve` | `  0.6% █░░░░░░░░░░░░░░░` | `  0.0% ░░░░░░░░░░░░░░░░` |
| `asynctls` | `  0.0% ░░░░░░░░░░░░░░░░` | `  4.6% █░░░░░░░░░░░░░░░` |
| `cacheflow` | `  0.0% ░░░░░░░░░░░░░░░░` | `  2.3% █░░░░░░░░░░░░░░░` |
| `contiguouskv` | `  0.0% ░░░░░░░░░░░░░░░░` | `  1.3% █░░░░░░░░░░░░░░░` |
| `duetserve` | `  0.0% ░░░░░░░░░░░░░░░░` | `  0.3% █░░░░░░░░░░░░░░░` |
| `fast-heterogeneous` | `n/a` | `n/a` |
| `flexicache` | `n/a` | `n/a` |
| `hexgen-flow` | `n/a` | `n/a` |
| `icecache` | `  0.4% █░░░░░░░░░░░░░░░` | `  0.4% █░░░░░░░░░░░░░░░` |
| `lamp` | `  0.0% ░░░░░░░░░░░░░░░░` | `  1.4% █░░░░░░░░░░░░░░░` |
| `niyama` | `  0.0% ░░░░░░░░░░░░░░░░` | `  2.5% █░░░░░░░░░░░░░░░` |
| `prefill-as-a-service` | `  0.0% ░░░░░░░░░░░░░░░░` | `  0.8% █░░░░░░░░░░░░░░░` |
| `ragged-paged-attention` | `  0.0% ░░░░░░░░░░░░░░░░` | `  0.9% █░░░░░░░░░░░░░░░` |
| `shift-parallelism` | `  0.0% ░░░░░░░░░░░░░░░░` | `  1.0% █░░░░░░░░░░░░░░░` |
| `ttkv` | `  0.7% █░░░░░░░░░░░░░░░` | `  0.7% █░░░░░░░░░░░░░░░` |
| `tutti` | `  0.0% ░░░░░░░░░░░░░░░░` | `  5.5% █░░░░░░░░░░░░░░░` |

## Run Summary

These numbers come from unchanged `run-benchmark-paper` smoke checks followed by unchanged `run-benchmark-set` executions on the frozen `researchbench_inference20_h100` manifest. Both backends were run from a clean worktree at committed `main`, with the benchmark harness, prompts, adapters, rubrics, and contracts left untouched. The first table shows `closed_headline_count / implementable_claim_baseline_total` for each paper, while the second shows `total_implemented_pct` across all rubric tasks.

- Average per-paper implementable-task closure: Codex `1.7693%` vs Claude Code `13.5642%`.
- Average `total_implemented_pct`: Codex `0.2118%` vs Claude Code `1.4412%`.
- Aggregate implementable-task closure: Codex `16/1327 = 1.21%` vs Claude Code `79/1327 = 5.95%`.
- Both runs left the majority of implementable work open; the difference was mostly in how far they got before budget/runtime failures, not in access to additional task classes.

## Linked Artifacts

- Aggregate Codex run summary: [`BENCHMARK_RUN_SUMMARY.json`](../../../data/frozen_benchmarks/researchbench_inference20_h100/_runs/codex/gpt-5-codex/20260630-gpt-5-codex-cleanbaseline-inf20/BENCHMARK_RUN_SUMMARY.json)
- Aggregate Claude Code run summary: [`BENCHMARK_RUN_SUMMARY.json`](../../../data/frozen_benchmarks/researchbench_inference20_h100/_runs/claude-code/claude-opus-4-7/20260629-claude-opus-4-7-cleanbaseline-inf20/BENCHMARK_RUN_SUMMARY.json)
- Representative Codex failure chain on `prefill-as-a-service`:
  [`PAPER_RUN_STATUS.json`](../../../data/frozen_benchmarks/researchbench_inference20_h100/_runs/codex/gpt-5-codex/20260630-gpt-5-codex-cleanbaseline-inf20/prefill-as-a-service-kvcache-of-next-generation/PAPER_RUN_STATUS.json),
  [`STOP_DIAGNOSIS.json`](../../../data/frozen_benchmarks/researchbench_inference20_h100/_runs/codex/gpt-5-codex/20260630-gpt-5-codex-cleanbaseline-inf20/prefill-as-a-service-kvcache-of-next-generation/workdir/STOP_DIAGNOSIS.json),
  [`REPLICATION_FAILURE_CONTEXT.json`](../../../data/frozen_benchmarks/researchbench_inference20_h100/_runs/codex/gpt-5-codex/20260630-gpt-5-codex-cleanbaseline-inf20/prefill-as-a-service-kvcache-of-next-generation/workdir/REPLICATION_FAILURE_CONTEXT.json),
  [`_grading_implementation_v1.json`](../../../data/frozen_benchmarks/researchbench_inference20_h100/_runs/codex/gpt-5-codex/20260630-gpt-5-codex-cleanbaseline-inf20/prefill-as-a-service-kvcache-of-next-generation/workdir/_grading_implementation_v1.json)
- Representative Claude Code failure chain on `contiguouskv`:
  [`PAPER_RUN_STATUS.json`](../../../data/frozen_benchmarks/researchbench_inference20_h100/_runs/claude-code/claude-opus-4-7/20260629-claude-opus-4-7-cleanbaseline-inf20/contiguouskv-accelerating-llm-prefill-with/PAPER_RUN_STATUS.json),
  [`STOP_DIAGNOSIS.json`](../../../data/frozen_benchmarks/researchbench_inference20_h100/_runs/claude-code/claude-opus-4-7/20260629-claude-opus-4-7-cleanbaseline-inf20/contiguouskv-accelerating-llm-prefill-with/workdir/STOP_DIAGNOSIS.json),
  [`REPLICATION_FAILURE_CONTEXT.json`](../../../data/frozen_benchmarks/researchbench_inference20_h100/_runs/claude-code/claude-opus-4-7/20260629-claude-opus-4-7-cleanbaseline-inf20/contiguouskv-accelerating-llm-prefill-with/workdir/REPLICATION_FAILURE_CONTEXT.json),
  [`_grading_implementation_v1.json`](../../../data/frozen_benchmarks/researchbench_inference20_h100/_runs/claude-code/claude-opus-4-7/20260629-claude-opus-4-7-cleanbaseline-inf20/contiguouskv-accelerating-llm-prefill-with/workdir/_grading_implementation_v1.json)

## Why 100% Was Not Reached

### Shared Missed Task Types

Across both backends, the remaining implementable work was concentrated in a small set of fine-grained task categories:

| Missed implementable task type | Unclosed leaves | Representative missed work |
| --- | ---: | --- |
| `Evaluation, Metrics & Benchmarking` | 1448 | Throughput, latency, LongBench, RULER, kernel speedup, and end-to-end performance claims were usually not fully verified. |
| `Method Implementation` | 955 | Profilers, kernel paths, offloading logic, and simulator internals were often only partially implemented or not exercised by a verifier. |
| `Experimental Setup` | 450 | Multi-node config parsing, workload matrices, and reproducible hardware/software setup remained incomplete. |
| `Environment & Infrastructure Setup` | 47 | Toolchain bring-up, build integration, and runtime wiring were still missing in several papers. |
| `Dataset and Model Acquisition` | 43 | Required pretrained models and benchmark corpora were not always available in the run environment. |
| `Logging, Analysis & Presentation` | 28 | Diagnostic traces, memory snapshots, and presentation artifacts were often not regenerated. |
| `Data Processing & Preparation` | 27 | Trace generation and preprocessing pipelines were left partially unverified. |

In practice, this means the harness struggled most on tasks that require complete experimental reproduction rather than isolated code edits: large benchmark sweeps, hardware-sensitive profiling, end-to-end result regeneration, and full artifact publication.

### Codex Root Causes

Codex's full run stopped with `replication_runtime_failure` on `13/20` papers, `reproduction_not_verified_within_budget` on `4/20`, and `controller_iteration_failure` on `3/20`. Its dominant failure categories were:

| Root issue | Count | What it blocked |
| --- | ---: | --- |
| `missing_result_artifact` | 1231 | The implementation often did not emit the JSON/CSV/log artifacts that the leaf verifiers needed. |
| `missing_per_leaf_test` | 1056 | Many rubric leaves had no executed targeted verifier, so the harness could not convert partial progress into verified closure. |
| `broad_leaf_unverifiable` | 668 | High-level claims were too broad to mark passed without more specific evidence or narrower artifacts. |
| `verification_gap` | 294 | Some code paths ran, but the produced evidence did not line up with the rubric's required measurement. |
| `reproduction_runtime_failure` | 14 | Entire paper runs failed before enough artifacts were produced to verify claims. |

The main Codex pattern was not "wrong numbers" so much as "did not get far enough into artifact production." The worst papers by implementable baseline, such as `prefill-as-a-service`, `asynctls`, `duetserve`, `fp16-equivalence`, and `FOCUS_autokernel`, were dominated by missing result artifacts plus missing per-leaf tests, which means the backend often failed before the benchmarking and verification loop was complete.
The linked `prefill-as-a-service` artifacts are representative: the paper status records a `codex iteration exceeded 180s timeout`, the stop diagnosis records `replication_runtime_failure`, and the failure context shows `reproduction_exit_code: 2` with zero reproduction files produced.

### Claude Code Root Causes

Claude Code's full run more often reached real verification work, but still stopped with `reproduction_not_verified_within_budget` on `13/20` papers, `replication_runtime_failure` on `3/20`, `controller_iteration_failure` on `3/20`, and one paper with no terminal diagnosis recorded. Its dominant failure categories were:

| Root issue | Count | What it blocked |
| --- | ---: | --- |
| `missing_per_leaf_test` | 1233 | Like Codex, Claude often lacked a verifier for the exact remaining rubric leaf. |
| `missing_result_artifact` | 943 | Many runs produced partial outputs but still missed the exact artifact a verifier expected. |
| `broad_leaf_unverifiable` | 661 | Broad paper claims could not be closed without narrower evidence. |
| `verification_gap` | 294 | Evidence existed, but not in the form or measurement contract the rubric required. |
| `numeric_mismatch` | 73 | Claude more often got to measured outputs, but those outputs missed target ranges or reported paper values. |
| `reproduction_runtime_failure` | 9 | A smaller set of papers still failed at runtime before verification completed. |

The main Claude pattern was "got further, but still could not finish the proof." Compared with Codex, Claude converted more work into published artifacts and verified leaves, but many remaining failures were still benchmark-heavy tasks where numeric outputs, exact metric tolerances, or missing targeted verifiers prevented closure.
The linked `contiguouskv` artifacts show that pattern directly: the run finished cleanly at the process level, the stop diagnosis is `reproduction_not_verified_within_budget`, and the failure context shows a successful reproduction exit code with many files produced but open leaves still remaining.

## Representative Blockers By Task Type

### Benchmarking Claims

These were the single largest unresolved class for both backends. Typical misses were:

- LongBench and RULER score reproduction for named pretrained models.
- End-to-end latency and throughput claims over long-context sweeps.
- Kernel-level speedup claims against FA, DS, or Quest baselines.
- Reported headline table and figure values that required exact numeric agreement.

Short root cause:
The harness usually needed full benchmark outputs plus targeted per-leaf verifiers, and many papers produced neither the complete metric bundle nor the exact artifact schema those verifiers expected.

### Method Implementation Claims

These misses usually involved:

- Offloading implementations.
- Profiler and telemetry capture.
- Kernel variants and operator implementations.
- Scheduler/simulator logic that had to be exercised under paper-specific workloads.

Short root cause:
The backend frequently wrote partial implementation code but did not finish the execution path needed to demonstrate the method under the rubric's expected conditions.

### Experimental Setup Claims

These misses usually involved:

- Cluster and node configuration parsing.
- Model/hardware matrix reconstruction.
- Dataset preparation and workload trace generation.
- Reproducible environment wiring across heterogeneous hardware assumptions.

Short root cause:
Many papers assumed assets or hardware combinations outside the exact run environment, so setup tasks were left incomplete or only partially represented.

### Environment-Dependent Claims

These were not the main reason implementable closure stayed low, but they explain much of the residual total-task gap:

- `requires_hardware: nvidia-a100`
- `requires_hardware: nvidia-h200`
- `requires_hardware: google-tpu-v7`
- `requires_pretrained` model fetches across Qwen, Llama, Mistral, Gemma, and GPT-2 families

Short root cause:
The benchmark includes many leaves that depend on unavailable hardware or heavyweight pretrained assets, so those tasks were skipped or remained unverifiable even when code structure existed.

## Bottom Line

Unified Harness V2 did produce a cleaner same-set comparison than prior mixed-source snapshots, but neither backend was close to exhausting the implementable claim space. The unresolved work was dominated by benchmark execution and verification closure rather than by a single missing primitive. Codex most often failed before producing enough evidence; Claude Code more often produced partial evidence and then stalled on verifier coverage, exact artifact requirements, or numeric mismatches.
