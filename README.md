# Guten Sites

Separate Next.js/React/MUI site renderer, with routes /<site_name>/<section_name>/<page_name>. The renderer reads published content through Guten Crust. Portal edits become visible here only after Publish. Authentication/authorization, custom-domain routing, and S3 delivery remain deployment work.

## Local development

From the sibling coordination repository:

```bash
cd ../guten
make status
make run SERVICE=sites
make check SERVICE=sites
```

Sites uses port **3000**. The existing Node dependencies must be installed first. Use the check and build commands to validate changes before deployment.

Both HTTP clients share `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:8000/api`). The older `NEXT_PUBLIC_GUTEN_CRUST_URL` remains a fallback for compatibility; prefer the canonical setting in `.env.example`. Public settings are embedded during Next.js builds and must never contain secrets. Local `.env` files stay outside Git. `/health` is a process liveness endpoint. The unused token interceptor has been removed; authentication remains a separate deployment task.

## Content and media

Page text and image references live in PostgreSQL. Actual local images live under public/assets, which is ignored by Git and must be backed up separately. Preserve the existing /assets/... paths. The root page asks readers to open their publication’s website address.

See [local operations](../guten/README.md), [storage and proposed S3 delivery](../guten/docs/storage-and-git.md), and [database recovery](../guten-datalake/docs/psql/how-to-backup-psql.md).

## Project structure

```text
src/app/[site_name]/ — site/section landing routes and page renderer
src/components/ — landing redirect
src/lib/ — clients and theme
public/assets/ — ignored content media
```

See [per-site publishing](../guten-datalake/docs/publishing.md) for the editor workflow, API, migration, and initial publication seeding. Portal/View Draft reads draft; Guten Sites reads published content only.

Cross-service browser acceptance tests live in the coordination repository: [testing guide](../guten/docs/testing.md).

## Containers

The Dockerfile and .dockerignore package this service without local secrets, dumps, installed dependencies or content media. Build/start it using the sibling coordination repository’s [Docker Compose guide](../guten/docs/docker.md). The container rehearsal uses a separate empty database and alternate localhost ports.

See [root pages and planned domain routing](../guten/docs/domain-routing.md) for the Portal home and public site entry points.
