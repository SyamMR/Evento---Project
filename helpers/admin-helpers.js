var db=require('../config/connection')
var collection=require('../config/collections')
var objectId=require('mongodb').ObjectID
module.exports={
    addVenue:(venue,callback)=>{
       
        
        db.get().collection('venue').insertOne(venue).then((data)=>{
               
            callback(data.ops[0]._id)
        })
    },
    getAllVenues:()=>{
        return new Promise(async(resolve,reject)=>{
            let venues=await db.get().collection(collection.VENUE_COLLECTION).find().toArray()
            resolve(venues)
        })
    },
    deleteVenue:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.VENUE_COLLECTION).removeOne({_id:objectId(proId)}).then((response)=>{
                console.log(response);
                resolve(response)
            })
        })
    },
    getVenueDetails:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.VENUE_COLLECTION).findOne({_id:objectId(proId)}).then((venue)=>{
                resolve(venue)
            })
        })
    },
    updateVenue:(proId,proDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.VENUE_COLLECTION).updateOne({_id:objectId(proId)},{
                $set:{
                    Name:proDetails.Name,
                    Location:proDetails.Location,
                 Capacity:proDetails.Capacity,
                    Amount:proDetails.Amount
                    
                }
            }).then((response)=>{
                resolve()
            })
        })
    },
    getAllBookings:()=>{
        return new Promise(async(resolve,reject)=>{
            let bookings=await db.get().collection(collection.BOOKING_COLLECTION).find().toArray()
            resolve(bookings)
        })
    },
    cancelBooking:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.BOOKING_COLLECTION).removeOne({_id:objectId(proId)}).then((response)=>{
                console.log(response);
                resolve(response)
            })
        })
    },
    getAllFeedbacks:()=>{
        return new Promise(async(resolve,reject)=>{
            let feedbacks=await db.get().collection(collection.FEEDBACK_COLLECTION).find().toArray()
            resolve(feedbacks)
        })
    }
}
