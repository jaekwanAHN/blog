---
description: 원격에 PR이 생성된 브랜치와 그 worktree를 로컬에서 정리한다
allowed-tools: Bash(git branch:*), Bash(git worktree:*), Bash(git fetch:*), Bash(git switch:*), Bash(git status:*), Bash(gh pr list:*), Bash(gh pr view:*)
---

원격에 이미 **PR이 생성된** 로컬 브랜치와, 거기에 딸린 worktree를 안전하게 정리한다.
로컬 사본만 지우며, 원격 브랜치나 PR 자체는 건드리지 않는다.

## 절차

1. **현황 수집**
   - `git fetch origin --prune` — 원격 기준 최신화 + 사라진 원격 추적 정리
   - `git worktree list` — 등록된 worktree 목록
   - `git branch -vv` — 로컬 브랜치와 추적 상태

2. **PR 여부 판정** — 각 로컬 브랜치에 대해 원격 PR이 있는지 확인한다.
   - `gh pr list --head <브랜치> --state all --json number,state,url`
   - PR이 하나라도 있으면(open/merged/closed 무관) "정리 후보"로 분류한다.
     사용자가 특정 상태만 원하면(예: merged 만) 그 조건에 맞춘다.

3. **삭제 대상 확정 및 확인**
   - 다음은 후보에서 **제외**한다:
     - 현재 체크아웃된 브랜치(먼저 다른 브랜치로 이동해야 지울 수 있음)
     - `main` 등 기본 브랜치
   - 삭제할 브랜치 / 제거할 worktree 목록을 표로 정리해 사용자에게 보여주고
     **명시적 확인을 받은 뒤에만** 실제 삭제를 진행한다. (되돌리기 어려운 작업)

4. **삭제 실행** (확인 후) — worktree를 먼저, 브랜치를 나중에 제거한다.
   - worktree 제거: `git worktree remove <경로>`
     (미커밋 변경으로 거부되면 사용자에게 알린다. `--force`는 사용자가 명시적으로 원할 때만.)
   - 브랜치 삭제: `git branch -d <브랜치>`
     (`-d`가 "not fully merged"로 거부하면, 원격에 PR/브랜치가 있어 안전함을 설명하고
      사용자 동의를 받은 뒤에만 `git branch -D`로 강제 삭제한다.)

5. **결과 보고** — 삭제한 브랜치/worktree, 건너뛴 항목과 그 이유를 정리해 보고한다.

## 주의
- 원격 브랜치(`git push origin --delete`)나 PR은 이 커맨드에서 절대 건드리지 않는다.
- 현재 이 저장소의 worktree는 `.claude/worktrees/` 아래에 위치한다.
