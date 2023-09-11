import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import CameraIcon from "@mui/icons-material/PhotoCamera";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import TextField from "@mui/material/TextField";
import "../Album.css";
// import UploadAdapterPlugin from "@ckeditor/ckeditor5-upload/src/adapters/uploadadapter";

const Album = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [openn, setOpenn] = useState(false);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [error, setError] = useState();
  const [updatedescription, setUpdateDescription] = useState("");
  const [updatetitle, setUpdateTitle] = useState("");
  const [blogId, setblogId] = useState();
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const validateTitle = () => {
    if (!title.trim()) {
      setTitleError("!Title is required");
      return false;
    }
    setTitleError("");
    return true;
  };
  const validateDescription = () => {
    if (!description.trim()) {
      setDescriptionError("Description is required");
      return false;
    }
    setDescriptionError("");
    return true;
  };

  const handlePreviewToggle = () => {
    setIsPreviewMode(!isPreviewMode);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpenn = (blog) => {
    const blogToEdit = blogs.find((item) => item._id === blog);

    if (blogToEdit) {
      setblogId(blogToEdit._id);
      setUpdateTitle(blogToEdit.title);
      setUpdateDescription(blogToEdit.description);
      setOpenn(true);
    }
  };

  const handleClosee = () => {
    setOpenn(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isTitleValid = validateTitle();
    const isDescriptionValid = validateDescription();
    if (isTitleValid && isDescriptionValid) {
      try {
        const response = await axios.post("http://localhost:3000/api/blog", {
          title: title,
          description: description,
        });
        setIsLoading(false);
        setDescription("");
        setTitle("");
        console.log("Blog created:", response.data);
        setOpen(false);
        viewData();
      } catch (error) {
        console.error("Error creating blog:", error.response.data);
      }
    }
  };

  const viewData = () => {
    let addQuery = "";
    if (searchQuery) {
      addQuery = addQuery + `?title=${searchQuery}`;
    }
    fetch(`http://localhost:3000/api/getblog${addQuery}`)
      .then((response) => response.json())
      .then((data) => {
        setBlogs(data.task);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  useEffect(() => {
    viewData();
  }, [searchQuery]);
  const styles = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    p: 3,
  };
  if (isLoading) {
    return (
      <div>
        <Box sx={styles}>
          <CircularProgress />
        </Box>
      </div>
    );
  }

  const handleDelete = async (blogId) => {
    console.log("id", blogId);
    try {
      const response = await fetch(
        `http://localhost:3000/api/deleteData/${blogId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Blog deleted successfully");
        viewData();
        setIsLoading(false);
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId));
      } else if (response.status === 404) {
        console.log("Blog not found");
      } else {
        console.log("An error occurred while deleting the blog");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      console.log("blogId", blogId);
      const response = await axios.put(
        `http://localhost:3000/api/updateblog/${blogId}`,
        {
          title: updatetitle,
          description: updatedescription,
        }
      );
      console.log("updatetitle", updatetitle);
      console.log("updatedescription", updatedescription);
      if (response.status === 200) {
        console.log("Blog updated successfully");
        viewData();
        setIsLoading(false);
        handleClosee();
      } else {
        console.error("Error updating blog", response.status);
        setError("Error updating blog", response.status);
      }
    } catch (error) {
      console.error("Error updating blog", error);
      setError("Error updating blog", error);
    }
  };

  const defaultTheme = createTheme();
  return (
    <ThemeProvider theme={defaultTheme}>
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Create New Blog"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <div className="App">
                <h3>Enter The Title</h3>
                {isPreviewMode ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: title }}
                    style={{ maxHeight: "300px", overflowY: "auto" }}
                  />
                ) : (
                  <TextField
                    id="outlined-basic"
                    required
                    label="Title"
                    variant="outlined"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                )}
                <p className="error-message">{titleError}</p>
                <h4>Enter The Description</h4>
                {isPreviewMode ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: description }}
                    style={{ maxHeight: "300px", overflowY: "auto" }}
                  />
                ) : (
                  <CKEditor
                    editor={ClassicEditor}
                    data={description}
                    onReady={(editor) => {
                      console.log("Editor is ready to use!", editor);
                    }}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setDescription(data);
                      console.log({ event, editor, data });
                    }}
                    onBlur={(event, editor) => {
                      console.log("Blur.", editor);
                    }}
                    onFocus={(event, editor) => {
                      console.log("Focus.", editor);
                    }}
                  />
                )}
                <p className="error-message">{descriptionError}</p>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePreviewToggle}>
              {isPreviewMode ? "Edit" : "Preview"}
            </Button>
            <Button onClick={handleSubmit}>Done</Button>
            <Button onClick={handleClose} autoFocus>
              cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      {/* ========================================================================================= */}
      <div>
        <Dialog
          open={openn}
          onClose={handleClosee}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Update Blog"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <div className="App">
                <h3>Enter The Title</h3>
                {isPreviewMode ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: updatetitle }}
                    style={{ maxHeight: "300px", overflowY: "auto" }}
                  />
                ) : (
                  <TextField
                    id="outlined-basic"
                    label="Title"
                    variant="outlined"
                    value={updatetitle}
                    onChange={(e) => setUpdateTitle(e.target.value)}
                  />
                )}
                <h4>Enter The Description</h4>
                {isPreviewMode ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: updatedescription }}
                    style={{ maxHeight: "300px", overflowY: "auto" }}
                  />
                ) : (
                  <CKEditor
                    editor={ClassicEditor}
                    data={updatedescription}
                    onReady={(editor) => {
                      console.log("Editor is ready to use!", editor);
                    }}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setUpdateDescription(data);
                    }}
                    onBlur={(event, editor) => {
                      console.log("Blur.", editor);
                    }}
                    onFocus={(event, editor) => {
                      console.log("Focus.", editor);
                    }}
                  />
                )}
              </div>
            </DialogContentText>
          </DialogContent>
          {error && <p> &nbsp;&nbsp;&nbsp;&nbsp;{error}</p>}
          <DialogActions>
            <Button onClick={handlePreviewToggle}>
              {isPreviewMode ? "Edit" : "Preview"}
            </Button>
            <Button onClick={handleUpdate}>Done</Button>
            <Button onClick={handleClosee} autoFocus>
              cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      {/* =============================================================================================================== */}
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <CameraIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap>
            Album layout
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <TextField
                id="standard-basic"
                label="Search Hare "
                variant="standard"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="contained" onClick={handleClickOpen}>
                Create blog
              </Button>
            </Stack>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {blogs?.map((blog) => (
              <Grid item key={blog} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      // 16:9
                      pt: "56.25%",
                    }}
                    image="https://picsum.photos/200/300"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      gutterBottom
                      variant="h5"
                      dangerouslySetInnerHTML={{ __html: blog?.title }}
                    ></Typography>
                    <Typography
                      dangerouslySetInnerHTML={{ __html: blog?.description }}
                    ></Typography>
                  </CardContent>

                  <CardActions>
                    <Button size="small" onClick={() => handleDelete(blog._id)}>
                      DELETE
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleClickOpenn(String(blog._id))}
                    >
                      Edit
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography>
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
};

export default Album;
