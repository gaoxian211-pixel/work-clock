#!/bin/zsh

cd "/Users/huanggaoxian/Documents/打卡" || exit 1
export PATH="/Users/huanggaoxian/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/huanggaoxian/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH"
exec pnpm exec vite --host 0.0.0.0 --port 5173
