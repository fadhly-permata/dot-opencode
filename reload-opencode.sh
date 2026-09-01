#!/bin/bash
# reload-opencode.sh — hot-reload opencode config by relaunching the same session.
# opencode does not hot-reload rules/skills/commands, so we spawn a fresh opencode
# with the current session, take over the TTY, then kill the old process.
#
# Run:  bash .opencode/reload-opencode.sh
set -u

# Don't die if the old opencode SIGHUPs its children when it exits.
trap '' HUP

# Prefer the pid opencode hands us; fall back to our parent.
OLD_PID="${OPENCODE_PID:-$PPID}"

STORAGE_DIR="$HOME/.local/share/opencode/storage/session_diff"

# Most recently modified session file = the active session.
SID_FILE=$(ls -t "$STORAGE_DIR"/ses_*.json 2>/dev/null | head -1)
SID=""
if [ -n "$SID_FILE" ]; then
  SID=$(basename "$SID_FILE" .json)
  SID=${SID#ses_}
fi

# Controlling TTY of the running opencode (the one we live inside).
TTY=$(readlink "/proc/$OLD_PID/fd/0" 2>/dev/null)
[ -z "$TTY" ] && TTY=$(tty 2>/dev/null)
if [ -z "$TTY" ] || [ ! -c "$TTY" ]; then
  echo "ERR: cannot determine TTY — aborting to avoid unsafe kill." >&2
  exit 1
fi

BIN="${OPENCODE_BIN:-opencode}"

# Detach into a fresh session so we survive the old opencode's death,
# take over the TTY as our controlling terminal + foreground group,
# then exec a fresh opencode on the same session.
setsid bash -c '
  OLD="'"$OLD_PID"'"
  TTY="'"$TTY"'"
  SID="'"$SID"'"
  BIN="'"$BIN"'"

  # 1. kill the old opencode so the TTY is released by its session.
  kill -TERM "$OLD" 2>/dev/null
  for _ in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20; do
    kill -0 "$OLD" 2>/dev/null || break
    sleep 0.1
  done
  kill -KILL "$OLD" 2>/dev/null

  # 2. grab the TTY as our controlling terminal and become foreground.
  python3 - "$TTY" <<PY
import os, sys, fcntl, termios
tty = sys.argv[1]
fd = os.open(tty, os.O_RDWR)
try:
    fcntl.ioctl(fd, termios.TIOCSCTTY, 0)
except Exception:
    pass
os.tcsetpgrp(fd, os.getpgrp())
os.close(fd)
PY

  # 3. exec fresh opencode, inheriting the controlling TTY + foreground group.
  if [ -n "$SID" ]; then
    exec "$BIN" --session "$SID"
  else
    exec "$BIN" --continue
  fi
' <"$TTY" >"$TTY" 2>"$TTY"

# If we get here (setsid returned), the handoff failed — leave a trace.
echo "ERR: reload-opencode handoff did not take over the TTY." >&2
exit 1
