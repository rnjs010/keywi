# 1️⃣리액트란?

## 라이브러리 🆚 프레임워크

- 프레임워크 : 무언가를 만드는 데 필요한 모든 것들이 갖춰져 제공되는 것 (골격 - 정해진 틀이 있음)
  - 단점 : 프레임워크에서 사용하는/권장되는 모든 것들을 공부해야 함 (러닝커브 높음), 자율성이 떨어짐
  - vue는 경량형 프레임워크 (http 통신, state management 제공x)
- 라이브러리 : 큰 골격이나 규칙이 정해지지 않고, 단 한가지 조금 더 좁은 문제를 해결하기 위한 작은 솔류션 단위 (자율성 보장, 진입장벽 낮음)

## React?

- UI를 만들기 위한 JS 라이브러리
  (UI를 빠르게 만들고, 사용자의 이벤트에 즉각적으로 반응해서 UI 업데이트, 간편하게 어플리케이션 만들 수 있을까 해서 나온 것)
- Renders **UI** and responds to (reacts to) **events**
- 웹, 모바일 앱을 손쉽게 만들 수 있게 해줌
- 2019 : v16.8 함수형 컴포넌트 (Hooks)
  2022 : v18 SSR+
- React, React Native, React + Electron(데스크탑 앱)

## Components

- 다른 coponents들과 독립적인 응집도가 높은 UI 블럭
- A highly **cohesive building block** for UIs **loosely coupled** with other components

- 컴포넌트 나누는 기준
  - 재사용성
  - 단일책임 : 한 곳에서만 쓰이지만 한 컴포넌트 안에서 너무 많은 일을 한다면 나누기

## 리액트 동작 원리

```jsx
// 컴포넌트 정의
export function CounterButton(props) {
    const [count, setCount] = useState(0);
    return(
        <div>
            <h1>Hello, {props.name}</h1>
            <button onClick={}>{count}</button>
        </div>
    );
}

// 컴포넌트 사용
<CounterButton name='이름'/>
```

- 데이터를 State(내부 상태), Props(외부로부터 전달받은 상태) 나타내는 render가 있음
- 상태가 변경될 때마다 re-render됨, 실제로 변경된 부분만 화면에 업데이트 됨

- 리액트는 가상 DOM Tree를 가지고 있고, 이전 tree와 비교해서 바뀐 부분만 update해서 빠름
- 사용자가 느끼기에 빠르고 부드럽게 업데이트 된다는 것은 60fps 유지

## 리액트 훅이란?

- Hooks are functions that let you **“hook into”** **React State and lifecycle feature(재사용 가능한 로직들)** from **function component**
  - useState, useEffect, useRef, useMemo, useCallback, useContext,,,
  - Hooks(함수들은)는 값의 재사용이 아니라 **로직의 재사용**을 위한 것

# 2️⃣개발환경 설정

- Node.js : 브라우저 밖에서 js를 실행할 수 있게 해주는 js 실행 환경
- npm : node 설치 시 자동 설치됨, 패키지 매니저 (외부 라이브러리 쉽게 설치 및 버전 관리)
- npx : npm 설치 시 자동 설치됨, 라이브러리를 개별적으로 실행하고 싶을 때
- yarn : npm 대체(npm은 사용 라이브러리 많을수록 실행 속도 저하, 순차적 실행 설치), 패키지 매니저(병렬적 실행 설치, 보안 우수)

```bash
git --version
node -v
npm -v
yarn -v
```

## 프로젝트 구조

- puclic : 정적인 리소스들 담는 곳 (robots.txt는 크롤링할 때 정보)
- src : 동적인 리소스들 담는 곳 (reportWebVitals.js 웹 성능 측정, setupTest.js 유닛테스트)

## 중요한 툴 설명

- BABEL : js transcompiler (최신 js를 예전 버전으로, ts를 js로 변환해서 제공 - 예전 브라우저도 사용가능)
- Webpack : Bundling the code, JS module bundler (코드 포장)
- ESLint : Checking code
- Jest : delightful JS testing framework (유닛테스트)
- PostCSS : expandable CSS libraries (tool for transforming CSS with JS)

## 확장 프로그램

- 크롬 : React Developer Tools - 컴포넌트와 props 등 확인 가능

**유용한 VS Code 익스텐션**

- Material Theme: 현재 사용하고 있는 테마(dark)
- Material Icon Theme: 현재 사용하고 있는 아이콘들
- Auto Import: 자동으로 import 해줌
- Prettier - Code formatter: 코드를 이쁘게 포맷
- CSS Modules: 나중에 PostCSS 쓸때 유용함

**기타 HTML & CSS 관련 익스텐션**

- IntelliSense for CSS class names in HTML
- HTML to CSS autocompletion
- HTML CSS Support
- CSS Peek
- Auto Rename Tag

# 3️⃣기본 문법

## 컴포넌트 반환 JSX 코드 주의사항

- 함수형 컴포넌트에서 UI인 JSX코드를 return할 때는 무조건 하나의 태그만 반환
  ⇒ 빈 태그로 감싸기 <> </>
- class를 사용할 때는 className이라는 속성을 사용해야 함
- jsx에서 js 코드를 작성할 때는 중괄호 이용해야 함
- ts를 만드는 컴포넌트 파일이라면 tsx 확장자

```jsx
import "./App.css";

function App() {
  const name = "이름";
  const list = ["우유", "딸기", "초코"];

  return (
    <>
      <p>{name}</p>
      <p>{`hello ${name}`}</p>
      <img
        style={{ width: "200px", height: "200px" }}
        className="클래스명"
        src=""
      />

      <ul>
        {list.map((item) => (
          <li>{item}</li>
        ))}

        {list.map((item) => {
          return <li>{item}</li>;
        })}

        {list.map(function (item) {
          return <li>{item}</li>;
        })}
      </ul>
    </>
  );
}
```

- 함수 작성 후 하단에 export default 함수명 으로 해도 되지만, 이름 변경 시 귀찮으므로
  `export default function ComponentName() { return <> </> }`

## Props

```java
import React from 'react';

export default function Profile(props) {
	return (
		<div>
			<img src={props.image}/>
			<h1>{props.name}</h1>
			<p>{props.title}</p>
		</div>
	);
}

export default function Profile({image, name, title}) {
	return (
		<div>
			<img src={image}/>
			<h1>{name}</h1>
			<p>{title}</p>
		</div>
	);
}

export default function Profile({image, name, title, **isNew**}) {
	return (
		<div>
			<img src={image}/>
			**{isNew && <span>New</span>}**
			<h1>{name}</h1>
			<p>{title}</p>
		</div>
	);
}

// 컴포넌트 사용
<Profile
	image=''
	name=''
	title=''
	isNew={true}
/>
```

## Event

```java
function App() {
	return (
		<>
			<button
				onClick={(event) => {
					console.log(event);
					alert('버튼 클릭');
				}}
			>
				버튼</button>
		</>
	);
}

function App() {
	const handleClick = (event) => {
					console.log(event);
					alert('버튼 클릭');
				}
	return (
		<>
			<button
				onClick={handleClick}
			>
				버튼</button>
		</>
	);
}
```
