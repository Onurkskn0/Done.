# Türkçe Date Picker Bileşeni

Tam özellikli, Türkiye lokaline uygun, modern bir tarih seçici bileşeni.

## Özellikler

✅ **Hafta Pazartesi'den başlar** - `weekStartsOn: 1`  
✅ **Türkçe gün isimleri** - Pzt, Sal, Çar, Per, Cum, Cmt, Paz (uppercase, ortalı)  
✅ **Bugünün haftası odaklı** - Takvim açıldığında mevcut haftayı gösterir  
✅ **Geçmiş tarihler devre dışı** - Bugünden önceki tarihler seçilemez ve soluk görünür  
✅ **Dark mode destekli** - Shadcn'in default dark teması ile tam uyumlu  
✅ **Responsive tasarım** - Mobil ve desktop'ta mükemmel görünüm  
✅ **Popover içinde** - Dışarı tıklandığında otomatik kapanır  
✅ **Türkçe tarih formatı** - "25 Kasım 2025, Salı" formatında gösterim  
✅ **Bugün vurgusu** - Mavi ring ile özel vurgulama  

## Kurulum

### 1. Gerekli Paketler

```bash
npm install date-fns
```

### 2. Shadcn/UI Bileşenleri

Eğer henüz yoksa, şu bileşenleri ekleyin:

```bash
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add button
```

### 3. Bileşeni Kullanma

```jsx
import { useState } from "react"
import { TurkishDatePicker } from "@/components/TurkishDatePicker"

function App() {
  const [selectedDate, setSelectedDate] = useState(null)
  
  return (
    <div className="p-8">
      <TurkishDatePicker 
        date={selectedDate}
        setDate={setSelectedDate}
        placeholder="Bir tarih seçin"
      />
      
      {selectedDate && (
        <p className="mt-4">
          Seçilen tarih: {selectedDate.toLocaleDateString('tr-TR')}
        </p>
      )}
    </div>
  )
}
```

## Props

| Prop | Tip | Varsayılan | Açıklama |
|------|-----|-----------|----------|
| `date` | `Date \| null` | - | Seçili tarih |
| `setDate` | `(date: Date) => void` | - | Tarih değiştirme fonksiyonu |
| `className` | `string` | `""` | Ek CSS sınıfları |
| `placeholder` | `string` | `"Tarih seçin"` | Tarih seçilmediğinde gösterilen metin |
| `disabled` | `boolean` | `false` | Bileşeni devre dışı bırakır |

## Özelleştirme

### Geçmiş Tarihleri Aktif Etme

Eğer geçmiş tarihleri de seçilebilir yapmak isterseniz:

```jsx
// TurkishDatePicker.jsx içinde
const disabledDays = (day) => {
  return false // Hiçbir günü devre dışı bırakma
}
```

### Gelecek Tarihleri Sınırlama

Sadece bugünden itibaren 30 gün içindeki tarihleri seçilebilir yapmak için:

```jsx
import { addDays } from "date-fns"

const disabledDays = (day) => {
  const today = startOfDay(new Date())
  const maxDate = addDays(today, 30)
  
  return isBefore(startOfDay(day), today) || isAfter(startOfDay(day), maxDate)
}
```

### Tarih Formatını Değiştirme

```jsx
// Kısa format: "25 Kas 2025"
format(selectedDate, "d MMM yyyy", { locale: tr })

// Uzun format: "25 Kasım 2025, Salı"
format(selectedDate, "d MMMM yyyy, EEEE", { locale: tr })

// Sadece gün/ay/yıl: "25/11/2025"
format(selectedDate, "dd/MM/yyyy", { locale: tr })
```

## Stil Özelleştirme

Bileşen Tailwind CSS kullanır. Renkleri değiştirmek için `classNames` prop'unu güncelleyin:

```jsx
// Örnek: Seçili günü yeşil yapmak
day_selected: "bg-green-600 text-white hover:bg-green-700"
```

## Dark Mode

Dark mode otomatik olarak desteklenir. Tailwind'in `dark:` prefix'i kullanılarak tüm renkler dark mode için optimize edilmiştir.

## Sorun Giderme

### Türkçe karakterler görünmüyor

`date-fns/locale` paketinden `tr` locale'ini import ettiğinizden emin olun:

```jsx
import { tr } from "date-fns/locale"
```

### Hafta Pazar'dan başlıyor

`weekStartsOn: 1` prop'unun Calendar bileşenine geçirildiğinden emin olun.

### Geçmiş tarihler seçilebiliyor

`disabled={disabledDays}` prop'unun Calendar bileşenine doğru şekilde geçirildiğini kontrol edin.

## Lisans

MIT
