// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b === btn));
    document.querySelectorAll('.model').forEach(m => m.classList.toggle('active', m.id === target));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// Per-question buttons
document.querySelectorAll('.question').forEach(q => {
  const tBtn = q.querySelector('.btn-translate');
  const aBtn = q.querySelector('.btn-answer');
  const trans = q.querySelector('.translation');
  const ans = q.querySelector('.answer');

  if (tBtn && trans) {
    tBtn.addEventListener('click', () => {
      const hidden = trans.hasAttribute('hidden');
      if (hidden) trans.removeAttribute('hidden'); else trans.setAttribute('hidden', '');
      tBtn.textContent = hidden ? 'إخفاء الترجمة' : 'إظهار الترجمة';
    });
  }

  if (aBtn && ans) {
    aBtn.addEventListener('click', () => {
      const hidden = ans.hasAttribute('hidden');
      if (hidden) ans.removeAttribute('hidden'); else ans.setAttribute('hidden', '');
      aBtn.textContent = hidden ? 'إخفاء الحل' : 'إظهار الحل';

      const correct = (ans.dataset.correct || '').toLowerCase();
      q.querySelectorAll('.options label').forEach(l => {
        const txt = l.textContent.trim().toLowerCase();
        const isMatch = txt.startsWith(correct + '.') || txt.startsWith(correct + ')') || txt.startsWith(correct + ' ');
        if (!hidden) l.classList.remove('correct');
        else if (isMatch) l.classList.add('correct');
      });
    });
  }
});
