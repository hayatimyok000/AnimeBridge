// Tab değiştirme işlevi
function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.remove('active');
  });
  
  document.getElementById(tabName).classList.add('active');
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

// Varsayılan siteleri yükle
function loadDefaultSites() {
  chrome.storage.sync.get(['preferredSite'], function(result) {
    const preferredSite = result.preferredSite || 'turkanime';
    
    const radio = document.getElementById(preferredSite);
    if (radio) {
      radio.checked = true;
      radio.closest('.site-option').classList.add('active');
    }
  });
}

// Özel siteleri yükle
function loadCustomSites() {
  chrome.storage.local.get(['customSites'], function(result) {
    const customSites = result.customSites || [];
    const customSitesContainer = document.getElementById('custom-sites-list');
    
    if (customSites.length === 0) {
      customSitesContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 20px; font-size: 13px;">Henüz özel site eklenmemiş</p>';
      return;
    }
    
    customSitesContainer.innerHTML = '';
    
    customSites.forEach((site, index) => {
      const siteOption = document.createElement('div');
      siteOption.className = 'site-option custom-site';
      
      chrome.storage.sync.get(['preferredSite'], function(syncResult) {
        if (syncResult.preferredSite === site.id) {
          siteOption.classList.add('active');
        }
      });
      
      siteOption.innerHTML = `
        <input type="radio" name="custom-site" value="${site.id}" id="${site.id}">
        <label for="${site.id}" class="site-info">
          <strong>
            ${site.name}
            <span class="custom-badge">ÖZEL</span>
          </strong>
          <span>${site.url}</span>
        </label>
        <button class="delete-btn" data-index="${index}">🗑️ Sil</button>
      `;
      
      // Site seçimi
      siteOption.querySelector('input').addEventListener('change', function() {
        if (this.checked) {
          chrome.storage.sync.set({ preferredSite: site.id }, function() {
            document.querySelectorAll('.site-option').forEach(opt => {
              opt.classList.remove('active');
            });
            siteOption.classList.add('active');
            
            document.querySelectorAll('#default-sites input').forEach(radio => {
              radio.checked = false;
            });
          });
        }
      });
      
      // Silme butonu
      siteOption.querySelector('.delete-btn').addEventListener('click', function(e) {
        e.stopPropagation();
        if (confirm(`"${site.name}" sitesini silmek istediğinize emin misiniz?`)) {
          deleteCustomSite(index);
        }
      });
      
      customSitesContainer.appendChild(siteOption);
    });
  });
}

// Özel site ekle
function addCustomSite() {
  const siteName = document.getElementById('custom-site-name').value.trim();
  const siteUrl = document.getElementById('custom-site-url').value.trim();
  const searchUrl = document.getElementById('custom-search-url').value.trim();
  
  if (!siteName) {
    alert('Lütfen site adı girin!');
    return;
  }
  
  if (!siteUrl) {
    alert('Lütfen site URL\'si girin!');
    return;
  }
  
  if (!searchUrl) {
    alert('Lütfen arama URL\'si girin!');
    return;
  }
  
  if (!searchUrl.includes('%s')) {
    alert('Arama URL\'sinde %s değişkeni bulunmalıdır!\n\nÖrnek: https://example.com/search?q=%s');
    return;
  }
  
  // Özel siteleri chrome.storage'dan al
  chrome.storage.local.get(['customSites'], function(result) {
    const customSites = result.customSites || [];
    
    // Yeni site ekle
    const newSite = {
      id: `custom-${Date.now()}`,
      name: siteName,
      url: siteUrl,
      searchUrl: searchUrl
    };
    
    customSites.push(newSite);
    
    // chrome.storage'a kaydet
    chrome.storage.local.set({ customSites: customSites }, function() {
      // Formu temizle
      document.getElementById('custom-site-name').value = '';
      document.getElementById('custom-site-url').value = '';
      document.getElementById('custom-search-url').value = '';
      
      // Listeyi güncelle
      loadCustomSites();
      
      // Başarı mesajı
      showNotification('Site başarıyla eklendi!', 'success');
    });
  });
}

// Özel site sil
function deleteCustomSite(index) {
  chrome.storage.local.get(['customSites'], function(result) {
    const customSites = result.customSites || [];
    const deletedSite = customSites[index];
    
    customSites.splice(index, 1);
    
    chrome.storage.local.set({ customSites: customSites }, function() {
      // Eğer silinen site seçiliyse, varsayılan siteye dön
      chrome.storage.sync.get(['preferredSite'], function(syncResult) {
        if (syncResult.preferredSite === deletedSite.id) {
          chrome.storage.sync.set({ preferredSite: 'turkanime' }, function() {
            loadDefaultSites();
          });
        }
      });
      
      // Listeyi güncelle
      loadCustomSites();
      
      // Başarı mesajı
      showNotification('Site silindi!', 'info');
    });
  });
}

// Bildirim göster
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#2ecc71' : '#3498db'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Site seçeneklerine tıklama olayı ekle (varsayılan siteler)
document.querySelectorAll('#default-sites .site-option').forEach(option => {
  option.addEventListener('click', function() {
    const site = this.dataset.site;
    const radio = this.querySelector('input[type="radio"]');
    
    radio.checked = true;
    
    document.querySelectorAll('.site-option').forEach(opt => {
      opt.classList.remove('active');
    });
    
    this.classList.add('active');
    
    chrome.storage.sync.set({ preferredSite: site }, function() {
      console.log('Site seçimi kaydedildi:', site);
    });
  });
});

// Radio butonlara da olay ekle
document.querySelectorAll('#default-sites input[type="radio"]').forEach(radio => {
  radio.addEventListener('change', function() {
    if (this.checked) {
      const site = this.value;
      
      document.querySelectorAll('.site-option').forEach(opt => {
        opt.classList.remove('active');
      });
      
      this.closest('.site-option').classList.add('active');
      
      chrome.storage.sync.set({ preferredSite: site }, function() {
        console.log('Site seçimi kaydedildi:', site);
      });
    }
  });
});

// Tab butonlarına olay ekle
document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', function() {
    const tabName = this.dataset.tab;
    switchTab(tabName);
  });
});

// Özel site ekleme formu
document.getElementById('add-custom-site-btn').addEventListener('click', addCustomSite);

// Enter tuşuyla form gönderme
document.querySelectorAll('.add-site-form input').forEach(input => {
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      addCustomSite();
    }
  });
});

// Footer'daki hayatim_yok linkine tıklama olayı
document.addEventListener("DOMContentLoaded", () => {
  const link = document.getElementById("yt-link");
  if (link) {
    link.addEventListener("click", () => {
      chrome.tabs.create({
        url: "https://youtu.be/FJqGirLjQn4?list=RDFJqGirLjQn4"
      });
    });
  }
  
  // Sayfa yüklendiğinde varsayılan siteleri ve özel siteleri yükle
  loadDefaultSites();
  loadCustomSites();
});

// Animasyon stilleri ekle
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);