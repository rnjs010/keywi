# React 공부

## 내부 상태 관리 State

- useState : 변경이 가능한 데이터고, 변경될 때마다 UI를 업데이트 함
  - stateful한 value와 업데이트하는 함수를 return 함
- 함수가 계속 호출되어도 0으로 초기화되지 않는 이유 : useState Hook은 값을 기억하고 있음

```java
import React, { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

```java
import React, { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

// 이렇게 하면 클릭되는 순간 캡쳐한 값인데 모두 count가 0이므로 1씩 늘어남 (5 X)
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => {
          setCount(count + 1)
          setCount(count + 1)
          setCount(count + 1)
          setCount(count + 1)
          setCount(count + 1)
         }}>Increment</button>
    </div>
  );
}

export default function Counter() {
  const [count, setCount] = useState(0);

// 이렇게 하면 클릭되는 순간 내부에서 외부에 참조하는 것이 없으므로 이전값 기준 5씩 늘어남
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => {
          setCount((prev) => prev + 1)
          setCount((prev) => prev + 1)
          setCount((prev) => prev + 1)
          setCount((prev) => prev + 1)
          setCount((prev) => prev + 1)
         }}>Increment</button>
    </div>
  );
}
```

## useEffect

- 컴포넌트가 처음 보여질 때(mount)만 네트워크 통신을 할 때 이용

```jsx
// Products.jsx
import { useEffect } from "react";

export default function Products() {
    const [products, setProducts] = useState([]);

    // useEffect의 첫 번재 인자는 콜백함수 (컴포넌트가 보여질 대 처음 한 번만 호출)
    useEffect(() => {
        fetch('data/products.json')
            .then(response => response.json())
            .then(data => {
                console.log('네트워크에서 데이터 받아옴');
                setProducts(data);
            });

            // 컴포넌트가 없어질 때, 메모리 정리 or 소켓 닫기 등을 처리하는 경우, return에 콜백함수를 작성
            // 컴포넌트 사라질 때 (unmount) 호출
            return () => {
                console.log('cleanup');
            };
    }, []);  // 한 번만 호출되어야 하는 경우, 두 번째 인자로 빈 배열을 전달 (dependency가 전달되지 않음)

    return (
        <div>
            <ul>
                {products.map(product => (
                    <li key={product.id}>
                        <article>
                            <h2>{product.name}</h2>
                            <p>{product.price}</p>
                        </article>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// products.json
[
    { "id": 1, "name": "Notebook", "price": 1200 },
    { "id": 2, "name": "Tablet", "price": 800 },
    { "id": 3, "name": "Smartphone", "price": 1000 }
]

// App.jsx
export default function App() {
    const [showProduct, setShowProduct] = useState(true);
    return (
        <div>
            <button onClick={() => setShowProduct(!showProduct)}>
                {showProduct ? '숨기기' : '보이기'}
            </button>

            {/* 위 코드와 동일 */}
            <button onClick={() => setShowProduct((show) => !show)}>
                {showProduct ? '숨기기' : '보이기'}
            </button>

            {showProduct && <Products />}
        </div>
    );
}
```

- 특정 값이 변경되었을 때, 다시 네트워크 요청이 필요할 수도 있음

```jsx
import { useEffect } from "react";

export default function Products() {
    const [products, setProducts] = useState([]);

    **const [checked, setChecked] = useState(false);
    const handleChange = () => {
        setChecked(prev => !prev);
    }**

    useEffect(() => {
        **fetch(`data/${checked ? 'sale_' : ''}products.json`)**
            .then(response => response.json())
            .then(data => {
                console.log('네트워크에서 데이터 받아옴');
                setProducts(data);
            });

            return () => {
                console.log('cleanup');
            };
    **}, [checked]);  // check가 변경될 때마다 useEffect 호출**

    return (
        <>
            **<input type="checkbox" value={checked} onChange={handleChange} />
            <label htmlFor='checkbox'>Show Only Sale</label>**

            <ul>
                {products.map(product => (
                    <li key={product.id}>
                        <article>
                            <h2>{product.name}</h2>
                            <p>{product.price}</p>
                        </article>
                    </li>
                ))}
            </ul>
        </>
    );
}

// products.json
[
    { "id": 1, "name": "Notebook", "price": 1200 },
    { "id": 2, "name": "Tablet", "price": 800 },
    { "id": 3, "name": "Smartphone", "price": 1000 }
]

// sale_products.json
[
    { "id": 1, "name": "Notebook", "price": 1200 },
    { "id": 3, "name": "Smartphone", "price": 1000 }
]
```

- 고유한 key를 전달해주지 않으면 에러 발생

```jsx
<ul>
    {products.map(product => (
        **<li key={product.id}>**
            <article>
                <h2>{product.name}</h2>
                <p>{product.price}</p>
            </article>
        </li>
    ))}
</ul>
```

## 마우스 따라가기

```jsx
import React, { useState } from "react";

export default function AppXY() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  return (
    <div
      onPointerMove={(e) => {
        console.log(e.clientX, e.clientY);
        setX(e.clientX);
        setY(e.clientY);
      }}
    >
      <div style={{ transform: `translate(${x}px, ${y}px)` }}></div>
    </div>
  );
}
```

```jsx
import React, { useState } from "react";

****export default function AppXY() {
  **const [position, setPosition] = useState({ x: 0, y: 0 });**

  return (
    <div
      onPointerMove={(e) => {
        console.log(e.clientX, e.clientY);
        **// 객체로 만들어 한 번에 변경
        setPosition({ x: e.clientX, y: e.clientY });

        // 수평으로만 이동하게 하려면
        setPosition((prev) => ({ x: e.clientX, y: prev.y }));

        // 객체 안에 값이 여러개라면, 이전 값 유지한 채 x 값만 변경
        setPosition((prev) => ({ ...prev, x: e.clientX }));**
      }}
    >
      <div style={{ transform: `translate(${x}px, ${y}px)` }}></div>
    </div>
  );
}

```

## 중첩 객체 값 변경 (이름 동일할 때 생략 가능 name: name)

```jsx
import React, { useState } from "react";

export default function AppXY() {
  const [person, setPerson] = useState({
    name: "mike",
    age: 20,
    mentor: {
      name: "jane",
      title: "개발자",
    },
  });

  return (
    <div>
      <button
        onClick={() => {
          **setPerson((person) => ({
            ...person,
            mentor: { ...person.mentor, name, },
          }));**
        }}
      >
        멘토 이름 변경
      </button>
    </div>
  );
}

```

- 원칙적으로 리액트에서 상태는 불변성을 유지해야 함
- 리액트는 객체를 만들면 객체마다 고유한 참조값이 만들어짐
  → 참조값이 변경되어야지 업데이트 되었다는 것을 알 수 있음
  ⇒변경해야 한다면, 새로운 값/객체/배열로 만들어야 함
- … 하면 객체나 배열을 풀어줌

```jsx
import React, { useState } from "react";

export default function AppXY() {
  const [person, setPerson] = useState({
    name: "mike",
    age: 20,
    mentors: [
      { name: "jane", title: "개발1" },
      { name: "peter", title: "개발2" },
    ],
  });

  return (
    <div>
      {/* 이름 변경 */}
      <button
        onClick={() => {
          const prev = prompt("누구 이름 변경?");
          const current = prompt("누구로 변경?");

          setPerson((person) => ({
            // 새로운 객체 생성
            ...person,
            mentors: person.mentors.map((mentor) => {
              // 새로운 배열 생성
              if (mentor.name === prev) {
                return { ...mentor, name: current };
              }
              return mentor;
            }),
          }));
        }}
      >
        멘토 이름 변경
      </button>

      {/* 멘토 삭제 */}
      <button
        onClick={() => {
          const name = prompt("누구 삭제?");

          setPerson((person) => ({
            ...person,
            mentors: person.mentors.filter((mentor) => mentor.name !== name),
          }));
        }}
      >
        멘토 삭제
      </button>

      {/* 멘토 추가 */}
      <button
        onClick={() => {
          const name = prompt("이름?");
          const title = prompt("직함?");

          setPerson((person) => ({
            ...person,
            mentors: [...person.mentors, { name, title }],
            // mentors: [{ name, title }, ...person.mentors],  앞에 추가하기
          }));
        }}
      >
        멘토 추가
      </button>
    </div>
  );
}
```

```jsx
// 코드 개선
import React, { useState } from "react";

export default function AppXY() {
  const [person, setPerson] = useState(initialPerson);

  const handleUpdate = () => {
    const prev = prompt("누구 이름 변경?");
    const current = prompt("누구로 변경?");

    setPerson((person) => ({
      // 새로운 객체 생성
      ...person,
      mentors: person.mentors.map((mentor) => {
        // 새로운 배열 생성
        if (mentor.name === prev) {
          return { ...mentor, name: current };
        }
        return mentor;
      }),
    }));
  };

  const handleAdd = () => {
    const name = prompt("이름?");
    const title = prompt("직함?");

    setPerson((person) => ({
      ...person,
      mentors: [...person.mentors, { name, title }],
      // mentors: [{ name, title }, ...person.mentors],
    }));
  };

  const handleDelete = () => {
    const name = prompt("누구 삭제?");

    setPerson((person) => ({
      ...person,
      mentors: person.mentors.filter((mentor) => mentor.name !== name),
    }));
  };

  return (
    <div>
      {/* 이름 변경 */}
      <button onClick={handleUpdate}>멘토 이름 변경</button>

      {/* 멘토 삭제 */}
      <button onClick={handleDelete}>멘토 삭제</button>

      {/* 멘토 추가 */}
      <button onClick={handleAdd}>멘토 추가</button>
    </div>
  );
}

const initialPerson = {
  name: "mike",
  age: 20,
  mentors: [
    { name: "jane", title: "개발1" },
    { name: "peter", title: "개발2" },
  ],
};
```

## useReducer

- 다른 컴포넌트에서도 사용할 수 있도록 한 코드

```jsx
// .js
export default function personReducer(person, action) {
  switch (action.type) {
    case "UPDATE":
      const { prev, current } = action;
      return {
        ...person,
        mentors: person.mentors.map((mentor) => {
          if (mentor.name === prev) {
            return { ...mentor, name: current };
          }
          return mentor;
        }),
      };
    case "ADD":
      const { name, title } = action;
      return {
        ...person,
        mentors: [...person.mentors, { name, title }],
      };
    case "DELETE":
      return {
        ...person,
        mentors: person.mentors.filter((mentor) => mentor.name !== action.name),
      };
    default: {
      throw Error("알 수 없는 액션입니다.");
    }
  }
}
```

```jsx
// .jsx
export default function AppXY() {
  const [person, dispatch] = useReducer(personReducer, initialPerson);

  const handleUpdate = () => {
    const prev = prompt("누구 이름 변경?");
    const current = prompt("누구로 변경?");
    dispatch({ type: "UPDATE", prev, current });
  };

  const handleAdd = () => {
    const name = prompt("이름?");
    const title = prompt("직함?");
    dispatch({ type: "ADD", name, title });
  };

  const handleDelete = () => {
    const name = prompt("누구 삭제?");
    dispatch({ type: "DELETE", name });
  };

  return (
    <div>
      {/* 이름 변경 */}
      <button onClick={handleUpdate}>멘토 이름 변경</button>

      {/* 멘토 삭제 */}
      <button onClick={handleDelete}>멘토 삭제</button>

      {/* 멘토 추가 */}
      <button onClick={handleAdd}>멘토 추가</button>
    </div>
  );
}

const initialPerson = {
  name: "mike",
  age: 20,
  mentors: [
    { name: "jane", title: "개발1" },
    { name: "peter", title: "개발2" },
  ],
};
```

## form 제출 (객체 or 따로 가능)

```jsx
import React, { useState } from "react";

export default function AppXY() {
  const [form, setForm] = useState({ name: "", email: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">이름</label>
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="이름"
      />
      <label htmlFor="email">이메일</label>
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="이메일"
      />
      <button type="submit">전송</button>
    </form>
  );
}
```

## Nav 컴포넌트

```jsx
export default function AppWrap() {
  return (
    <>
      <Navbar>
        <h1>안녕하세요</h1>
      </Navbar>
    </>
  );
}

function Navbar({ children }) {
  return <header style={{ backgroundColor: "red" }}>{children}</header>;
}
```

## useCallback, useMemo, memo

- (변경되지 않으면 다시 렌더링 되지 않도록 함)

→ 엄청 느린 부분만 적용해서 개선된 것을 확인하기

![Image](https://github.com/user-attachments/assets/f196c96d-1293-42b0-a608-21a50b303944)

![Image](https://github.com/user-attachments/assets/25f133d6-1227-4c7f-8776-02e5ef7c3f94)

## 커스텀 hook

![Image](https://github.com/user-attachments/assets/78234818-eb1c-4f09-8c22-0ebd643c6c96)

![Image](https://github.com/user-attachments/assets/3231f3d3-6349-42a8-9dc5-cb9b26097636)
