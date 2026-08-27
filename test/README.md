# Editor e2e tests

End-to-end tests driving the extension in Chrome for Testing through the
Chrome DevTools Protocol (simple-cdp). The suite loads the unpacked extension,
opens the editor through the real `editor.open` background flow, and exercises
multi-page archive browsing, editing, saving (including deduplicated
archives), and the single-page regression path.

## Running

```sh
npm install
npm run install-test-browser
npm test
```

Chrome for Testing is required: branded Google Chrome (since ~v137) cannot
open the pages of extensions loaded with `--load-extension`. The binary is
searched in `test/.browser/`, then in `~/.cache/puppeteer/chrome/`; it can be
overridden with the `SF_CHROME_PATH` environment variable.

## Fixtures

The SFZ fixtures come from the `single-file-core` package
(`node_modules/single-file-core/test/fixtures/`). They are intentionally
frozen; see the README there before touching them.
