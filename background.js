// Extension yüklendiğinde
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.storage.sync.set({ 
      preferredSite: 'turkanime',
      version: '4.0'
    });
    console.log('MAL & AniList Anime İzle Pro kuruldu!');
  } else if (details.reason === 'update') {
    const previousVersion = details.previousVersion;
    const currentVersion = chrome.runtime.getManifest().version;
    console.log(`Eklenti güncellendi: ${previousVersion} -> ${currentVersion}`);
  }
});

// Storage değişikliklerini dinle
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' || namespace === 'local') {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      console.log(`Storage key "${key}" değişti:`, oldValue, '->', newValue);
    }
  }
});

// Tab güncellemelerini dinle
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    const url = tab.url || '';
    if (url.includes('myanimelist.net/anime/') || url.includes('anilist.co/anime/')) {
      chrome.tabs.sendMessage(tabId, { action: 'refreshButton' }).catch(() => {});
    }
  }
});

// Mesajları dinle
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openAnimeLink') {
    chrome.tabs.create({ url: request.url });
    sendResponse({ success: true });
  }

  if (request.action === 'getCustomSites') {
    chrome.storage.local.get(['customSites'], (result) => {
      sendResponse({ sites: result.customSites || [] });
    });
    return true;
  }

  if (request.action === 'checkSiteAvailability') {
    fetch(request.url, { method: 'HEAD', mode: 'no-cors' })
      .then(() => sendResponse({ available: true }))
      .catch(() => sendResponse({ available: false }));
    return true;
  }
});

// Context menu ekle
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'searchAnime',
    title: 'Bu anime için Türkçe altyazı ara: "%s"',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'searchAnime') {
    const selectedText = info.selectionText;
    chrome.storage.sync.get(['preferredSite'], (result) => {
      const site = result.preferredSite || 'turkanime';
      
      // Özel siteleri kontrol et
      if (site.startsWith('custom-')) {
        chrome.storage.local.get(['customSites'], (localResult) => {
          const customSites = localResult.customSites || [];
          const customSite = customSites.find(s => s.id === site);
          if (customSite) {
            const searchUrl = customSite.searchUrl.replace('%s', encodeURIComponent(selectedText));
            chrome.tabs.create({ url: searchUrl });
          }
        });
      } else {
        // Varsayılan siteler
        let searchUrl;
        if (site === 'turkanime') {
          searchUrl = `https://www.turkanime.co/arama?q=${encodeURIComponent(selectedText)}`;
        } else if (site === 'anizm') {
          searchUrl = `https://anizm.net/?s=${encodeURIComponent(selectedText)}`;
        }
        if (searchUrl) chrome.tabs.create({ url: searchUrl });
      }
    });
  }
});

// Alarm her 24 saatte bir çalışır
chrome.alarms.create('cleanupOldData', { periodInMinutes: 1440 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'cleanupOldData') {
    console.log('Eski veriler temizleniyor...');

    chrome.storage.local.get(['customSites'], (result) => {
      const sites = result.customSites || [];
      const now = Date.now();
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;

      const filteredSites = sites.filter(site => {
        return !site.lastUsed || (now - site.lastUsed) < thirtyDays;
      });

      chrome.storage.local.set({ customSites: filteredSites }, () => {
        console.log('Eski site verileri temizlendi.');
      });
    });

    chrome.storage.sync.get(null, (items) => {
      if (!items.preferredSite) {
        chrome.storage.sync.set({ preferredSite: 'turkanime' });
        console.log('Varsayılan site tekrar ayarlandı.');
      }
    });
  }
});