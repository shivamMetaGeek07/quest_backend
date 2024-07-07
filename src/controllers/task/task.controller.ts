import { Request, Response } from "express";
import TaskModel, { TaskOrPoll } from "../../models/task/task.model";
import QuestModel from "../../models/quest/quest.model";


export const taskController = {

    // get all task
    getAllTask: async ( req: Request, res: Response ):Promise<void> =>
    {
        try
        {
            const tasks = await TaskModel.find();
            res.json( tasks );
        }
        catch ( err )
        {
            res.json( { message: err } );
        }
    },
    
    // get task by creator id
    getTaskByCreatorId: async ( req: Request, res: Response ) :Promise<void>=>
    {
        try
        {
            const tasks = await TaskModel.find( { creator: req.params.creatorId } );
            console.log( tasks );
            res.json( tasks );
        }
        catch ( err )
        {
            res.json( { message: err } );
        }
    },

     addTask: async ( req: Request, res: Response ) :Promise< void> =>
    {
        console.log(req.body)
        try
        {
            const questId = req.body.creator;
          
            const new_task: TaskOrPoll = await TaskModel.create( req.body );

            const quest = await QuestModel.findById( questId );
            // console.log(quest)
            if ( quest )
            {
                quest?.tasks?.push( new_task._id );
                await quest?.save();
            }else{
                res.status( 400 ).json( { message: "Quest not found" } );
            }
            res.status( 200 ).json( { msg:"New Task has been created", new_task:new_task} );
            } catch (error) {
            console.log( error )
            res.status( 500 ).json( { msg: "Error creating new  Task", error } );
        }
    },


     
     
     
     
     
     
     
     
     
     

     
     
     
    //  DON'T TOUCH BELOW CODE
     

     
     // these are just for now, if not needed and we dont required i will remove them , please don't touch them
    // // visit link task
    // visitLink: async ( req: Request, res: Response ) :Promise< void> =>
    // {
    //     console.log(req.body)
    //     try
    //     {
    //         const questId = req.body.creator;
          
    //         const visit: TaskOrPoll = await TaskModel.create( req.body );

    //         const quest = await QuestModel.findById( questId );
    //         // console.log(quest)
    //         if ( quest )
    //         {
    //             quest?.tasks?.push( visit._id );
    //             await quest?.save();
    //         }else{
    //             res.status( 400 ).json( { message: "Quest not found" } );
    //         }
    //         res.status( 200 ).json( { msg:"New Visit Link Task has been created", newVisitTask:visit} );
    //         } catch (error) {
    //         console.log( error )
    //         res.status( 500 ).json( { msg: "Error creating new Visit Link Task", error } );
    //     }
    // },

    // // create a poll
    // createPoll: async ( req: Request, res: Response ): Promise<void> =>
    // {
    //     console.log( req.body )
    //     try
    //     {
    //         const questId = req.body.creator;
    //         const poll: TaskOrPoll = await TaskModel.create( req.body );
    //         const quest = await QuestModel.findById( questId );
    //         if ( quest )
    //         {
    //             quest?.tasks?.push( poll._id );
    //             await quest?.save();
    //         }
    //         else
    //         {
    //             res.status( 400 ).json( { message: "Quest not found" } );
    //         }
    //         res.status( 200 ).json( {
    //             msg: "New Poll Task has been created", "new Poll Task": poll
    //         } );
    //     } catch ( error )
    //     {
    //         console.log( error )
    //         res.status( 500 ).json( {
    //             msg: "Error creating new Poll Task", error
    //         } );
    //     }
    // },

    // // create a quiz
    // createQuiz: async ( req: Request, res: Response ): Promise<void> =>
    // {
    //     console.log( req.body )
    //     try
    //     {
    //         const questId = req.body.creator;
    //         const quiz: TaskOrPoll = await TaskModel.create( req.body );
    //         const quest = await QuestModel.findById( questId );
    //         if ( quest )
    //         {
    //             quest?.tasks?.push( quiz._id );
    //             await quest?.save();
    //         }
    //         else
    //         {
    //             res.status( 400 ).json( { message: "Quest not found" } );
    //         }
    //         res.status( 200 ).json( {
    //             msg: "New Quiz Task has been created", "new Quiz Task": quiz
    //         } );
    //     } catch ( error )
    //     {
    //         console.log( error )
    //         res.status( 500 ).json( {
    //             msg: "Error creating new Quiz Task", error
    //         } );
    //     }
    // },

    // // create a invite to n number of other members
    // createInvite: async ( req: Request, res: Response ): Promise<void> =>
    // {
    //     console.log( req.body )
    //     try
    //     {
    //         const questId = req.body.creator;
    //         const invite: TaskOrPoll = await TaskModel.create( req.body );
    //         const quest = await QuestModel.findById( questId );
    //         if ( quest )
    //         {
    //             quest?.tasks?.push( invite._id );
    //             await quest?.save();
    //         }
    //         else
    //         {
    //             res.status( 400 ).json( { message: "Quest not found" } );
    //         }
    //         res.status( 200 ).json( {
    //             msg: "New Invite Task has been created", "new Invite Task": invite
    //         } );
    //     } catch ( error )
    //     {
    //         console.log( error )
    //         res.status( 500 ).json( {
    //             msg: "Error creating new Invite Task", error
    //         } );
    //     }
    // }
    
    
    

    
}