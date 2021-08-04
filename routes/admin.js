var express = require('express');
const adminHelpers = require('../helpers/admin-helpers');
var router = express.Router();
var adminHelper = require('../helpers/admin-helpers');
const verifyLogin = (req, res, next) => {
  if (req.session.admin) {
    next()
  } else {
    res.redirect('/admin/login')
  }
}

/* GET users listing. */
router.get('/', verifyLogin, function (req, res, next) {
  let admin = req.session.admin
  adminHelpers.getAllVenues().then((venues) => {
    console.log(venues);
    res.render('admin/view-venues', { admin: true, venues, admin, title: 'Admin-panel' })
  })
});
router.get('/login', (req, res) => {
  if (req.session.admin) {
    res.redirect('/admin')
  } else {
    res.render('admin/login', { "loginErr": req.session.adminLoginErr, admin: true, title: 'Admin-Login' })
    req.session.adminLoginErr = false
  }
})
router.get('/signup', (req, res) => {
  res.render('admin/signup', { admin: true, title: 'Admin-Signup' })
})
router.post('/signup', (req, res) => {
  adminHelpers.doSignup(req.body).then((response) => {
    console.log(response);
    req.session.admin = response
    req.session.admin.loggedIn = true
    res.redirect('/admin')
  })
})
router.post('/login', (req, res) => {
  adminHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.admin = response.admin
      req.session.admin.loggedIn = true
      res.redirect('/admin')
    } else {
      req.session.adminLoginErr = "Invalid name or password"
      res.redirect('/admin/login')
    }
  })
})
router.get('/logout', (req, res) => {
  req.session.admin = null
  res.redirect('/admin')
})
router.get('/add-venue', verifyLogin, function (req, res) {
  let admin = req.session.admin
  res.render('admin/add-venue', { admin: true, admin })
})
router.post('/add-venue', (req, res) => {
  let admin = req.session.admin
  adminHelpers.addVenue(req.body, (id) => {
    let image = req.files.Image
    console.log(id);
    image.mv('./public/venue-images/' + id + '.jpg', (err) => {
      if (!err) {
        res.render("admin/add-venue", { admin: true, admin })
      } else {
        console.log(err);
      }
    })

  })
})
router.get('/delete-venue/:id', (req, res) => {
  let proId = req.params.id
  console.log(proId);
  adminHelpers.deleteVenue(proId).then((response) => {
    res.redirect('/admin/')
  })
})
router.get('/edit-venue/:id', async (req, res) => {
  let admin = req.session.admin
  let venue = await adminHelpers.getVenueDetails(req.params.id)
  console.log(venue);
  res.render('admin/edit-venue', { admin: true, venue, admin, title: 'Edit-product' })
})
router.post('/edit-venue/:id', (req, res) => {
  console.log(req.params.id);
  let id = req.params.id
  adminHelpers.updateVenue(req.params.id, req.body).then(() => {
    res.redirect('/admin')
    if (req.files.Image) {
      let image = req.files.Image
      image.mv('./public/venue-images/' + id + '.jpg')
    }
  })
})
router.get('/all-bookings', verifyLogin, (req, res) => {
  let admin = req.session.admin
  adminHelpers.getAllBookings().then((bookings) => {
    console.log(bookings);
    res.render('admin/all-bookings', { admin: true, bookings, admin, title: 'All-bookings' })
  })
})

router.get('/cancel-booking/:id', (req, res) => {
  let proId = req.params.id
  console.log(proId);
  adminHelpers.cancelBooking(proId).then((response) => {
    res.redirect('/admin/all-bookings/')
  })
})
router.get('/users-feedbacks', verifyLogin, (req, res) => {
  let admin = req.session.admin
  adminHelpers.getAllFeedbacks().then((feedbacks) => {
    console.log(feedbacks);
    res.render('admin/users-feedbacks', { admin: true, feedbacks, admin, title: 'Users-feedbacks' })
  })
})

module.exports = router;
