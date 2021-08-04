var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectID
module.exports = {
    doSignup: (adminData) => {
        return new Promise(async (resolve, reject) => {
            adminData.Password = await bcrypt.hash(adminData.Password, 10)
            db.get().collection(collection.ADMIN_COLLECTION).insertOne(adminData).then((data) => {
                resolve(data.ops[0])
            })

        })

    },
    doLogin: (adminData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ Email: adminData.Email })
            if (admin) {
                bcrypt.compare(adminData.Password, admin.Password).then((status) => {
                    if (status) {
                        console.log("Login Success");
                        response.admin = admin
                        response.status = true
                        resolve(response)
                    } else {
                        console.log('Login Failed');
                        resolve({ status: false })
                    }
                })
            } else {
                console.log('Login Failed');
                resolve({ status: false })
            }
        })
    },
    addVenue: (venue, callback) => {


        db.get().collection('venue').insertOne(venue).then((data) => {

            callback(data.ops[0]._id)
        })
    },
    getAllVenues: () => {
        return new Promise(async (resolve, reject) => {
            let venues = await db.get().collection(collection.VENUE_COLLECTION).find().toArray()
            resolve(venues)
        })
    },
    deleteVenue: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.VENUE_COLLECTION).removeOne({ _id: objectId(proId) }).then((response) => {
                console.log(response);
                resolve(response)
            })
        })
    },
    getVenueDetails: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.VENUE_COLLECTION).findOne({ _id: objectId(proId) }).then((venue) => {
                resolve(venue)
            })
        })
    },
    updateVenue: (proId, proDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.VENUE_COLLECTION).updateOne({ _id: objectId(proId) }, {
                $set: {
                    Name: proDetails.Name,
                    Location: proDetails.Location,
                    Capacity: proDetails.Capacity,
                    Amount: proDetails.Amount

                }
            }).then((response) => {
                resolve()
            })
        })
    },
    getAllBookings: () => {
        return new Promise(async (resolve, reject) => {
            let bookings = await db.get().collection(collection.BOOKING_COLLECTION).find().toArray()
            resolve(bookings)
        })
    },
    cancelBooking: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.BOOKING_COLLECTION).removeOne({ _id: objectId(proId) }).then((response) => {
                console.log(response);
                resolve(response)
            })
        })
    },
    getAllFeedbacks: () => {
        return new Promise(async (resolve, reject) => {
            let feedbacks = await db.get().collection(collection.FEEDBACK_COLLECTION).find().toArray()
            resolve(feedbacks)
        })
    }
}
