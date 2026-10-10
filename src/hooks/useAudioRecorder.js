import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Custom hook for real browser-based microphone recording using getUserMedia and MediaRecorder.
 * Handles permissions, stream acquisition and track cleanup, blob creation,
 * object URL revocation, and recording timer.
 */
export function useAudioRecorder() {
  // Status: 'idle' | 'recording' | 'completed' | 'denied' | 'unavailable' | 'error'
  const [status, setStatus] = useState('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const audioUrlRef = useRef(null);

  // Keep audioUrlRef in sync for cleanup
  useEffect(() => {
    audioUrlRef.current = audioUrl;
  }, [audioUrl]);

  // Clean up all tracks and timer
  const cleanupMediaTracks = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // Ignore
        }
      });
      streamRef.current = null;
    }
  }, []);

  // Format time in MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Start recording
  const startRecording = useCallback(async () => {
    setErrorMessage(null);

    // Check browser support
    if (!navigator?.mediaDevices?.getUserMedia || typeof window.MediaRecorder === 'undefined') {
      setStatus('unavailable');
      setErrorMessage('Your browser does not support audio recording (getUserMedia or MediaRecorder API missing).');
      return;
    }

    // Revoke previous audio URL if exists
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
      setAudioUrl(null);
    }
    setAudioBlob(null);
    setRecordingTime(0);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Determine supported mimeType
      let mimeType = '';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        mimeType = 'audio/webm';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      }

      const options = mimeType ? { mimeType } : {};
      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        cleanupMediaTracks();

        if (audioChunksRef.current.length > 0) {
          const type = recorder.mimeType || 'audio/webm';
          const blob = new Blob(audioChunksRef.current, { type });
          const url = URL.createObjectURL(blob);
          audioUrlRef.current = url;
          setAudioBlob(blob);
          setAudioUrl(url);
          setStatus('completed');
        } else {
          setStatus('idle');
          setErrorMessage('No audio data captured. Please try recording again.');
        }
      };

      recorder.onerror = (e) => {
        console.error('MediaRecorder error:', e);
        cleanupMediaTracks();
        setStatus('error');
        setErrorMessage('A recording error occurred while capturing audio.');
      };

      recorder.start(100);
      setStatus('recording');

      // Start timer
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone recording error:', err);
      cleanupMediaTracks();

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setStatus('denied');
        setErrorMessage('Microphone access was denied. Please allow microphone permissions in your browser settings to record your voice.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setStatus('unavailable');
        setErrorMessage('No microphone device found. Please connect a headset or microphone and retry.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setStatus('error');
        setErrorMessage('The microphone is in use by another application. Please close conflicting software and retry.');
      } else {
        setStatus('error');
        setErrorMessage(`Unable to access microphone: ${err.message || 'Unknown device error'}`);
      }
    }
  }, [cleanupMediaTracks]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.error('Error stopping recorder:', err);
      }
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  // Reset / Record again
  const resetRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // Ignore
      }
    }
    cleanupMediaTracks();

    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }

    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setErrorMessage(null);
    setStatus('idle');
    audioChunksRef.current = [];
  }, [cleanupMediaTracks]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupMediaTracks();
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, [cleanupMediaTracks]);

  return {
    status,
    recordingTime,
    formattedTime: formatTime(recordingTime),
    audioBlob,
    audioUrl,
    errorMessage,
    startRecording,
    stopRecording,
    resetRecording,
  };
}
