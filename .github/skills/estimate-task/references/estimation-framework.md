# Task Estimation Framework

## Default baseline — calibrate with your own historical data for best results

*A scoring model for software development tasks — works across languages, frameworks, and domains. Produces calibrated three-point estimates (optimistic / likely / pessimistic).*

---

## How to Use This Document

Provide this document as context to an AI assistant alongside a **task description** (from a work tracking tool, email, or verbal brief). The AI will:

1. **Ask clarifying questions** before scoring (see protocol below)
2. Score the task on 6 complexity dimensions
3. Map the composite score to a calibrated hour range
4. Apply relevant adjustments (project, lead, keywords)
5. Return a **three-point estimate** (optimistic / likely / pessimistic)

**Prompt template:**
> Using the estimation framework below, analyze this task and provide an estimate:
> 
> **Project:** [project name]
> **Lead/PM:** [name]
> **Developer familiarity with this codebase:** [high/medium/low/first-time]
> **Task description:** [paste description]

### Clarifying Questions Protocol (MANDATORY)

**Before scoring any task, the AI MUST ask clarifying questions.** Validation showed that interactive estimation (92% in-range) dramatically outperforms autonomous estimation (67% in-range) because critical context is often missing from task descriptions.

**Always ask these if not already clear from the description:**

1. **Project & Familiarity:** "Which project/codebase is this in, and how familiar are you with it?"
2. **System topology:** "Is this within a single service/system, or does it span multiple?" *(cross-system integration is 3-4× harder)*
3. **Scope boundaries:** "Does this apply to multiple entities, platforms, or environments?" *(scope trap detection)*
4. **Own vs third-party code:** "Are we modifying our own code or patching third-party / framework code?" *(third-party code needs TechComplexity +1)*
5. **Description completeness:** "Is this the full spec, or is there additional context in emails, meetings, or diagrams?" *(anti-pattern #9 detection)*

**Additionally, ask if any of these red flags are present:**
- Vague description + lead who tends to assign broad-scope tasks → likely larger than it reads
- Multiple distinct deliverables mentioned → confirm count
- Testing only possible in production or staging → adds dependency overhead
- External system or API dependencies → clarify availability and documentation quality

**After receiving answers, proceed with scoring. If the developer says "just estimate it", provide the estimate but flag which assumptions you made and their risk.**

### Estimation Principles
- **Anchor to the median, not the mean.** Most tasks are smaller than the mean suggests — outliers skew upward.
- **Familiarity dominates.** In well-known codebases, effort drops ~50% vs early work. Always ask: "Have I done something similar here before?"
- **Score conservatively.** When in doubt between two scores, pick the lower one. The framework already accounts for upside risk through asymmetric bands.
- **Keywords inform, they don't dictate.** Don't let a single keyword override the full scoring.

---

## 1. Complexity Scoring Model

Score each dimension from 1 (minimal) to 5 (maximum):

### Dimension 1: Scope
*How many components/modules are touched?*

| Score | Description | Examples |
|-------|------------|---------|
| 1 | Single field, property, or config change | Add a column, change a label, update a config value |
| 2 | Single component modification | New UI element, add validation to one module |
| 3 | Multiple related components (2–4) | New feature touching model + view + controller |
| 4 | Cross-functional feature (5+ components) | Workflow spanning multiple services or layers |
| 5 | New module or major subsystem | Full module, data migration suite, new service |

**Scope scoring trap:** When a task applies the same change across **multiple targets** (e.g., both web AND mobile, both create AND edit endpoints, both staging AND production), score Scope **one level higher** than the individual change suggests. The per-target effort for testing, edge cases, and subtle differences adds up.

### Dimension 2: Uncertainty
*How clearly defined is the requirement?*

| Score | Description | Examples |
|-------|------------|---------|
| 1 | Crystal clear spec with test criteria | Templated task, exact field mapping provided |
| 2 | Well described, minor clarification needed | Detailed ticket with clear acceptance criteria |
| 3 | Goal is clear, approach needs investigation | "Make X work like Y" without implementation details |
| 4 | Vague requirement, needs discovery | Customer email with rough idea, verbal request |
| 5 | Exploratory / unknown scope | "Debug this intermittent issue", "Investigate feasibility" |

### Dimension 3: Technical Complexity
*How difficult is the implementation?*

| Score | Description | Examples |
|-------|------------|---------|
| 1 | Simple configuration or property change | Feature flags, UI text, simple field additions |
| 2 | Straightforward code, known patterns | CRUD operations, simple validations, standard UI components |
| 3 | Moderate logic, data transformations | Reports, ETL scripts, business rule engines |
| 4 | Complex algorithms, multi-system operations | Data sync pipelines, complex query optimization |
| 5 | Architecture-level, migrations, deep integration | Major version upgrades, system-to-system integration, new infrastructure |

### Dimension 4: Dependencies
*What external factors affect completion?*

| Score | Description | Examples |
|-------|------------|---------|
| 1 | Fully standalone, no external input needed | Internal tooling, isolated fix |
| 2 | Needs minor input (one question to PM/lead) | Clarification on a field mapping or requirement |
| 3 | Depends on external testing or data | Staging environment needed, data validation required |
| 4 | Multi-party coordination | Integration with external system, shared branches, other teams |
| 5 | Blocked by external deliverables or infrastructure | Waiting on third-party API, environment provisioning, access grants |

### Dimension 5: Testing & Validation
*How much testing/QA is required?*

| Score | Description | Examples |
|-------|------------|---------|
| 1 | Quick visual/smoke test | UI renders correctly, config takes effect |
| 2 | Targeted functional test | Feature works as described in happy path |
| 3 | Multi-scenario testing | Multiple data paths, edge cases, input variations |
| 4 | Regression testing + stakeholder validation | Changes may affect existing logic, needs sign-off |
| 5 | Full system test / go-live validation | Migrations, deployments, end-to-end verification |

### Dimension 6: Familiarity (strongest predictor)
*How well do you know this codebase and domain?*

| Score | Description | Impact |
|-------|------------|--------|
| 1 | Expert — built or maintained this code extensively | Effort drops ~50% vs unfamiliar |
| 2 | Experienced — worked on this project multiple times | Comfortable navigating, minor discovery needed |
| 3 | Moderate — done a few tasks here, know the basics | Some exploration required for each task |
| 4 | Low — first few tasks in this codebase | Expect ~30% overhead for orientation and code discovery |
| 5 | None — brand new project, never seen the code | Expect 50-80% overhead for orientation, pattern discovery, and environment setup |

*Familiarity is consistently the dominant predictor of effort. In calibration data, effort dropped 59-74% from early to later tasks within the same project.*

---

## 2. Score-to-Hours Mapping

### Composite Score Calculation
```
Composite = (Scope × 1.2) + (Uncertainty × 1.0) + (TechComplexity × 1.2) + (Dependencies × 0.7) + (Testing × 0.7) + (Familiarity × 1.2)
```
*Weights reflect calibration: Scope, Technical Complexity, and Familiarity are the strongest effort predictors. Dependencies and Testing contribute less to pure development time. Uncertainty is weighted neutrally.*

**Maximum possible: 30.0 | Minimum: 6.0**

### Hour Mapping (non-linear piecewise with asymmetric bands)

The mapping uses a **non-linear curve** that scales gently for small tasks but accelerates for complex ones. Bands are **asymmetric** — P80 is proportionally wider than P20 because complex tasks have more upside risk than downside.

| Composite | P20 (Optimistic) | P50 (Likely) | P80 (Pessimistic) | Category |
|-----------|------------------|-------------|-------------------|----------|
| 7 | 0.5h | 1h | 2h | Trivial |
| 8 | 0.5h | 1h | 2.5h | Trivial |
| 9 | 0.5h | 1.5h | 3h | Trivial |
| 10 | 0.5h | 1.5h | 3h | Trivial |
| 11 | 1h | 2h | 4.5h | Small |
| 12 | 1.5h | 3h | 6h | Small |
| 13 | 2h | 4h | 8h | Small |
| 14 | 2h | 4.5h | 10h | Small |
| 15 | 3h | 6.5h | 14h | Medium |
| 16 | 4h | 8.5h | 19h | Medium |
| 17 | 5h | 10.5h | 26h | Medium |
| 18 | 6h | 12.5h | 31h | Medium |
| 19 | 8h | 16.5h | 40h | Large |
| 20 | 10h | 20h | 50h | Large |
| 22 | 14h | 28.5h | 70h | Large |
| 24+ | 20h+ | 40h+ | 80h+ | XL |

**Underlying formula (for interpolation):**
```
Composite 6–10:   P50 = 0.15 × composite               (trivial: ~1–1.5h)
Composite 10–14:  P50 = 1.5 + 0.75 × (composite − 10)  (small: ~1.5–4.5h)
Composite 14–18:  P50 = 4.5 + 2.0 × (composite − 14)   (medium: ~4.5–12.5h)
Composite 18–22:  P50 = 12.5 + 4.0 × (composite − 18)  (large: ~12.5–28.5h)
Composite 22+:    P50 = 28.5 + 7.0 × (composite − 22)  (XL: accelerating)

Bands:
  Trivial/Small (≤14):  P20 = P50 × 0.45,  P80 = P50 × 2.0
  Medium (14–18):        P20 = P50 × 0.50,  P80 = P50 × 2.2
  Large+ (18+):          P20 = P50 × 0.50,  P80 = P50 × 2.5
```

*The non-linear mapping scales gently for small tasks but accelerates for complex ones. Bands are wider and asymmetric — honest about upside risk on complex work.*

### Non-Development Tasks
Tasks like conference attendance, placeholder time-tracking, or administrative work **cannot be estimated by this framework**. Flag them explicitly and estimate based on calendar time (e.g., "3-day conference = 24h").

### Irreducible Variance Warning
Even among tasks that look similar, effort has a **high coefficient of variation** (100%+ is typical in software). This means:
- A task scored as "Small" (P50 = 3-4h) will land at **1–12h** in 80% of cases
- **~10% of Small-looking tasks will exceed 12h** — triple the P50
- This isn't a flaw in the framework. It's the fundamental nature of software estimation.

**Practical guidance:** When a task falls in the Small-Medium range (composite 11-16), always communicate the **full P20-P80 range** to stakeholders — not just the P50. The likely estimate is your planning target; the pessimistic is your commitment.

---

## 3. Adjustment Factors

Apply these as **soft adjustments** (±15-25% max) to the base estimate. **Never let adjustments more than double or halve the base estimate.**

### Project Adjustments
*Based on project characteristics. Note: familiarity is already captured in Dimension 6, so these adjustments are smaller.*

| Project Type | Adjustment | Notes |
|-------------|-----------|-------|
| Primary/high-volume project | −10% | Well-known codebase, many prior tasks |
| Internal tools | −15% | Familiar patterns, full control |
| Small-scope client projects | −20% | Consistently small, well-scoped tasks |
| Upgrade-heavy / infrastructure projects | +25% | Complex infrastructure, less predictable |
| *New/unfamiliar project* | *Handled via Dimension 6 (Familiarity)* | *Don't double-count* |

### Lead/PM Adjustments
*These reflect task scoping tendencies, not effort. Cap at ±20%.*

| PM Style | Adjustment | Rationale |
|----------|-----------|-----------|
| Broad-scope / architectural lead | +15% to +20% | Tends to assign cross-functional or architecturally significant tasks |
| Balanced / average-scope lead | 0% | Standard scoping, no adjustment needed |
| Self-assigned tasks | −10% | Accurate self-scoping, knows own velocity |
| Well-scoping / targeted lead | −15% | Consistently delivers focused, well-defined task briefs |
| Small-fix / focused lead | −15% | Assigns targeted, isolated fixes |

### Keyword-Based Signals
*Use as directional hints, NOT multipliers. All values are medians.*

| Keyword/Pattern | Typical effort | vs Baseline | Interpretation |
|----------------|---------------|-------------|----------------|
| "import" / "export" / "migration" | Above baseline | ↑ | Data handling adds effort, but rarely extreme |
| "report" / "dashboard" | At baseline | → | Not inherently large; mean is inflated by outliers |
| "bug fix" / "correction" | Slightly above | → | Debugging adds mild overhead |
| "conversion" / "transformation" | Slightly above | → | Manageable with known patterns |
| "automation" / "scheduled job" | Slightly above | → | Automation logic is moderate |
| "integration" / "API" | At or below baseline | ↓ | Often efficient with known patterns |
| "extension" / "plugin" | Below baseline | ↓ | Incremental, low-risk |
| "config" / "settings" / "UI tweak" | Well below | ↓ | UI-only, surface-level changes |

---

## 4. Estimation Output Format

When producing an estimate, use this format:

```
## Task Estimate: [Task Title]

### Complexity Scoring
| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Scope | X/5 | [brief reason] |
| Uncertainty | X/5 | [brief reason] |
| Technical Complexity | X/5 | [brief reason] |
| Dependencies | X/5 | [brief reason] |
| Testing | X/5 | [brief reason] |
| Familiarity | X/5 | [brief reason] |

**Composite Score:** XX.X → [Category]

### Adjustments (capped at ±25%)
- Project: [±X%] — [reason]
- Lead/PM: [±X%] — [reason]
- Keyword signals: [directional note, not a multiplier]
- **Combined adjustment: [±X%]** (never exceed ±40% total)

### Estimate
| | Hours |
|---|------|
| **Optimistic (P20)** | Xh |
| **Likely (P50)** | Xh |
| **Pessimistic (P80)** | Xh |

### Confidence & Risks
- Confidence: [High/Medium/Low] — based on description clarity and familiarity
- [Key risk or assumption]
- [Similar historical task if applicable]
```

---

## 5. Task Archetypes

### Trivial (1–2h)
- Adding/exposing fields on existing UI
- Simple validation or label changes
- Config changes, property modifications
- Single-component fixes with clear instructions

### Small (3–5h)
- New UI component with supporting logic
- API endpoint extensions with known patterns
- Small report or dashboard modifications
- Well-defined bug fixes in familiar code

### Medium (6–10h)
- Multi-component features (model + UI + logic)
- Data synchronization between systems
- Status/workflow implementations with business rules
- Report building with moderate complexity
- Error handling improvements for existing features

### Large (11–20h)
- Data import/export pipelines
- Scheduling or planning features
- Module refactoring/modernization (tech debt cleanup)
- Multi-scenario features requiring stakeholder test cycles

### XL (20–50h)
- Major new features spanning multiple domains
- Third-party module installation + customization
- Complex multi-format output systems (labels, documents)
- Features spanning multiple functional areas or services

### XXL (50h+)
- Go-live support with hotfixes
- Major version upgrades or platform migrations
- Full module implementations from scratch
- Major architecture changes

---

## 6. Estimation Anti-Patterns

Lessons learned from calibration and validation:

1. **Don't let keywords override scoring.** Mean-based keyword signals inflate estimates (e.g., "report" might average 10h but the median is 4h). Always score dimensions first, use keywords as a sanity check only.

2. **Familiarity is king.** The biggest estimation errors occur on well-known codebases where familiarity isn't properly accounted for. If you've done 10+ tasks in a project, score Familiarity at 1.

3. **Lead/PM adjustments should be gentle (±15-20%).** Overly aggressive multipliers cause massive distortion. The scoping influence on effort is real but modest.

4. **Beware the "complex-sounding" description.** Tasks with intimidating names (architectural patterns, enterprise terminology) may resolve to a simple implementation. Read the *solution approach*, not just the problem statement.

5. **New entity/object creation pushes Scope up.** If a task requires creating a brand new data model, service, or module (not just extending), score Scope at least one level higher.

6. **Low familiarity × multiple deliverables = explosive effort.** When Familiarity score is high (4-5, meaning the codebase is unfamiliar) AND Scope is high (3+), the real effort will often land near P80 or beyond.

7. **Non-dev tasks break the model.** Conference attendance, placeholder tracking, administrative time — these simply can't be scored. Flag them and estimate based on calendar duration.

8. **Accept irreducible variance.** Even with perfect scoring, ~20-25% of tasks will fall outside P20-P80. This is **normal** — don't over-tune the model. Communicate ranges rather than point estimates.

9. **Vague descriptions = hidden icebergs.** When a task description is intentionally brief ("see attached diagram", "several fields needed"), scope usually lives outside the ticket — in emails, meetings, or someone's head. These tasks are systematically underestimated. **Rule of thumb:** If the description is under ~100 chars and the assigner tends toward broad-scope tasks, assume the task is at least Large (P50 ≥ 12h) regardless of scoring. Ask for a fuller brief before committing.

10. **Cross-system integration ≠ same-system integration.** Integration tasks between separate systems, services, or environments are 3-4× harder than within a single system. Data must survive serialization boundaries, debugging spans multiple systems, and APIs may be poorly documented. Always clarify which type before scoring.

11. **Multiple distinct deliverables = Scope +1.** When a task has 2+ independent pieces of work (e.g., "event handler + new API endpoint" or "data mapping + UI changes"), score Scope at least one higher than each individual piece suggests. Each deliverable carries its own testing and edge cases.

12. **Third-party / framework bug fixes land at P80, not P50.** Patching third-party or framework code (not your own) requires navigating unfamiliar internals. Discovery time is real even when the fix is clear. Score TechComplexity one level higher than the fix itself suggests.

---

## 7. Calibration

### About This Baseline

The piecewise curve and weights in this framework were calibrated from 170+ historical tasks by a single developer. **Your mileage will vary.** The scoring model and anti-patterns are broadly applicable, but the hour mapping will benefit from calibration against your own data.

### How to Calibrate

1. **Use the framework as-is** for your first 10-20 tasks
2. **Record actuals** in the tracker below after each task
3. **After 20+ tasks**, compare P50 estimates to actuals:
   - If >60% of tasks overshoot P50: your curve is too aggressive — reduce piecewise slopes by ~15%
   - If >60% of tasks undershoot P50: your curve is too conservative — increase slopes by ~15%
   - If <75% of tasks fall within P20-P80: re-examine whether dimension scoring or adjustments are off
4. **Re-run regression** on composite → actual hours to fit a new piecewise curve to your data

### Forward Validation Tracker

After completing each task, record results here. Review monthly for systematic drift.

```
| Date | Task Title | Project | Lead | P20 | P50 | P80 | Actual | In Range? | Notes |
|------|------------|---------|------|-----|-----|-----|--------|-----------|-------|
|      |            |         |      |     |     |     |        |           |       |
```

**What to track:**
- **Systematic bias:** If >3 consecutive tasks overrun P50, increase Uncertainty scoring by 1 across the board
- **New project patterns:** After 5+ tasks in a new project, add it to the Project Adjustments table (§3)
- **Lead calibration:** If a lead's tasks consistently land outside range, adjust their modifier by ±5%
- **Keyword discoveries:** If a new keyword appears in 3+ tasks with consistent effort, add it to the signals table

**When to recalibrate the piecewise curve:**
- After 20+ forward-validated tasks, re-run the composite→actual regression
- If MAPE exceeds 50% over a rolling 10-task window, investigate root cause before adjusting

---

*Framework based on piecewise non-linear mapping with asymmetric confidence bands.*
*Scoring model: 6 weighted dimensions · 12 anti-patterns · mandatory clarifying questions protocol.*
*Calibrate the hour mapping against your own historical data for best results.*
