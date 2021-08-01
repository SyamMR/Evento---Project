var express = require('express');
const adminHelpers = require('../helpers/admin-helpers');
var router = express.Router();
var adminHelper=require('../helpers/admin-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
adminHelpers.getAllVenues().then((venues)=>{
  console.log(venues);
  res.render('admin/view-venues',{admin:true,venues})
})
  
});
router.get('/add-venue',function(req,res){
  res.render('admin/add-venue',{admin:true})
})
router.post('/add-venue',(req,res)=>{
 

  adminHelpers.addVenue(req.body,(id)=>{
    let image=req.files.Image
    console.log(id);
    image.mv('./public/venue-images/'+id+'.jpg',(err)=>{
      if(!err){
    res.render("admin/add-venue",{admin:true})
  }else{
    console.log(err);
  }
    })
    
  })
})
router.get('/delete-venue/:id',(req,res)=>{
  let proId=req.params.id
  console.log(proId);
  adminHelpers.deleteVenue(proId).then((response)=>{
    res.redirect('/admin/')
  })
})
router.get('/edit-venue/:id',async (req,res)=>{
  let venue=await adminHelpers.getVenueDetails(req.params.id)
  console.log(venue);
  res.render('admin/edit-venue',{admin:true,venue})
})
router.post('/edit-venue/:id',(req,res)=>{
  console.log(req.params.id);
  let id=req.params.id
  adminHelpers.updateVenue(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.Image){
      let image=req.files.Image
      image.mv('./public/venue-images/'+id+'.jpg')
    }
  })
})
router.get('/all-bookings',(req,res)=>{
  adminHelpers.getAllBookings().then((bookings)=>{
    console.log(bookings);
  res.render('admin/all-bookings',{admin:true,bookings})
})
})

router.get('/cancel-booking/:id',(req,res)=>{
  let proId=req.params.id
  console.log(proId);
  adminHelpers.cancelBooking(proId).then((response)=>{
    res.redirect('/admin/all-bookings/')
  })
})
router.get('/users-feedbacks',(req,res)=>{
  adminHelpers.getAllFeedbacks().then((feedbacks)=>{
    console.log(feedbacks);
  res.render('admin/users-feedbacks',{admin:true,feedbacks})
})
})

module.exports = router;
