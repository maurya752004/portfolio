const SITE = {
  projectsUrl: 'data/projects.json',
  certificatesUrl: 'data/certificates.json',
};

const elements = {
  navToggle: document.querySelector('[data-nav-toggle]'),
  navMenu: document.querySelector('[data-nav-menu]'),
  currentYear: document.querySelector('[data-current-year]'),
  projectGrid: document.querySelector('[data-project-grid]'),
  projectStatus: document.querySelector('[data-project-status]'),
  filterButtons: document.querySelectorAll('[data-filter]'),
  themeToggle: document.querySelector('[data-theme-toggle]'),
  certificateGrid: document.querySelector('[data-certificate-grid]'),
  certificateStatus: document.querySelector('[data-certificate-status]'),
};

const projectState = {
  projects: [],
  filter: 'All',
};

function setCurrentYear() {
  if (elements.currentYear) {
    elements.currentYear.textContent = new Date().getFullYear();
  }
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('portfolio-theme', theme);

  if (elements.themeToggle) {
    const isDark = theme === 'dark';
    elements.themeToggle.textContent = isDark ? 'Light mode' : 'Dark mode';
    elements.themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  }
}

function initializeTheme() {
  const storedTheme = localStorage.getItem('portfolio-theme');
  setTheme(storedTheme === 'light' ? 'light' : 'dark');
}

function setNavState(isOpen) {
  if (!elements.navMenu || !elements.navToggle) {
    return;
  }

  elements.navMenu.classList.toggle('is-open', isOpen);
  elements.navToggle.setAttribute('aria-expanded', String(isOpen));
}

function closeNav() {
  setNavState(false);
}

function createTagList(items) {
  const list = document.createElement('ul');
  list.className = 'tag-list';
  items.forEach((item) => {
    const tag = document.createElement('li');
    tag.textContent = item;
    list.appendChild(tag);
  });
  return list;
}

function createButton({ label, href, variant = 'primary', download = false, target }) {
  const link = document.createElement('a');
  link.className = `button button--${variant}`;
  link.href = href;
  link.textContent = label;
  if (download) {
    link.setAttribute('download', '');
  }
  if (target) {
    link.target = target;
    link.rel = 'noreferrer noopener';
  }
  return link;
}

function renderCertificates(certificates) {
  if (!elements.certificateGrid) {
    return;
  }

  elements.certificateGrid.innerHTML = '';
  certificates.forEach((certificate) => {
    const card = document.createElement('article');
    card.className = 'certificate-card';

    if (certificate.preview) {
      const image = document.createElement('img');
      image.className = 'certificate-card__preview';
      image.src = certificate.preview;
      image.alt = `${certificate.title} preview`;
      image.loading = 'lazy';
      card.appendChild(image);
    } else {
      const documentIcon = document.createElement('div');
      documentIcon.className = 'certificate-card__document';
      documentIcon.textContent = 'PDF';
      documentIcon.setAttribute('aria-hidden', 'true');
      card.appendChild(documentIcon);
    }

    const body = document.createElement('div');
    body.className = 'certificate-card__body';
    const title = document.createElement('h3');
    title.textContent = certificate.title;
    const issuer = document.createElement('p');
    issuer.textContent = `${certificate.issuer} / ${certificate.type}`;
    const action = createButton({ label: 'View Certificate', href: certificate.file, variant: 'secondary', target: '_blank' });
    body.append(title, issuer, action);
    card.appendChild(body);
    elements.certificateGrid.appendChild(card);
  });
}

async function loadCertificates() {
  if (!elements.certificateGrid) {
    return;
  }

  try {
    const response = await fetch(SITE.certificatesUrl, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to load certificates (${response.status})`);
    }
    const data = await response.json();
    const certificates = Array.isArray(data) ? data : [];
    if (elements.certificateStatus) {
      elements.certificateStatus.textContent = `${certificates.length} certificates available.`;
    }
    renderCertificates(certificates);
  } catch (error) {
    if (elements.certificateStatus) {
      elements.certificateStatus.textContent = 'Certificates could not be loaded right now.';
    }
  }
}

function renderProjects(projects) {
  if (!elements.projectGrid) {
    return;
  }

  const normalizedFilter = projectState.filter.toLowerCase();
  const visibleProjects = projects.filter((project) => {
    if (normalizedFilter === 'all') {
      return true;
    }
    return String(project.category || '').toLowerCase() === normalizedFilter;
  });

  elements.projectGrid.innerHTML = '';

  if (!visibleProjects.length) {
    const emptyState = document.createElement('p');
    emptyState.className = 'empty-state';
    emptyState.textContent = 'No projects match the selected filter yet.';
    elements.projectGrid.appendChild(emptyState);
    return;
  }

  visibleProjects
    .slice()
    .sort((first, second) => {
      if (first.featured === second.featured) {
        return first.title.localeCompare(second.title);
      }
      return first.featured ? -1 : 1;
    })
    .forEach((project) => {
      const card = document.createElement('article');
      card.className = 'project-card';

      const image = document.createElement('img');
      image.className = 'project-card__image';
      image.src = project.image || 'assets/projects/project-placeholder.svg';
      image.alt = `${project.title} preview`;
      image.loading = 'lazy';
      image.width = 1600;
      image.height = 900;

      const body = document.createElement('div');
      body.className = 'project-card__body';

      const header = document.createElement('div');
      header.className = 'project-card__header';

      const title = document.createElement('h3');
      title.textContent = project.title;

      const category = document.createElement('span');
      category.className = 'project-card__category';
      category.textContent = project.category;

      header.append(title, category);

      const description = document.createElement('p');
      description.className = 'project-card__description';
      description.textContent = project.description;

      const technologies = createTagList(project.technologies || []);

      const actions = document.createElement('div');
      actions.className = 'project-card__actions';

      if (project.github) {
        actions.appendChild(createButton({ label: 'GitHub', href: project.github, variant: 'secondary', target: '_blank' }));
      }

      if (project.demo) {
        actions.appendChild(createButton({ label: 'Live Demo', href: project.demo, target: '_blank' }));
      }

      if (project.page) {
        actions.appendChild(createButton({ label: 'View Project', href: project.page, variant: 'ghost' }));
      }

      body.append(header, description, technologies, actions);
      card.append(image, body);
      elements.projectGrid.appendChild(card);
    });
}

function updateFilterButtons(activeFilter) {
  elements.filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === activeFilter;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

async function loadProjects() {
  if (!elements.projectGrid) {
    return;
  }

  if (elements.projectStatus) {
    elements.projectStatus.textContent = 'Loading projects...';
  }

  try {
    const response = await fetch(SITE.projectsUrl, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to load projects (${response.status})`);
    }

    const data = await response.json();
    projectState.projects = Array.isArray(data) ? data : [];

    if (elements.projectStatus) {
      elements.projectStatus.textContent = `${projectState.projects.length} projects loaded.`;
    }

    renderProjects(projectState.projects);
  } catch (error) {
    if (elements.projectStatus) {
      elements.projectStatus.textContent = 'Projects could not be loaded right now.';
    }

    elements.projectGrid.innerHTML = '';
    const fallback = document.createElement('p');
    fallback.className = 'empty-state';
    fallback.textContent = 'Add or preview projects locally with a static server to load the JSON data.';
    elements.projectGrid.appendChild(fallback);
  }
}

function bindEvents() {
  if (elements.themeToggle) {
    elements.themeToggle.addEventListener('click', () => {
      const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
    });
  }

  if (elements.navToggle) {
    elements.navToggle.addEventListener('click', () => {
      const isOpen = elements.navMenu?.classList.contains('is-open');
      setNavState(!isOpen);
    });
  }

  document.querySelectorAll('[data-nav-link]').forEach((link) => {
    link.addEventListener('click', () => {
      closeNav();
    });
  });

  elements.filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      projectState.filter = button.dataset.filter || 'All';
      updateFilterButtons(projectState.filter);
      renderProjects(projectState.projects);
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) {
      closeNav();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  setCurrentYear();
  updateFilterButtons(projectState.filter);
  bindEvents();
  loadProjects();
  loadCertificates();
});
