import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Trash2, RefreshCw, X, Check, Image as ImageIcon, Sparkles } from 'lucide-react';

interface PhotoUploadCaptureProps {
  photoUrl: string;
  onChange: (url: string) => void;
  label?: string;
  idt: (kh: string, en: string, zh?: string) => string;
  aspectRatio?: 'square' | '4x6';
  entityType?: 'student' | 'teacher' | 'staff';
}

export default function PhotoUploadCapture({
  photoUrl,
  onChange,
  label,
  idt,
  aspectRatio = 'square',
  entityType = 'student'
}: PhotoUploadCaptureProps) {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Helper to compress image to lightweight base64 JPEG
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 600;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.85));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Helper to upload image to server /api/upload
  const uploadToServer = async (fileOrBlob: File | Blob, filename = "photo.jpg"): Promise<string | null> => {
    try {
      const token = localStorage.getItem("plc_token") || "";
      const formData = new FormData();
      formData.append("file", fileOrBlob, fileOrBlob instanceof File ? fileOrBlob.name : filename);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: token ? { "Authorization": `Bearer ${token}` } : {},
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url || data.fileUrl) {
          return data.url || data.fileUrl;
        }
      }
    } catch (err) {
      console.warn("Upload to server failed, using base64 fallback:", err);
    }
    return null;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await compressImage(file);
        onChange(base64);
        const serverUrl = await uploadToServer(file);
        if (serverUrl) {
          onChange(serverUrl);
        }
      } catch (err) {
        console.error("Error compressing/uploading image:", err);
      }
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    setIsCameraOpen(true);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      // Fallback directly to native device camera input if getUserMedia is unsupported
      setIsCameraOpen(false);
      cameraInputRef.current?.click();
      return;
    }

    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      let mediaStream: MediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: facingMode }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
      } catch (firstErr) {
        // Retry with simple constraints if ideal resolution failed
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      setStream(mediaStream);
    } catch (err: any) {
      console.error("Camera access error:", err);
      setCameraError(
        idt(
          "មិនអាចបើកកាមេរ៉ាផ្សាយផ្ទាល់បានទេ។ សូមចុចប៊ូតុងខាងក្រោមដើម្បីថតតាមកាមេរ៉ាទូរស័ព្ទ/កុំព្យូទ័រ។",
          "Unable to access live camera stream. Please click below to use native device camera.",
          "无法访问摄像头。请点击下方使用设备相机。"
        )
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const takeSnapshot = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      const w = video.videoWidth || 640;
      const h = video.videoHeight || 640;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (facingMode === 'user') {
          // Flip horizontally for front camera mirroring
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        onChange(dataUrl);
        stopCamera();

        canvas.toBlob(async (blob) => {
          if (blob) {
            const serverUrl = await uploadToServer(blob, `snapshot_${Date.now()}.jpg`);
            if (serverUrl) {
              onChange(serverUrl);
            }
          }
        }, 'image/jpeg', 0.85);
      }
    }
  };

  const toggleFacingMode = async () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: nextMode } },
        audio: false
      }).catch(() => {
        return navigator.mediaDevices.getUserMedia({
          video: { facingMode: nextMode },
          audio: false
        });
      });
      setStream(mediaStream);
    } catch (err) {
      console.error("Failed to switch camera mode:", err);
    }
  };

  // Ensure video element receives stream whenever modal mounts or stream changes
  useEffect(() => {
    let isCancelled = false;
    if (isCameraOpen && stream && videoRef.current) {
      const videoEl = videoRef.current;
      videoEl.srcObject = stream;
      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          if (!isCancelled) {
            const msg = String(e?.message || e || "");
            if (
              !msg.includes("interrupted") && 
              !msg.includes("removed") && 
              !msg.includes("AbortError") && 
              !msg.includes("play()")
            ) {
              console.warn("Camera video play notice:", e);
            }
          }
        });
      }
    }
    return () => {
      isCancelled = true;
      if (videoRef.current) {
        try {
          videoRef.current.pause();
          videoRef.current.srcObject = null;
        } catch (e) {}
      }
    };
  }, [isCameraOpen, stream]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const defaultTitle = entityType === 'student'
    ? idt("រូបថតសិស្ស (Photo)", "Student Photo", "学生照片")
    : entityType === 'teacher'
    ? idt("រូបថតគ្រូបង្រៀន (Photo)", "Teacher Photo", "教师照片")
    : idt("រូបថតបុគ្គលិក (Photo)", "Staff Photo", "员工照片");

  return (
    <div className="space-y-2">
      <label className="block text-[12px] font-extrabold text-slate-700 font-sans">
        {label || defaultTitle}
      </label>

      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        capture="user"
        className="hidden"
      />

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80 shadow-3xs">
        {/* Photo Display / Thumbnail */}
        <div className="relative group shrink-0">
          <div className={`w-20 h-24 rounded-2xl border-2 border-slate-200 bg-slate-100 overflow-hidden shadow-3xs flex items-center justify-center ${
            aspectRatio === '4x6' ? 'aspect-[3/4]' : 'aspect-square'
          }`}>
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-2 text-center text-slate-400">
                <ImageIcon className="w-7 h-7 mb-1 text-slate-300" />
                <span className="text-[10px] font-bold">4x6 Photo</span>
              </div>
            )}
          </div>

          {photoUrl && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 text-white p-1 rounded-full shadow-md transition-all cursor-pointer"
              title={idt("លុបរូបថត", "Remove photo", "删除照片")}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex-1 w-full space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {/* Upload File Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200/90 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-3xs transition-all active:scale-95 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{idt("Upload រូបភាព", "Upload Photo", "上传照片")}</span>
            </button>

            {/* Direct Camera Button */}
            <button
              type="button"
              onClick={startCamera}
              className="px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
            >
              <Camera className="w-4 h-4 shrink-0" />
              <span>{idt("ថតផ្ទាល់", "Take Photo", "ថតផ្ទាល់")}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-500 font-medium leading-tight">
            {idt(
              "ចុច 'Upload រូបភាព' ដើម្បីជ្រើសរើសរូបពីក្នុងកុំព្យូទ័រ/ទូរស័ព្ទ ឬចុច 'ថតផ្ទាល់' ដើម្បីថតរូបតាមកាមេរ៉ា។",
              "Click 'Upload Photo' to select an image file or 'Take Photo' to capture directly via camera.",
              "点击上传照片或直接拍照。"
            )}
          </p>
        </div>
      </div>

      {/* Live Camera Stream Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-400" />
                <h4 className="font-extrabold text-sm">
                  {idt("ថតរូបភាពផ្ទាល់ (Camera Live)", "Take Live Photo", "Live Camera")}
                </h4>
              </div>
              <button
                type="button"
                onClick={stopCamera}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center text-xs font-bold transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Video Preview */}
            <div className="relative bg-black aspect-square w-full flex items-center justify-center overflow-hidden">
              {cameraError ? (
                <div className="p-6 text-center space-y-4">
                  <p className="text-rose-400 text-xs font-bold leading-relaxed">{cameraError}</p>
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    {idt("បើកកាមេរ៉ាទូរស័ព្ទ (Device Camera)", "Use Device Camera", "Use Device Camera")}
                  </button>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                  />
                  {/* Photo Frame Outline Overlay */}
                  <div className="absolute inset-8 border-2 border-dashed border-white/60 rounded-2xl pointer-events-none flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white/80 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-xs">
                      {idt("តម្រឹមផ្ទៃមុខឱ្យចំកណ្តាល", "Center Face Here", "居中")}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Camera Actions Footer */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={toggleFacingMode}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl transition-all cursor-pointer"
                title={idt("ប្តូរកាមេរ៉ាមុខ/ក្រោយ", "Switch Camera", "切换摄像头")}
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={takeSnapshot}
                disabled={!!cameraError}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all active:scale-95 cursor-pointer"
              >
                <div className="w-3 h-3 rounded-full bg-white animate-ping" />
                <span>{idt("ថតរូបភាព (Capture)", "Capture Photo", "拍照")}</span>
              </button>

              <button
                type="button"
                onClick={stopCamera}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-2xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
