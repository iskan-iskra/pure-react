import { mount } from "./core";
import App from "./App";

// Монтируем приложение после загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("app");
  mount(App, rootElement);
});
