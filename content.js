// Anime adını temizle ve normalize et - Geliştirilmiş
function normalizeTitle(title) {
  let normalized = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Aksanları kaldır
  
  // "2nd season", "3rd season" gibi ifadeleri düzelt
  normalized = normalized
    .replace(/\s*2nd\s+season/gi, '-2nd-season')
    .replace(/\s*3rd\s+season/gi, '-3rd-season')
    .replace(/\s*1st\s+season/gi, '-1st-season')
    .replace(/\s*(\d+)(st|nd|rd|th)\s+season/gi, '-$1$2-season')
    .replace(/\s+season\s*(\d+)/gi, '-season-$1');
  
  // Kelimeleri ayır
  const words = normalized.split(/\s+/);
  
  // Kısa tekrarlayan kelimeler için özel işlem (Dan Da Dan -> dandadan)
  if (words.length >= 2) {
    const shortWords = words.filter(w => w.length <= 3 && w.length > 0);
    if (shortWords.length === words.length || (shortWords.length >= 2 && words.length <= 4)) {
      // Tüm kelimeler kısa - birleştir
      normalized = words.join('');
    } else {
      // Normal kelimeler için tire ile birleştir
      normalized = words.join('-');
    }
  }
  
  return normalized
    .replace(/[^\w\s-]/g, '') // Özel karakterleri kaldır
    .replace(/\s+/g, '-') // Boşlukları tire ile değiştir
    .replace(/-+/g, '-') // Birden fazla tireyi tek tireye çevir
    .replace(/^-|-$/g, '') // Baştaki ve sondaki tireleri kaldır
    .trim();
}

// Başlık varyasyonları oluştur
function generateTitleVariations(title) {
  const variations = new Set();
  
  // Önce orijinal başlığı normalize et
  const normalized = normalizeTitle(title);
  variations.add(normalized);
  
  // Season/Part bilgisini ayır
  const seasonMatch = title.match(/(?:season\s*(\d+)|(\d+)(?:st|nd|rd|th)\s+season)/i);
  const partMatch = title.match(/part\s*(\d+)/i);
  
  let baseTitle = title;
  let seasonSuffix = '';
  
  if (seasonMatch) {
    const seasonNum = seasonMatch[1] || seasonMatch[2];
    baseTitle = title.replace(/(?:season\s*\d+|\d+(?:st|nd|rd|th)\s+season)/i, '').trim();
    
    // Farklı season formatları
    const ordinals = ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];
    const ordinal = parseInt(seasonNum) < ordinals.length ? ordinals[parseInt(seasonNum)] : `${seasonNum}th`;
    
    // Season varyasyonları ekle
    seasonSuffix = `-${ordinal}-season`;
    const altSeasonSuffix = `-season-${seasonNum}`;
    
    variations.add(`${normalizeTitle(baseTitle)}${seasonSuffix}`);
    variations.add(`${normalizeTitle(baseTitle)}${altSeasonSuffix}`);
    variations.add(`${normalizeTitle(baseTitle)}-${seasonNum}`);
  } else if (partMatch) {
    const partNum = partMatch[1];
    baseTitle = title.replace(/part\s*\d+/i, '').trim();
    variations.add(`${normalizeTitle(baseTitle)}-part-${partNum}`);
  }
  
  // Base title varyasyonları
  const words = baseTitle.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  
  // Tamamen birleşik (dandadan)
  const joined = words.join('').replace(/[^\w]/g, '');
  if (joined.length > 0) {
    variations.add(joined);
    if (seasonSuffix) {
      const ordinalMatch = seasonSuffix.match(/(\d+)(?:st|nd|rd|th)-season/);
      if (ordinalMatch) {
        variations.add(`${joined}-${ordinalMatch[0]}`);
        variations.add(`${joined}-season-${ordinalMatch[1]}`);
        variations.add(`${joined}-${ordinalMatch[1]}`);
      }
    }
  }
  
  // Tire ile ayrılmış (dan-da-dan)
  const withDashes = words.join('-').replace(/[^\w-]/g, '');
  if (withDashes.length > 0 && withDashes !== joined) {
    variations.add(withDashes);
    if (seasonSuffix) {
      variations.add(`${withDashes}${seasonSuffix}`);
    }
  }
  
  // Boşluksuz base title (season/part olmadan)
  if (seasonMatch || partMatch) {
    variations.add(joined);
    variations.add(withDashes);
  }
  
  return Array.from(variations).filter(v => v.length > 0);
}

// MyAnimeList'ten anime bilgilerini al
function getAnimeInfoMAL() {
  const titleElement = document.querySelector('h1.title-name strong') || 
                       document.querySelector('h1.h1 span[itemprop="name"]');
  
  if (!titleElement) return null;
  
  const title = titleElement.textContent.trim();
  const alternativeTitles = [];
  let romajiTitle = null;
  
  const infoBlocks = document.querySelectorAll('.spaceit_pad');
  infoBlocks.forEach(block => {
    const text = block.textContent;
    if (text.includes('English:')) {
      const englishTitle = text.replace('English:', '').trim();
      if (englishTitle) alternativeTitles.push(englishTitle);
    }
    if (text.includes('Synonyms:')) {
      const synonyms = text.replace('Synonyms:', '').split(',');
      synonyms.forEach(syn => {
        const cleaned = syn.trim();
        if (cleaned) alternativeTitles.push(cleaned);
      });
    }
    if (text.includes('Japanese:')) {
      const japaneseTitle = text.replace('Japanese:', '').trim();
      if (japaneseTitle) {
        const romajiMatch = japaneseTitle.match(/\(([^)]+)\)/);
        if (romajiMatch) {
          romajiTitle = romajiMatch[1];
        }
      }
    }
  });
  
  return {
    title: title,
    alternativeTitles: alternativeTitles,
    romajiTitle: romajiTitle,
    normalizedTitle: normalizeTitle(title),
    url: window.location.href,
    malId: window.location.pathname.match(/\/anime\/(\d+)/)?.[1]
  };
}

// AniList'ten anime bilgilerini al
function getAnimeInfoAniList() {
  const titleElement = document.querySelector('.header .content h1');
  
  if (!titleElement) return null;
  
  const title = titleElement.textContent.trim();
  const alternativeTitles = [];
  let romajiTitle = null;
  
  const dataRows = document.querySelectorAll('.data-set .data');
  dataRows.forEach(row => {
    const typeDiv = row.querySelector('.type');
    const valueDiv = row.querySelector('.value');
    
    if (typeDiv && valueDiv) {
      const labelText = typeDiv.textContent.toLowerCase().trim();
      if (labelText === 'romaji') {
        romajiTitle = valueDiv.textContent.trim();
        if (romajiTitle !== title) {
          alternativeTitles.push(romajiTitle);
        }
      } else if (labelText === 'english' || labelText === 'native') {
        const altTitle = valueDiv.textContent.trim();
        if (altTitle && altTitle !== title) {
          alternativeTitles.push(altTitle);
        }
      }
    }
  });
  
  return {
    title: title,
    alternativeTitles: alternativeTitles,
    romajiTitle: romajiTitle,
    normalizedTitle: normalizeTitle(title),
    url: window.location.href,
    anilistId: window.location.pathname.match(/\/anime\/(\d+)/)?.[1]
  };
}

// Site tipini algıla ve uygun bilgiyi al
function getAnimeInfo() {
  const hostname = window.location.hostname;
  
  if (hostname.includes('myanimelist')) {
    return getAnimeInfoMAL();
  } else if (hostname.includes('anilist')) {
    return getAnimeInfoAniList();
  }
  
  return null;
}

// Site seçimine göre URL oluştur
function getWatchUrl(site, animeInfo, titleVariation = null) {
  const targetTitle = titleVariation || animeInfo.normalizedTitle;
  
  // Özel siteler için - chrome.storage'dan al
  if (site.startsWith('custom-')) {
    return new Promise((resolve) => {
      chrome.storage.local.get(['customSites'], function(result) {
        const customSites = result.customSites || [];
        const customSite = customSites.find(s => s.id === site);
        if (customSite) {
          // normalizeTitle kullan - ham başlık yerine
          const normalizedForCustom = normalizeTitle(animeInfo.title);
          resolve(customSite.searchUrl.replace('%s', normalizedForCustom));
        } else {
          resolve(`https://www.turkanime.co/anime/${targetTitle}`);
        }
      });
    });
  }
  
  switch(site) {
    case 'anizm':
      return Promise.resolve(`https://anizm.net/${targetTitle}`);
      
    case 'turkanime':
      return Promise.resolve(`https://www.turkanime.co/anime/${targetTitle}`);
      
    default:
      return Promise.resolve(`https://www.turkanime.co/anime/${targetTitle}`);
  }
}

// Site durumunu kontrol et
async function checkSiteAvailability(url) {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      mode: 'no-cors'
    });
    return { available: true, status: 'success' };
  } catch (error) {
    return { available: false, status: 'error' };
  }
}

// Dropdown menüsü oluştur
function createMultipleWatchButtons(buttonContainer, animeInfo, preferredSite) {
  const { title, alternativeTitles } = animeInfo;
  
  // Ana izle butonu
  const watchButton = document.createElement('button');
  watchButton.className = 'mal-watch-button';
  watchButton.textContent = '▶ İzle';
  watchButton.title = 'Türkçe anime sitesinde izle';
  
  watchButton.addEventListener('click', async function() {
    const url = await getWatchUrl(preferredSite, animeInfo);
    window.open(url, '_blank');
  });

  // Dropdown butonu
  const dropdownButton = document.createElement('button');
  dropdownButton.className = 'mal-watch-dropdown-button';
  dropdownButton.textContent = '▼';
  dropdownButton.title = 'Site seç';

  // Dropdown menü
  const dropdownMenu = document.createElement('div');
  dropdownMenu.className = 'mal-watch-dropdown-menu';
  
  // Varsayılan siteler
  const sites = [
    { id: 'turkanime', name: 'TurkAnime', url: 'turkanime.co' },
    { id: 'anizm', name: 'Anizm', url: 'anizm.net' }
  ];
  
  // Özel siteleri chrome.storage'dan al
  chrome.storage.local.get(['customSites'], function(result) {
    const customSites = result.customSites || [];
    
    // Özel siteleri listeye ekle
    customSites.forEach(site => {
      sites.push({
        id: site.id,
        name: site.name,
        url: site.url,
        custom: true,
        searchUrl: site.searchUrl
      });
    });

    // Menü itemlarını oluştur
    sites.forEach(site => {
      const menuItem = document.createElement('div');
      menuItem.className = 'mal-watch-dropdown-item';
      if (site.id === preferredSite) {
        menuItem.classList.add('active');
      }
      
      menuItem.innerHTML = `
        <div class="site-info">
          <strong>${site.name}${site.custom ? '<span class="custom-badge">ÖZEL</span>' : ''}</strong>
          <span>${site.url}</span>
        </div>
        <span class="availability-status" data-site="${site.id}">⏳</span>
      `;
      
      menuItem.addEventListener('click', function(e) {
        e.stopPropagation();
        chrome.storage.sync.set({ preferredSite: site.id }, function() {
          window.location.reload();
        });
      });
      
      dropdownMenu.appendChild(menuItem);
      
      // Site durumunu kontrol et
      if (!site.custom) {
        getWatchUrl(site.id, animeInfo).then(testUrl => {
          checkSiteAvailability(testUrl).then(result => {
            const statusElement = menuItem.querySelector('.availability-status');
            if (result.available) {
              statusElement.textContent = '✓';
              statusElement.style.color = '#2ecc71';
            } else {
              statusElement.textContent = '?';
              statusElement.style.color = '#95a5a6';
            }
          });
        });
      } else {
        const statusElement = menuItem.querySelector('.availability-status');
        statusElement.textContent = '★';
        statusElement.style.color = '#3498db';
      }
    });

    // Başlık varyasyonları bölümü
    const titleVariations = generateTitleVariations(title);
    if (titleVariations.length > 1) {
      const separator = document.createElement('div');
      separator.className = 'mal-watch-dropdown-separator';
      dropdownMenu.appendChild(separator);
      
      const variationsHeader = document.createElement('div');
      variationsHeader.className = 'mal-watch-dropdown-header';
      variationsHeader.textContent = 'Farklı Yazılışlar:';
      dropdownMenu.appendChild(variationsHeader);
      
      titleVariations.forEach((variation, index) => {
        const varItem = document.createElement('div');
        varItem.className = 'mal-watch-dropdown-alt-title';
        varItem.textContent = variation;
        varItem.title = 'Bu yazılışla dene';
        
        varItem.addEventListener('click', async function(e) {
          e.stopPropagation();
          const url = await getWatchUrl(preferredSite, animeInfo, variation);
          window.open(url, '_blank');
        });
        
        dropdownMenu.appendChild(varItem);
      });
    }

    // Romaji başlığını ekle (eğer varsa)
    if (animeInfo.romajiTitle && animeInfo.romajiTitle !== title) {
      if (!titleVariations.length) {
        const separator = document.createElement('div');
        separator.className = 'mal-watch-dropdown-separator';
        dropdownMenu.appendChild(separator);
      }
      
      const romajiHeader = document.createElement('div');
      romajiHeader.className = 'mal-watch-dropdown-header';
      romajiHeader.textContent = 'Romaji:';
      dropdownMenu.appendChild(romajiHeader);
      
      const romajiItem = document.createElement('div');
      romajiItem.className = 'mal-watch-dropdown-alt-title';
      romajiItem.textContent = animeInfo.romajiTitle;
      romajiItem.title = 'Romaji başlıkla ara';
      
      romajiItem.addEventListener('click', async function(e) {
        e.stopPropagation();
        const romajiAnimeInfo = { 
          ...animeInfo, 
          title: animeInfo.romajiTitle, 
          normalizedTitle: normalizeTitle(animeInfo.romajiTitle),
          alternativeTitles: []
        };
        const url = await getWatchUrl(preferredSite, romajiAnimeInfo);
        window.open(url, '_blank');
      });
      
      dropdownMenu.appendChild(romajiItem);
    }

    // Alternatif başlıklar
    if (alternativeTitles.length > 0) {
      const separator = document.createElement('div');
      separator.className = 'mal-watch-dropdown-separator';
      dropdownMenu.appendChild(separator);
      
      const altTitlesHeader = document.createElement('div');
      altTitlesHeader.className = 'mal-watch-dropdown-header';
      altTitlesHeader.textContent = 'Alternatif Başlıklar:';
      dropdownMenu.appendChild(altTitlesHeader);
      
      alternativeTitles.slice(0, 3).forEach(altTitle => {
        const altItem = document.createElement('div');
        altItem.className = 'mal-watch-dropdown-alt-title';
        altItem.textContent = altTitle;
        altItem.title = 'Bu başlıkla dene';
        
        altItem.addEventListener('click', async function(e) {
          e.stopPropagation();
          const altAnimeInfo = { 
            ...animeInfo, 
            title: altTitle, 
            normalizedTitle: normalizeTitle(altTitle),
            alternativeTitles: []
          };
          const url = await getWatchUrl(preferredSite, altAnimeInfo);
          window.open(url, '_blank');
        });
        
        dropdownMenu.appendChild(altItem);
      });
    }
  });

  dropdownButton.addEventListener('click', function(e) {
    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
  });

  document.addEventListener('click', function() {
    dropdownMenu.classList.remove('show');
  });

  buttonContainer.appendChild(watchButton);
  buttonContainer.appendChild(dropdownButton);
  buttonContainer.appendChild(dropdownMenu);
}

// İzle butonu oluştur
function createWatchButton() {
  if (document.querySelector('.mal-watch-button-container')) {
    return;
  }

  const animeInfo = getAnimeInfo();
  if (!animeInfo) {
    return;
  }

  let titleContainer = document.querySelector('h1.title-name') || 
                       document.querySelector('h1.h1');
  
  if (!titleContainer) {
    titleContainer = document.querySelector('.header .content');
  }
  
  if (!titleContainer) {
    return;
  }

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'mal-watch-button-container';
  buttonContainer.setAttribute('data-mal-extension', 'true');

  chrome.storage.sync.get(['preferredSite'], function(result) {
    const preferredSite = result.preferredSite || 'turkanime';
    createMultipleWatchButtons(buttonContainer, animeInfo, preferredSite);
    
    if (titleContainer.nextSibling) {
      titleContainer.parentNode.insertBefore(buttonContainer, titleContainer.nextSibling);
    } else {
      titleContainer.parentNode.appendChild(buttonContainer);
    }
  });
}

// Sayfa yüklendiğinde butonu ekle
function initExtension() {
  const existingButtons = document.querySelectorAll('.mal-watch-button-container');
  existingButtons.forEach(btn => btn.remove());
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWatchButton);
  } else {
    const hostname = window.location.hostname;
    if (hostname.includes('anilist')) {
      setTimeout(createWatchButton, 1500);
    } else {
      createWatchButton();
    }
  }
}

initExtension();

// Dinamik içerik için MutationObserver
let observerTimeout;
const observer = new MutationObserver(function(mutations) {
  clearTimeout(observerTimeout);
  observerTimeout = setTimeout(function() {
    if (!document.querySelector('.mal-watch-button-container[data-mal-extension="true"]')) {
      const animeInfo = getAnimeInfo();
      if (animeInfo) {
        createWatchButton();
      }
    }
  }, 500);
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// AniList için sayfa değişikliklerini yakala
if (window.location.hostname.includes('anilist')) {
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(() => {
        const existingButtons = document.querySelectorAll('.mal-watch-button-container');
        existingButtons.forEach(btn => btn.remove());
        createWatchButton();
      }, 1000);
    }
  }).observe(document, { subtree: true, childList: true });
}