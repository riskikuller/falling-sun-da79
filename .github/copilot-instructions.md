# Repository instructions

## Project

- This is a TypeScript/React application deployed as a Cloudflare Worker.
- Client code lives in `src/client`, Worker code in `src/server`, and shared types in `src/shared.ts`.
- Technical design notes live in `docs`.

## Working agreement

- Install dependencies with `npm ci`.
- Run `npm run check` before finishing any code change. It type-checks both TypeScript projects and performs a Wrangler dry-run deployment.
- Do not claim that tests passed unless the exact command was executed successfully.
- Keep browser-only APIs in the client and Cloudflare Worker APIs in the server.
- Preserve strict TypeScript typing; avoid `any` unless an external API makes it unavoidable and the reason is documented.
- Never commit credentials, tokens, `.dev.vars`, or generated deployment output.
- For documentation-only changes, verify formatting and links manually and state that no runtime tests were required.

## Pull requests

- Summarize user-visible behavior and implementation details separately.
- List every validation command and its result.
- Keep changes scoped to the assigned issue; do not perform unrelated refactors.
