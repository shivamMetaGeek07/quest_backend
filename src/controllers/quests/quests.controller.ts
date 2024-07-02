import { Request, Response } from "express";
import QuestModel, { Quest } from "../../models/quests/quest.model";


export const questController = {

    // create a quest
    createQuest: async ( req: Request, res: Response ) =>
    {
        try
        {
            const newQuest: Quest = await QuestModel.create( req.body );
            res.status( 201 ).json( { newQuest: newQuest, msg: "New Quest Created successful" } );
        } catch (error) {
            res.status( 500 ).json( { msg: "Error creating quest", error: error } );
        }
    },

    //  get all quests
    getAllQuests: async ( req: Request, res: Response ) =>
    {
        console.log("Hello world")
        try
        {

            const allQuests: Quest[] = await QuestModel.find();
            res.status( 200 ).json( {
                allQuests: allQuests, msg:
                    "All Quests retrieved successfully"
            } );
        } catch ( error )
        {
            res.status( 500 ).json( {
                msg: "Error retrieving all quests", error:
                    error
            } );
        }
    },

    // Get a specific quest by ID
    getQuestById: async ( req: Request, res: Response ) =>
    {
        try
        {
            const quest: Quest | null = await QuestModel.findById( req.params.id );
            res.status( 200 ).json( {
                quest: quest, msg: "Quest retrieved successfully"
            } );
        } catch ( error )
        {
            res.status( 500 ).json( {
                msg: "Error retrieving quest", error: error
            } );
        }
    },
    
    // update a quest
    updateQuest: async ( req: Request, res: Response ) =>
    {
        try
        {
            const updatedQuest: Quest | null = await QuestModel.findByIdAndUpdate( req.params.id, req.body
                , { new: true } );
            res.status( 200 ).json( {
                updatedQuest: updatedQuest, msg: "Quest updated successfully"
            } );
        } catch ( error )
        {
            res.status( 500 ).json( {
                msg: "Error updating quest", error: error
            } );
        }
    },

    // delete the quest
    deleteQuest: async ( req: Request, res: Response ) =>
    {
        try
        {
            const deletedQuest: Quest | null = await QuestModel.findByIdAndDelete( req.params.id );
            res.status( 200 ).json( {
                deletedQuest: deletedQuest, msg: "Quest deleted successfully"
            } );
        } catch ( error )
        {
            res.status( 500 ).json( {
                msg: "Error deleting quest", error: error
            } );
        }
    },

    // Get quests by type
    getQuestsByType: async ( req: Request, res: Response ) =>
    {
        try
        {
            const quests: Quest[] = await QuestModel.find( { type: req.params.type } );
            res.status( 200 ).json( {
                quests: quests, msg: "Quests retrieved successfully"
                } );
        } catch ( error )
        {
            res.status( 500 ).json( {
                msg: "Error retrieving quests", error: error
            } );
        }
    },

    // get the quest by status
    getQuestsByStatus: async ( req: Request, res: Response ) =>
    {
        try {
            const quests: Quest[] = await QuestModel.find( { status: req.params.status } );
            res.status( 200 ).json( {
                quests: quests, msg: "Quests retrieved successfully"
            } );
            
        } catch ( error )
        {
            res.status( 500 ).json( {
                msg: "Error retrieving quests", error: error
            } );
        }
    },
    
    // update the quest status
    updateQuestStatus: async ( req: Request, res: Response ) =>
    {
        try {
            const quest: Quest | null = await QuestModel.findOneAndUpdate( {
                _id: req.params.id
            } );
            res.status( 200 ).json( {
                quest: quest, msg: "Quest updated successfully"
            } );
        } catch (error) {
            res.status( 500 ).json( {
                msg: "Error updating quest", error: error
            } );
        }
        
    }
    
    

        

}