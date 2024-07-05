import { Request, Response } from 'express';
import CommunityModel, { Community } from '../../models/community/community.model';

export const CommunityController = {

    // create a community
    createCommunity: async ( req: Request, res: Response ): Promise<void> =>
    {
        try
        {
            const newCommunity: Community = await CommunityModel.create( req.body );
            res.status( 201 ).json( { newCommunity: newCommunity, msg: "Community Created Successfully" } );
        } catch ( error )
        {
            res.status( 400 ).json( { message: 'Failed to create the Community', error } );
        }
    },

    // get all communities
    getAllCommunities: async ( req: Request, res: Response ): Promise<void> =>
    {
        try
        {
            const communities: Community[] = await CommunityModel.find();
            res.status( 200 ).json( {
                communities: communities,
                msg: "Fetched Communities successfully"
            } );
        } catch ( error )
        {
            res.status( 400 ).json( { message: 'failed to fetch the communities', error } );
        }
    },

    // Get a specific community by ID
    getCommunityById: async ( req: Request, res: Response ): Promise<void> =>
    {
        try
        {
            const community: Community | null = await CommunityModel.findById( req.params.id );
            res.status( 200 ).json( { community: community, msg: `Community Fetched successfully` } );
        }
        catch ( error )
        {
            res.status( 400 ).json( {
                message: 'failed to fetch the community', error
            } );
        }
    },
    
    // update a community
    updateCommunity: async ( req: Request, res: Response ): Promise<void> =>
    {
        try
        {
            const community: Community | null = await CommunityModel.findByIdAndUpdate( req.params.id, req.body,
                { new: true } );
            res.status( 200 ).json( community );
            
        } catch ( error )
        {
            res.status( 400 ).json( {
                message: 'failed to update the community', error
            } );
        }
    },
    
    //  delete a community
    deleteCommunity: async ( req: Request, res: Response ): Promise<void> =>
    {
        try
        {
            const community: Community | null = await CommunityModel.findByIdAndDelete( req.params.id );
            res.status( 200 ).json( community );
        } catch ( error )   
        {
            res.status( 400 ).json( {
                message: 'failed to delete the community', error
            } );
        }
    },

    // Get communities by ecosystem
    getCommunitiesByEcosystem: async ( req: Request, res: Response ): Promise<void> =>
    {
        try
        {
            const communities: Community[] = await CommunityModel.find( {
                ecosystem: req.params.ecosystem
            } );
            res.status( 200 ).json( communities );
        } catch ( error )
        {
            res.status( 400 ).json( {
                message: 'Failed to fetch the community by ecosystem',
                error
            } );
        }
    },

    //Get communities by category
    getCommunitiesByCategory: async ( req: Request, res: Response ): Promise<void> =>
    {
        try
        {
            const communities: Community[] = await CommunityModel.find( {
                category: req.params.category
            } );
            res.status( 200 ).json( communities );
        } catch ( error )
        {
            res.status( 400 ).json( {
                message: 'Failed to fetch the community by category', error
            } );
        }
    },

    // Add quest to a community
    addQuestToCommunity: async ( req: Request, res: Response ): Promise<void> =>
    {
        try
        {
            const updatedCommunity: Community | null = await CommunityModel.findByIdAndUpdate(
                req.params.id,
                {
                    $push: { quests: req.body.questId }
                },
                { new: true }
            );

            if ( !updatedCommunity )
            {
                res.status( 400 ).json( { message: 'Community not found' } );
            }

            res.status( 200 ).json( { "msg": "quest created successfully", updatedCommunity } );
        } catch ( error )
        {
            res.status( 400 ).json( {
                message: 'Failed to add quest to community',
                error
            } );
        }
    },

    // join the community by member
    joinCommunity: async ( req: Request, res: Response ): Promise<void> =>
    {
        try
        {
            const communityId = req.params.id;
            const memberId = req.body.memberId;

            if ( !communityId || !memberId )
            {
                res.status( 400 ).json( { message: 'Invalid community ID or member ID' } );
                return;
            }

            const updatedCommunity = await CommunityModel.findOneAndUpdate(
                { _id: communityId, members: { $ne: memberId } },
                { $addToSet: { members: memberId } },
                { new: true, runValidators: true }
            );
            console.log( updatedCommunity );
            if ( !updatedCommunity )
            {
                res.status( 404 ).json( { message: 'Community not found or member already added' } );
                return;
            }

            res.status( 200 ).json( {
                message: "Member added to community successfully",
                updatedCommunity
            } );
        } catch ( error )
        {
            console.error( 'Error in joinCommunity:', error );
            res.status( 500 ).json( {
                message: 'Internal server error while joining community'
            } );
        }
    },

    // member leave the community
    leaveCommunity: async (req: Request, res: Response): Promise<void> => {
    try {
        const communityId = req.params.id;
        const memberId = req.body.memberId;

        if (!communityId || !memberId) {
            res.status(400).json({ message: 'Invalid community ID or member ID' });
            return;
        }

        const updatedCommunity = await CommunityModel.findOneAndUpdate(
            { _id: communityId, members: memberId },
            { $pull: { members: memberId } },
            { new: true, runValidators: true }
        );

        if (!updatedCommunity) {
            res.status(404).json({ message: 'Community not found or member not in community' });
            return;
        }

        res.status(200).json({ 
            message: 'Member removed successfully', 
            updatedCommunity 
        });
    } catch (error) {
        console.error('Error in leaveCommunity:', error);
        res.status(500).json({ 
            message: 'Internal server error while leaving community'
        });
    }
}
    
    
    
}
 

           
       
   

    

    
