const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const VK_TOKEN = process.env.VK_TOKEN;
const CONFIRMATION_CODE = process.env.CONFIRMATION_CODE;
const GROUP_ID = process.env.GROUP_ID;

// Ответы от Киры
const autoReplies = {
  'привет': '🖤 Привет! Я Кира — пишу песни и нахожу лучшее на Ozon. Чем могу помочь?',
  'hello': '🖤 Привет! Я Кира — пишу песни и нахожу лучшее на Ozon. Чем могу помочь?',
  'заказ': '🎵 Хочешь трек на заказ? Напиши о чём должна быть песня — про любовь, поздравление, твою историю. Обсудим всё в личке 🤍',
  'трек': '🎵 Хочешь трек на заказ? Напиши о чём должна быть песня — про любовь, поздравление, твою историю. Обсудим всё в личке 🤍',
  'песня': '🎵 Хочешь песню на заказ? Расскажи свою историю — сделаю уникальный трек специально для тебя 🤍',
  'поздравление': '🎉 Музыкальное поздравление — отличная идея! Напиши кому и по какому поводу — всё сделаем красиво 🎵',
  'ozon': '🛍️ Лучшие находки с Ozon со скидками — смотри в постах группы! Новые подборки каждый день 🔥',
  'озон': '🛍️ Лучшие находки с Ozon со скидками — смотри в постах группы! Новые подборки каждый день 🔥',
  'скидка': '🛍️ Все товары со скидками в постах группы! Подпишись чтобы не пропустить горячие предложения 🔥',
  'цена': '🛍️ Все цены и ссылки в постах группы! Там самые выгодные находки с Ozon 💰',
  'подписка': '🤍 Подпишись на группу и будь в курсе новых треков и находок с Ozon! vk.com/kira_musicant',
  'спасибо': '🤍 Всегда рада! Подпишись чтобы не пропускать новые треки и подборки 🎵',
  'молодец': '🤍 Спасибо! Твоя поддержка очень важна для меня 🖤',
  'красиво': '🤍 Спасибо большое! Это очень приятно слышать 🖤',
};

// Функция отправки сообщения
async function sendMessage(userId, message) {
  try {
    await axios.post('https://api.vk.com/method/messages.send', null, {
      params: {
        user_id: userId,
        message: message,
        random_id: Math.floor(Math.random() * 1000000),
        access_token: VK_TOKEN,
        v: '5.131'
      }
    });
  } catch (error) {
    console.error('Ошибка отправки:', error.message);
  }
}

// Функция умного ответа
function getSmartReply(text) {
  const lower = text.toLowerCase();
  
  for (const [key, reply] of Object.entries(autoReplies)) {
    if (lower.includes(key)) {
      return reply;
    }
  }
  
  // Дефолтный ответ
  return `🖤 Привет! Я Кира.

🎵 Пишу песни на заказ — про любовь, поздравления, твою историю
🛍️ Нахожу лучшие товары на Ozon со скидками до 78%

Чем могу помочь? Напиши что тебя интересует 🤍`;
}

// Основной webhook
app.post('/webhook', async (req, res) => {
  const body = req.body;
  
  // Подтверждение сервера VK
  if (body.type === 'confirmation') {
    return res.send(CONFIRMATION_CODE);
  }
  
  // Новое сообщение
  if (body.type === 'message_new') {
    const message = body.object.message;
    const userId = message.from_id;
    const text = message.text || '';
    
    // Не отвечаем самим себе
    if (userId < 0) return res.send('ok');
    
    const reply = getSmartReply(text);
    await sendMessage(userId, reply);
  }
  
  res.send('ok');
});

// Healthcheck
app.get('/', (req, res) => {
  res.send('🖤 Kira VK Bot — работает!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Kira Bot запущен на порту ${PORT}`);
});
