(function () {
  const roots = document.querySelectorAll('.doc-search');
  if (!roots.length) return;

  const currentPath = window.location.pathname;
  const loadedIndexes = {};

  function normalizeText(value) {
    return (value || '').toLowerCase();
  }

  function makeSnippet(content, query) {
    const text = (content || '').replace(/\s+/g, ' ').trim();
    if (!text) return '';

    const q = normalizeText(query);
    const hay = normalizeText(text);
    const at = q ? hay.indexOf(q) : -1;
    const start = at > 60 ? at - 60 : 0;
    const end = Math.min(start + 170, text.length);
    const snippet = text.slice(start, end);
    return (start > 0 ? '... ' : '') + snippet + (end < text.length ? ' ...' : '');
  }

  function searchDocs(items, query, scope) {
    const q = normalizeText(query).trim();
    if (!q) return [];

    const tokens = q.split(/\s+/).filter(Boolean);
    const filtered = items.filter(function (item) {
      if (scope && item.scope !== scope) return false;
      if (item.url === currentPath || item.url === currentPath + '/') return false;
      const title = normalizeText(item.title);
      const content = normalizeText(item.content);
      return tokens.every(function (t) {
        return title.includes(t) || content.includes(t);
      });
    });

    filtered.forEach(function (item) {
      const title = normalizeText(item.title);
      const content = normalizeText(item.content);
      let score = 0;
      tokens.forEach(function (t) {
        if (title.includes(t)) score += 4;
        if (content.includes(t)) score += 1;
      });
      item._score = score;
    });

    filtered.sort(function (a, b) {
      return b._score - a._score;
    });

    return filtered.slice(0, 8);
  }

  function renderResults(container, results, query) {
    container.innerHTML = '';
    if (!query.trim()) {
      container.hidden = true;
      return;
    }

    if (!results.length) {
      const empty = document.createElement('div');
      empty.className = 'doc-search-empty';
      empty.textContent = 'No matching docs found.';
      container.appendChild(empty);
      container.hidden = false;
      return;
    }

    const list = document.createElement('ul');
    list.className = 'doc-search-list';

    results.forEach(function (item) {
      const li = document.createElement('li');
      li.className = 'doc-search-item';

      const a = document.createElement('a');
      a.href = item.url;
      a.className = 'doc-search-link';

      const title = document.createElement('div');
      title.className = 'doc-search-item-title';
      title.textContent = item.title || item.url;

      const snippet = document.createElement('div');
      snippet.className = 'doc-search-item-snippet';
      snippet.textContent = makeSnippet(item.content, query);

      a.appendChild(title);
      a.appendChild(snippet);
      li.appendChild(a);
      list.appendChild(li);
    });

    container.appendChild(list);
    container.hidden = false;
  }

  roots.forEach(function (root) {
    const input = root.querySelector('.doc-search-input');
    const resultsContainer = root.querySelector('.doc-search-results');
    const indexUrl = root.getAttribute('data-index-url');
    const scope = root.getAttribute('data-doc-scope') || '';
    if (!input || !resultsContainer || !indexUrl) return;

    async function getIndex() {
      if (!loadedIndexes[indexUrl]) {
        loadedIndexes[indexUrl] = fetch(indexUrl).then(function (res) {
          if (!res.ok) throw new Error('Search index request failed');
          return res.json();
        }).catch(function () {
          return [];
        });
      }
      return loadedIndexes[indexUrl];
    }

    let timer = null;
    input.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(async function () {
        const items = await getIndex();
        const found = searchDocs(items, input.value, scope);
        renderResults(resultsContainer, found, input.value);
      }, 110);
    });

    document.addEventListener('click', function (event) {
      if (!root.contains(event.target)) {
        resultsContainer.hidden = true;
      }
    });
  });
})();
