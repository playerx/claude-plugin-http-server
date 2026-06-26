#!/usr/bin/env bun
/**
 * Forward a Claude Code hook payload to the fakechat server's /event endpoint,
 * which turns it into a tool / event / status line in the web UI.
 *
 * Registered per-event in hooks/hooks.json. The raw hook JSON arrives on stdin
 * and is passed through untouched — server.ts (handleHook) does the shaping.
 *
 * Failures are swallowed and nothing is written to stdout: a stopped server or
 * a network blip must never disrupt the session or be mistaken for a PreToolUse
 * permission decision.
 */
const PORT = process.env.FAKECHAT_PORT ?? '8787'
try {
  const body = await Bun.stdin.text()
  await fetch(`http://127.0.0.1:${PORT}/event`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
    signal: AbortSignal.timeout(500),
  })
} catch {}
