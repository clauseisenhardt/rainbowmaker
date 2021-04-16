const Post = require('../models/post');

exports.createPost = (req, res, next) => {
  console.log("Posts:createPost: " + req.body.title);
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/image/" + req.file.filename,
    creator: req.userData.userId
  });
  console.log(req.userData);
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added succesfully!',
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Creating a post failed!"
    });
  });
}

exports.updatePost = (req, res, next) => {
  //console.log("Put: ", req);
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/image/" + req.file.filename
  }

  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId

  });
  console.log("Update post: " + post._id + " title: " + post.title);
  //console.log("  Post: " + post);
  console.log("  Post creator: " + req.userData.userId);
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
  .then(result => {
    if (result.n > 0) {
      res.status(200).json({
        message: 'Post updated succesfully!'
      });
    }
    else {
      res.status(401).json({
        message: 'Not authorized!'
      })
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Could not update post!"
    });
  });
}

exports.getPosts = (req, res, next) => {
  console.log('get posts start...');
  console.log(req.query);
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPost;

  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1) )
      .limit(pageSize);
  }

  postQuery.
    then(documents => {
      //console.log(documents);
      fetchedPost = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        messege: 'Posts fetched succesfully!',
        posts: fetchedPost,
        maxPosts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed!"
      });
    });
  console.log('get posts end.');
}

exports.getPost = (req, res, next) => {
  console.log('Get post: ' + req.params.id);
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    }
    else {
      res.status(404).json({ message: 'Post not found!'});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching post failed!"
    });
  });
}

exports.deletePost = (req, res, next) => {
  console.log('delete post: ' + req.params.id);

  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
  .then(result => {
    //console.log(result);
    if (result.n > 0) {
      res.status(200).json({
        message: 'Post deleted succesfully!'
      });
    }
    else {
      res.status(401).json({
        message: 'Not authorized!'
      });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Deleting post failed!"
    });
  });
  console.log('delete post.');
}
