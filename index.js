var util = require('util');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var jQuery = require('jquery')(require("jsdom").jsdom().parentWindow);

var app = express();

// config:
app.set('port', (process.env.PORT || 6000));

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true  })); 

// routes
app.post('/hook/*', function (req, res) {
    var h = req.body;
    var slackHook = req.params['0'];
    //console.log('heroku hook body: ', h);
    //console.log('target slack webhook url: ', slackHook);

  
    request('http://explosm.net/rcg', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var myimg = jQuery(body).find('img#rcg-comic')[0].src;
        var myimgsrc = myimg.replace('file:////','http://');
        console.log('hey ', myimgsrc); // Show the HTML for the Modulus homepage.
    } else {
        return
    }
    


    var slack = {
        text: util.format('Here\'s a bit of Cyanide & Happiness thanks to %s  \n<%s>',
                          h.user_name, myimgsrc),
        username: 'happiness',
        icon_emoji: ':kissing_cat:'
    };

    //console.log(util.format('sending to slack webhook: \n%j\n', slack));

    request.post({
        url: slackHook,
        form: {
            payload: JSON.stringify(slack)
        }},
        function(err, httpResponse, body) {
            //console.log('slack response:');
            if (err) {
                //console.error(err);
                res.status(400).send('oops');
                return;
            }

            //console.log(body);
            res.send('thanks!');
        }
    );
    });

});

// serve:
var server = app.listen(app.get('port'), function () {
    var host = server.address().address;
    //var host = 'localhost';
    var port = server.address().port;

    //console.log('listening at http://%s:%s', host, port);
});

