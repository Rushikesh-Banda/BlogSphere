import exp from 'express'
import {UserTypeModel} from '../models/UserModel.js'

export const adminRoute = exp.Router()

//block user
adminRoute.post('/block/:userId', async (req, res) => {

    try {

        //get user id from params
        let uid = req.params.userId

        //update user as blocked 
        let blockedUser = await UserTypeModel.findByIdAndUpdate(
            uid,
            { $set: { isUserActive: false } },
            { returnDocument: 'after' },

        )

        //if user not found
        if (!blockedUser) {
            return res.status(404).json({ message: "user not found" })
        }

        //send response
        res.status(200).json({ message: "user blocked", payload: blockedUser })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }

})


//unblock user
adminRoute.post('/unblock/:userId', async (req, res) => {

    try {

        //get user id from params
        let uid = req.params.userId

        //update user as active
        let unblockedUser = await UserTypeModel.findByIdAndUpdate(
            uid,
            { $set: { isUserActive: true } },
            { new: true }
        )

        //if user not found
        if (!unblockedUser) {
            return res.status(404).json({ message: "user not found" })
        }

        //send response
        res.status(200).json({ message: "user unblocked", payload: unblockedUser })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }

})
