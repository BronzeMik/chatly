import userModel from "../model/userModel.js";
import bcrypt from 'bcrypt';


export const register = async (req,res,next) => {
    try{
        console.log(req.body)
        const {username, email, password} = req.body;

    const userNameCheck = await userModel.findOne({username});

    // check username
    if(userNameCheck) {
        return res.json({msg: "username already taken", status: false})
    }

    // check email
    const emailCheck = await userModel.findOne({email});

    if(emailCheck) {
        return res.json({msg: "email already taken, try logging in", status: false})
    }

    // generate hased password
    const hashedPassword = await bcrypt.hash(password, 10);


    // create user
    const user = await userModel.create({
        email,
        username, password: hashedPassword
    })

    // delete password
    delete user.password


    // return user
    return res.json({status: true, user})
    }
    catch(err) {
        next(err);
    }
    
}

export const login = async (req,res,next) => {
    try{
        const {username, password} = req.body;

    const user = await userModel.findOne({username});

    // Check username
    if(!user) {
        return res.json({msg: "Incorrect username or password", status: false})
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(isPasswordValid === false) {
        return res.json({msg: "Incorrect username or password", status: false})
    }

    // delete password
    delete user.password


    // return user
    return res.json({status: true, user})
    }
    catch(err) {
        next(err);
    }
    
}

export const setAvatar = async (req,res,next) => {
    try{
        // get user id and avatar
        const userId = req.params?.id;
        const avatarImage = req.body?.image;

        // update user data in DB
        const userData = await userModel.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage,
        });

        return res.json({isSet: userData.isAvatarImageSet, image: userData.avatarImage})
    }
    catch(err) {
        next(err);
    }
    
}

export const getAllUsers = async (req,res,next) => {
    try{
        // selects all users except current user
        const users = await userModel.find({_id:{$ne:req.params.id}}).select([
            "email",
            "username",
            "avatarImage",
            "_id"
        ])

        

        return res.json(users)
    }   

    catch(err) {
        next(err);
    }
    
}
