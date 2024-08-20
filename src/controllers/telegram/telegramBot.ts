// // telegramBot.js
// import TelegramBot from 'node-telegram-bot-api';

// const token = process.env.TELE_BOT_TOKEN as string;
// const bot = new TelegramBot(token, { polling: true });

// bot.on('new_chat_members', (msg:any) => {
//   const chatId = msg.chat.id;
//   const newMembers = msg.new_chat_members;

//   newMembers.forEach((member:any) => {
//     console.log("member",member);
//     const userId = member.id;
//     const username = member.username;
//     const firstName = member.first_name;
//     const lastName = member.last_name;

//     // Send a welcome message to the group
//     bot.sendMessage(chatId, `Welcome, ${firstName} ${lastName || ''}!`);
//   });
// });

// export default bot;
