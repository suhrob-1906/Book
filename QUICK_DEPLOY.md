# 🚀 Quick Deployment Guide (Render)

## Быстрый старт - 5 минут!

### 1️⃣ Получить Gemini API ключ
```
https://aistudio.google.com/app/apikey
```
Скопируйте ключ (начинается с `AIza...`)

---

### 2️⃣ Создать Supabase проект
```
https://supabase.com
```
1. New Project → Создайте проект
2. SQL Editor → Вставьте `supabase/migrations/001_initial_schema.sql` → Run
3. Storage → Создайте buckets: `avatars` и `book-covers` (оба public)
4. Settings → API → Скопируйте URL и anon key

---

### 3️⃣ Деплой Edge Function
```bash
# Установить Supabase CLI
scoop install supabase

# Логин
supabase login

# Линк проекта
supabase link --project-ref YOUR_PROJECT_REF

# Добавить Gemini ключ
supabase secrets set GEMINI_API_KEY=YOUR_GEMINI_KEY

# Деплой функции
supabase functions deploy ai-chat
```

---

### 4️⃣ Деплой на Render

#### Вариант A: Через GitHub (рекомендуется)

```bash
# 1. Пушим код на GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_URL
git push -u origin main
```

**2. В Render Dashboard:**
- New + → Static Site
- Подключить GitHub
- Выбрать репозиторий
- Настройки:
  - Build Command: `npm install && npm run build`
  - Publish Directory: `dist`
- Environment Variables:
  - `VITE_SUPABASE_URL` = ваш Supabase URL
  - `VITE_SUPABASE_ANON_KEY` = ваш Supabase anon key
- Create Static Site

#### Вариант B: Без Git

```bash
# 1. Билд локально
npm run build

# 2. Установить Render CLI
npm install -g render-cli

# 3. Логин и деплой
render login
render deploy
```

---

### ✅ Готово!

Ваш сайт будет доступен по адресу:
```
https://your-app-name.onrender.com
```

---

## 🔧 Troubleshooting

### Ошибка: "Supabase credentials not found"
✅ Проверьте environment variables в Render
✅ Переменные должны начинаться с `VITE_`
✅ Редеплойте после добавления переменных

### Билд падает
✅ Build Command: `npm install && npm run build`
✅ Publish Directory: `dist`
✅ Проверьте логи в Render Dashboard

### Анимации не работают
✅ Очистите кэш браузера
✅ Проверьте что билд прошел успешно

---

## 📊 Что получится

- ✨ Интерактивные частицы (80 штук!)
- 🎨 3D наклон карточек
- 🌈 Анимированные градиенты
- 💫 Плавающие орбы
- 🔔 Toast уведомления
- 🚀 Молниеносная загрузка

---

## 🆓 Бесплатные лимиты Render

- ✅ 100GB трафика/месяц
- ✅ 500 минут билда/месяц
- ✅ Автоматический деплой при пуше
- ✅ Бесплатный SSL
- ✅ Глобальный CDN
- ✅ Custom домены

---

**Полная инструкция:** [DEPLOYMENT.md](./DEPLOYMENT.md)
