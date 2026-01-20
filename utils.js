
export function getIdleButton(selector = 'button.idleBtn') {
  const btn = document.querySelector(selector);
  if (!btn) throw new Error(`Idle button not found by selector: ${selector}`);
  return btn;
}

export function initIdleButton(button, { activeClass = 'active' } = {}) {
  const setActive = (value) => button.classList.toggle(activeClass, value);
  const isActive = () => button.classList.contains(activeClass);

  button.addEventListener('click', () => setActive(!isActive()));

  return { isActive, setActive };
}

export const animateIdle = (group, time, isChangePosition) => {
  group.rotation.y = time * 0.5;
  if (isChangePosition) group.position.y = Math.sin(time);
}

export const setDefaultPosition = (group) => {
  group.rotation.y = 0;
  group.position.y = 0;
}