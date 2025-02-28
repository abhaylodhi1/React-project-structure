import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPosts, addPost, deletePost, editPost } from '../api/api';

const TodoList = () => {
  const queryClient = useQueryClient();
  const [newPostTitle, setNewPostTitle] = useState('');

  const [editingPost, setEditingPost] = useState(null);
  const [editPostTitle, setEditPostTitle] = useState('');

  const {
    data: posts,
    //ZkkhakjsgckhatfjhcvscxknagsdckvAS,C
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  const addPostMutation = useMutation({
    mutationFn: addPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setNewPostTitle('');
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const editPostMutation = useMutation({
    mutationFn: editPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setEditingPost(null);
      setEditPostTitle('');
    },
  });

  const handleAddPost = () => {
    if (newPostTitle.trim()) {
      addPostMutation.mutate({ title: newPostTitle });
    }
  };

  const handleDeletePost = (id) => {
    deletePostMutation.mutate(id);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setEditPostTitle(post.title);
  };

  const handleUpdatePost = () => {
    if (editPostTitle.trim()) {
      editPostMutation.mutate({ ...editingPost, title: editPostTitle });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching posts</div>;

  return (
    <div className="todo-container">
      <h1>Todo List</h1>
      <div className="todo-input">
        <input
          type="text"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
          placeholder="Add a new post"
        />
        <button onClick={handleAddPost}>Add Post</button>
      </div>
      <ul>
        {posts?.map((post) => (
          <li key={post.id}>
            {editingPost?.id === post.id ? (
              <div className="edit-input">
                <input
                  type="text"
                  value={editPostTitle}
                  onChange={(e) => setEditPostTitle(e.target.value)}
                />
                <button className="update-btn" onClick={handleUpdatePost}>
                  Update
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setEditingPost(null)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                {post.title}
                <button
                  className="edit-btn"
                  onClick={() => handleEditPost(post)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeletePost(post.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
