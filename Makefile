SHELL := /bin/bash
define npm_install
	npm ci
endef

synth-network:
	shopt -s expand_aliases;
	$(call npm_install)
	STACK_NAME="network" cdktf synth;

deploy-network:
	STACK_NAME="network" cdktf deploy;