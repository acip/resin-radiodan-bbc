waitForRabbitServer(spawnRadiodan);

//max wait time for RabbitServer: retries * sleeping ms (default: 20*500 = 10s)
function waitForRabbitServer(callback, retries, sleeping) {
	//defaults to 5 retries
	retries = typeof retries === typeof void 0 ? 20: retries;
	//defaults to 500ms sleeping between retries
	sleeping = typeof sleeping === typeof void 0 ? 500: sleeping; 
	 
	if (retries == 0) {
		console.error('timeout waiting for RabbitMQ server');
	} else {                                                         
		require('amqplib')
		   .connect('amqp://localhost')
		   .then(function(conn) {
			   		//success
			   		console.log('Rabbit MQ connect succeeded');
			   		
			   		//close connection
			   		conn.close();
			   		
			   		//start radiodan
			   		callback();
			   		
			   		return false;
				}, function(err) {
					console.error('Rabbit MQ connect failed: %s', err);
					console.error('retrying...');
                    setTimeout( function() {
                            		waitForRabbitServer(callback, --retries, sleeping);
                    }, sleeping);
				}
			);
	}
}     


function spawnRadiodan() {
	console.log('spawning Radiodan');
	//radiodan server configuration file
	var params = [__dirname + '/server.config.json'];	
	
	console.log('starting radiodan server');
	var child = require('child_process').execFile('node_modules/radiodan/bin/server', params)
	
	//output radiodan output
	child.stdout.on('data', function(data) {
	    console.log(data.toString()); 
	});
	
	//start radiodan web client example
	//HACK: we assume that the server has started by now (30s). Should parse the output of the server and start when server is ready.
	setTimeout(startRadiodanWebClient, 30000);
	
	function startRadiodanWebClient() {
		console.log('starting web client');	
		require('radiodan-web-example/main.js');		
	}	
}
