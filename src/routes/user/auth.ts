import express, { Request, Response } from "express";
import dotenv from "dotenv";
import passport from "../../utils/passport";
import { checkIfUserFollows, loginFailed, loginSuccess, logout, updateUser } from "../../controllers/User/auth.js";
import { isAuthenticated } from "../../middleware/user/authorize.user";
import { TwitterConnected } from "../../middleware/user/twitter";
import { checkGuilds, checkInviteLink, fetchGuildChannelInfo, sendNotification } from "../../controllers/User/discord.js";
import UserDb, { IUser } from "../../models/user/user";
import { DiscordConnected } from "../../middleware/user/discord";
import KolsDB from "../../models/kols/kols";
dotenv.config();

const authrouter = express.Router();

// Google route

authrouter.get(
  "/google/kol",
  (req, res, next) => {
    req.query.state = 'kol';  
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: 'kol',  
    })(req, res, next);
  }
);

authrouter.get(
  "/google/user",
  (req, res, next) => {
    req.query.state = 'user'; 
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: 'user',  
    })(req, res, next);
  }
);

// Google OAuth callback route 

authrouter.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.PUBLIC_CLIENT_URL}/failed`,
  }),
  (req, res) => { 
    res.redirect(`${process.env.PUBLIC_CLIENT_URL}/sucessfulLogin`);
  }
);
 

// Connect twitter account  of user and check it is authenticate or not

authrouter.get(
  "/twitter",
  isAuthenticated,
  TwitterConnected,
  passport.authenticate("twitter")
);

authrouter.get(
  "/twitter/callback",
  passport.authenticate("twitter", {
    successRedirect:`${process.env.PUBLIC_CLIENT_URL}/sucessfulLogin`,
    failureRedirect: `${process.env.PUBLIC_CLIENT_URL}/failed`,
     })
);

// Connect Discord account  of user and check it is authenticate or not

authrouter.get(
  "/discord",
  isAuthenticated,
  DiscordConnected,
  passport.authenticate("discord")
);

authrouter.get(
  "/discord/callback",
  passport.authenticate("discord", {
    successRedirect:`${process.env.PUBLIC_CLIENT_URL}/sucessfulLogin`,
    failureRedirect: `${process.env.PUBLIC_CLIENT_URL}/failed`,
     }) 
);

authrouter.get('/auth/telegram', (req:Request, res:Response) => {
  res.send(`
    <script async src="https://telegram.org/js/telegram-widget.js?7"
            data-telegram-login="${process.env.TELEGRAM_BOT_USERNAME}"
            data-size="large"
            data-auth-url="${process.env.PUBLIC_SERVER_URL}/auth/telegram/callback"
            data-request-access="write"></script>
  `);
});
// Telegram callback route
authrouter.get('/auth/telegram/callback',
  passport.authenticate('telegram', {
    successRedirect:`${process.env.PUBLIC_CLIENT_URL}/sucessfulLogin`,
    failureRedirect: `${process.env.PUBLIC_CLIENT_URL}/failed`,
     })
);

// Get the Specific user info

authrouter.get("/twitter/follows/:targetUserId", isAuthenticated, checkIfUserFollows);

authrouter.get("/login/success", loginSuccess);

authrouter.get("/login/failed", loginFailed);

// Get User And Kol info

authrouter.get("/profile", isAuthenticated, async (req, res) => {
  const user = req.user as any;
  
  let data;
  if (user.role === 'kol') {
    data = await KolsDB.findById(user._id);
  } else {
    data = await UserDb.findById(user._id);
  }

  if (!data) {
    return res.status(401).json({ message: "User not found. Please login" });
  }
  return res.status(200).send(data);
});

// update profile user and Kol

authrouter.put("/profile/update",isAuthenticated, updateUser );

// logout client
authrouter.get("/logout",isAuthenticated, logout);


// fetch guiild channel  (DISORD)

authrouter.get('/fetch-guild/:guildId', async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).send('User is not authenticated');
  }

  const users = req.user as IUser;

  if (!users.discordInfo || !users.discordInfo.accessToken) {
    return res.status(400).send('User does not have a Discord access token');
  }

  const accessToken = users.discordInfo.accessToken;
  try {
    const {guildId } = req.params;

    const channels = await fetchGuildChannelInfo(guildId, accessToken);
    // const channels = guilds.channels;
    if (channels.length === 0) {
      return res.send('User has not joined any guilds');
    }

   
    return res.json({message:channels});  }
   catch (error) {
    console.error('Error fetching guilds:', error);
    return res.status(500).send('Failed to fetch guilds');
  }
});
// Check Guild in user  (DISORD)

authrouter.get('/check-guilds', async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).send('User is not authenticated');
  }

  const users = req.user as IUser;

  if (!users.discordInfo || !users.discordInfo.accessToken) {
    return res.status(400).send('User does not have a Discord access token');
  }

  const accessToken = users.discordInfo.accessToken;
  try {
    const guilds = await checkGuilds( accessToken);

    
    console.log(guilds)
    return res.status(200).send(guilds);
  } catch (error) {
    console.error('Error fetching guilds:', error);
    return res.status(500).send('Failed to fetch guilds');
  }
});

// send Message to  User after joining the channel  (DISORD)

authrouter.post('/message/channel', async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).send('User is not authenticated');
  }

  const users = req.user as IUser;
  if (!users.discordInfo || !users.discordInfo.accessToken) {
    return res.status(400).send('User does not have a Discord access token');
  }
  const {channelId, message}=req.body;
  try {
    const sendMesg = await sendNotification(channelId,message);

    res.status(200).json({ success: true, sendMesg });
  } catch (error) {
    console.error('Error fetching guilds:', error);
    return res.status(500).send('Failed to fetch guilds');
  }
});

// Check Invited url is valid or not   (DISORD)

 
authrouter.get('/validate/:inviteUrl', async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).send('User is not authenticated');
  }

  const users = req.user as IUser;

  if (!users.discordInfo || !users.discordInfo.accessToken) {
    return res.status(400).send('User does not have a Discord access token');
  }

  try {
    const {inviteUrl}=req.params;
    const validLink = await checkInviteLink(inviteUrl);

    if (validLink) {
      res.status(200).json({ success: true, message: 'Valid link and bot is in the guild' });
    } else {
      res.status(200).json({ success: false, message: 'INValid link . bot is not in the guild' });
    }


  } catch (error) {
    console.error('Error fetching guilds:', error);
    return res.status(500).send('Failed to fetch guilds');
  }
});

export default authrouter;
