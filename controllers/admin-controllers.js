
const User = require('../model/user')
const user = require('../model/user')

const mailPattern =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


module.exports = {


    checkAuthPayload : (req,res,next)=>{
    //recuperer l'email et mdp dans le body de la requete 
    const{email, password}=req.body

    if(!email||!password){

        return res.status(400).json({message:'missing email or password'})
    }
    req.email = email
    req.password = password
    // sinon passer au middleware suivant 
    next()

},

    checkEmailPayload : (req,res,next) => {
    const {email}=req
    if (!mailPattern.test(email)) 
        return res.status(400).json({message:"invalid email's format"})

    next()
},
    checkPasswordPayload : (req,res,next) => {

    next()
},
signupResponse:async(req,res) => {
    try{

    //TODO : enregistre le new user
        const {email,password} = req

        const newUser = new User({
            email,
            password,
            ingredients: [],
        })

        const savedUser = await newUser.save()
        if(!savedUser) throw new Error("saving user error")
        const existingUser = await User.findOne({email})
        if (existingUser) throw new Error('Existing user')


        res.status(201).json({message:'tout va bien'})        
        }catch (error){
            let status = 500

            if (error.message === 'Existing user') status = 400
            console.log('---------------');
            console.error(
                new Date().toISOString,
                'controllers/admin-controllers.js > signupResponse > error '.error
                )
            return res.status(status).json({message})

        }
    },
}
