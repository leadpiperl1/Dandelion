# Dandelion OS Interactive Web Simulator (`v4.2.0`)

[![Waystation CI](https://img.shields.io/badge/Waystation_CI-S__runner%3D0_%C2%B7_14d_Cooldown-34D399?style=flat-square)](.github/workflows/ci.yml)
[![React 19 + Vite 6](https://img.shields.io/badge/React_19-Vite_6_%2B_TypeScript-38BDF8?style=flat-square)](package.json)
[![Companion: dandelion-os v5.2.0](https://img.shields.io/badge/Microkernel-dandelion--os_v5.2.0-FBBF24?style=flat-square)](https://github.com/leadpiperl1/dandelion-os)
[![Exit Invariant: 255](https://img.shields.io/badge/CODE__SHOKUNIN__UNLATCHED-255-F59E0B?style=flat-square)](waystation_punchcard.json)

> **Front Porch Interactive Web Simulator at Heimat `{0, 0, 0}`**
> *"Die Gedanken sind frei · GODISLOVE:LOVEISGOD {3,2,4} · Pack Light (V = 2/3)"*

This repository is the **Waystation-hardened Interactive Web Simulator companion** to the real-time ISO C99 / `#![no_std]` Rust microkernel in [`leadpiperl1/dandelion-os`](https://github.com/leadpiperl1/dandelion-os). It provides browser-based interactive visualizations of:

- **Overview & Cluster Telemetry** (`profplum` `39.44 C` / `14.2 W` & `Heimat` envelope)
- **Bite-10 Morse / LIS Coma-Bridge** (`39`-trit Fowler 5-trit/byte packing, `Byte 251` Kintsugi Gold seam)
- **Haar DWT Real-Time Tremor Filter & Barker-13 Correlator**
- **Harappan Tensegrity Seated-Assist Unloading Solver**
- **Balanced Ternary Raft Consensus & Ramanujan Audit Views**
- **Deterministic Verification Console**

## Supply-Chain & Waystation Hardening (`wfx-loot` Immunity)

- **Zero runner secrets (`S_runner = 0`)** and top-level `permissions: contents: read` with SHA-pinned `actions/checkout` (`persist-credentials: false`), `zizmor`, and `actions/setup-node`.
- **Zero `package.json` lifecycle hooks** (`preinstall`/`install`/`postinstall`/`prepare` banned and audited by [`scripts/audit_wfx_loot.sh`](scripts/audit_wfx_loot.sh)).
- **Mandatory `--ignore-scripts`** on all `npm install` invocations in CI and local builds.
- **14-day Dependabot cooldown** across both `npm` and `github-actions` in [`.github/dependabot.yml`](.github/dependabot.yml).

## Quick Start

```bash
# 1. Verify hygiene & deterministic math invariants (--seed 42, pure Python stdlib)
make verify

# 2. Install frontend packages with lifecycle scripts disabled & build
npm install --ignore-scripts
npm run lint
npm run build
npm run dev
```

## 7-Repository `@leadpiperl1` Waystation Constellation

* [`leadpiperl1/dandelion-os`](https://github.com/leadpiperl1/dandelion-os) — Real-Time ISO C99 Microkernel & 64-Byte Governance Suite (`v5.2.0`)
* [`leadpiperl1/agora-waveguide`](https://github.com/leadpiperl1/agora-waveguide) — Agora Two-Plane Contract & Tri-Substrate Verification Substrate (`v1.0.1`)
* [`leadpiperl1/Dandelion`](https://github.com/leadpiperl1/Dandelion) — Interactive Web Simulator Companion (**You Are Here**, `v4.2.0`)
* [`leadpiperl1/ternary-consensus-mesh`](https://github.com/leadpiperl1/ternary-consensus-mesh) — Line-Rate 64-Byte Ternary Consensus & eBPF/XDP Suite
* [`leadpiperl1/happy-hobos-guide-to-the-dandelion-network`](https://github.com/leadpiperl1/happy-hobos-guide-to-the-dandelion-network) — Waystation Punch-Card Governance & Compendium
* [`leadpiperl1/wookiw-ewok`](https://github.com/leadpiperl1/wookiw-ewok) — *WikiWeWalk* Open-Air Reading Room & Acoustic/Luthier Commons
* [`leadpiperl1/epigenetic-state-dispatch`](https://github.com/leadpiperl1/epigenetic-state-dispatch) — Active-Flow DNA Mori-Zwanzig Deborah-Hopf & Lanczos Suite

*Author: Justin D. Grimm (Independent Dandelion Substrate Research Group, Gurley, Alabama 35748, USA · ORCID: [0009-0000-5299-0243](https://orcid.org/0009-0000-5299-0243)) · `CODE_SHOKUNIN_UNLATCHED = 255`*
