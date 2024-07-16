import { NextFunction, Request, Response } from "express";
import { IReferral, ReferralDb } from "../../models/other models/models";
import TaskModel from "../../models/task/task.model";
import UserDb from "../../models/user/user";
import { userInfo } from "os";
import CommunityModel, { Community } from "../../models/community/community.model";

export const  RefrralMiddleaware=async(req:Request,res: Response,next: NextFunction)=>{

    const communityId=req.params;
    const {referral ,userId}=req.body;
    
    if(!referral){
        res.status(401).json({message:"Invalid Call .Please Fill The referral"});
    }
    try {
        const referralCheck=await ReferralDb.findOne({referralCode:referral})
        if(!referralCheck){
        res.status(401).json({messgae:"Invalid Refrral"});
        }
        // const comunity=await CommunityModel.findById(communityId);
        const community = await CommunityModel.findById(communityId);
        if (!community) {
            return res.status(404).json({ message: "Community not found" });
        }

        // Check if the community in the referral does not match the community in the request
        if (community._id.toString() !== referralCheck?.communityInfo.toString()) {
            return res.status(401).json({ message: "Wrong community" });
        }
        const task = await TaskModel.findById(referralCheck?.taskInfo);
        if (!task) {
            res.status(404).json({ message: "Task not found" });
            return;
        }

        const user = await UserDb.findById(referralCheck?.userInfo);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const userTaskID=referralCheck?.userInfo
        // Check if the user has already completed this task
        const alreadyCompleted = task.completions?.some(
            (completion) => completion.user.toString() === user._id
        );

          if ( alreadyCompleted )
          {
            console.log("message: Task already completed by this user")
            res.status(400).json({ message: "Task already completed by this user" });
            return;
        }

        // Add the completion to the task
        if (!task.completions) {
            task.completions = [];
        }
        
        console.log(userTaskID);
        task?.completions.push( { user: referralCheck?.userInfo, completedAt: new Date(), submission:  userId, userName :user.displayName  } );


        await task.save();

        // Add the task to the user's completed tasks
        if (!user.completedTasks) {
            user.completedTasks = [];
        }
        user.completedTasks.push(referralCheck?.taskInfo);
        await user.save();

        return next();
    } catch (error) {
        console.error("Error checking user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
}