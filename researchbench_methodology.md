# ResearchBench Methodology

ResearchBench evaluates code agents on fixed research-reproduction tasks with shared harness logic.

## Frozen Task Definition

Each benchmark paper is frozen into three parts:

- `inputs/`: immutable paper-specific context used to reconstruct a fresh runnable workdir
- `rubric/rubric.json`: the canonical fixed grading target
- `contracts/verification_contracts.json`: the canonical machine-checkable verification contract for measurable leaves

The benchmark does not regenerate rubrics during comparison runs.

## Named Benchmark Sets

Frozen tasks live under named roots such as `data/frozen_benchmarks/researchbench_inference_gate3/`.

Each set manifest records:
- `benchmark_name`
- theme
- hardware target
- paper slug list
- per-paper source path, title, rubric hash, and contracts hash

This keeps the 3-paper gate set intact while allowing a future `researchbench_inference20_h100` set to coexist.

## Run Procedure

For every benchmark run:

1. Reconstruct a fresh workdir from frozen `inputs/`.
2. Copy the canonical `rubric.json` and `verification_contracts.json` into that workdir.
3. Run the shared benchmark harness controller.
4. Execute each paper as an isolated subprocess so one stuck paper cannot invalidate the whole set run.
5. Persist a terminal per-paper status artifact and update the set-level summary incrementally after each paper.
6. Resume incomplete set runs from completed paper statuses rather than rerunning the entire set.
7. Inside each paper controller, keep target-slice selection, prompt structure, reroute logic, grading, and stop conditions fixed across backends.
8. Invoke only the backend/model-specific adapter at the final agent-execution step.
9. Grade the resulting workdir against the frozen rubric.
10. Record per-paper and set-level summaries.

## Validation And Iteration Gates

ResearchBench requires empirical validation before a harness change or set expansion is treated as complete.

### Harness gate

After any harness-affecting change:

1. Rerun the full `researchbench_inference_gate3` set for `codex / gpt-5-codex`.
2. Rerun the same set for `claude-code / claude-opus-4-7`.
3. Inspect the completed summaries and per-paper artifacts, not just the exit code.
4. Compare the new results against the prior baseline for both models.

The harness is only considered improved if the fresh gate runs show that:

- Codex no longer dies for trivial orchestration reasons such as missing `reproduce.sh`, missing result artifacts, or invalid handoff artifacts.
- Codex coverage and failure modes move in a diagnostically meaningful direction.
- Claude does not show a material unexplained deterioration in feasible closure or a shift toward earlier-stage harness failures.

If those checks fail, the harness remains in iteration. The correct next step is to debug, rerun, and re-inspect, not to publish a claim that the harness is better.

### 20-paper expansion gate

The future `researchbench_inference20_h100` set is only considered real when all of the following are true:

1. Each selected paper has local assets, a rubric, tests, contracts, and an initial feasibility review.
2. The set freezes successfully into a named benchmark root.
3. Both backends complete benchmark runs on that same frozen 20-paper set.
4. The resulting per-paper outputs are reviewed for reasonableness, including feasible closure, failure categories, and artifact quality.
5. Obvious onboarding mistakes or nonsensical results have been iterated on and rerun.

In other words, adding 20 papers is not just a file-management task. It includes running the benchmark, inspecting outcomes, and iterating until the results are credible enough to compare.

## What Varies And What Stays Fixed

Fixed across backends:
- evaluation papers within the named set
- rubric hashes
- contracts hashes
- workdir reconstruction
- prompt-building path
- iteration controller
- reroute and value-delta policy
- grading logic
- required artifacts such as `implementation_v1/reproduce.sh`, `implementation_v1/results/`, and `implementation_v1/execution_plan.json`

Variable across backends:
- execution backend (`codex`, `claude-code`)
- declared execution model
- resulting implementation code, results, and coverage

## Primary Metrics

ResearchBench tracks:

- `closed_headline_count`
- `remaining_headline_count`
- `implementable_claim_baseline_total`
- feasible closure percentage: `closed_headline_count / implementable_claim_baseline_total`
- `total_implemented_pct`
- `possible_pct`
- status counts:
  - `verified_pass`
  - `verified_fail`
  - `unverified`
  - `skipped-environment`
- aggregate failure-category and owner-layer counts
- deltas versus the previous run of the same backend/model pair

## Published Artifacts

For each backend/model run, ResearchBench publishes:

- the set-level `BENCHMARK_RUN_SUMMARY.json`
- the per-paper `PAPER_RUN_STATUS.json`
- the paper-level `RUN_SUMMARY.json`
- the reconstructed `implementation_v1/`
- `implementation_v1/results/`
- `implementation_v1/execution_plan.json`
- grading output
- a generated feasible-closure comparison chart for the benchmark set

The goal is to make every published result inspectable and to ensure the comparison measures model differences under otherwise static information and orchestration.
