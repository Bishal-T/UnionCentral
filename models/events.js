const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const eventSchema = new Schema({
    category: {type: String, enum: ['Music Concert', 'Movie Night', 'Sports Game', 'Food Festival', 'Game Night'], required: [true, 'Must select a Category']},
    title: {type: String, required: [true, 'Must Enter a Title']},
    host: {type: Schema.Types.ObjectId, ref: 'User'},
    details: {type: String, required: [true, 'Must Enter Details'], minLength: [10 , 'Detials must be at least 10 characters long']},
    location: {type: String, required: [true, 'Must Enter a Location']},
    eventStart: {type: Date, required: [true, 'Must Enter a Start Date']},
    eventEnd: {type: Date, required: [true, 'Must Enter an End Date']},
    image: {type: String, required: [true, 'Must Enter an Image']},


},
{timestamps: true}
);


module.exports = mongoose.model('events', eventSchema);

