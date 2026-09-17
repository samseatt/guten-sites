# Guten Sites

Separate Next.js/React/MUI site renderer, with routes /<site_name>/<section_name>/<page_name>. The current local MVP intentionally reads draft content through Guten Crust so portal edits appear immediately. A working publication boundary, authentication/authorization, custom-domain routing, and S3 delivery are not implemented.

## Local development

From the sibling coordination repository:

```bash
cd ../guten
make status
make run SERVICE=sites
make check SERVICE=sites
```

Sites uses port **3000**. The existing Node dependencies must be installed first. Use the check and build commands to validate changes before deployment.

The current clients use NEXT_PUBLIC_GUTEN_CRUST_URL (http://localhost:8000/api/guten) and NEXT_PUBLIC_API_BASE_URL (http://localhost:8000/api). Local .env files stay outside Git.

## Content and media

Page text and image references live in PostgreSQL. Actual local images live under public/assets, which is ignored by Git and must be backed up separately. Preserve the existing /assets/... paths. Small tracked SVGs outside that folder are application scaffolding still referenced by the root page.

See [local operations](../guten/README.md), [storage and proposed S3 delivery](../guten/docs/storage-and-git.md), and [database recovery](../guten-datalake/docs/psql/how-to-backup-psql.md).

## Project structure

```text
src/app/[site_name]/ — site/section landing routes and page renderer
src/components/ — landing redirect
src/lib/ — clients and theme
public/assets/ — ignored content media
```
