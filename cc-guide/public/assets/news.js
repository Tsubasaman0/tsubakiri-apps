(async () => {
  const list = document.getElementById('news-list');
  const updated = document.getElementById('news-updated');
  if (!list) return;

  function text(tag, value, className) {
    const node = document.createElement(tag);
    node.textContent = value;
    if (className) node.className = className;
    return node;
  }

  try {
    const indexResponse = await fetch('news/index.json', { cache: 'no-store' });
    if (!indexResponse.ok) throw new Error(`index: HTTP ${indexResponse.status}`);
    const index = await indexResponse.json();
    const dataResponse = await fetch(`news/${index.latest}`, { cache: 'no-store' });
    if (!dataResponse.ok) throw new Error(`news: HTTP ${dataResponse.status}`);
    const data = await dataResponse.json();

    updated.textContent = `最終更新 ${data.generatedAtJst}`;
    list.replaceChildren();
    for (const item of data.items) {
      const card = document.createElement('article');
      card.className = 'news-card';
      const meta = document.createElement('div');
      meta.className = 'news-meta';
      meta.append(text('span', item.date));
      meta.append(text('span', item.sourceTier, 'tier-badge'));
      meta.append(text('span', item.status, 'status-badge'));
      card.append(meta, text('h2', item.headline));
      const summary = document.createElement('ul');
      for (const line of item.summary) summary.append(text('li', line));
      card.append(summary);
      // 用語の説明は本文に混ぜず、記事の下に小さな注として1つだけ出す(無ければ出さない)
      if (item.note) card.append(text('p', item.note, 'note'));
      const source = text('p', '', 'source-note');
      const link = document.createElement('a');
      link.href = item.sourceUrl;
      link.textContent = item.sourceName;
      link.rel = 'noopener';
      source.append(link);
      card.append(source);
      list.append(card);
    }
    if (!data.items.length) list.append(text('p', '掲載条件を満たす新着はありませんでした。', 'news-empty'));
  } catch (error) {
    list.replaceChildren(text('p', 'ニュースを読み込めませんでした。時間を置いて再読み込みしてください。', 'news-empty'));
    updated.textContent = '更新日時を取得できません';
    console.error(error);
  }
})();

