/* ============================================================
   Dorian Cole — portfolio
   Chapter tab controller.
   ARIA tab pattern with keyboard arrows + URL-hash routing.
   Vanilla JS, no dependencies, deferred so it never blocks paint.
   ============================================================ */
(function () {
  'use strict';

  const tabs   = Array.from(document.querySelectorAll('[role="tab"]'));
  const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
  if (!tabs.length || !panels.length) return;

  function activate(id, focusTab) {
    let matched = false;
    tabs.forEach(t => {
      const isActive = t.dataset.target === id;
      if (isActive) matched = true;
      t.setAttribute('aria-selected', String(isActive));
      t.setAttribute('tabindex', isActive ? '0' : '-1');
      if (isActive && focusTab) t.focus();
    });
    if (!matched) return false;
    panels.forEach(p => {
      const isActive = p.id === id;
      p.hidden = !isActive;
      if (isActive) {
        // re-trigger the CSS fade animation
        p.style.animation = 'none';
        // force reflow
        void p.offsetWidth;
        p.style.animation = '';
      }
    });
    return true;
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      const id = tab.dataset.target;
      if (activate(id)) history.replaceState(null, '', '#' + id);
    });

    tab.addEventListener('keydown', (e) => {
      let next = null;
      switch (e.key) {
        case 'ArrowRight':
          next = (index + 1) % tabs.length;
          break;
        case 'ArrowLeft':
          next = (index - 1 + tabs.length) % tabs.length;
          break;
        case 'Home':
          next = 0;
          break;
        case 'End':
          next = tabs.length - 1;
          break;
        default:
          return;
      }
      e.preventDefault();
      const targetId = tabs[next].dataset.target;
      activate(targetId, true);
      history.replaceState(null, '', '#' + targetId);
    });
  });

  // initial state from URL hash, falling back to the first tab
  const initial = (location.hash || '').replace('#', '');
  if (!initial || !activate(initial)) {
    activate(tabs[0].dataset.target);
  }

  // back/forward buttons should switch tabs
  window.addEventListener('hashchange', () => {
    const id = (location.hash || '').replace('#', '');
    if (id) activate(id);
  });
})();
