# Security configuration and credential rotation

Copy `.env.example` to `.env` and `client/.env.example` to `client/.env` for local development. Configure deployment secrets through the hosting platform. Set a newly generated JWT secret with at least 32 bytes before starting the server. Never put credentials in React environment variables: they are exposed in the browser bundle.

The MongoDB credentials, JWT signing secret, and New Relic license key previously committed to this repository must be treated as compromised. Removing files from the current version does not remove them from Git history or existing copies.

Before deployment:

- Rotate the database password and revoke the old credentials through the database provider.
- Rotate the New Relic license key and revoke the old key through New Relic.
- Set a fresh JWT signing secret on every application instance. Replacing it invalidates all existing tokens and requires users to sign in again.
- Audit existing users for unauthorized administrator roles and review database/provider access logs.
- Resolve any duplicate email addresses in existing data before creating the unique email index; confirm that the index exists before reopening registration.

The diagnostic `/ping`, `/login-test`, and `/login-test-2` endpoints have been removed. `/greet` returns plain text. Public registration always assigns role 0; administrator access must be provisioned through a trusted administrative process.

Run `npm test` for the security regression suite. The tests mock database operations and do not require production credentials or a live database.
