//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; 						//stream from getUserMedia()
var rec; 							//Recorder.js object
var input; 							//MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb.
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //audio context to help us record

var recordButton = $('#recordButton')
var stopButton = $('#stopButton')
var pauseButton = $('#pauseButton')
var saveButton = $('#saveRecord')

//add events to those 2 buttons
$(recordButton).on("click", startRecording);
$(stopButton).on("click", stopRecording);
$(pauseButton).on("click", pauseRecording);
$(saveButton).on("click", markMastered);


function startRecording() {
	console.log("recordButton clicked");
	var warning = $("<div class='alert alert-warning alert-dismissible fade show text-center'>");
	var msg = "Recording";
	$(warning).append(msg);
	$('#recordingsList').empty().append(warning);
	/*
	Simple constraints object, for more advanced audio features see
	https://addpipe.com/blog/audio-constraints-getusermedia/
	*/

	var constraints = { audio: true, video:false }

	/*
	Disable the record button until we get a success or fail from getUserMedia()
	*/

	$(recordButton).tooltip('hide');
	$(recordButton).prop('disabled', true)
	$(stopButton).prop('disabled', false)
	$(pauseButton).prop('disabled', false)
	$(saveButton).prop('disabled', true)

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

		// console.log("btn-deleteted");

	}).catch(function(err) {
		//enable the record button if getUserMedia() fails
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
	$(recordButton).prop('disabled', false)
	$(stopButton).prop('disabled', true)
	$(pauseButton).prop('disabled', true)

	$(stopButton).tooltip('hide');

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

	$(saveButton).prop('disabled', false);

	// recordingsList.appendChild(div);
}

function markMastered(){
	$(saveButton).tooltip('hide');
	var new_recording = {
		Id: video.Id,
		Name: video.Name
	}
	save_mastered(new_recording)
	$(saveButton).off('click')
	// $(saveButton).prop('disabled', true);
	var progIcon = $('<ion-icon name="pulse">');
	$(saveButton).empty().append(progIcon)
	$(saveButton).removeClass('btn-success').addClass('btn-info')
	$(saveButton).attr('data-original-title', 'Check Progress (t)');
	$(saveButton).on("click", toProgress);
}

function toProgress(){
	window.location= "/progress"
}

var save_mastered = function(new_mastered){
	var data_to_save = new_mastered
	$.ajax({
		type: "POST",
		url: "mark_mastered",
		dataType : "json",
		contentType: "application/json; charset=utf-8",
		data : JSON.stringify(data_to_save),
		success: function(result){
			mastered = result["mastered"]
		},
		error: function(request, status, error){
			console.log("Error");
			console.log(request)
			console.log(status)
			console.log(error)
		}
	});
}
