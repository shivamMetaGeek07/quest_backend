import express from 'express';

const telegramRouter= express.Router();

telegramRouter.post('/webhook', (req, res) => {
  const { message } = req.body;

  if (message && message.new_chat_members) {
    const chatId = message.chat.id;
    const newMembers = message.new_chat_members;

    newMembers.forEach((member: any) => {
      // Your logic to handle new members
      console.log(`New member joined: ${member.username}`);
    });
  }

  res.sendStatus(200);
});

export default telegramRouter;