const API_URL = import.meta.env.VITE_API_URL;

const fetchPosts = async (page) => {
  const response = await fetch(
    `${API_URL}?_sort=-id${page ? `&_page=${page}&_per_page=5` : ''}`
  );
  if (!response.ok)
    throw new Error(`Failed to fetch posts. Status: ${response.status}`);
  return response.json();
};

const addPost = async (post) =>
  (
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    })
  ).json();

const deletePost = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error(`Failed to delete post with ID ${id}`);
  return response.json();
};

const editPost = async (updatedPost) => {
  const response = await fetch(`${API_URL}/${updatedPost.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedPost),
  });
  if (!response.ok)
    throw new Error(`Failed to update post. Status: ${response.status}`);
  return response.json();
};

export { fetchPosts, addPost, deletePost, editPost };
