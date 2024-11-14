// mini-react.js
// Глобальный стейт для хранения текущего компонента и эффектов
let currentComponent = null;
let effectsQueue = [];

// Функция для создания реактивного состояния
function useState(initialValue) {
  const component = currentComponent;

  // Создаем состояние, если его еще нет
  if (!component.states) {
    component.states = [];
    component.stateIndex = 0;
  }

  if (component.states.length <= component.stateIndex) {
    component.states[component.stateIndex] = initialValue;
  }

  const currentIndex = component.stateIndex;

  // Функция для обновления состояния
  const setState = (newValue) => {
    if (component.states[currentIndex] !== newValue) {
      component.states[currentIndex] = newValue;
      renderComponent(component);
    }
  };

  const state = component.states[component.stateIndex++];
  return [state, setState];
}

// Функция для создания эффектов
function useEffect(callback, dependencies) {
  const component = currentComponent;

  if (!component.effects) {
    component.effects = [];
    component.effectIndex = 0;
  }

  const currentIndex = component.effectIndex++;

  effectsQueue.push({
    callback,
    dependencies,
    component,
    index: currentIndex,
    previousDeps: component.effects[currentIndex]?.dependencies,
  });
}

// Функция для рендеринга компонента
function renderComponent(component) {
  currentComponent = component;
  component.stateIndex = 0;
  component.effectIndex = 0;
  effectsQueue = [];

  // Вызываем функцию компонента для получения нового DOM
  const newDom = component.render();

  // Обновляем DOM
  if (component.dom) {
    component.dom.replaceWith(newDom);
  }
  component.dom = newDom;

  // Запускаем эффекты
  runEffects();

  currentComponent = null;
}

// Функция для запуска эффектов
function runEffects() {
  effectsQueue.forEach((effect) => {
    const { callback, dependencies, component, index, previousDeps } = effect;

    const depsChanged =
      !previousDeps ||
      !dependencies ||
      dependencies.some((dep, i) => dep !== previousDeps[i]);

    if (depsChanged) {
      // Очищаем предыдущий эффект если есть cleanup функция
      if (component.effects[index]?.cleanup) {
        component.effects[index].cleanup();
      }

      // Запускаем эффект и сохраняем cleanup функцию
      const cleanup = callback();
      component.effects[index] = { cleanup, dependencies };
    }
  });
}

// Функция для монтирования компонента в DOM
function mount(Component, rootElement) {
  const component = {
    render: () => Component(),
    states: [],
    effects: [],
    stateIndex: 0,
    effectIndex: 0,
  };

  renderComponent(component);
  rootElement.appendChild(component.dom);

  return component;
}

export { useState, useEffect, mount };
