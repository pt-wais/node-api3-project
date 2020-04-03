const express = require('express');

const Users = require('./userDb.js');
const Posts = require("../posts/postDb");
const router = express.Router();

router.post('/', validateUser, (req, res) => {
  // do your magic!
  Users.insert(req.body)
  .then(user => {
    res.status(200).json(user);
  })
  .catch(err => {
    res.status(500).json({message: "Could not add user"});
  })
});

router.post('/:id/posts', validatePost, validateUserId, (req, res) => {
  // do your magic!
  Posts.insert({...req.body, user_id: req.params.id})
  .then(post => {
    res.status(201).json(post);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({errorMessage: 'error creating post'});
  })

});

router.get('/', (req, res) => {
  // do your magic!
   Users.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "The user list could not be retrieved." });
    });
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  Users.getById(req.params.id)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).json({ message: 'Error retrieving the user', err });
    });
});

router.get('/:id/posts', (req, res) => {
  // do your magic!
    Users.getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "Error retrieving the posts" });
    });
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  Users.remove(req.params.id)
  .then(user => {
    res.status(200).json(user);
  }).catch(err => {
    console.log(err);
    res.status(500).json({errMessage: "Error deleting the user"})
  })
});

router.put('/:id',validateUserId, validateUser, (req, res) => {
  // do your magic!
  const { id } = req.params;

  Users.update(id, req.body)
    .then((user) => {
      res.status(200).json({ success: 'Info Updated!', info: req.body, user });
    })
    .catch((err) => {
      res.status(500).json({ error: 'I cannot provide any info from the inner server, try again!', err });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  Users.getById(req.params.id)
  .then(user => {
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(400).json({message: "invalid user id"})
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({message: "There was an error"});
  })
}

function validateUser(req, res, next) {
  if (req.body) {
    if (req.body.name) {
      next();
    } else {
      res.status(400).json({ message: "Missing name" });
    }
  } else {
    res.status(400).json({ message: "Missing user data" });
  }
}

function validatePost(req, res, next) {
  if (req.body) {
    if (req.body.text) {
      next();
    } else {
      res.status(400).json({ message: "Missing required text field" });
    }
  } else {
    res.status(400).json({ message: "Missing post data" });
  }
}


module.exports = router;
