### react re-render
react框架re-render的核心概念`当state发生变化的时候，重新渲染组件以及其子组件`

针对react的re-render，有一些misconception，主要有
- state发生变化的时候，re-render整个app（并不是，ui树结构顶层算起，哪个comp发生变化，重新渲染它以及子组件）
- comp只有在props发生变化的时候才re-render（根据core concept，即便props不发生变化，也重新渲染）

关于React.memo，将组件缓存起来，这些react不会每次都渲染组件，除非
- props发生变化
- 明确地使用了useContext hooks，context发生了变化（context可以看做隐式props）
- 备注：React.memo需要对比props才能决定是不是发生了变化，也是存在代价的
  - 组件props非常多，但是没有子组件，这时候直接渲染可能性能表现更好
  - 组件发生变化只以来context、props，且组件树非常深

分析react app的性能，需要在production模式下分析，production的性能是远远高于dev模式的，同时可以以来react devtools中profile面板分析react re-render的次数

react的component是函数，所以对于如下component
```js
function App() {
  const dog = {
    name: 'Spot',
    breed: 'Jack Russell Terrier'
  };
  return (
    <DogProfile dog={dog} />
  );
}
```
不管是否用React.memo进行包裹，每次均进行re-render

