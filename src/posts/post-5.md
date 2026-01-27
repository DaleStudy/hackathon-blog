# Dependabot 도입기: 달레UI 사례로 보는 의존성 관리 자동화

## 의존성, 어떻게 관리할까요?

"의존성, 어떻게 관리할까요?" 달레UI 프로젝트 초기, 팀 회의에서 질문이 나왔습니다.
"지금은 프로젝트가 작지만, 패키지들이 계속 업데이트되고 보안 취약점도 발견될 텐데... 이걸 어떻게 관리할까요?"
프로젝트가 막 시작되었을 때는 의존성이 많지 않았습니다. 하지만 팀원들은 문제가 생기기 전에 대비해야 한다는 점에 동의했습니다. 매주 수동으로 `bun update`를 실행하는 것보다, 자동화된 시스템을 처음부터 구축하는 것이 나을 것 같았습니다. 그렇게 우리는 **Dependabot**을 도입하기로 결정했습니다.

## Dependabot이란?

<img width="200" height="200" alt="image" src="https://github.com/user-attachments/assets/02a5ae9e-77ae-4d10-9f57-1d0c43429fb2" />

[Dependabot](https://github.com/dependabot)은 깃허브에서 제공하는 자동화된 도구로, 프로젝트의 패키지 및 의존성을 지속적으로 모니터링하고 업데이트합니다. 원래는 독립 서비스였으나 2019년에 깃허브에 인수되어 현재는 깃허브 플랫폼에 통합되어 있습니다.

비슷한 도구로는 Renovate, Snyk 등이 있습니다. 이미 이런 도구를 사용하고 계시다면 Dependabot도 비슷한 방식으로 작동한다고 생각하시면 됩니다.

**주요 기능:**

- 오래된 버전이나 보안 취약점을 가진 패키지 자동 감지
- 업데이트를 위한 풀 리퀘스트(PR) 자동 생성
- 프로젝트의 보안성과 안정성 향상
- 개발자의 시간과 노력 절약

처음에는 "설정 파일 하나만 추가하면 끝나겠지"라고 생각했습니다. 하지만 실제로 운영하면서 예상하지 못했던 다양한 문제들을 만났고, 그 과정에서 많은 것을 배웠습니다.

## 7개월간의 설정 진화

처음 달레UI에서 Dependabot을 도입할 때는 간단한 설정으로 시작했습니다.

**2025년 3월 23일 - 첫 번째 설정:**

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "daily"

  - package-ecosystem: "github-actions"
    directory: "/.github/workflows"
    schedule:
      interval: "daily"
```

**7개월 후 - 진화한 설정 (2025년 12월 30일):**

```yaml
version: 2
# enable-beta-ecosystems: true # 더 이상 필요 없음 (Bun 공식 지원)
updates:
  - package-ecosystem: "bun" # npm에서 bun으로 변경
    pull-request-branch-name:
      separator: "-"
    directory: "/"
    schedule:
      interval: "weekly" # daily에서 weekly로 변경
    cooldown:
      default-days: 14
      major-days: 90    # 주요 버전: 긴 대기 (breaking changes)
      minor-days: 30    # 마이너 버전: 중간 대기
      patch-days: 3     # 패치 버전: 짧은 대기 (보안 패치)
    groups: # 패키지 그룹핑 추가
      storybook:
        patterns:
          - "storybook"
          - "@storybook/*"
      react:
        patterns:
          - "react"
          - "react-dom"
          - "@types/react"
          - "@types/react-dom"
      vite:
        patterns:
          - "vite"
          - "vitest"

  - package-ecosystem: "github-actions"
    pull-request-branch-name:
      separator: "-"
    directory: "/.github/workflows"
    schedule:
      interval: "weekly" # daily에서 weekly로 변경
```

이 설정은 [13개의 커밋](https://github.com/DaleStudy/달레UI/commits/main/.github/dependabot.yml)을 통해 7개월에 걸쳐 점진적으로 완성되었습니다. 각 변경사항은 실제로 부딪힌 문제를 해결하기 위한 것이었습니다.

## 점진적인 변화의 과정

저희 팀은 결국 두 번째 방식을 선택했고, 그 결정에 따라 Dependabot 설정이 다음과 같은 과정을 통해 진화했습니다.

### 1단계: Bun 패키지 매니저로 전환 (2025.03.25)

**문제:** 프로젝트가 npm에서 Bun으로 패키지 매니저를 전환했지만, Dependabot은 여전히 npm으로 설정되어 있었습니다.

**해결:**

```yaml
# 변경 전
- package-ecosystem: "npm"

# 변경 후
- package-ecosystem: "bun"
```

그런데, Bun은 당시 Dependabot의 베타 기능이었습니다. 다음 날 또 다른 문제를 만나게 됩니다.

### 2단계: Beta 에코시스템 활성화 (2025.03.26)

**문제:** Dependabot이 Bun을 인식하지 못하고 오류가 발생했습니다.

**해결:**

```yaml
version: 2
enable-beta-ecosystems: true # 루트 레벨에 추가
updates:
  - package-ecosystem: "bun"
```

**배운 점:** 최신 패키지 매니저를 사용할 때는 Dependabot의 베타 기능 지원이 필요합니다. 또한 설정 파일의 구조를 정확히 이해해야 합니다. 처음에는 `updates` 아래에 넣었다가 루트 레벨로 옮겨야 한다는 것을 배웠습니다.

**업데이트 (2025.12):** [Bun이 Dependabot에서 공식 지원](https://github.com/DaleStudy/daleui/pull/694)되면서 더 이상 `enable-beta-ecosystems` 설정이 필요하지 않습니다. 하지만 당시에는 베타 기능이었기 때문에 이 과정을 거쳐야 했습니다.

### 3단계: PR 폭증 문제 해결 (2025.03.27-28)

**문제:** 매일 수십 개의 Dependabot PR이 생성되어 팀의 리뷰 부담이 커졌습니다.

**해결 1 - 패키지 그룹핑:**

```yaml
groups:
  storybook:
    patterns:
      - "storybook"
      - "@storybook/*"
```

**효과:** Storybook 관련 5개 패키지가 하나의 PR로 통합되었습니다.

```
# 변경 전: 5개의 개별 PR
- build(deps-dev): bump @storybook/addon-actions from 8.0.0 to 8.0.1
- build(deps-dev): bump @storybook/addon-essentials from 8.0.0 to 8.0.1
- build(deps-dev): bump @storybook/addon-interactions from 8.0.0 to 8.0.1
...

# 변경 후: 1개의 통합 PR
- build(deps-dev): bump the storybook group with 5 updates
```

**해결 2 - 업데이트 주기 조정:**

```yaml
schedule:
  interval: "weekly" # daily → weekly
```

**배운 점:** 너무 잦은 업데이트는 오히려 생산성을 떨어뜨릴 수 있습니다. 관련 패키지를 그룹화하면 테스트와 리뷰가 훨씬 효율적입니다.

### 4단계: React 패키지 그룹핑 (2025.04.03)

**문제:** React와 타입 정의가 따로 업데이트되면서 타입 불일치 오류가 발생했습니다.

**해결:**

```yaml
groups:
  react:
    patterns:
      - "react"
      - "react-dom"
      - "@types/react"
      - "@types/react-dom"
```

**배운 점:** 서로 의존성이 있는 패키지는 반드시 함께 업데이트되어야 합니다. 특히 런타임 패키지와 타입 정의는 버전이 맞아야 합니다.

### 5단계: Vite 빌드 도구 그룹핑 (2025.05.07)

**문제:** Vite와 Vitest 버전이 따로 업데이트되면서 빌드 설정 호환성 문제가 발생했습니다.

**해결:**

```yaml
groups:
  vite:
    patterns:
      - "vite"
      - "vitest"
```

**배운 점:** 같은 생태계의 도구들은 함께 관리하는 것이 좋습니다.

### 6단계: 쿨다운 기간 최적화 (2025.10.19 - 2025.12.30)

**문제:** 어떤 패키지는 너무 자주 업데이트되어 CI 빌드 비용이 증가하고 팀의 리뷰 피로도가 높아졌습니다. 반면, 보안 패치는 빠르게 적용되어야 합니다.

**해결:**

처음에는 단일 쿨다운 기간을 설정했습니다:

```yaml
cooldown:
  default-days: 14
```

하지만 이후 [시맨틱 버저닝 기반의 차별화된 쿨다운](https://github.com/DaleStudy/daleui/pull/703)으로 개선했습니다:

```yaml
cooldown:
  default-days: 14
  major-days: 90    # 주요 버전: 긴 대기 (breaking changes)
  minor-days: 30    # 마이너 버전: 중간 대기
  patch-days: 3     # 패치 버전: 짧은 대기 (보안 패치)
```

**효과:**
- 보안 패치는 3일 내에 빠르게 적용
- Breaking changes는 90일 대기로 충분한 검토 시간 확보
- 같은 패키지가 연속으로 업데이트되는 것을 방지

**배운 점:** 모든 업데이트를 동일하게 다루기보다, 변경의 성격(patch/minor/major)에 따라 차별화된 전략을 적용하는 것이 더 효과적입니다. 특히 보안 패치는 빠른 적용이 중요합니다.

**쿨다운 설정 사용 시 주의사항:**

쿨다운 설정을 사용할 때는 보안 업데이트와의 관계를 이해하는 것이 중요합니다. dependabot.yml의 쿨다운 설정은 일반 의존성 업데이트(Version Updates)에만 적용되며, Dependabot Security Updates에는 적용되지 않습니다.

보안 업데이트는 GitHub Advisory Database에 등록된 취약점에 대해 쿨다운, 스케줄 등의 설정과 독립적으로 자동 PR을 생성합니다. 따라서 쿨다운 설정을 사용하더라도 심각한 보안 취약점에 대해서는 자동으로 대응할 수 있습니다.

## Dependabot 성공의 핵심: CI/CD 파이프라인

**Dependabot 도입을 고려한다면, 먼저 탄탄한 CI/CD 파이프라인을 구축하세요.**

Dependabot이 생성한 PR에 대해 빌드, 단위 테스트, 통합 테스트, 린트 검사가 자동으로 실행됩니다. 덕분에 CI가 통과하면 개발자가 깊게 리뷰하지 않아도 안전하게 병합할 수 있었습니다.

만약 이런 CI/CD 파이프라인이 없었다면, 다른 프로젝트에서 흔히 볼 수 있듯이 Dependabot PR이 오랫동안 방치되었을 것입니다. 개발자가 수동으로 테스트해야 한다면 의존성 업데이트는 항상 우선순위에서 밀리게 됩니다.

### 추가 최적화: Chromatic 건너뛰기

Dependabot PR에서 Chromatic(시각적 회귀 테스트 도구)을 건너뛰도록 설정했습니다.

```yaml
# .github/workflows/chromatic.yml
if: github.actor != 'dependabot[bot]'
```

대부분의 의존성 업데이트(예: TypeScript, ESLint, Vite 등)는 UI에 직접적인 영향을 주지 않으므로 Chromatic 테스트를 건너뛰면 빌드 시간과 비용을 절약할 수 있습니다. **하지만** Ark UI, lucide-react, React 같은 UI 라이브러리의 버전이 변경될 때는 의도치 않은 UI 변화가 발생할 수 있습니다. 결국 이 최적화는 비용 절감과 위험 관리 사이의 선택입니다.

달레UI 팀은 빌드 비용 절감을 우선시하여 이 설정을 유지하고 있지만, Dependabot PR 머지 후 수동으로 Chromatic 테스트를 실행하거나, 주기적으로 전체 테스트를 실행하여 의도치 않은 변경을 감지하는 것을 권장합니다. 프로젝트의 안정성 요구사항에 따라 이 설정을 조정할 수 있습니다.

## Dependabot을 도입하고 나서

7개월간 Dependabot을 운영하면서 달레UI 팀이 얻은 것들:

- **의존성 관리의 자동화**: 매주 수동으로 확인하던 패키지 업데이트를 자동화하여 개발자가 더 중요한 일에 집중할 수 있게 되었습니다.
- **보안 대응 속도 향상**: 보안 취약점 발견 시 즉시 PR이 생성되어 빠르게 대응할 수 있습니다.
- **학습과 성장**: 실제 문제를 해결하면서 의존성 관리에 대한 이해도가 높아졌습니다.

기술적인 설정만큼이나 중요한 것이 **팀 문화**입니다. 처음에는 Dependabot PR이 오랫동안 방치되는 일이 있었습니다. 회고를 통해 이 문제를 인식하고, 팀원들이 Dependabot PR을 적극적으로 리뷰하고 병합하는 문화를 만들어갔습니다. 기술 도구는 팀이 함께 만드는 문화가 뒷받침될 때 비로소 제대로 작동합니다.

<img width="1464" height="1124" alt="image" src="https://github.com/user-attachments/assets/422dee25-338b-4d82-bcba-6939b17056d8" />

재미있는 사실 하나를 공유하자면, Dependabot을 몇 달 돌린 후 프로젝트 기여자 1등 자리를 Dependabot에게 뺏겼습니다. 그만큼 꾸준하게 프로젝트를 관리해주는 팀원도 없었습니다 😊

Dependabot은 단순히 설정 파일 하나를 추가하는 것이 아니라, 팀과 함께 성장하는 도구입니다. 의존성 관리에 시간을 빼앗기고 계신다면, Dependabot 도입을 고려해보세요. 달레UI의 7개월간의 여정이 여러분의 프로젝트에도 도움이 되길 바랍니다.

---

This work is licensed under [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/?ref=chooser-v1) ![cc xlarge](https://github.com/user-attachments/assets/52c997be-c31d-401f-b982-5d6202e0fe56)![by xlarge](https://github.com/user-attachments/assets/919810d3-d421-4864-8286-9324a5b36bc7)
