const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const Joi = require('joi');
const cors = require('cors')
const { reset } = require('nodemon');

// need to parse json body to the req to use
app.use(bodyParser.json())
app.use(cors())

const courses = [
  {
    name: 'Math',
    id: 1,
  },{
    name: 'Science',
    id: 2
  },{
    name: 'Geograph',
    id: 3
  }];
const token = 'F13XFS35%F5@FDFJ3'

// GET
app.get('/', (req, res) => {
  res.send('Hello Word')
})

// auuthentication logic, return a JWT token
app.get('/api/v1/authentication', (req, res) => {
  res.status(201)
  .cookie('access_token', 'Bearer ' + token, {
    expires: new Date(Date.now() + 8 * 3600000) // cookie will be removed after 8 hours
  })
  .cookie('test', 'test')
  .send('Authrized, cookie set')
})


// CRUD
// GET resources
app.get('/api/v1/courses', (req, res) => {
  res.send(courses)
})

// GET single resource
app.get('/api/v1/courses/:id', (req, res) => {
  let route_parmas = req.params;  // route parameters :id
  let query_params = req.query    // query parameters ?a=1&b=2
  const course = courses.find(c => c.id == route_parmas.id);
  if (!course) return res.status(404).send('The course with the given ID not exists')
  res.send(course)
})


// POST, add a resource
app.post('/api/v1/courses', (req, res) => {
  // use joi to validate input format, lenth...etc
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error)

  let request_body = req.body
  const course = {
    id : courses.length + 1,
    name: request_body.name
  }
  courses.push(course)
  res.send(course)
})


// PUT, update a resource
app.put('/api/v1/courses/:id', (req, res) => {
  // look up the course, not exists 404
  let route_parmas = req.params;  // route parameters :id
  const course = courses.find(c => c.id == route_parmas.id);
  if (!course) res.status(404).send('The course with the given ID not exists')

  // validate input, if invalid, return 400, bad request
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error)

  // update course DB, return updated course
  course.name = req.body.name
  res.send(course)
})

// DELETE
app.delete('/api/v1/courses/:id', (req, res) => {
  // look up the course, not exists 404
  let route_parmas = req.params;  // route parameters :id
  const course = courses.find(c => c.id == route_parmas.id);
  if (!course) return res.status(404).send('The course with the given ID not exists')

  // delte
  const index = courses.indexOf(course)
  courses.splice(index, 1)

  //return the deleted course
  res.send(course)
})


function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required()
  });
  return schema.validate(course);
}

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}`))
