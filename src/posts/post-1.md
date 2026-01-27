# 달레UI 디자인 시스템: 테크 스택 선정 과정 A to Z

좋은 디자인 시스템은 단지 컴포넌트를 모아놓는 것 이상입니다.
어떤 언어로, 어떤 기준으로 설계되었는지가 전반적인 제품 경험을 바꾸죠.

달레UI는 **한국어 사용자 경험**을 우선으로 고려한 오픈소스 디자인 시스템입니다.
기존 유명한 디자인 시스템을 가져다가 바로 사용하려고 하면 항상 부딪히는 문제가 있었어요
예를 들면, 버튼 텍스트 한 줄 바꿨을 뿐인데 줄 간격이 이상해지고, 모바일에서 잘리는 일이 자주 일어났습니다.
이런 사소하지만 빈번한 문제들이 누적되면서, 우리는 더 나은 기본값을 만들고 싶어졌습니다.

![image](https://github.com/user-attachments/assets/bd5ea84e-3a18-4d6d-bea0-a1cace7c598f)
>출처: 달레UI 비전 미션 워크샵 보드 캡처

그래서 달레UI를 시작했습니다.
한글 UI에 최적화된 시각 언어와 개발 경험, 그리고 기여자들이 무리 없이 참여할 수 있는 구조.
그걸 가능하게 만들 핵심은 결국 **기술 스택의 정교한 선택**이었습니다.

이 글에서는 달레UI가 어떤 기준으로 기술을 선택해왔는지,
단순한 사용기나 나열이 아닌 실제 고민과 결정을 담은 흐름을 소개합니다.

React냐, Web Component냐.
스타일링은 런타임이냐 빌드 타임이냐.
디자인 토큰을 어떻게 다룰 것인가.
접근성과 커스터마이징을 동시에 만족시키는 UI 구성은 가능한가.

우리는 수많은 선택 앞에서 어떤 기준을 세웠고, 왜 그 길을 택했는지를 하나씩 풀어보려 합니다.
지금도 달레UI는 디자이너와 개발자들이 함께 기초를 다져가고 있는 중이에요.
이 글이, 같은 고민을 하고 있을 누군가에게 작은 나침반이 되길 바랍니다.

## 웹 컴포넌트 vs. React: 프레임워크 독립보다 중요한 것

처음 달레UI를 시작했을 때, 가장 먼저 떠오른 기준은 **특정 프레임워크에 얽매이지 말자**는 것이었어요.
그래서 자연스럽게 웹 컴포넌트(Web Components)를 1순위 후보로 삼았습니다.

![image](https://github.com/user-attachments/assets/8344e808-38e2-4f38-ae60-028daed24678)
>출처: [웹 컴포넌트 홈페이지](https://www.webcomponents.org/introduction)

웹 컴포넌트는 어떤 프레임워크에서도 쓸 수 있고, 브라우저에서 바로 지원되는 웹 표준 기술이기도 하죠.
React든, Vue든, Svelte든… 심지어 Vanilla JS만으로도 쓸 수 있다는 점은 분명 매력적이었어요.
기술의 유연성, 그리고 장기적인 유지보수를 생각하면 꽤 합리적인 선택처럼 보였죠.

처음에는 이런 식으로 프로토타입을 만들었습니다:

```ts
// base-button.ts
class BaseButton extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `<button><slot></slot></button>`;
  }
}
customElements.define("base-button", BaseButton);
```

간단해 보이지만, 문제는 그 이후부터였습니다.

- 상태 바인딩을 하려면 속성을 직접 감지하거나 이벤트를 수동으로 다뤄야 했고,
- 컴포넌트 간 상호작용도 명확한 패턴이 부족했고,
- TypeScript와 Storybook에서 문서화하려니 추가 설정이 계속 꼬였어요.

그리고 이런 간단한 구성에서도 접근성과 포커스 관리, 키보드 이벤트 처리 등
기본적인 UI 컴포넌트 로직이 직접 다 구현해야 할 일이 돼버렸습니다.
Lit과 Stencil와 같이 웹 컴포넌트 작성을 수월하게 해주는 프레임워크가 있지만 
실제로 써보면 자질구질한 문제에 계속해서 부딪히게 됩니다. 
프론트엔드 테스팅의 사실상 표준으로 자리잡은 Testing Library도 웹 컴포넌트는 지원하지 않고 있죠.

⸻

결국, 개발 생산성 측면에서 이건 너무 비효율적이다라는 판단이 들었어요.
기여자 입장에서 이 코드를 보고 기여를 시작하는 건, 너무 높은 진입 장벽이었죠.

그래서 방향을 바꿨습니다.
우리가 이미 익숙하고, 생태계도 풍부하고, 커뮤니티 기여도 활발한 — **React**를 선택하기로 했어요.

⸻

React를 쓰면 아래와 같이 훨씬 명확하게 설계할 수 있었습니다:

```tsx
// Button.tsx
type ButtonProps = {
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ children, ...props }: ButtonProps) {
  return (
    <button {...props} className="btn">
      {children}
    </button>
  );
}
```

- 접근성은 ARIA 속성과 라이브러리 연동으로 자연스럽게 커버 가능했고,
- TypeScript와의 호환도 매끄러웠고,
- Storybook에서 바로 문서화 + 테스트 가능성도 확보됐죠.

무엇보다 기여자 입장에서 익숙한 구조였기에,
이 프로젝트, 나도 한 줄쯤은 기여할 수 있겠다는 인상을 줄 수 있었어요.

![image](https://github.com/user-attachments/assets/e603e479-79b2-4fad-a6fc-b02c7f3c565a)
>출처: [React 홈페이지](https://react.dev/)

물론 React는 프레임워크 종속이라는 한계가 있어요.
하지만 우리에겐 지금 당장 “더 나은 기본값”이 필요했고,
그걸 가장 현실적으로 구현할 수 있는 선택이 React였습니다.

기술이 우리를 이끄는 게 아니라, 우리가 만들고 싶은 가치가 기술을 이끄는 흐름이 생겼다는 게 이 시점의 중요한 전환이었습니다.

## React + TypeScript: 안정성과 기여를 위한 기본값

React를 선택한 다음, TypeScript 도입은 사실 큰 고민 없이 바로 이어졌습니다.
요즘 프론트엔드 프로젝트에서 TypeScript는 거의 **기본값**에 가까운 선택이죠.

하지만 달레UI에서는 그 ‘기본값’이 조금 더 큰 의미를 가집니다.

오픈소스라는 특성상 다양한 레벨의 기여자들이 참여하게 되는데, 정확한 타입이 있다는 것만으로도 문서 이상의 역할을 하게 되니까요.
컴포넌트 설계 구조를 명확하게 보여주고, 실수나 혼란을 줄여주는 자기 문서화(self-documenting) 도구로 작동하죠.

예를 들어, 아래처럼 간단한 컴포넌트에서도:

```tsx
type ButtonProps = {
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
```

이 타입 정의 하나만으로도

- 어떤 옵션을 줄 수 있고
- 어떤 HTML 속성이 들어올 수 있는지

바로 이해할 수 있습니다.

기여자 입장에서 보면, 문서를 먼저 읽지 않아도 코드를 보고 바로 감을 잡을 수 있는 거죠.
뒤에서 다룰 스토리북과 함께 사용하면 자동으로 컴포넌트 API가 추론되어 문서화가 되는 혜택도 얻게 됩니다.
TypeScript는 단순한 문법이 아니라, 기여를 유도하는 **‘초대장’** 같은 역할을 하고 있어요.

## 스타일링: 우리는 왜 빌드 타임을 택했는가

디자인 시스템에서 스타일링은 그 자체로 **철학**입니다.
어떤 방식으로 스타일을 관리하느냐에 따라,
프로젝트의 퍼포먼스, 유지보수성, 심지어 디자이너와의 협업 방식까지 달라지죠.

처음엔 우리도 흔히 쓰는 CSS-in-JS 방식들 — Styled Components, Styled JSX 등을 고민했어요.
하지만 곧 확신이 들었습니다: “이건 우리가 원하는 방향이 아니다.”

![image](https://github.com/user-attachments/assets/4dde87b1-5212-4823-a157-7f9fb0aa982f)
>출처: [Micro Frontend: Run-Time Vs. Build-Time Integration](https://www.syncfusion.com/blogs/post/micro-frontend-run-time-vs-build-time/amp)

### 우리가 배제한 것: 런타임 스타일링

CSS-in-JS는 빠르게 개발하고 유연하게 커스터마이징할 수 있다는 장점이 있어요.
하지만 디자인 시스템처럼 “기본값이 명확하고, 성능이 중요한” 프로젝트에선 단점이 더 크게 느껴졌습니다.

- 런타임 성능 오버헤드: 컴포넌트를 쓸 때마다 JS가 스타일을 처리하는 방식은 처음부터 스타일이 정적일 수 있는 시스템에는 과했어요.
- 번들 사이즈: 사용하지 않는 스타일도 JS로 묶여 들어가기 때문에, 의도치 않은 비용이 발생할 수 있고요.
- 예측 가능성 부족: 클래스명이 동적으로 생성되다 보니, 스타일 충돌이나 디버깅에 시간이 걸리는 경우도 많았죠.

디자인 시스템은 ‘빠르게 수정’보다 ‘처음부터 안정적인 설계’가 훨씬 중요합니다.
그래서 우리는 처음부터 빌드 타임 스타일링 방식으로 방향을 잡았습니다.

### 우리가 고려한 것: Panda CSS vs StyleX

빌드 타임 스타일링을 기준으로, 두 가지 솔루션을 집중적으로 검토했습니다:

- StyleX (by Meta): Facebook과 Instagram에서 쓰이는 솔루션으로 컴포넌트 단위 스타일 관리, 예측 가능한 클래스 생성, 정적 CSS 추출 기능이 강점이에요.
- Panda CSS: 유틸리티 기반 스타일링 방식인데, Tailwind처럼 쓰되 TypeScript 기반으로 작동하면서 디자인 토큰을 강력하게 관리할 수 있어요.

초기에는 StyleX가 꽤 유력했어요. 실제로 실험도 했고, Facebook 내부 사례들도 참고했죠.
하지만 Panda CSS는 생각 이상으로 디자인 시스템에 맞춤형 솔루션처럼 느껴졌습니다.

⸻

### 최종 선택: Panda CSS

![image](https://github.com/user-attachments/assets/da1483ed-69e0-4e8b-9256-7f2ff4f637b7)
>출처: [Panda css 웹사이트](https://panda-css.com/)

Panda CSS를 선택한 이유는 단순히 “더 좋아 보여서”가 아닙니다.
달레UI가 지향하는 가치들과 가장 자연스럽게 연결됐기 때문이에요.

- 디자인 토큰 기반 설계: Panda는 토큰을 중심으로 스타일이 만들어지기 때문에 일관된 테마/컴포넌트 스타일 관리에 최적화돼 있었고,
- 타입 안전성: 스타일 속성에 자동으로 타입이 붙고, 오타나 실수를 줄여주는 DX가 강력했어요.
- 설정 유연성: 컴포넌트 단위로 확장하거나, 디자인 요구에 맞게 커스터마이징하는 게 꽤 간편했고요.

예를 들어, 이렇게 쓰면:

```ts
// button recipe
export const button = defineRecipe({
  base: {
    borderRadius: "md",
    fontWeight: "semibold",
  },
  variants: {
    variant: {
      solid: { bg: "blue.500", color: "white" },
      outline: {
        border: "2px solid",
        borderColor: "blue.500",
        color: "blue.500",
      },
    },
  },
});
```

우리가 추구하는 명확한 구조, 디자인 시스템스러운 일관성, 그리고 개발자의 편의성이 그대로 살아났어요.
스타일은 단지 꾸미는 게 아니라, 시스템의 성격을 결정짓는 설계 요소라는 걸 이 과정에서 다시 한번 확인하게 됐습니다.

## 똑똑한 컴포넌트 설계: 헤드리스 UI 활용 (Radix UI)

React와 Panda CSS로 뼈대를 잡았지만, UI 컴포넌트의 로직과 접근성은 또 다른 숙제였습니다.
탭의 키보드 이동, 모달의 포커스 관리 같은 것들을 처음부터 다 만드는 건 비효율적이었죠.
특히 웹 접근성은 단순한 ‘부가 기능’으로 치부할 수 없는, 제품의 품질과 사용자 경험을 좌우하는 핵심 요소입니다. 
WAI-ARIA 표준 준수, 키보드 인터랙션, 포커스 관리 등 고려해야 할 사항이 매우 많고 복잡해서, 
어설프게 구현하면 오히려 사용자를 배제하거나 큰 불편을 야기할 수 있는 매우 민감하고 전문적인 영역이었어요. 
이는 단순히 많은 시간이 필요한 문제를 넘어, 전문성이 부족할 경우 제대로 만들기 어렵다는 것을 의미했고,
기여자들이 쉽게 참여하기 어렵게 만드는 요인이었습니다.

![image](https://github.com/user-attachments/assets/b6d74b22-186a-4d39-a2c7-17d7bb779b10)
>출처: [RadixUI 홈페이지](https://www.radix-ui.com/)

그래서 헤드리스 UI(Headless UI)에 주목했습니다.
말 그대로 스타일 없이 로직과 접근성만 갖춘 컴포넌트죠.
개발자는 여기에 원하는 스타일을 입히기만 하면 됩니다.

장점은 명확했습니다:

- 로직과 스타일 분리: 복잡한 로직은 이미 해결된 것을 쓰고, 달레UI의 시각 언어 구현에 집중할 수 있습니다.
- 보장된 접근성: WAI-ARIA 표준을 준수하는 수준 높은 접근성을 기본으로 확보합니다.
- 높은 유연성: 스타일이 없으니 Panda CSS와 충돌 없이 자유롭게 디자인을 적용할 수 있습니다.

여러 대안 중 Radix UI를 선택한 이유는 달레UI의 지향점과 가장 잘 맞았기 때문입니다:

- 탁월한 접근성: WAI-ARIA 표준을 철저히 준수하여, 복잡한 접근성 요구사항을 알아서 해결해줍니다. 예를 들어 Dialog 컴포넌트는 포커스 트랩이나 Esc 키 닫기 같은 기능을 이미 완벽히 지원하죠.
- Panda CSS와의 완벽한 통합: 스타일이 전혀 없어 Panda CSS로 달레UI만의 디자인을 온전히 입힐 수 있습니다.
- 핵심 프리미티브 제공: 체크박스, 다이얼로그, 드롭다운 메뉴 등 디자인 시스템에 필수적인 기본 로직들을 제공합니다.

```tsx
//checkbox component
<CheckboxPrimitive.Root
  checked={checked}
  required={required}
  onCheckedChange={(checked) => {
    onChange?.(checked === true, value);
  }}
  disabled={disabled}
  // Panda CSS의 cva로 생성된 스타일을 className으로 전달
  className={styles({ tone })}
  {...rest}
>
  <CheckboxPrimitive.Indicator
  // Panda CSS의 css 유틸리티로 생성된 스타일을 className으로 전달
    className={css({
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    })}
  >
    <Check size={16} />
</CheckboxPrimitive.Indicator>
```

여기서 `CheckboxPrimitive.Root`에는 `styles({ tone })`처럼 `cva`로 정의된 조건부 스타일이,
`CheckboxPrimitive.Indicator`에는 `css()` 유틸리티로 만들어진 정적 스타일이 `className`을 통해 적용됩니다.
이렇게 하면 복잡한 `aria-\*` 속성이나 키보드 인터랙션, 상태 관리는 Radix가 내부적으로 깔끔하게 처리해주니,
우리는 달레UI의 시각적 표현과 같은 핵심 가치에만 집중하면 됩니다.

Radix UI 도입은 핵심 로직과 접근성을 전문가에게 맡기고,
달레UI만의 디자인과 사용자 경험을 빚어내는 데 에너지를 집중할 수 있게 한 현명한 ‘아웃소싱’ 전략이었던 셈입니다.
이는 기여자들에게도 훨씬 낮은 진입 장벽을 제공하여, 더 많은 참여를 유도할 수 있는 기반이 됩니다.

## 개발과 소통의 중심: Storybook 생태계와 품질 관리

좋은 컴포넌트를 만들었다고 끝이 아닙니다.
이 컴포넌트를 어떻게 보여주고, 테스트하고, 기여자들과 함께 개선해나갈지가 중요하죠.
달레UI에게 이 모든 과정의 중심에는 Storybook이 있습니다.

Storybook은 단순한 컴포넌트 갤러리가 아닙니다. 달레UI에게는 다음과 같은 핵심 역할을 합니다:

- **컴포넌트 기반 개발**: 각 컴포넌트를 개별적으로 개발하고 시각적으로 즉시 확인할 수 있게 해줍니다.
- **살아있는 시각적 문서**: 컴포넌트의 다양한 상태와 사용법을 직접 인터랙션하며 이해할 수 있는 문서가 됩니다.
- **테스트 플랫폼**: 컴포넌트의 기능과 접근성을 검증하는 자동화된 테스트의 기반이 됩니다.

![image](https://github.com/user-attachments/assets/f51ee492-2b69-4949-9109-09e1cec8654e)
>출처: [Storybook 홈페이지](https://storybook.js.org/)

이러한 역할을 극대화하기 위해 달레UI는 다음과 같은 Storybook 애드온을 적극 활용합니다 (각 애드온에 대한 더 자세한 이야기는 별도의 글로 풀어낼 예정입니다):

- **Essentials**: Docs, Controls, Actions 등 개발과 문서화에 필요한 핵심 기능을 제공하는 기본 세트입니다.
- **A11y**: 개발 중 실시간으로 접근성 위반 사항을 검사하여, 모두를 위한 UI를 만드는 데 기여합니다.
- **Interactions & Test**: 사용자의 실제 인터랙션 시나리오를 작성하고, 이를 기반으로 컴포넌트의 동작을 테스트하여 견고함을 더합니다.
- **Themes**: 다크/라이트 모드와 같이 다양한 테마를 손쉽게 적용하고 시각적으로 확인할 수 있게 해, 디자인 일관성을 유지합니다.
- **Designs**: Figma 등 디자인 툴과의 연동을 통해 디자인 스펙과 실제 구현 간의 간극을 줄여나갈 예정입니다.

뿐만 아니라 Storybook의 클라우드 기반 확장 도구인 Chromatic을 CI/CD 파이프라인에 통합하여 시각적 회귀 테스트를 자동화 하였습니다. 
이는 디자이너와 개발자 간 UI 검토 프로세스를 체계화함으로써, 의도치 않은 UI 깨짐이나 스타일 변화를 조기에 발견하여 시각적 일관성을 유지하는데 결정적인 역할을 합니다.

결과적으로 Storybook과 Chromatic 결합은 달레UI에 다음과 같은 명확한 이점을 가져다줍니다:

- **개발 효율성 향상**: 컴포넌트 단위의 독립적인 개발과 즉각적인 시각적 피드백은 개발 속도를 높입니다.
- **협업 강화**: 디자이너와 개발자가 동일한 결과물을 보며 소통하고, 이는 특히 한국어 UI의 미세한 디테일을 조율할 때 빛을 발합니다.
- **문서의 생활화**: 코드가 곧 문서가 되고, 문서가 곧 테스트 환경이 되어 정보의 최신성을 유지합니다.
- **높은 품질 유지**: 자동화된 접근성 검사와 인터랙션 테스트는 잠재적인 이슈를 조기에 발견하고, 일관된 사용자 경험을 보장하는 든든한 안전망이 됩니다.

결국 Storybook은 달레UI가 추구하는 ‘잘 만들어진 기본값’을 함께 만들고 다듬어가는 소통의 장이자, 품질을 지켜나가는 핵심 도구인 셈입니다.

## 빠르고 효율적인 개발 환경: Vite 그리고 Bun

좋은 디자인 시스템을 만드는 여정은, 그것을 뒷받침하는 개발 환경의 속도와 효율성에 크게 좌우됩니다.
느린 빌드, 긴 의존성 설치 시간은 개발자의 흐름을 끊고 생산성을 저해하죠. 달레UI는 이 지점에서도 최선의 선택을 고민했습니다.

![image](https://github.com/user-attachments/assets/faa3200d-1636-43bf-8b5a-4841b35fc144)
>출처: [Vite 홈페이지](https://vite.dev/)

사실 빌드 도구와 개발 서버로 Vite를 선택하는 과정은 깊은 고민이 필요하지 않았습니다.
현대 프론트엔드 개발에서 Vite가 제공하는 이점들은 너무나 명확했기 때문이죠.

- **압도적인 개발 서버 속도**: Native ESM 기반 덕분에 개발 서버는 거의 즉시 구동됩니다. 수정 사항이 즉각 반영되는 HMR(Hot Module Replacement)은 기다림 없는 개발 경험을 선사합니다.
- **최적화된 프로덕션 빌드**: 내부적으로 Rollup을 사용하여 효율적이고 가벼운 결과물을 만들어냅니다.
- **간결한 설정과 강력한 생태계**: 복잡한 설정 없이 바로 시작할 수 있으며, 예를 들어 vite-plugin-svgr을 활용해 SVG 아이콘을 React 컴포넌트처럼 손쉽게 관리하고 있습니다.

Vite가 마련한 쾌적한 환경 위에, Bun은 개발 경험을 한층 더 끌어올렸습니다.
Bun은 JavaScript 런타임이자 번들러, 테스트 러너, 그리고 패키지 매니저까지 겸하는 올인원 툴킷이죠.

달레UI에서 Bun은 다음과 같은 역할을 톡톡히 해내고 있습니다:

- 의존성 관리의 혁신: bun install은 기존 yarn, npm, pnpm 대비 눈에 띄게 빠른 속도로 의존성을 설치합니다. 프로젝트를 시작하거나 업데이트할 때 기다리는 시간이 대폭 줄어들죠.
- CI/CD 파이프라인 최적화: 빌드 및 테스트 시간 단축은 CI/CD 과정의 효율을 높여, 더 빠른 피드백과 배포 사이클을 가능하게 합니다. 이는 잠재적으로 CI 비용 절감으로도 이어질 수 있습니다.

Vite와 Bun의 조합은 달레UI 개발자들이 불필요한 기다림 없이, 오롯이 ‘더 나은 기본값’을 만드는 데 집중할 수 있도록 돕는 강력한 조력자입니다.

## 결론: 달레UI 기술 스택, 현재와 미래

지금까지 달레UI가 어떤 고민과 선택으로 현재의 기술 스택을 갖추게 되었는지 그 여정을 함께 살펴보았습니다.

React와 TypeScript는 안정적이고 기여하기 쉬운 컴포넌트의 기초를, Panda CSS는 디자인 토큰 기반의 일관되고 예측 가능한 스타일링을, Radix UI는 탄탄한 웹 접근성과 핵심 로직을 제공합니다. 이 모든 것을 Storybook을 통해 효과적으로 개발하고 소통하며, Vite와 Bun은 빠르고 쾌적한 개발 환경을 뒷받침합니다. 이 기술들은 각자의 자리에서 달레UI가 지향하는 ‘한국어 사용자 경험 최우선’, ‘열린 기여 문화’, 그리고 ‘높은 품질의 디자인 시스템’이라는 목표를 향해 나아가는 데 핵심적인 역할을 하고 있습니다.

이 과정을 통해 얻은 가장 큰 교훈은, 완벽한 기술은 없다는 사실입니다. 중요한 것은 프로젝트의 목표와 가치, 그리고 함께하는 사람들의 상황에 맞춰 최적의 조합을 찾아나가는 여정 그 자체였습니다. 기술은 목적을 이루기 위한 도구일 뿐, 우리가 만들고 싶은 가치가 기술 선택을 이끌어야 한다는 것을 다시 한번 깨달았습니다.

물론, 오늘의 선택이 영원하진 않을 겁니다. 기술 스택은 살아있는 유기체와 같아서, 새로운 기술 동향과 커뮤니티의 피드백을 통해 끊임없이 진화하고 개선될 것입니다. 달레UI는 앞으로도 더 나은 한국어 UI 환경을 만들기 위한 고민을 멈추지 않을 것입니다.

달레UI는 이제 막 첫걸음을 뗀 오픈소스 프로젝트입니다. 이 글을 읽고 계신 여러분의 관심과 참여, 그리고 어떤 형태의 피드백이든 달레UI를 더욱 단단하고 가치 있게 만들어갈 것입니다. 한국어 사용자를 위해 일관성과 신뢰성을 지닌 디자인 시스템으로 발전해 나갈 수 있도록 여정에 동참해주세요.

This work is licensed under [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/?ref=chooser-v1)  ![cc xlarge](https://github.com/user-attachments/assets/52c997be-c31d-401f-b982-5d6202e0fe56)![by xlarge](https://github.com/user-attachments/assets/919810d3-d421-4864-8286-9324a5b36bc7)




## 참고자료
- [웹 컴포넌트 (Web Components)](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.webcomponents.org%2Fintroduction)
- [React](https://www.google.com/url?sa=E&q=https%3A%2F%2Freact.dev%2F)
- [TypeScript](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.typescriptlang.org%2F)
- [Panda CSS](https://www.google.com/url?sa=E&q=https%3A%2F%2Fpanda-css.com%2F)
- [Radix UI](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.radix-ui.com%2F)
- [Testing Library](https://www.google.com/url?sa=E&q=https%3A%2F%2Ftesting-library.com%2F)
- [Storybook](https://www.google.com/url?sa=E&q=https%3A%2F%2Fstorybook.js.org%2F)
- [Vite](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvitejs.dev%2F)
- [Webpack vs Vite 무엇을 써야 할까요?](https://enjoydev.life/blog/frontend/4-module-bundler)
- [Bun](https://www.google.com/url?sa=E&q=https%3A%2F%2Fbun.sh%2F)
- [헬로 Bun](https://www.yes24.com/Product/Goods/134021042)
