.PHONY: test coverage lint format offline clean

test:
	PYTHONPATH=src python -m pytest -q

coverage:
	PYTHONPATH=src python -m pytest --cov=hvdc_openai_agent --cov-report=term-missing

lint:
	python -m ruff check src tests

format:
	python -m ruff format src tests

offline:
	PYTHONPATH=src python -m hvdc_openai_agent.agent_app BL-AUH-002 --offline --format brief

clean:
	rm -rf .pytest_cache .ruff_cache build dist *.egg-info src/**/__pycache__ tests/**/__pycache__
