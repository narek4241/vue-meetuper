const mongoose = require('mongoose');
const Meetup = require('./models/meetups');
const User = require('./models/users');
const Post = require('./models/posts');
const Thread = require('./models/threads');
const Category = require('./models/categories');

const data = require('./data.js');
const { MONGO_URI } = require('./config');

class DB {
  constructor() {
    this.meetups = data.meetups;
    this.users = data.users;
    this.threads = data.threads;
    this.posts = data.posts;
    this.categories = data.categories;
    this.models = [Meetup, User, Post, Thread, Category];
  }

  async cleanDb() {
    for (let model of this.models) {
      await model.deleteMany({}, () => {});
      console.log(`Data for model ${model.collection.collectionName} Deleted!`);
    }
  }

  async pushDataToDb() {
    await Category.insertMany(this.categories);
    console.log('Category Populated!');

    await User.insertMany(this.users);
    console.log('User Populated!');

    await Meetup.insertMany(this.meetups);
    console.log('Meetup Populated!');

    await Thread.insertMany(this.threads);
    console.log('Thread Populated!');

    await Post.insertMany(this.posts);
    console.log('Post Populated!');

    console.log('Database Populated!');
  }

  async seedDb() {
    const category = await Category.findById('5fbae897fd33096483eaf97e');
    if (category) {
      console.log('Nulkkkk');
      return;
    }

    await this.cleanDb();
    await this.pushDataToDb();
  }
}

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true })
  .then(async () => {
    const db = new DB();
    await db.seedDb();
    console.log('You can close connection now!');
    process.exit(0);
  })
  .catch((err) => console.log(err));
