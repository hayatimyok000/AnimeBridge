<img width="512" height="512" alt="image" src="https://github.com/user-attachments/assets/79e2168a-ab24-4c0d-baa4-85695f9548d7" />
               

# AnimeBridge - MyAnimeList & AniList Türkçe Anime Yönlendirici

MyAnimeList ve AniList'te gezinirken Türkçe altyazılı anime sitelerine tek tıkla geçiş yapmanızı sağlayan gelişmiş Chrome eklentisi.

## 🎯 Özellikler

- **Tek Tıkla İzleme**: MyAnimeList veya AniList'teki herhangi bir anime sayfasında direkt "İzle" butonu
- **Çoklu Site Desteği**: TurkAnime, Anizm gibi varsayılan siteler + özel site ekleme
- **Site Durumu Kontrolü**: Hangi sitelerin erişilebilir olduğunu gösterir
- **Özel Site Ekleme**: Kendi favori anime sitenizi ekleyebilme

## 📦 Kurulum

### Manuel Kurulum
1. Bu repository'yi indirin veya klonlayın
2. Chrome'da `chrome://extensions/` adresine gidin
3. Sağ üstten "Geliştirici modu"nu aktifleştirin
4. "Paketlenmemiş öğe yükle" butonuna tıklayın
5. İndirdiğiniz klasörü seçin

## 🚀 Kullanım

1. MyAnimeList veya AniList'te herhangi bir anime sayfasına gidin
2. Başlık yanında görünen "▶ İzle" butonuna tıklayın
3. Dropdown menüden farklı siteler veya başlık varyasyonları seçebilirsiniz

### Özel Site Ekleme
1. Eklenti ikonuna tıklayın
2. "Özel Siteler" sekmesine geçin
3. Site bilgilerini girin:
   - **Site Adı**: Görünecek isim
   - **Site URL**: Alan adı (örn: example.com)
   - **Arama URL**: Arama linki (`%s` anime adı yerine gelir)
4. "Site Ekle" butonuna tıklayın

**Örnek Arama URL**: `https://example.com/anime/%s`

## 🛠️ Teknik Detaylar

- **Manifest Version**: 3
- **Desteklenen Siteler**: MyAnimeList, AniList
- **Tarayıcı Desteği**: Chrome, Edge, Brave (Chromium tabanlı)
- **İzinler**: 
  - `storage`: Site tercihlerini kaydetmek için
  - `activeTab`: Anime bilgilerini okumak için
  - `contextMenus`: Sağ tık menüsü için

## 🎨 Ekran Görüntüleri

<img width="2536" height="1049" alt="Ekran görüntüsü 2025-10-03 144939" src="https://github.com/user-attachments/assets/2e493b49-7e27-4d9d-90cf-4d1dc9ca1509" />

<img width="2452" height="1096" alt="Ekran görüntüsü 2025-10-03 145001" src="https://github.com/user-attachments/assets/bf2ec041-7438-480b-ac70-e0d61c989261" />




## 🤝 Katkıda Bulunma

Metin Özçetin
TR59 0004 6002 9188 8000 2271 25

## 📄 Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

👤 Geliştirici

hayatim_yok

Bu proje Claude AI desteğiyle geliştirilmiştir.

## ⚠️ Sorumluluk Reddi

Bu eklenti, kullanıcıların legal anime sitelerine daha kolay erişmesini sağlamak için geliştirilmiştir. Telif hakları ihlali teşvik edilmez. Kullanıcılar, içerik izlerken yerel yasalara uymakla yükümlüdür.

## 🐛 Hata Bildirimi

Bir hata buldunuz mu? Lütfen [Issues](../../issues) sekmesinden bildirin.

## 💡 Özellik İstekleri

Yeni özellik önerilerinizi [Issues](../../issues) bölümünden paylaşabilirsiniz.
