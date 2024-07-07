import { Request, Response } from 'express';
// import { generate , charset,Charset } from 'referral-codes';

    const generatreReferral=async()=>{
        try{
            const { generate } = await import('referral-codes');
            const referralCode = generate({
            count: 1, // Generating a single code
            length: 6, // Length of the code
            charset: '0123456789', // Characters to use in the code
            });

        return referralCode
        }
        catch(error){
            console.log(`error while creating referral ${error}`)
            return error
        }
        
    }
 const createReferral = async (req: Request, res: Response): Promise<void> => {

    try{
        const referralCode=await generatreReferral()
        res.send(referralCode)
    }
    catch(error){
        console.log(`error while creating referral ${error}`)
        res.send(error)
    }
};

export default createReferral

