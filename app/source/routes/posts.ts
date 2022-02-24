/** source/routes/posts.ts */
import express from 'express';
import controller from '../controller/posts';
const router = express.Router();

router.get('/posts', controller.getPosts);
router.get('/execute', controller.execute_contract);
router.put('/posts/:id', controller.updatePost);
router.delete('/posts/:id', controller.deletePost);
router.post('/posts', controller.addPost);

export = router;