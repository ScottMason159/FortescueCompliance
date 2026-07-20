(() => {
  const textSizeButton = document.getElementById('textSizeButton');
  const printButton = document.getElementById('printButton');
  const dialog = document.getElementById('imageDialog');
  const dialogImage = document.getElementById('dialogImage');
  const closeDialog = document.getElementById('closeDialog');
  const pathButtons = [...document.querySelectorAll('.path-button')];
  const sections = [...document.querySelectorAll('[data-guide-section]')];

  function makeGroupControls(container, detailsList) {
    const controls = document.createElement('div');
    controls.className = 'accordion-controls';
    controls.innerHTML = `
      <button class="secondary-button expand-all" type="button">Expand all steps</button>
      <button class="secondary-button collapse-all" type="button">Collapse all steps</button>`;
    controls.querySelector('.expand-all').addEventListener('click', () => {
      detailsList.forEach(item => { item.open = true; });
    });
    controls.querySelector('.collapse-all').addEventListener('click', () => {
      detailsList.forEach(item => { item.open = false; });
    });
    container.prepend(controls);
  }

  function buildStatutoryAccordions() {
    const layout = document.querySelector('#statutory .step-layout');
    const tabs = [...document.querySelectorAll('#statutory .step-tab')];
    const panels = [...document.querySelectorAll('#statutory .step-panel')];
    if (!layout || !tabs.length || !panels.length) return;

    const accordion = document.createElement('div');
    accordion.className = 'accordion-list';
    const detailsList = [];

    tabs.forEach((tab, index) => {
      const panel = panels.find(p => p.dataset.panel === tab.dataset.step);
      if (!panel) return;
      panel.hidden = false;
      panel.classList.remove('active');

      const details = document.createElement('details');
      details.className = 'accordion-item';
      if (index === 0) details.open = true;

      const summary = document.createElement('summary');
      summary.innerHTML = `<span class="accordion-number">${tab.dataset.step}</span><span>${tab.textContent.replace(/^\s*\d+\s*/, '').trim()}</span><span class="accordion-hint">Open step</span>`;
      details.append(summary, panel);
      accordion.appendChild(details);
      detailsList.push(details);
    });

    layout.replaceWith(accordion);
    document.querySelector('#statutory .progress-wrap')?.remove();
    makeGroupControls(accordion, detailsList);
  }

  function buildCardAccordions() {
    const grid = document.querySelector('#hsr .card-grid');
    if (!grid) return;
    const cards = [...grid.querySelectorAll('.simple-card')];
    const accordion = document.createElement('div');
    accordion.className = 'accordion-list';
    const detailsList = [];

    cards.forEach((card, index) => {
      const heading = card.querySelector('h3')?.textContent || `Step ${index + 1}`;
      const details = document.createElement('details');
      details.className = 'accordion-item';
      if (index === 0) details.open = true;
      const summary = document.createElement('summary');
      summary.innerHTML = `<span class="accordion-number">${index + 1}</span><span>${heading}</span><span class="accordion-hint">Open step</span>`;
      card.querySelector('.number')?.remove();
      card.querySelector('h3')?.remove();
      card.classList.add('accordion-card-content');
      details.append(summary, card);
      accordion.appendChild(details);
      detailsList.push(details);
    });

    grid.replaceWith(accordion);
    makeGroupControls(accordion, detailsList);
  }

  function buildSseAccordions() {
    const strip = document.querySelector('#sse .process-strip');
    const imagePair = document.querySelector('#sse .image-pair');
    if (!strip) return;
    const steps = [...strip.children];
    const figures = imagePair ? [...imagePair.querySelectorAll('figure')] : [];
    const figureForStep = { 1: figures[0], 2: figures[1], 5: figures[2] };
    const accordion = document.createElement('div');
    accordion.className = 'accordion-list';
    const detailsList = [];

    steps.forEach((step, index) => {
      const number = index + 1;
      const text = step.querySelector('p')?.innerHTML || '';
      const details = document.createElement('details');
      details.className = 'accordion-item';
      if (index === 0) details.open = true;
      const summary = document.createElement('summary');
      summary.innerHTML = `<span class="accordion-number">${number}</span><span>${step.textContent.replace(/^\s*\d+\s*/, '').trim()}</span><span class="accordion-hint">Open step</span>`;
      const content = document.createElement('div');
      content.className = 'sse-step-content';
      content.innerHTML = `<p>${text}</p>`;
      if (figureForStep[number]) content.appendChild(figureForStep[number]);
      details.append(summary, content);
      accordion.appendChild(details);
      detailsList.push(details);
    });

    strip.replaceWith(accordion);
    imagePair?.remove();
    makeGroupControls(accordion, detailsList);
  }

  function buildRescindAccordion() {
    const task = document.querySelector('#rescind .single-task');
    if (!task) return;
    const details = document.createElement('details');
    details.className = 'accordion-item';
    details.open = true;
    const summary = document.createElement('summary');
    summary.innerHTML = '<span class="accordion-number">1</span><span>Open the rescind steps</span><span class="accordion-hint">Open step</span>';
    task.parentNode.insertBefore(details, task);
    details.append(summary, task);
    makeGroupControls(details.parentNode, [details]);
  }

  function setCategoryState(section, button, open) {
    section.classList.toggle('category-collapsed', !open);
    button.classList.toggle('active', open);
    button.setAttribute('aria-expanded', String(open));
    const toggle = section.querySelector('.category-toggle');
    if (toggle) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Collapse section' : 'Expand section';
    }
  }

  function setupCategoryToggles() {
    sections.forEach((section, index) => {
      section.hidden = false;
      const heading = section.querySelector('.section-heading');
      const pathButton = pathButtons.find(b => b.dataset.target === section.id);
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'secondary-button category-toggle';
      toggle.textContent = index === 0 ? 'Collapse section' : 'Expand section';
      toggle.setAttribute('aria-expanded', String(index === 0));
      heading?.appendChild(toggle);
      setCategoryState(section, pathButton, index === 0);

      const toggleSection = () => {
        const open = section.classList.contains('category-collapsed');
        setCategoryState(section, pathButton, open);
        if (open) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
      toggle.addEventListener('click', toggleSection);
      pathButton?.addEventListener('click', toggleSection);
    });
  }

  function setupImageZoom() {
    document.querySelectorAll('figure img, .simple-card img').forEach(image => {
      image.addEventListener('click', () => {
        dialogImage.src = image.src;
        dialogImage.alt = image.alt;
        dialog.showModal();
      });
    });
  }

  buildStatutoryAccordions();
  buildCardAccordions();
  buildSseAccordions();
  buildRescindAccordion();
  setupCategoryToggles();
  setupImageZoom();

  textSizeButton.addEventListener('click', () => {
    const enabled = document.body.classList.toggle('large-text');
    textSizeButton.textContent = enabled ? 'Standard text' : 'Larger text';
    textSizeButton.setAttribute('aria-pressed', String(enabled));
  });

  printButton.addEventListener('click', () => window.print());
  closeDialog.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
})();
