# Introduction

This is an example repo for testing an Expo app with Maestro (with full CI integration). By adding tags (`deploy`, `weekly`, `pr`) to your maestro tests, they will be automatically run at the right time.

With this setup, the app isn't rebuilt on each run. We only publish an expo update and useMaestro Cloud which makes for super fast E2E test runs (<5min).

For more info, see:
- [Slides of the talk](https://docs.google.com/presentation/d/1CaT6HvsXMtfMhTUK46jE-gdDXZboQ-arKJuMZ6Nc51g)
- Video of the talk (coming soon)
- Article (coming soon)

# Setup

## Start the app

- `yarn`
- `yarn start`

## E2E tests with maestro

- [Install Maestro](https://maestro.mobile.dev/getting-started/installing-maestro)
- [Login to Maestro Cloud](https://cloud.mobile.dev/getting-started/quickstart#id-2.-login-to-the-cli)
- run the tests locally with `maestro test .maestro`
- run the tests on maestro cloud with `yarn test:e2e:ci:ios --ios-update-id XXX` (similar for android)

# Possible improvements

- Reuse app binary on Maestro Cloud
    - https://github.com/mobile-dev-inc/action-maestro-cloud?tab=readme-ov-file#using-an-already-uploaded-app
    - https://cloud.mobile.dev/reference/reusing-app-binary#app-binary-id
- find a way to make it work when there are native changes on the PR (and it needs a new build)
    - use runtime version
    - use expo fingerprint
- cache Maestro in the CI
- add `openLink autoVerify: true`  https://maestro.mobile.dev/api-reference/commands/openlink#auto-verification-of-your-android-apps




