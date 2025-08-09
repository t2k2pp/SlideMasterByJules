/**
 * Extracts frames from a video file at a given interval.
 * @param videoFile The video file to process.
 * @param interval The interval in seconds between frame extractions.
 * @returns A promise that resolves to an array of base64 encoded image strings (jpeg).
 */
export const extractFramesFromVideo = (
  videoFile: File,
  interval: number
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      return reject(new Error('Failed to get 2D context from canvas.'));
    }

    const videoUrl = URL.createObjectURL(videoFile);
    video.src = videoUrl;
    video.muted = true;

    const frames: string[] = [];

    const onSeeked = () => {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      frames.push(canvas.toDataURL('image/jpeg', 0.8)); // Use JPEG for smaller size

      const nextTime = video.currentTime + interval;
      if (nextTime <= video.duration) {
        video.currentTime = nextTime;
      } else {
        cleanup();
        resolve(frames);
      }
    };

    const cleanup = () => {
      video.removeEventListener('loadeddata', onLoadedData);
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('error', onError);
      URL.revokeObjectURL(videoUrl);
    };

    const onLoadedData = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      video.currentTime = 0.1; // Start seeking slightly after the beginning
    };

    const onError = (e: Event) => {
      cleanup();
      reject(new Error('Failed to load video file. It may be corrupt or in an unsupported format.'));
    };

    video.addEventListener('loadeddata', onLoadedData);
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('error', onError);

    // Start loading the video
    video.load();
  });
};
