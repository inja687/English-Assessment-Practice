import React, { useState } from 'react';
import { 
  Mic, 
  Camera, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  ShieldCheck, 
  VideoOff,
  MicOff
} from 'lucide-react';

export default function MediaPermissionsCheck({ 
  onMediaStateChange,
  micStatus,
  cameraStatus,
  onSkipMic,
  onSkipCamera
}) {
  const [micLoading, setMicLoading] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [micMessage, setMicMessage] = useState('');
  const [cameraMessage, setCameraMessage] = useState('');

  // 1. Microphone Permission Check
  const checkMicrophone = async () => {
    setMicLoading(true);
    setMicMessage('');

    if (!navigator?.mediaDevices?.getUserMedia) {
      setMicLoading(false);
      setMicMessage('Your browser does not support the MediaDevices API. Please update your browser.');
      onMediaStateChange('mic', 'error');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Get device label if available
      const audioTrack = stream.getAudioTracks()[0];
      const label = audioTrack?.label || 'Default Audio Input';

      // Immediately stop track so hardware light turns off
      stream.getTracks().forEach((track) => track.stop());

      setMicLoading(false);
      setMicMessage(`Microphone verified and accessible (${label}).`);
      onMediaStateChange('mic', 'passed');
    } catch (err) {
      setMicLoading(false);
      console.warn('Microphone permission check failed:', err);

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setMicMessage(
          'Microphone permission was denied. To enable: click the lock/settings icon in your browser address bar, set Microphone to "Allow", and retry.'
        );
        onMediaStateChange('mic', 'denied');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setMicMessage(
          'No microphone device detected. Please connect a headset or microphone and try again.'
        );
        onMediaStateChange('mic', 'not_found');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setMicMessage(
          'The microphone is currently in use by another software (e.g. Zoom, Teams, or another tab). Please close conflicting apps and retry.'
        );
        onMediaStateChange('mic', 'error');
      } else {
        setMicMessage(
          `Unable to access microphone: ${err.message || 'Unknown device error'}.`
        );
        onMediaStateChange('mic', 'error');
      }
    }
  };

  // 2. Camera Permission Check (Optional)
  const checkCamera = async () => {
    setCameraLoading(true);
    setCameraMessage('');

    if (!navigator?.mediaDevices?.getUserMedia) {
      setCameraLoading(false);
      setCameraMessage('Your browser does not support the MediaDevices API.');
      onMediaStateChange('camera', 'error');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      const videoTrack = stream.getVideoTracks()[0];
      const label = videoTrack?.label || 'Default Webcam';

      // Stop tracks immediately
      stream.getTracks().forEach((track) => track.stop());

      setCameraLoading(false);
      setCameraMessage(`Camera verified successfully (${label}). Note: No recording or proctoring is enabled.`);
      onMediaStateChange('camera', 'passed');
    } catch (err) {
      setCameraLoading(false);
      console.warn('Camera permission check failed:', err);

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraMessage(
          'Camera permission was denied. You may click "Continue Without Camera" below as webcam is optional.'
        );
        onMediaStateChange('camera', 'denied');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraMessage(
          'No camera hardware detected. Camera is optional for practice mode.'
        );
        onMediaStateChange('camera', 'not_found');
      } else {
        setCameraMessage(
          `Camera check notice: ${err.message || 'Webcam unavailable'}. Camera is optional for practice.`
        );
        onMediaStateChange('camera', 'error');
      }
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
        <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
          <Mic className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">
            2. Requesting Microphone/Webcam Permission
          </h3>
          <p className="text-xs text-slate-500">
            Microphone access is required for spoken practice evaluations. Camera access is strictly optional.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Transparent notice */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Privacy & Device Transparency</span>
          </div>
          <p>
            Your audio and video are <strong>never uploaded to external servers or stored without your control</strong>. Camera permission is an optional simulated check and does not activate proctoring or video recording.
          </p>
        </div>

        {/* Device Rows: Microphone & Camera */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Microphone Card */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Mic className="w-4 h-4 text-blue-600" />
                  <span>Microphone (Required for Voice)</span>
                </span>

                {micStatus === 'passed' && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Passed</span>
                  </span>
                )}
                {micStatus === 'skipped' && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    <MicOff className="w-3.5 h-3.5" />
                    <span>Text-Only Mode</span>
                  </span>
                )}
                {(micStatus === 'denied' || micStatus === 'not_found' || micStatus === 'error') && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Attention</span>
                  </span>
                )}
                {micStatus === 'not_checked' && (
                  <span className="text-xs text-slate-400 font-medium">Not checked</span>
                )}
              </div>

              <p className="text-xs text-slate-500 mb-3">
                Verifies your microphone connection for oral repetition and fluency recordings.
              </p>

              {micMessage && (
                <div className={`p-3 rounded-lg text-xs mb-3 border ${
                  micStatus === 'passed' 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-amber-50 text-amber-900 border-amber-200'
                }`}>
                  {micMessage}
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={checkMicrophone}
                disabled={micLoading}
                id="btn-check-microphone"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm transition disabled:opacity-60"
              >
                {micLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Requesting Microphone Access...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    <span>{micStatus === 'passed' ? 'Re-check Microphone' : 'Check Microphone'}</span>
                  </>
                )}
              </button>

              {/* Option to continue without mic if user cannot plug one in */}
              {(micStatus === 'denied' || micStatus === 'not_found' || micStatus === 'error') && (
                <button
                  type="button"
                  onClick={onSkipMic}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition"
                >
                  <MicOff className="w-3.5 h-3.5 text-slate-500" />
                  <span>Continue Without Microphone (Text-Only Mode)</span>
                </button>
              )}
            </div>
          </div>

          {/* Camera Card */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-indigo-600" />
                  <span>Webcam (Optional)</span>
                </span>

                {cameraStatus === 'passed' && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Passed</span>
                  </span>
                )}
                {cameraStatus === 'skipped' && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                    <VideoOff className="w-3.5 h-3.5 text-slate-400" />
                    <span>Skipped</span>
                  </span>
                )}
                {(cameraStatus === 'denied' || cameraStatus === 'not_found' || cameraStatus === 'error') && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    <span>Unavailable</span>
                  </span>
                )}
                {cameraStatus === 'not_checked' && (
                  <span className="text-xs text-slate-400 font-medium">Optional</span>
                )}
              </div>

              <p className="text-xs text-slate-500 mb-3">
                Simulated webcam verification. Camera permission is entirely optional for practice.
              </p>

              {cameraMessage && (
                <div className="p-3 rounded-lg text-xs mb-3 bg-slate-50 text-slate-700 border border-slate-200">
                  {cameraMessage}
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={checkCamera}
                disabled={cameraLoading}
                id="btn-check-camera"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-sm transition disabled:opacity-60"
              >
                {cameraLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Requesting Camera Access...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-3.5 h-3.5" />
                    <span>{cameraStatus === 'passed' ? 'Re-check Camera' : 'Check Camera'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onSkipCamera}
                id="btn-continue-without-camera"
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition"
              >
                <VideoOff className="w-3.5 h-3.5 text-slate-500" />
                <span>Continue Without Camera</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
