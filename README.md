# AnimeBridge - MyAnimeList & AniList Türkçe Anime Yönlendirici

MyAnimeList ve AniList'te gezinirken Türkçe altyazılı anime sitelerine tek tıkla geçiş yapmanızı sağlayan gelişmiş Chrome eklentisi.

## 🎯 Özellikler

- **Tek Tıkla İzleme**: MyAnimeList veya AniList'teki herhangi bir anime sayfasında direkt "İzle" butonu
- **Akıllı Başlık Eşleştirme**: Anime başlıklarını otomatik olarak normalize eder ve doğru formatta arar
- **Çoklu Site Desteği**: TurkAnime, Anizm gibi varsayılan siteler + özel site ekleme
- **Romaji Desteği**: Romaji başlıklarla da arama yapabilme
- **Alternatif Başlıklar**: İngilizce, Japonca ve alternatif başlıklarla deneme seçeneği
- **Başlık Varyasyonları**: Farklı yazılış formatlarını otomatik deneme (örn: "dan-da-dan", "dandadan")
- **Site Durumu Kontrolü**: Hangi sitelerin erişilebilir olduğunu gösterir
- **Özel Site Ekleme**: Kendi favori anime sitenizi ekleyebilme
- **Season/Part Desteği**: "2nd Season", "Part 2" gibi ifadeleri otomatik algılama

## 📦 Kurulum

### Chrome Web Store'dan (Yakında)
Eklenti Chrome Web Store'da yayınlandığında buradan indirilebilecek.

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

## 📋 Başlık Normalizasyon Özellikleri

Eklenti aşağıdaki senaryoları otomatik olarak işler:
- Boşlukları tire ile değiştirir
- Özel karakterleri kaldırır
- "2nd Season", "Part 2" gibi ifadeleri farklı formatlarda dener
- Kısa tekrarlayan kelimeleri birleştirir (örn: "Dan Da Dan" → "dandadan")
- Romaji ve alternatif başlıkları kullanır

## 🎨 Ekran Görüntüleri

[Buraya ekran görüntüleri eklenecek]

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen şu adımları izleyin:

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/YeniOzellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/YeniOzellik`)
5. Pull Request oluşturun

## 📝 Değişiklik Geçmişi

### v4.0 (Mevcut)
- Romaji başlık desteği eklendi
- Özel site ekleme özelliği
- Gelişmiş başlık normalizasyon
- Site durumu kontrolü
- AniList desteği iyileştirildi

## 📄 Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👤 Geliştirici

Made with ❤️ by hayatim_yok

## ⚠️ Sorumluluk Reddi

Bu eklenti, kullanıcıların legal anime sitelerine daha kolay erişmesini sağlamak için geliştirilmiştir. Telif hakları ihlali teşvik edilmez. Kullanıcılar, içerik izlerken yerel yasalara uymakla yükümlüdür.

## 🐛 Hata Bildirimi

Bir hata buldunuz mu? Lütfen [Issues](../../issues) sekmesinden bildirin.

## 💡 Özellik İstekleri

Yeni özellik önerilerinizi [Issues](../../issues) bölümünden paylaşabilirsiniz.
