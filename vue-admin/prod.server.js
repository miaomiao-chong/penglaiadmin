const express = require('express')


const port = 3020

const app = express()



app.get('/', function (req, res, next) {
  next()
})



app.use(express.static('./dist'))

app.use(function (err, req, res, next) {
  // handle CSRF token errors here
 //console.log(err);
})

module.exports = app.listen(port, function (err) {
  if (err) {
    //console.log(err)
    return
  }
  //console.log('Listening at http://localhost:' + port + '\n')
})
