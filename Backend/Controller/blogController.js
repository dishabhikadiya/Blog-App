const mongoose = require("mongoose");
const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const bcrypt = require("bcrypt");
const Blog = require("../model/blogModel");
const path = require("path");
// const imagepath = path.join("uplodes");
// const fs = require("fs");
const Api = require("../apiFeatures/features");
//CRETE BLOG
exports.blog = catchAsyncErrors(async (req, res) => {
  try {
    // let imagePath = `${imagepath}/${req.file.filename}`;
    const newBlog = new Blog({
      title: req.body.title,
      // images: imagePath,
      description: req.body.description,
    });
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
});

//UPDATE BLOG
exports.updateblog = catchAsyncErrors(async (req, res) => {
  try {
    const blogId = req.params.id;
    const existingBlog = await Blog.findById(blogId);

    if (!existingBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    existingBlog.title = req.body.title || existingBlog.title;
    existingBlog.description = req.body.description || existingBlog.description;

    const updatedBlog = await existingBlog.save();

    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
});

//GET ALL BLOG
exports.getblog = catchAsyncErrors(async (req, res) => {
  try {
    const apiFeature = new Api(Blog.find(req.query)).search();
    let task = await apiFeature.query;

    let filterTaskCount = task.length;

    apiFeature.pagination();
    let taskCount = task.length;

    task = await apiFeature.query.clone();
    // console.log("apiFeature", apiFeature);
    return res.json({
      success: true,
      task: task,
      taskCount: taskCount,
      resultPerPage: Number(req.query.resultPerPage),
      filterTaskCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//FIND ONE
exports.getone = catchAsyncErrors(async (req, res) => {
  try {
    const id = req.params.id;
    const singleblog = await Blog.findOne({ _id: id });
    if (!singleblog) {
      return res.status(404).json({ Message: "No data Found" });
    }
    return res.status(201).send(singleblog);
  } catch (err) {
    console.log("Error", err);
  }
});

// DELETE BLOG

exports.deleteData = catchAsyncErrors(async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await Blog.findByIdAndRemove(id);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.json({ message: "Blog removed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
