import express, { Request, Response } from "express";
import dotenv from "dotenv";
import passport from "../../utils/passport";
import { checkIfUserFollows, loginFailed, loginSuccess, logout, updateUser } from "../../controllers/user/auth";
import { isAuthenticated } from "../../middleware/user/authorize.user";
import { TwitterConnected } from "../../middleware/user/twitter";
import { checkGuilds, checkInviteLink, fetchGuildChannelInfo, sendNotification } from "../../controllers/user/discord";
import UserDb, { IUser } from "../../models/user/user";
import { DiscordConnected } from "../../middleware/user/discord";
import KolsDB from "../../models/kols/kols";
import crypto from 'crypto';
import { checkTelegramId } from "../../middleware/user/telegram";
import { ensureAuthenticated } from "../../middleware/user/discordAuthentication";
import { verifyToken } from "../../middleware/user/verifyToken";

dotenv.config();

const authrouter = express.Router();
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const SECRET_KEY = crypto.createHash('sha256').update(TELEGRAM_BOT_TOKEN).digest();
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


authrouter.post('/telegram/callback', checkTelegramId,async (req, res) => {
  try {
    const { hash, ...user } = req.body as { [key: string]: string };
    const users = req.user as IUser;
    const role = users.role; 

    const dataCheckString = Object.keys(user)
      .sort()
      .map(key => `${key}=${user[key]}`)
      .join('\n');

    const hmac = crypto.createHmac('sha256', SECRET_KEY).update(dataCheckString).digest('hex');

    if (hmac !== hash) {
      return res.status(403).send('Authentication failed: Invalid hash.');
    }

    // At this point, the user is authenticated
    // You can save the user data to your database here
    let userdata;
    
    if (role === 'kol') {
      userdata = await KolsDB.findOne({ googleId: users.googleId });
      if (!userdata) {
        userdata = new KolsDB({
          teleInfo: {
            telegramId: user.id,
            teleName: user.first_name,
            teleusername: user.username,
          },
        });
        await userdata.save();
      }
    } else {
      userdata = await UserDb.findOne({ googleId: users.googleId });
      if (!userdata) {
        userdata = new UserDb({
          teleInfo: {
            telegramId: user.id,
            teleName: user.first_name,
            teleusername: user.username,
          },
        });
        await userdata.save();
      }
    }

    return res.send(`Hello, ${user.first_name}! Your Telegram ID is ${user.id}`);
  } catch (error) {
    console.error("Error during authentication:", error);
    return res.status(500).send("Internal server error.");
  }
});

// Get the Specific user info

authrouter.get("/twitter/follows/:targetUserId", isAuthenticated, checkIfUserFollows);

authrouter.get("/login/success", loginSuccess);

authrouter.get("/login/failed", loginFailed);

// Get User And Kol info  

authrouter.get("/profile",verifyToken, async (req, res) => {
  const user = req.user as any;
  let data;
  if (!user) {
    return res.status(201).json({success:false, message: "User not found. Please login" });

  }

  data = await UserDb.findById(user.ids);
   
  return res.status(200).send(data);
});

// update profile user and Kol

authrouter.put("/profile/update",verifyToken, updateUser );

// logout client
authrouter.get("/logout",verifyToken , logout);

// fetch guiild channel  (DISORD)

authrouter.get('/fetch-guild/:guildId', async (req: Request, res: Response) => {
  const users=req.body;
  if (!users.discordInfo || !users.discordInfo.accessToken) {
    return res.status(200).send('User does not have a Discord access token');
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
    return res.status(201).send({success:false,message:'User is not authenticated'});
  }

  const users = req.user as IUser;

  if (!users.discordInfo || !users.discordInfo.accessToken) {
    return res.status(200).send('User does not have a Discord access token');
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
    return res.status(200).send('User does not have a Discord access token');
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

 
authrouter.post('/validate/:inviteUrl', async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(201).send({success:false,message:'User is not authenticated'});
    }

  const users = req.user as IUser;
console.log(users)
  if (!users.discordInfo || !users.discordInfo.accessToken) {
    return res.status(201).send('User does not have a Discord access token');
  }

  try {
    const inviteUrl = decodeURIComponent(req.params.inviteUrl);
    const validLink = await checkInviteLink(inviteUrl);

    if (validLink) {
      res.status(200).json({ success: true, message: 'Valid link and bot is in the guild',validLink });
    } else {
      res.status(200).json({ success: false, message: 'INValid link . bot is not in the guild' });
    }


  } catch (error) {
    console.error('Error fetching guilds:', error);
    return res.status(201).send({ success: false, message:'Failed to fetch guilds'});
  }
});

export default authrouter;
