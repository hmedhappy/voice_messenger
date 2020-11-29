
 jQuery(document).ready(function () {
                var $ = jQuery;
                var myRecorder = {
                    objects: {
                        context: null,
                        stream: null,
                        recorder: null
                    },
                    init: function () {
                        if (null === myRecorder.objects.context) {
                            myRecorder.objects.context = new (
                                    window.AudioContext || window.webkitAudioContext
                                    );
                        }
                    },
                    start: function () {
                        var options = {audio: true, video: false};
                        navigator.mediaDevices.getUserMedia(options).then(function (stream) {
                            myRecorder.objects.stream = stream;
                            myRecorder.objects.recorder = new Recorder(
                                    myRecorder.objects.context.createMediaStreamSource(stream),
                                    {numChannels: 1}
                            );
                            myRecorder.objects.recorder.record();
                        }).catch(function (err) {});
                    },
                    stop: function (listObject) {
                        if (null !== myRecorder.objects.stream) {
                            myRecorder.objects.stream.getAudioTracks()[0].stop();
                        }
                        if (null !== myRecorder.objects.recorder) {
                            myRecorder.objects.recorder.stop();

                            // Validate object
                            if (null !== listObject
                                    && 'object' === typeof listObject
                                    && listObject.length > 0) {
                                // Export the WAV file
                                myRecorder.objects.recorder.exportWAV( function (blob) {
                                   
                                    var url = (window.URL || window.webkitURL)
                                            .createObjectURL(blob);
                                          
                                            const formData = new FormData();
                                                    formData.append('audio-file', blob);
                                                    const response =  fetch('http://localhost:5000/upload', {
                                                        method: 'POST',
                                                        body: formData
                                                    }).then(response=>console.log({response}));

                                    // Prepare the playback
                                    var audioObject = $('<audio style="margin-left: auto;" controls></audio>')
                                            .attr('src', url);

                                    var responseAudio = $('<audio style="margin-right: auto;" controls ></audio>')
                                            .attr('src', 'http://localhost:5000/getaudio'); 

                                    // Wrap everything in a row
                                    var holderObject = $('<div style="display:flex" class="row"></div>')
                                            .append(audioObject)
                                            

                                    var holderObject2 = $('<div style="display:flex" class="row"></div>')
                                                .append(responseAudio)
       

                                    // Append to the list
                                    listObject.append(holderObject);
                                    setTimeout(() => {
                                        
                                        listObject.append(holderObject2);
                                    }, 2000);
                                });
                            }
                        }
                    }
                };

                // Prepare the recordings list
                var listObject = $('[data-role="recordings"]');

                // Prepare the record button
                $('[data-role="controls"] > button').click(function () {
                    // Initialize the recorder
                    myRecorder.init();

                    // Get the button state 
                    var buttonState = !!$(this).attr('data-recording');

                    // Toggle
                    if (!buttonState) {
                        $(this).attr('data-recording', 'true');
                        myRecorder.start();
                    } else {
                        $(this).attr('data-recording', '');
                        myRecorder.stop(listObject);
                    }
                });
            });