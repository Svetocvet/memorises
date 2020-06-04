const mongoose = require('mongoose');

let postSchema = new mongoose.Schema({
    title: String,
    description: String,
    addedAt: Date,
    poster: String,
    isPublic: Boolean,
    user_id: mongoose.Schema.Types.ObjectId
}, {
    versionKey: false
});

postSchema.statics.insert = function (obj, user_id, poster, description) {
    let date = new Date();
    obj.addedAt = date.toISOString().slice(0, 19) + 'Z';
    obj.user_id = user_id;
    obj.poster = poster;
    obj.description = description;
    let Post = this.model('Posts');
    let post = new Post(obj);
    return post.save();
};

postSchema.statics.update = function (id,  title, description) {
    let obj = {};
    obj.title = title;
    obj.description = description;
    return Post.findByIdAndUpdate(id, obj);
}

const Post = mongoose.model('Posts', postSchema);

module.exports = Post;
