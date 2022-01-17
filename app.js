const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const Blog = require('./models/blogs');
const { render } = require('express/lib/response');

//make app
const app = express();

//connect to mongoose
const dbURI = 'mongodb+srv://soul-sister:akarshita@cluster0.4d3dv.mongodb.net/fullstack-try?retryWrites=true&w=majority';
mongoose.connect(dbURI,{useNewUrlParser : true, useUnifiedTopology : true})
  .then((result) => {
      //listen for requests
      app.listen(3000)
  })
  .catch((err) =>{
      console.log(err)
  })

//register viewengine
app.set('view engine','ejs')

//middleware
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))

// mongoose & mongo tests
// app.get('/add-blog', (req, res) => {
//     const blog = new Blog({
//       title: 'new blog',
//       snippet: 'about my new blog',
//       body: 'more about my new blog'
//     })
  
//     blog.save()
//       .then(result => {
//         res.send(result);
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   });

//   app.get('/all-blogs', (req, res) => {
//     Blog.find()
//       .then(result => {
//         res.send(result);
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   });

  // app.get('/single-blog', (req, res) => {
  //   Blog.findById('5ea99b49b8531f40c0fde689')
  //     .then(result => {
  //       res.send(result);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // });

app.get('/',(req,res) => {
  res.redirect('/blogs');
})
app.get('/about',(req,res) => {
    // res.send('<p>homepage hai yeh gadhe</p>')
    // res.sendFile('./views/about.html',{root : __dirname})
    res.render('about',{title : 'about us'});
})

//blog routes
app.get('/blogs/create',(req,res) => {
    // res.send('<p>homepage hai yeh gadhe</p>')
    // res.sendFile('./views/about.html',{root : __dirname})
    res.render('create',{title : 'create your blog'});
})
app.get('/blogs', (req, res) => {
  Blog.find().sort({ createdAt: -1 })
    .then(result => {
      res.render('index', { blogs: result, title: 'All blogs' });
    })
    .catch(err => {
      console.log(err);
    });
});

app.post('/blogs', (req, res) => {
  // console.log(req.body);
  const blog = new Blog(req.body);

  blog.save()
    .then(result => {
      res.redirect('/blogs');
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/blogs/:id', (req,res) => {
  const id = req.params.id.trim();
  Blog.findById(id)
      .then((result) => {
          res.render('details', { blog: result, title: 'Blog Details' })
      })
      .catch((err) => {
          console.log(err);
      });
});

app.delete('/blogs/:id', (req,res) => {
  const id = req.params.id.trim();
  Blog.findByIdAndDelete(id)
  .then(result => {
    res.json({redirect:'/blogs'})
  })
  .catch(err => {
    console.log(err)
  })
})

//for 404.. it should be at the end
app.use((req,res) => {
    // res.status(404).sendFile('./views/404.html',{root : __dirname})
    res.render('404',{title : 'error 404'})
})