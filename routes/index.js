var express = require('express');
var axios = require('axios')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  if(req.cookies.cookie == undefined){
    res.redirect('/login')
  }
  else{
    axios.get("https://hunter-todo-api.herokuapp.com/todo-item", {headers: {'Authorization':`${req.cookies.cookie.token}`}})
    .then(resc => {
       res.render("index", {tasks:resc.data});
    })
    .catch(err => {
      if(err.response.status == 404){
        res.render("index", {tasks:{}});
      }
      else{
      res.redirect("/login");
      }
    })
  }
});

router.get('/login', function(req, res) {
  res.render('login');
});

router.get('/logout', (req,res) => {
  res.clearCookie('cookie');
  res.redirect('/login');
});

router.get('/register', function(req, res) {
  res.render('register');
});

router.post('/register', function(req, res) {
  const header = {
    'username': req.body.username,
    headers: {'Content-Type': 'application/json'}
}
  axios.post('https://hunter-todo-api.herokuapp.com/user', header)
      .then(resb => {
          res.redirect("/login"); 
      })
      .catch(error => {
           console.error(error); 
           res.redirect("/register");  
      })
})

router.post('/login', function(req, res) {
  axios.post('https://hunter-todo-api.herokuapp.com/auth', {username:req.body.username})
 .then(resb => {
    res.cookie('cookie', {token:resb.data.token, name:req.body.username});
    res.redirect("/")
 })
 .catch(err => {
  if(err.status == 404){
    res.redirect("/")
  }
  else{
  res.redirect("/login"); 
  }
 });
})

router.post('/addtask', (req, res) => {
  axios.post('https://hunter-todo-api.herokuapp.com/todo-item', {content:req.body.content}, {headers: {"Authorization":`${req.cookies.cookie.token}`}})
  .then(resb => {
      res.redirect("/"); 
  })
  .catch(err => {
       res.redirect("/");  
  })
});

router.get('/markdone', (req, res) => {
  const id = 	req.query.id.substring(0, req.query.id.length - 1);
  axios.put("https://hunter-todo-api.herokuapp.com/todo-item/" + id, {completed:true}, {headers: {'Authorization':`${req.cookies.cookie.token}`, 'content-type': 'application/json'}})
  .then(resb => {
    res.redirect('/');
  })
  .catch(err => {
    res.redirect('/');
  })
});

router.get('/deletetask', (req, res) => {
  const id = 	req.query.id.substring(0, req.query.id.length - 1);
  axios.delete("https://hunter-todo-api.herokuapp.com/todo-item/" + id, {headers: {'Authorization':`${req.cookies.cookie.token}`, 'content-type': 'application/json'}})
  .then(resb => {
    res.redirect('/');
  })
  .catch(err => {
    res.redirect('/');
  })
});

module.exports = router;
