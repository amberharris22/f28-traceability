const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const port = process.env.PORT || 6000

app.use(express.json())
app.use(cors())

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '1ea22916cdab40d882b21f93847dab35',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html')) //need a new app.get for each page
})

app.get('/css', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.css'))
  })

  app.get('/api/students', (req, res) => {
      res.status(200).send(students)
  })
  
  app.post('/api/students', (req, res) => {
     let {name} = req.body
  
     const index = students.findIndex(student => {
         return student === name
     })
  
     try {
         if (index === -1 && name !== '') {
              students.push(name)
              rollbar.log('Student was added successfully')
              res.status(200).send(students)
         } else if (name === ''){
              rollbar.error('No name was provided')
              res.status(400).send('You must enter a name.')
         } else {
              rollbar.critical('Student is already in array')
              res.status(400).send('That student already exists.')
         }
     } catch (err) {
         console.log(err)
     }
  })
  
  app.delete('/api/students/:index', (req, res) => {
      const targetIndex = +req.params.index
      
      students.splice(targetIndex, 1)
      rollbar.info('Student was deleted')
      res.status(200).send(students)

})

app.listen(port, () => console.log(`Server listening on ${port}`))