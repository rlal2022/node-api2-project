// implement your posts router here

const express = require("express");
const router = express.Router();
const Post = require("./posts-model");

// #### 1 [GET] /api/posts

// - If there's an error in retrieving the _posts_ from the database:
//   - respond with HTTP status code `500`.
//   - return the following JSON: `{ message: "The posts information could not be retrieved" }`.

router.get("/", (req, res) => {
  Post.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ message: "The posts information could not be retrieved" });
    });
});

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then((posts) => {
      if (posts) {
        res.status(200).json(posts);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ message: "The post information could not be retrieved" });
    });
});

router.post("/", (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  } else {
    Post.insert({ title, contents })
      .then(({ id }) => {
        return Post.findById(id);
      })
      .then((posts) => {
        res.status(201).json(posts);
      })
      .catch((err) => {
        res.status(500).json({
          message: "There was an error while saving the post to the database",
        });
      });
  }
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, contents } = req.body;

  if (!title || !contents) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  } else {
    Post.update(id, req.body)
      .then((posts) => {
        if (!posts) {
          res
            .status(404)
            .json({ message: "The post with the specified ID does not exist" });
        } else {
          return Post.findById(id);
        }
      })
      .then((post) => {
        res.status(200).json(post);
      })
      .catch((err) => {
        res.status(500) /
          json({ message: "The post information could not be modified" });
      });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletePost = await Post.findById(req.params.id);
    if (!deletePost) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
    } else {
      const post = await Post.remove(req.params.id);
      res.status(200).json(deletePost);
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "The post information could not be modified" });
  }
});

router.get("/:id/comments", async (req, res) => {
  try {
    const post = Post.findById(req.params.id);
    if (post) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
    } else {
      const comments = await Post.findPostComments(req.params.id);
      res.json(comments);
    }
  } catch (err) {
    res.status(500).json({
      message: "The comments information could not be retrieved",
    });
  }

  //   const postId = Post.findById(req.params.id);
  //   postId
  //     .then((id) => {
  //       if (!id) {
  //         res
  //           .status(404)
  //           .json({ message: "The post with the specified ID does not exist" });
  //       } else {
  //         return Post.findPostComments(req.params.id);
  //       }
  //     })
  //     .then((comments) => {
  //       res.status(200).json(comments);
  //     })
  //     .catch((err) => {
  //       res
  //         .status(500)
  //         .json({ message: "The comments information could not be retrieved" });
  //     });
});

module.exports = router;
