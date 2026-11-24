#!/usr/bin/env bash
# scripts/audit_wfx_loot.sh (v1.3.0 — Web Simulator Edition)
# Enforces zero .ci-*.sh scripts, zero npm lifecycle hooks in package.json,
# dependabot cooldown >= 14 days, permissions: contents: read, persist-credentials: false,
# and 40-char SHA action pinning.
set -euo pipefail

REPO_DIR="${1:-.}"
cd "${REPO_DIR}"

echo "=== [1/4] Scanning Git History for wfx-loot IOCs ==="
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  SUS_BRANCHES="$(git branch -a 2>/dev/null | grep -E 'wfx-docs|ci-check-[0-9]{4}|chore/[a-z0-9]{8}' || true)"
  if [[ -n "${SUS_BRANCHES}" ]]; then
    echo "[CRIMSON SPEEDO ALERT] Suspicious branches: ${SUS_BRANCHES}" >&2
    exit 251
  fi
  SUS_COMMITS="$(git log --all --since='2026-10-24' --oneline \
    --grep='docs: dependency audit notes' \
    --grep='ci: refresh build cache' \
    --grep='chore: add ci helper' \
    --grep='chore: add dependency audit workflow' \
    --grep='ci: restore' \
    --grep='ci: cleanup' 2>/dev/null || true)"
  if [[ -n "${SUS_COMMITS}" ]]; then
    echo "[CRIMSON SPEEDO ALERT] Sandwich commits: ${SUS_COMMITS}" >&2
    exit 251
  fi
fi
echo "  [OK] Zero wfx-loot branches or sandwich commits."

echo "=== [2/4] Auditing Hidden Scripts & package.json Lifecycle Hooks ==="
ROGUE_SCRIPTS="$(find . -maxdepth 3 -not -path './.git*' -not -path './node_modules*' \( -name '.ci-*.sh' -o -name '.DS_Store' -o -name 'Thumbs.db' \) || true)"
if [[ -n "${ROGUE_SCRIPTS}" ]]; then
  echo "[CRIMSON SPEEDO ALERT] Unauthorized hidden script/junk: ${ROGUE_SCRIPTS}" >&2
  exit 251
fi

python3 - "package.json" << 'PYPKG'
import json, sys
FORBIDDEN = {
    "preinstall", "install", "postinstall", "preuninstall", "uninstall",
    "postuninstall", "prepare", "prepublish", "prepublishOnly", "prepack", "postpack"
}
data = json.load(open(sys.argv[1], encoding="utf-8"))
scripts = data.get("scripts", {})
bad = sorted(set(scripts.keys()) & FORBIDDEN)
if bad:
    print(f"[CRIMSON SPEEDO ALERT] Forbidden package.json lifecycle hooks: {bad}", file=sys.stderr)
    sys.exit(251)
print(f"  [OK] package.json scripts={sorted(scripts.keys())} (0 lifecycle hooks).")
PYPKG

echo "=== [3/4] Auditing GitHub Actions SHA Pinning, Read-Only Scope & Dependabot >= 14d ==="
for wf in .github/workflows/*.yml .github/workflows/*.yaml; do
  [[ -e "${wf}" ]] || continue
  if ! grep -Eq '^permissions:[[:space:]]*$' "${wf}" || ! grep -Eq '^[[:space:]]+contents:[[:space:]]*read[[:space:]]*$' "${wf}"; then
    echo "[CRIMSON SPEEDO ALERT] ${wf} lacks permissions: contents: read" >&2
    exit 251
  fi
  if ! grep -Eq 'persist-credentials:[[:space:]]*false' "${wf}"; then
    echo "[CRIMSON SPEEDO ALERT] ${wf} lacks persist-credentials: false" >&2
    exit 251
  fi
  if ! grep -Eq -- '--ignore-scripts' "${wf}"; then
    echo "[CRIMSON SPEEDO ALERT] ${wf} must enforce --ignore-scripts on npm install/ci" >&2
    exit 251
  fi
  UNPINNED="$(grep -E '^[[:space:]-]*uses:[[:space:]]*' "${wf}" | grep -Ev '@[0-9a-f]{40}([[:space:]]|$|#)' || true)"
  if [[ -n "${UNPINNED}" ]]; then
    echo "[CRIMSON SPEEDO ALERT] Unpinned action in ${wf}: ${UNPINNED}" >&2
    exit 251
  fi
  echo "  [OK] ${wf}: contents:read + persist-credentials:false + --ignore-scripts + 40-char SHA pins."
done

python3 - ".github/dependabot.yml" << 'PYDEP'
import re, sys
txt = open(sys.argv[1], encoding="utf-8").read()
ecosystems = re.findall(r'package-ecosystem:\s*["\']?([A-Za-z0-9_-]+)', txt)
cooldowns = [int(x) for x in re.findall(r'default-days:\s*(\d+)', txt)]
if not ecosystems or len(cooldowns) < len(ecosystems) or any(d < 14 for d in cooldowns):
    print(f"[CRIMSON SPEEDO ALERT] dependabot cooldowns {cooldowns} must cover all {len(ecosystems)} ecosystems with >= 14 days", file=sys.stderr)
    sys.exit(251)
print(f"  [OK] .github/dependabot.yml: ecosystems={ecosystems}, cooldown default-days={cooldowns} (>= 14 days).")
PYDEP

echo "=== [4/4] Waystation Web Simulator Hygiene Clean (S_runner = 0, CODE_SHOKUNIN_UNLATCHED = 255) ==="
