import { useEffect, useRef, useState } from "react";
import NextIcon from "./icons/NextIcon";
import PauseIcon from "./icons/PauseIcon";
import PlayIcon from "./icons/PlayIcon";
import PreviousIcon from "./icons/PreviousIcon";
import formatTime from "@/functions/formatTime";

export default function ControlMusic() {
  const [musicPlayList, setMusicPlayList] = useState([]);
  const [audio, setAudio] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [musicIndex, setMusicIndex] = useState(0);

  const audioRef = useRef(null);

  useEffect(() => {
    window.electronAPI.ReceiveFromElectron(
      "music-playable",
      async (ev, music) => {
        setMusicPlayList([...musicPlayList, music]);

        if (!audioRef.current.currentSrc) {
          setAudio(`/music/${music}`);
          audioRef.current.load();
          setCurrentTime(audioRef.current.currentTime);
        }
      }
    );
  }, [musicPlayList]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("loadedmetadata", () => {
        setDuration(audioRef.current.duration);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("loadedmetadata", () => {});
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      const musicDuration = audioRef.current.duration;
      const interval = setInterval(() => {
        if (!audioRef.current.paused) {
          const time = audioRef.current.currentTime;
          setCurrentTime(time);

          const progressBar = document.getElementById("progress-bar");
          progressBar.style.width = `${(time / musicDuration) * 100}%`;
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [audioRef.current]);

  function handlePlay() {
    if (audio !== null) {
      audioRef.current.play();

      document.getElementById("play").classList.remove("flex");
      document.getElementById("play").classList.add("hidden");

      document.getElementById("pause").classList.remove("hidden");
      document.getElementById("pause").classList.add("flex");
    }
  }

  function handlePause() {
    if (audio !== null) {
      audioRef.current.pause();

      document.getElementById("pause").classList.remove("flex");
      document.getElementById("pause").classList.add("hidden");

      document.getElementById("play").classList.remove("hidden");
      document.getElementById("play").classList.add("flex");
    }
  }

  function handlePrevious() {
    if (musicIndex > 0) {
      setMusicIndex(musicIndex - 1);
      setAudio(`/music/${musicPlayList[musicIndex - 1]}`);
      audioRef.current.load();
      handlePlay();
      setCurrentTime(audioRef.current.currentTime);
    }
  }

  function handleNext() {
    if (musicIndex < musicPlayList.length - 1) {
      setMusicIndex(musicIndex + 1);
      setAudio(`/music/${musicPlayList[musicIndex + 1]}`);
      audioRef.current.load();
      handlePlay();
      setCurrentTime(audioRef.current.currentTime);
    }
  }

  function handleProgressbarClick(ev) {
    if (audioRef.current) {
      const progressBar = ev.currentTarget;
      const clickPosition = ev.nativeEvent.offsetX;
      const totalWidth = progressBar.clientWidth;
      const percentage = clickPosition / totalWidth;
      const time = audioRef.current.duration * percentage;

      audioRef.current.currentTime = time;
    }
  }

  return (
    <div className="w-96 h-14 px-8 flex-col justify-center items-center gap-4 inline-flex">
      <div className="justify-center items-center gap-8 inline-flex">
        <div className="w-4 h-4 justify-start items-start gap-2.5 flex">
          <div className="w-4 h-4 relative cursor-pointer">
            <PreviousIcon onClick={handlePrevious} />
          </div>
        </div>
        <div
          id="play"
          className="flex w-4 h-4 justify-start items-start gap-2.5"
        >
          <div className="w-4 h-4 relative cursor-pointer">
            <PlayIcon onClick={handlePlay} />
          </div>
        </div>

        <audio ref={audioRef} onEnded={handleNext}>
          <source type="audio/mp3" src={audio} />
        </audio>

        <div
          id="pause"
          className="hidden w-4 h-4 justify-start items-start gap-2.5"
        >
          <div className="w-4 h-4 relative cursor-pointer">
            <PauseIcon onClick={handlePause} />
          </div>
        </div>

        <div className="w-4 h-4 justify-start items-start gap-2.5 flex">
          <div className="w-4 h-4 relative cursor-pointer">
            <NextIcon onClick={handleNext} />
          </div>
        </div>
      </div>

      <div className="self-stretch justify-start items-center gap-8 inline-flex">
        <div className="text-center text-xs text-white font-semibold leading-tight tracking-wide">
          <p>{audioRef.current ? formatTime(duration) : "00:00"}</p>
        </div>

        <div
          className="w-96 h-1 relative bg-neutral-600 rounded-full cursor-pointer"
          onClick={handleProgressbarClick}
        >
          <div
            id="progress-bar"
            className="h-1 w-1 rounded-full bg-white absolute top-1/2 transform -translate-y-1/2"
            style={{
              left: `${
                audioRef.current
                  ? (audioRef.current.currentTime / audioRef.current.duration) *
                    100
                  : 0
              }%`,
            }}
          />
        </div>

        <div className="text-center text-xs text-white font-semibold leading-tight tracking-wide">
          <p>{audioRef.current ? formatTime(currentTime) : "00:00"}</p>
        </div>
      </div>
    </div>
  );
}
