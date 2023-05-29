# Fetch Kaikki: client + types for Wiktionary data from Kaikki.org

## Overview

Fetch Kaikki is a simple TypeScript client + response types for Wiktionary data fetched from [Kaikki.org](https://kaikki.org). The data was generated with Tatu Ylonen's [wiktextract](https://github.com/tatuylonen/wiktextract).

The response type strcture (see `types.ts`) is based on [wiktextract's documentation](https://github.com/tatuylonen/wiktextract#format-of-the-extracted-word-entries), as well as personal observations and corrections. Feel free to suggest edits!

This client is used by my custom dictionary app [Dictus](https://github.com/vls9/dictus).

Note: as of now, you need to disable cross-origin restrictions to fetch Wiktionary data (from [Kaikki.org](https://kaikki.org)), since the website doesn't set `Access-Control-Allow-Origin`. A workaround is in development.
