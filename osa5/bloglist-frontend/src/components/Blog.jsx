import { useState } from "react";

const Blog = ({ blog, likeBlog }) => {
  const [showAll, setShowAll] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleLikeBlog = (event) => {
    console.log(blog)
    likeBlog({
      user: blog.user,
      id: blog.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    })
  }

  return (
    <div style={blogStyle}>
      <div>
        <div>
        {blog.title} <button onClick={() => setShowAll(!showAll)}>{showAll ? 'hide' : 'view'}</button>
        </div>
        {showAll &&
          <div>
            <div>{blog.url}</div>
            <div>likes {blog.likes} <button onClick={handleLikeBlog}>like</button></div>
            <div>{blog.author}</div>
          </div>
        }
      </div>
    </div>
  );
};

export default Blog;
