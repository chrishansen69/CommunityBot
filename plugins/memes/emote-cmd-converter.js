'use strict';

const vars = `
ytrash:http://i2.kym-cdn.com/photos/images/facebook/000/536/019/c54.png
pennsmile:https://i.ytimg.com/vi/Aba7KO-Hh1Y/hqdefault.jpg
garbage:http://i.imgur.com/h6eO2eJ.png
discarded:https://alpacapowered.files.wordpress.com/2015/04/discarded.jpg
penn:http://i.imgur.com/FnFgoLs.jpg
alltrash:http://images.memes.com/meme/796459
onlytrash:http://i.imgur.com/8gqybUs.jpg
trasher:http://i.imgur.com/TTyz5Bb.jpg
pennsmash:http://i3.kym-cdn.com/photos/images/original/000/561/287/02a.png
trashmasters:http://i0.kym-cdn.com/photos/images/newsfeed/000/589/599/d6f.png
resumes:http://i2.kym-cdn.com/photos/images/original/000/589/633/9b7.jpg
trashit:http://i3.kym-cdn.com/photos/images/original/000/569/812/9f3.jpg
trashtime:http://i0.kym-cdn.com/photos/images/newsfeed/000/789/814/4f5.png
undertrash:https://66.media.tumblr.com/f82b3c62236984134b509ed5cdb33354/tumblr_nwc2nzpGRv1s65neno1_1280.jpg
personoftheyear:http://i0.kym-cdn.com/photos/images/newsfeed/000/789/821/66f.png
trashbait:http://i3.kym-cdn.com/photos/images/newsfeed/000/755/984/cb0.jpg
trashbat:http://i3.kym-cdn.com/photos/images/newsfeed/000/589/615/dfb.png
trash:http://i1.kym-cdn.com/photos/images/newsfeed/000/589/605/82d.jpg
intothetrash:http://i3.kym-cdn.com/photos/images/newsfeed/000/569/804/0c3.jpg
penngif:http://i1.kym-cdn.com/photos/images/newsfeed/000/562/291/6c9.gif
globetrash:http://i1.kym-cdn.com/photos/images/newsfeed/000/539/097/1d1.jpg

`;

vars.split('\n').forEach(function(v) {
  if (v === '') return;

	const trig = v.substr(0, v.indexOf(':'));
	const link = v.substr(v.indexOf(':') + 1);
	console.log(`    ${trig}: {
	      fn: function(message) {
	        message.channel.sendFile(
	          '${link}'
	        );
	      },
	      description: 'it\'s a meme'
	    },`);
});

