var express = require('express');
var router = express.Router();
const adminHelpers = require('../helpers/admin-helpers');
const userHelpers = require('../helpers/user-helpers');

const verifyLogin = (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    res.redirect('/login')
  }
}
/* GET home page. */
router.get('/', function (req, res, next) {
  let user = req.session.user
  console.log(user);
  adminHelpers.getAllVenues().then((venues) => {

    res.render('user/view-venues', { venues, user })
  })
});
router.get('/login', (req, res) => {
  if (req.session.user) {
    res.redirect('/')
  } else {
    res.render('user/login', { "loginErr": req.session.userLoginErr })
    req.session.userLoginErr = false
  }
})
router.get('/signup', (req, res) => {
  res.render('user/signup')
})
router.post('/signup', (req, res) => {

  userHelpers.doSignup(req.body).then((response) => {
    console.log(response);
    req.session.user = response
    req.session.user.loggedIn = true
    res.redirect('/')
  })
})
router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.user = response.user
      req.session.user.loggedIn = true
      res.redirect('/')
    } else {
      req.session.userLoginErr = "Invalid username or password"
      res.redirect('/login')
    }
  })
})
router.get('/logout', (req, res) => {
  req.session.user = null
  res.redirect('/login')
})
router.get('/book-now', verifyLogin, (req, res) => {
  res.render('user/book-now', { user: req.session.user })
})
router.post('/book-now', (req, res) => {

  console.log(req.body);
  userHelpers.addBooking(req.body, (id) => {
    res.redirect("/")
  })
})
router.get('/contact-us', verifyLogin, (req, res) => {
  res.render('user/contact-us', { user: req.session.user })
})
router.post('/contact-us', (req, res) => {

  console.log(req.body);
  userHelpers.addFeedback(req.body, (id) => {
    res.redirect("/")
  })
})
router.get('/about-us', verifyLogin, (req, res) => {
  res.render('user/about-us', { user: req.session.user })
})

module.exports = router;
