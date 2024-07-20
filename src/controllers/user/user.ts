import { Request, Response } from "express";
import User from "../../models/user/user";
import { CommandInteractionOptionResolver } from "discord.js";
import UserDb from "../../models/user/user";

const getUserById = async (req: Request, res: Response) => {

  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }  
    res.status(200).json(user);  
  } catch (error) {
    res.status(500).json({ error: error });
  } 
};

const getFriendsByIds = async ( req: Request, res: Response ): Promise<void> =>
{
  try
  {
    const friendsId = req.body.friendsIds;
        // console.log(friendsId)
    if ( !Array.isArray( friendsId ) )
    {
      res.status( 400 ).json( { message: 'Invalid input: friendsId must be an array' } );
      return;
    }
    const friends = await User.find( { _id: { $in: friendsId } } );
      
    res.status( 200 ).json( {
      message: "friendsId fetched successfully",
      friends
    } );
  } catch ( error )
  {
    console.error( 'Error in getFriendsByIds:', error );
    res.status( 500 ).json( {
      message: 'Internal server error while fetching friends'
    } );
  }
}

const followUser = async (req: Request, res: Response) => {
  const { userId, followId } = req.body;
  try {
    const user = await User.findById(userId);
  const followUser = await User.findById(followId);

  if (!user || !followUser) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!user.following.includes(followId)) {
    user.following.push(followId);
  }
  if (!followUser.followers.includes(userId)) {
    followUser.followers.push(userId);
  }

  await user.save();
  await followUser.save();

  res.status(200).json({ message: "Successfully followed" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
  
  
};

const unfollowUser = async (req: Request, res: Response) => {
  const { userId, unfollowId } = req.body;
  // console.log(userId, unfollowId);
  try {
    const user = await User.findById(userId);
    const unfollowUser = await User.findById(unfollowId);

    if (!user || !unfollowUser) {
      return res.status(404).json({ message: "User not found" });
    }

    user.following = user.following.filter(
      (id) => id.toString() !== unfollowId
    );
    unfollowUser.followers = unfollowUser.followers.filter(
      (id) => id.toString() !== userId
    );

    await user.save();
    await unfollowUser.save();

    res.status(200).json({ message: "Successfully unfollowed" });
  } catch (err) {
    console.log(err);
    res.sendStatus(500).json({ error: err });
  }
};

const getAllUser = async ( req: Request, res: Response ) =>
{
  try {
    const users: any = await User.find();
    // console.log(users);
    res.status(200).json(users);
  } catch ( err ) 
  {
    console.log("error in geting the users :-",err)
    res.status( 500 ).json( { error: err } );
  }
}

export { getUserById, followUser, unfollowUser,getAllUser, getFriendsByIds };
