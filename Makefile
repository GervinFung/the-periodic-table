.PHONY: build test
MAKEFLAGS += --silent

## telemetry
opt-out-telemetry:
	pnpm next telemetry disable

## generate
generate: generate-webmanifest generate-sitemap generate-schema

generate-webmanifest:
	pnpm vite-node script/site/webmanifest.ts

generate-sitemap:
	pnpm next-sitemap

generate-schema:
	pnpm vite-node script/seo/schema.ts

## deployment
deploy-staging: build-staging
	vercel

deploy-production: build-production
	vercel --prod

## .env
generate-environment-type-definition:
	pnpm vite-node script/env/type-def.ts

copy-env:
	cp config/.env.${environment} .env

copy-env-development:
	make copy-env environment="development"

copy-env-production:
	make copy-env environment="production"

copy-env-testing:
	make copy-env environment="testing"

clear-cache:
	rm -rf .next

start-development: copy-env-development clear-cache dev

start-testing: copy-env-testing clear-cache dev

start-production: copy-env-production clear-cache dev

## build
build-development: clear-cache copy-env-development build

build-production: clear-cache copy-env-production build generate

build-testing: clear-cache copy-env-testing build

build:
	pnpm next build

## start
start:
	pnpm next start $(arguments)

## dev
dev:
	pnpm next dev

## format
format-generate-config:
	pnpm prettier-config-generate

format:
	pnpm prettier --$(type) .

format-check:
	make format type=check

format-write:
	make format type=write

## lint
lint:
	pnpm eslint --ignore-path .gitignore --ext .mjs,.tsx,.ts --color && pnpm knip

## typecheck
typecheck:
	pnpm tsc -p tsconfig.json $(arguments) 

## test
test-type:
	pnpm vitest test/$(path)/**.test.ts $(arguments)

test-unit:
	make test-type path="unit" arguments="$(arguments)"

test-snapshot:
	rm -rf test/snapshot/generated-*.test.ts &&\
		pnpm vite-node script/test/snapshot.ts &&\
		make test-type path="snapshot" arguments="$(arguments)"

test: build-testing test-unit test-snapshot
