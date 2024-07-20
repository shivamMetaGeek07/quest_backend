import { Request, Response } from 'express';
import CommunityData from '../../models/admin/communityData';

// Controller to get community details
export const getCommunityData = async ( req: Request, res: Response ) =>
{
  try
  {
    const community = await CommunityData.findOne();
    if ( !community )
    {
      return res.status( 404 ).json( { message: 'Community not found' } );
    }
    res.status( 200 ).json( { community, message: 'Community meta data fetched successfully' } );
  } catch ( error )
  {
    res.status( 500 ).json( { message: 'Server error' } );
  }
};


export const createCommunityData = async ( req: Request, res: Response ) =>
{
  console.log( "create community", req.body );
  const { categories, ecosystems } = req.body;

  try
  {
    const newCommunity = new CommunityData( {
      categories,
      ecosystems,
    } );

    await newCommunity.save();

    res.status( 201 ).json( { message: 'Community created successfully', community: newCommunity } );
  } catch ( error )
  {
    res.status( 500 ).json( { message: 'Server error' } );
  }
};


// Controller to update categories and ecosystems
export const updateCommunityData = async ( req: Request, res: Response ) =>
{
  console.log( "update community", req.body );
  const { categories, ecosystems } = req.body;

  try
  {
    const community = await CommunityData.findOne();
    if ( !community )
    {
      return createCommunityData( req, res );
    }

    community.categories = categories;
    community.ecosystems = ecosystems;

    await community.save();
    res.status( 200 ).json( { message: 'Community updated successfully', community } );
  } catch ( error )
  {
    res.status( 500 ).json( { message: 'Server error' } );
  }
};
