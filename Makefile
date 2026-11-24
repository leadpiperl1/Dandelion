PYTHON ?= python3
NPM ?= npm

.PHONY: verify build lint clean

verify:
	bash scripts/audit_wfx_loot.sh .
	$(PYTHON) scripts/verify_web_sim_invariants.py --seed 42
	@if [ -d node_modules ]; then \
		$(NPM) run lint && $(NPM) run build; \
	else \
		echo "[INFO] node_modules not installed locally; run 'npm install --ignore-scripts && make verify' for Vite build check."; \
	fi

lint:
	$(NPM) run lint

build:
	$(NPM) run build

clean:
	rm -rf dist
