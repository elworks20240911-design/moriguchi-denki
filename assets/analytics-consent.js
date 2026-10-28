/* EL works: optional, consent-gated audience measurement. No form tracking. */
(() => {
  'use strict';
  const id = 'G-4RYJ9RRNBN', key = 'elworksAnalyticsConsent';
  const panel = document.getElementById('analytics-panel');
  const status = document.getElementById('analytics-status');
  const settings = document.getElementById('analytics-settings');
  let loaded = false;
  window['ga-disable-' + id] = true;
  function readChoice() {
    if (window.location.hash === '#analytics-disabled') return 'denied';
    try { if (window.sessionStorage.getItem(key) === 'denied') return 'denied'; } catch (_) {}
    try { const raw = localStorage.getItem(key); if (raw) localStorage.setItem(key, raw); const v = JSON.parse(raw); return v && v.expires > Date.now() ? v.choice : null; } catch (_) { return null; }
  }
  function save(choice) {
    try { localStorage.setItem(key, JSON.stringify({choice, expires: Date.now() + 180 * 86400000})); return true; } catch (_) { return false; }
  }
  function load() {
    if (loaded) return;
    loaded = true;
    window['ga-disable-' + id] = false;
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    const page = document.querySelector('link[rel="canonical"]').href;
    let referrer = '';
    try { const u = new URL(document.referrer); if (/^https?:$/.test(u.protocol)) referrer = u.origin + '/'; } catch (_) {}
    const context = {page_location: page, page_title: document.title, page_referrer: referrer};
    gtag('consent', 'default', {analytics_storage:'granted', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'});
    gtag('set', context);
    gtag('js', new Date());
    gtag('config', id, {...context, send_page_view:false, allow_google_signals:false, allow_ad_personalization_signals:false, cookie_domain:'none', cookie_path:'/moriguchi-denki/', cookie_prefix:'elw', cookie_expires:15552000, cookie_flags:'SameSite=Lax;Secure'});
    gtag('event', 'page_view', {...context, send_to:id});
    const script = document.createElement('script');
    script.async = true;
    script.referrerPolicy = 'no-referrer';
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(script);
  }
  function removeOwnCookies() {
    document.cookie.split(';').forEach(part => {
      const name = part.trim().split('=')[0];
      if (/^elw_ga(?:_|$)/.test(name)) document.cookie = name + '=; Max-Age=0; Path=/moriguchi-denki/; SameSite=Lax; Secure';
    });
  }
  function close(message) { panel.hidden = true; status.textContent = message; settings.focus(); }
  document.getElementById('analytics-accept').addEventListener('click', () => { try { window.sessionStorage.removeItem(key); } catch (_) {} if (window.location.hash === '#analytics-disabled') window.history.replaceState(null, '', window.location.pathname + window.location.search); save('granted'); load(); close('アクセス解析を許可しました。'); });
  document.getElementById('analytics-decline').addEventListener('click', () => {
    const saved = save('denied');
    if (!saved) { try { localStorage.removeItem(key); } catch (_) {} }
    try { window.sessionStorage.setItem(key, 'denied'); } catch (_) {}
    window['ga-disable-' + id] = true;
    if (!saved) window.history.replaceState(null, '', '#analytics-disabled'); removeOwnCookies();
    close('アクセス解析を許可しない設定です。');
    if (loaded) window.location.reload();
  });
  settings.addEventListener('click', () => { panel.hidden = false; document.getElementById('analytics-decline').focus(); });
  window.addEventListener('storage', event => {
    if ((event.key === key || event.key === null) && readChoice() !== 'granted') {
      window['ga-disable-' + id] = true; removeOwnCookies(); if (loaded) window.location.reload();
    }
  });
  const choice = readChoice();
  panel.hidden = choice === 'granted' || choice === 'denied';
  if (choice === 'granted') load();
})();
