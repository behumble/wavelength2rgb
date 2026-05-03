# wavelength2rgb

빛의 **파장(nm)** 을 입력하면 해당하는 **RGB 색상**을 보여주는 작은 React 웹 앱입니다. 가시광선 영역(약 380–780 nm)의 파장을 sRGB 값으로 근사 변환하여 색 견본, RGB·HEX·CSS 표기를 함께 출력합니다.

## 주요 기능

- 숫자 입력과 슬라이더로 파장(nm)을 조절하면 실시간으로 색상이 갱신됩니다.
- RGB / HEX / CSS 세 가지 표기를 함께 표시합니다.
- URL 해시(`#`)로 파장을 지정할 수 있습니다. 예: `/#600` → 600 nm.
- 한국어 / 영어 인터페이스를 지원하며, 브라우저 언어를 자동으로 감지합니다(한국어가 아니면 영어로 폴백).
- 가시광선 영역을 벗어나면(IR·UV 등) 검은색으로 표시되며 *범위를 벗어남* 안내가 표기됩니다.

## 기술 스택

- React 18
- Vite 5 (개발 서버 / 번들러)
- 외부 라이브러리 없이 직접 구현한 i18n 및 라우팅 (단일 경로 파라미터)

## 시작하기

요구 사항: Node.js 18 이상 권장.

```bash
npm install      # 의존성 설치
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드 (dist/)
npm run preview  # 빌드된 결과를 로컬에서 미리보기
```

## URL 해시 파라미터

해시(`#`) 뒤의 정수가 곧 파장(nm)으로 해석됩니다. 해시는 서버로 전송되지 않으므로 별도의 SPA 리라이트 설정 없이도 어떤 정적 호스팅에서나 그대로 동작합니다.

| URL | 동작 |
| --- | --- |
| `/`        | 기본값 550 nm |
| `/#600`    | 600 nm로 시작 |
| `/#450`    | 450 nm로 시작 |

슬라이더나 입력 값을 변경하면 `history.replaceState`를 통해 해시가 자동으로 갱신됩니다(브라우저 히스토리에는 쌓이지 않으며, 앵커로 인한 스크롤 점프도 발생하지 않음). 뒤로/앞으로 이동도 정상 동작합니다.

## 다국어 지원 (i18n)

- 첫 실행 시 다음 순서로 언어를 결정합니다.
  1. `localStorage`에 저장된 이전 선택값
  2. 브라우저의 `navigator.languages` 중 지원되는 언어
  3. 위 어느 것도 해당하지 않으면 영어(`en`)
- 헤더 우측의 `EN / KO` 토글로 언제든 변경할 수 있으며, 선택한 언어는 자동으로 저장됩니다.

## 변환 알고리즘

[Dan Bruton의 가시광선 → RGB 근사식](https://academo.org/demos/wavelength-to-colour-relationship/)을 사용합니다. 380–780 nm를 6개 구간으로 나누어 각 채널을 계산한 뒤, 스펙트럼 양 끝에서의 강도 감쇠와 감마 0.8 보정을 적용합니다. 가시광선 범위 밖에는 대응하는 RGB 값이 존재하지 않으므로 검은색으로 표시됩니다.

## 참고 자료

- [Electromagnetic spectrum](https://en.wikipedia.org/wiki/Electromagnetic_spectrum) — 전자기 스펙트럼 전반
- [Visible spectrum](https://en.wikipedia.org/wiki/Visible_spectrum) — 가시광선
- [Ultraviolet](https://en.wikipedia.org/wiki/Ultraviolet) — 자외선(UV)
- [Infrared](https://en.wikipedia.org/wiki/Infrared) — 적외선(IR)
- [Color vision](https://en.wikipedia.org/wiki/Color_vision) — 색각

## 프로젝트 구조

```
src/
├── App.jsx            # 메인 컴포넌트 (상태, URL 동기화, UI 구성)
├── main.jsx           # React 진입점
├── i18n.js            # 번역 사전 + useLocale 훅
├── wavelengthToRgb.js # 파장 → RGB 변환 함수 (순수 함수)
└── index.css          # 스타일
```
