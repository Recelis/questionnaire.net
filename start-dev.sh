#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cleanup() {
  # Stop all child processes started by this script.
  kill 0 2>/dev/null || true
}

trap cleanup INT TERM EXIT

(
  cd "$ROOT_DIR/net/LifeTracker"
  dotnet run
) &

(
  cd "$ROOT_DIR/react-electron"
  npm run dev
) &

wait
