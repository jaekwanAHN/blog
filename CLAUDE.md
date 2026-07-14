# 작업 지침

## 새 작업 시작 시 브랜치 전략
새 기능·포스트·수정 등 **새로운 작업 요청**을 받으면, 코드나 콘텐츠를 변경하기 전에 먼저 `main` 기준으로 새 브랜치를 분기한다. `.claude/commands/new-work.md`의 절차를 따른다.

1. 작업 트리에 커밋되지 않은 변경이 있으면 사용자에게 알리고 stash/커밋 여부를 확인한다.
2. `git fetch origin`으로 원격을 최신화한다.
3. 로컬 `main`을 `origin/main`으로 fast-forward 갱신한다.
4. 항상 최신 `origin/main`을 기준으로 새 브랜치를 분기한다 (`git switch -c <브랜치> origin/main`).

이미 작업용 브랜치에 있고 그 작업의 연장선이면 새로 분기하지 않는다. 브랜치 이름이 불명확하면 사용자에게 물어본다.

## PR·브랜치 정리
원격에 PR이 생성된 로컬 브랜치와 그 worktree는 `.claude/commands/cleanup-branches.md` 절차로 정리한다. 삭제는 되돌리기 어려우므로 항상 대상 목록을 보여주고 명시적 확인을 받은 뒤 진행하며, 원격 브랜치와 PR 자체는 건드리지 않는다.

## push / PR
- `main`에 직접 push하지 않는다. 작업 브랜치를 push하고 `main`으로의 PR을 통해 병합한다.
- push·PR 생성은 사용자가 요청할 때만 수행한다.
