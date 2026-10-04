#!/usr/bin/env bash
# PreToolUse/Bash: bloquea operaciones git destructivas (ver AGENTS.md §1).
# Commits, tests y despliegues están permitidos: forman parte del flujo de cada tarea.
cmd=$(jq -r '.tool_input.command // ""')

deny() {
  jq -n --arg r "$1" '{hookSpecificOutput: {hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: $r}}'
  exit 0
}

git_cmd='(^|[;&|[:space:]])git([[:space:]]+-[^[:space:]]+([[:space:]]+[^-[:space:]][^[:space:]]*)?)*[[:space:]]+'

if printf '%s' "$cmd" | grep -Eq "${git_cmd}push([[:space:]].*)?[[:space:]](-f|--force|--force-with-lease)([=[:space:]]|$)"; then
  deny "AGENTS.md §1: nunca hagas push --force."
fi

if printf '%s' "$cmd" | grep -Eq "${git_cmd}push([[:space:]].*)?[[:space:]]\+[^[:space:]]"; then
  deny "AGENTS.md §1: nunca hagas push forzado (+refspec)."
fi

if printf '%s' "$cmd" | grep -Eq "${git_cmd}reset([[:space:]].*)?[[:space:]]--hard([[:space:]]|$)"; then
  deny "AGENTS.md §1: no uses reset --hard; revierte con un commit nuevo (git revert)."
fi

if printf '%s' "$cmd" | grep -Eq "${git_cmd}(clean[[:space:]].*-[a-zA-Z]*f|branch[[:space:]].*-D|checkout[[:space:]]+--[[:space:]]+\.|restore[[:space:]]+\.)"; then
  deny "AGENTS.md §1: operación git destructiva bloqueada (clean -f, branch -D, descartar todos los cambios)."
fi

exit 0
