# Releasing

This package is published to the public npm registry.

## First release

The first version must be published by an authenticated npm user because trusted publishing can only be configured after the package exists on npm.

1. Confirm the final package name is still available with `npm view <package-name>`.
2. Sign in with `npm login` and verify the account with `npm whoami`.
3. Run `npm run check` and `npm pack --dry-run`.
4. Publish with `npm publish --access public`.
5. Confirm the package can be installed in a clean React project.
6. Create the matching GitHub release and tag.

Do not commit an npm token or place one in documentation, examples, or shell history.

## Automated releases

After the first release, configure npm Trusted Publishing for:

- provider: GitHub Actions;
- GitHub user: `sob-hon`;
- repository: `react-smart-truncate`;
- workflow: `publish.yml`;
- allowed action: `npm publish`.

Trusted Publishing uses short-lived OIDC credentials and avoids storing a long-lived npm write token. Once configured, update the publish workflow to use npm 11.5.1 or newer and remove the `NPM_TOKEN` environment variable.

For each release:

1. Update the version according to semantic versioning.
2. Move the release notes in `CHANGELOG.md` from Unreleased to the version and date.
3. Open a pull request and require CI to pass.
4. Merge the pull request.
5. Publish a GitHub release whose tag matches the package version, for example `v0.1.0`.
6. Verify the npm package page, provenance, and clean-project installation.

Never reuse a published version number. Use a prerelease such as `0.2.0-beta.0` with the `next` dist-tag when testing a release candidate.
