// Adds a material-style ripple to any enabled <button> on click.
// Installed once globally so individual components don't need changes.
export function installRipple() {
  if (typeof document === 'undefined') return;

  document.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    const button = event.target.closest('button');
    if (!button || button.disabled || button.dataset.noRipple !== undefined) return;

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

    button.classList.add('ripple-host');
    button.appendChild(ripple);
    ripple.addEventListener('animationend', () => {
      ripple.remove();
      if (!button.querySelector('.ripple')) button.classList.remove('ripple-host');
    });
  });
}
