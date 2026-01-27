import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleUserNameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("loggedNoteAppUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch {
      setErrorMessage("wrong username or password");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleNewBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility();
      const blog = await blogService.createBlog(blogObject);

      setBlogs(blogs.concat(blog));

      setSuccessMessage(`a new blog ${title} by ${author} added`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLikeBlog = async (blogObject) => {
    try {
      setBlogs(
        blogs.map((blog) => (blog.id === blogObject.id ? blogObject : blog)),
      );
      await blogService.likeBlog(blogObject);
      setSuccessMessage(`you liked ${blogObject.title} blog`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogOut = () => {
    setUser(null);
    blogService.setToken(null);
    window.localStorage.removeItem("loggedNoteAppUser");
  };

  return (
    <div>
      {!user && (
        <div>
          <h1>log in to application</h1>
          <Notification message={errorMessage} type="error" />
          <LoginForm
            usernameValue={username}
            passwordValue={password}
            handleUserNameChangeValue={handleUserNameChange}
            handlePasswordChangeValue={handlePasswordChange}
            onSubmitValue={handleLogin}
          />
        </div>
      )}
      {user && (
        <div>
          <h2>blogs</h2>
          <Notification message={successMessage} />
          <p>
            {user.name} logged in <button onClick={handleLogOut}>logout</button>
          </p>
          <h2>create new</h2>
          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm createBlog={handleNewBlog} />
          </Togglable>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} likeBlog={handleLikeBlog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
