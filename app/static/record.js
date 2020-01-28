//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; 						//stream from getUserMedia()
var rec; 							//Recorder.js object
var input; 							//MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb.
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //audio context to help us record

// var recordButton = document.getElementById("recordButton");
// var stopButton = document.getElementById("stopButton");
// var pauseButton = document.getElementById("pauseButton");
var recordButton = $('#recordButton')
var stopButton = $('#stopButton')
var pauseButton = $('#pauseButton')

//add events to those 2 buttons
// recordButton.addEventListener("click", startRecording);
$(recordButton).on("click", startRecording);
$(stopButton).on("click", stopRecording);
$(pauseButton).on("click", pauseRecording);


function startRecording() {
	console.log("recordButton clicked");

	/*
	Simple constraints object, for more advanced audio features see
	https://addpipe.com/blog/audio-constraints-getusermedia/
	*/

	var constraints = { audio: true, video:false }

	/*
	Disable the record button until we get a success or fail from getUserMedia()
	*/

	$(recordButton).prop('disabled', true)
	$(stopButton).prop('disabled', false)
	$(pauseButton).prop('disabled', false)
	// recordButton.disabled = true;
	// stopButton.disabled = false;
	// pauseButton.disabled = false

	/*
	We're using the standard promise based getUserMedia()
	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	*/

	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

		/*
		create an audio context after getUserMedia is called
		sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
		the sampleRate defaults to the one set in your OS for your playback device

		*/
		audioContext = new AudioContext();

		//update the format
		// document.getElementById("formats").innerHTML="Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz"

		/*  assign to gumStream for later use  */
		gumStream = stream;

		/* use the stream */
		input = audioContext.createMediaStreamSource(stream);

		/*
		Create the Recorder object and configure to record mono sound (1 channel)
		Recording 2 channels  will double the file size
		*/
		rec = new Recorder(input,{numChannels:1})

		//start the recording process
		rec.record()

		console.log("Recording started");

	}).catch(function(err) {
		//enable the record button if getUserMedia() fails
		// $(stopButton).remove()
		// $(pauseButton).remove()
		// var recordB = $("<button type='button' class='btn btn-primary movebot m-2 btn-xlarge' id='recordButton'>")
		// var recordI = $('<ion-icon name="microphone">')
		// $(recordB).append(recordI)
		// $("#right-col").append(recordB)
		// recordButton.disabled = false;
		// stopButton.disabled = true;
		// pauseButton.disabled = true
		$(recordButton).prop('disabled', false)
		$(stopButton).prop('disabled', true)
		$(pauseButton).prop('disabled', true)
	});
}

function pauseRecording(){
	console.log("pauseButton clicked rec.recording=",rec.recording );
	if (rec.recording){
		//pause
		rec.stop();
		// pauseButton.innerHTML="Resume";
		var resumeIcon = $('<ion-icon name="play">')
		$(pauseButton).children().replaceWith(resumeIcon)
	}else{
		//resume
		rec.record()
		// pauseButton.innerHTML="Pause";
		var pauseIcon = $('<ion-icon name="pause">')
		$(pauseButton).children().replaceWith(pauseIcon)
	}
}

function stopRecording() {
	console.log("stopButton clicked");

	//disable the stop button, enable the record too allow for new recordings
	// stopButton.disabled = true;
	// recordButton.disabled = false;
	// pauseButton.disabled = true;
	$(recordButton).prop('disabled', false)
	$(stopButton).prop('disabled', true)
	$(pauseButton).prop('disabled', true)
	// $(stopButton).remove()
	// $(pauseButton).remove()
	// var recordB = $("<button type='button' class='btn btn-primary movebot m-2 btn-xlarge' id='recordButton'>")
	// var recordI = $('<ion-icon name="microphone">')
	// $(recordB).append(recordI)
	// $("#right-col").append(recordB)

	//reset button just in case the recording is stopped while paused
	// pauseButton.innerHTML="Pause";

	//tell the recorder to stop the recording
	rec.stop();

	//stop microphone access
	gumStream.getAudioTracks()[0].stop();

	//create the wav blob and pass it on to createDownloadLink
	rec.exportWAV(createDownloadLink);
}

function createDownloadLink(blob) {

	var url = URL.createObjectURL(blob);
	var au = document.createElement('audio');
	var div = document.createElement('div');
	var link = document.createElement('div');

	//name of .wav file to use during upload and download (without extendion)
	var filename = new Date().toISOString();

	//add controls to the <audio> element
	au.controls = true;
	au.src = url;


	//add the new audio element to li
	div.appendChild(au);

	//add the filename to the li
	link.append(document.createTextNode(filename+".wav "))

	//add the save to disk link to li
	// div.appendChild(link);

	//add the li element to the ol
	$('#recordingsList').empty().append(div);
	// recordingsList.appendChild(div);
}
