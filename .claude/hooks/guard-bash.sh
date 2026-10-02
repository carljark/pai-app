#!/usr/bin/env bash
# PreToolUse/Bash: bloquea commits y ejecución de tests/builds (ver AGENTS.md §1 y §6).
cmd=$(jq -r '.tool_input.command // ""')

deny() {
  jq -n --arg r "$1" '{hookSpecificOutput: {hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: $r}}'
  exit 0
}

if printf '%s' "$cmd" | grep -Eq '(^|[;&|[:space:]])git([[:space:]]+-[^[:space:]]+([[:space:]]+[^-[:space:]][^[:space:]]*)?)*[[:space:]]+commit([[:space:]]|$)'; then
  deny "AGENTS.md: no hagas commits. Deja los cambios locales; el usuario hará el commit."
fi

if printf '%s' "$cmd" | grep -Eq '(^|[;&|[:space:]])(npm[[:space:]]+(run[[:space:]]+)?(test|build|e2e)([:[:space:]]|$)|npm[[:space:]]+t([[:space:]]|$)|(npx[[:space:]]+)?ng[[:space:]]+(test|build)([[:space:]]|$)|(npx[[:space:]]+)?(vitest|cypress)([[:space:]]|$))'; then
  deny "AGENTS.md: no ejecutes tests ni builds. Indica al usuario el comando para que lo lance él."
fi

exit 0
