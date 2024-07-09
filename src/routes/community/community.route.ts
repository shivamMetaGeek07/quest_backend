import express  from "express"
import { CommunityController } from "../../controllers/community/community.controller";

const communityRoute = express.Router();


// create community
communityRoute.post( '/', CommunityController.createCommunity );

// get all commmunities
communityRoute.get( '/', CommunityController.getAllCommunities );

// get a specific communiyt by id
communityRoute.get( '/:id', CommunityController.getCommunityById );

// get communities by ids
communityRoute.post('/getByIds', CommunityController.getCommunitiesByIds);

// update the community
communityRoute.put( '/:id', CommunityController.updateCommunity );

// delete the community
communityRoute.delete( '/:id', CommunityController.deleteCommunity );

// get communities by ecosystem
communityRoute.get( '/ecosystem/:ecosystem', CommunityController.getCommunitiesByEcosystem );

// get community by category
communityRoute.get( '/category/:category', CommunityController.getCommunitiesByCategory );

// add the quest to community
communityRoute.post( '/:id', CommunityController.addQuestToCommunity );

// join community
communityRoute.post( '/joincommunity/:id', CommunityController.joinCommunity );

// leave the community
communityRoute.post( '/leavecommunity/:id', CommunityController.leaveCommunity );


export default communityRoute;


