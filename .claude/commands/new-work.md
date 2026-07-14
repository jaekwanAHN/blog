---
description: main 최신화 후 새 작업 브랜치를 분기한다
argument-hint: <새-브랜치-이름>
allowed-tools: Bash(git fetch:*), Bash(git switch:*), Bash(git status:*), Bash(git stash:*), Bash(git branch:*), Bash(git log:*)
---

`main`을 원격 기준으로 최신화한 뒤, 새 작업 브랜치를 분기한다.

## 인자
- 새 브랜치 이름: `$1`
  - 비어 있으면 사용자에게 브랜치 이름을 물어본 뒤 진행한다.

## 절차
아래 순서대로 진행하되, 각 단계에서 문제가 생기면 멈추고 사용자에게 상황을 보고한다.

1. **작업 트리 확인** — `git status --short`
   - 커밋되지 않은 변경이 있으면 그대로 브랜치를 분기하기 전에 사용자에게 알린다.
     stash 후 진행할지(`git stash push -u`), 아니면 먼저 커밋할지 물어본다.
     깨끗하면 다음 단계로 진행한다.

2. **원격 최신화** — `git fetch origin`
   - 원격의 최신 상태(특히 `origin/main`)를 가져온다.

3. **main 최신화** — 로컬 `main`을 `origin/main`으로 빠르게 맞춘다.
   - 다른 브랜치에 있어도 되도록 switch 없이 갱신한다:
     `git fetch origin main:main` 이 fast-forward로 가능하면 이를 사용하고,
     실패하면(로컬 main이 갈라진 경우) 사용자에게 알리고 멈춘다.

4. **새 브랜치 분기** — 항상 최신 `origin/main`을 기준으로 분기한다.
   - `git switch -c $1 origin/main`

5. **결과 보고** — 새 브랜치 이름, 어느 커밋에서 분기됐는지(`git log --oneline -1`),
   그리고 1단계에서 stash 했다면 그 사실을 함께 알린다.

## 주의
- 항상 로컬 현재 상태가 아니라 방금 fetch 한 `origin/main`을 기준으로 분기한다.
- push/커밋 등 되돌리기 어려운 작업은 이 커맨드에서 하지 않는다.
