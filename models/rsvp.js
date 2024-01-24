const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const rsvpSchema = new Schema({
    status: {type: String, enum: ['Yes', 'No', 'Maybe'], required: [true, 'Must select a Status']},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    event: {type: Schema.Types.ObjectId, ref: 'events'},
}
);



module.exports = mongoose.model('rsvp', rsvpSchema);