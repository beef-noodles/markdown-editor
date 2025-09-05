export function appendReferencesSection(input: HTMLElement | string): HTMLElement | string | void {
  if (!input) return;

  const isStringInput = typeof input === 'string';
  const root: HTMLElement = (() => {
    if (isStringInput) {
      const temp = document.createElement('div');
      temp.innerHTML = input as string;
      return temp;
    }
    return input as HTMLElement;
  })();

  const article = root.querySelector('article') as HTMLElement | null;
  const host = article || root;

  const existing = host.querySelector('#references-section');
  if (existing) existing.remove();

  host.querySelectorAll('.ref-sup').forEach(el => el.remove());

  const anchorNodes = Array.from(host.querySelectorAll('a[href]')) as HTMLAnchorElement[];
  const referencesMap = new Map<string, string>();

  for (const a of anchorNodes) {
    const href = a.getAttribute('href') || '';
    if (!href) continue;
    if (href.startsWith('#')) continue;
    if (/^mailto:/i.test(href)) continue;
    const text = (a.textContent || a.getAttribute('title') || href).trim();
    if (!referencesMap.has(href)) {
      referencesMap.set(href, text || href);
    }
  }

  if (referencesMap.size === 0) return;

  const hrefToIndex = new Map<string, number>();
  let runningIndex = 1;
  for (const href of referencesMap.keys()) {
    hrefToIndex.set(href, runningIndex++);
  }

  for (const a of anchorNodes) {
    const href = a.getAttribute('href') || '';
    if (!href || href.startsWith('#') || /^mailto:/i.test(href)) continue;
    const idx = hrefToIndex.get(href);
    if (!idx) continue;
    const sup = document.createElement('sup');
    sup.className = 'ref-sup';
    sup.textContent = `[${idx}]`;
    a.insertAdjacentElement('afterend', sup);
  }

  const section = document.createElement('section');
  section.id = 'references-section';


  const heading = document.createElement('h2');
  heading.textContent = '参考';

  section.appendChild(heading);

  const list = document.createElement('ol');


  let index = 1;
  for (const [href, text] of referencesMap.entries()) {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = href;
    link.textContent = `${text} — ${href}`;

    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    li.setAttribute('data-ref-index', String(index++));
    li.appendChild(link);
    list.appendChild(li);
  }

  section.appendChild(list);
  host.appendChild(section);

  if (isStringInput) {
    return root.innerHTML;
  }
  return root;
}
