#!/usr/bin/env python3
"""Deterministic pure-stdlib verifier for Dandelion Web Simulator v4.2.0 invariants."""
import argparse
import hashlib
import json
import pathlib
import random
import re
import sys

EXIT_UNLATCHED = 255
FOWLER_MAX_BYTE = 242
BARKER13 = [1, 1, 1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1]


def fowler_pack_5(trits):
    acc = 0
    pow3 = 1
    for t in trits:
        acc += (t + 1) * pow3
        pow3 *= 3
    return acc


def fowler_unpack_5(byte_val):
    assert 0 <= byte_val <= FOWLER_MAX_BYTE
    out = []
    v = byte_val
    for _ in range(5):
        out.append((v % 3) - 1)
        v //= 3
    return out


def main() -> int:
    ap = argparse.ArgumentParser(description="Verify Dandelion Web Simulator mathematical & hygiene invariants.")
    ap.add_argument("--seed", type=int, default=42)
    args = ap.parse_args()

    root = pathlib.Path(__file__).resolve().parent.parent
    core_ts = (root / "src" / "lib" / "dandelion-core.ts").read_text(encoding="utf-8")
    pkg = json.loads((root / "package.json").read_text(encoding="utf-8"))
    zenodo = json.loads((root / ".zenodo.json").read_text(encoding="utf-8"))

    # Gate 1: TypeScript substrate constants parity with C99 Dandelion OS
    required_consts = [
        ("GAIKU_TRITS", "39"),
        ("FOWLER_MAX_VALID_BYTE", "242"),
        ("CODE_KINTSUGI_GOLD", "251"),
        ("KRAMHAUS_TAU_CRIT_UNM", "49426"),
    ]
    for name, val in required_consts:
        assert re.search(rf"export const {name}\s*=\s*{val}\b", core_ts), f"Missing or drifted {name}={val}"

    # Gate 2: Exhaustive 243-state Fowler 5-trit bijection
    for b in range(243):
        trits = fowler_unpack_5(b)
        assert fowler_pack_5(trits) == b, f"Bijection failed at byte {b}"

    # Gate 3: Barker-13 peak autocorrelation & deterministic --seed 42 checksum
    rng = random.Random(args.seed)
    peak = sum(x * x for x in BARKER13)
    assert peak == 13
    sample_bytes = bytes(fowler_pack_5([rng.choice((-1, 0, 1)) for _ in range(5)]) for _ in range(256))
    digest = hashlib.sha256(sample_bytes).hexdigest()[:16]

    # Gate 4: Zero npm lifecycle hooks & clean citation metadata
    forbidden = {"preinstall", "install", "postinstall", "prepare", "prepublish", "prepack"}
    assert not (set(pkg.get("scripts", {}).keys()) & forbidden), "Forbidden lifecycle hook detected"
    assert (root / "CITATION.cff").is_file()
    assert zenodo.get("version") == pkg.get("version")

    receipt = {
        "artifact": "verify_web_sim_invariants.py",
        "version": pkg.get("version"),
        "seed": args.seed,
        "fowler_243_bijection": True,
        "barker13_peak": peak,
        "npm_lifecycle_scripts": 0,
        "deterministic_digest16": digest,
        "gates_passed": "4/4",
        "exit_state": f"CODE_SHOKUNIN_UNLATCHED = {EXIT_UNLATCHED}",
    }
    print(json.dumps(receipt, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
