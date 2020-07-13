const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const data = [
	{
		name: 'lake site',
		image: 'https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg?auto=compress&cs=tinysrgb&h=350',
		desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
	},
	{
		name: 'Nature',
		image: 'https://images.pexels.com/photos/371589/pexels-photo-371589.jpeg?auto=compress&cs=tinysrgb&h=350',
		desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
	},
	{
		name: 'Ask for tulip',
		image: 'https://images.pexels.com/photos/589697/pexels-photo-589697.jpeg?auto=compress&cs=tinysrgb&h=350',
		desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
	}
]

function seedDB() {
	Campground.remove({},(err) => {
		if(err) {
			console.log(err);
		}
		console.log('removed everything');
		data.forEach(dt => {
		Campground.create(dt, (err,campground) => {
			if(err) {
				console.log(err);
			} else {
				console.log('added');
				Comment.create({
					text: 'blah blah blah',
					author: 'its me'
				}, (err, comment) => {
					if(err) {
						console.log(err);
					} else {
						campground.comments.push(comment);
						campground.save();
						console.log('finally created');
					}
					// Campground.comments = Campground.comments || [];
					
				});
			}
		});
	});
	});
	
	
}

module.exports = seedDB;
