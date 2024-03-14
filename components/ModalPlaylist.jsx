import { useEffect, useState } from "react";

export default function ModalPlaylist() {
  const [musicPlayList, setMusicPlayList] = useState([]);

  useEffect(() => {
    window.electronAPI.ReceiveFromElectron("music-playable", (ev, music) => {
      setMusicPlayList([...musicPlayList, music]);
    });
  }, [musicPlayList]);

  return (
    <div
      id="modal-play-list"
      className="absolute hidden flex-col right-0 bottom-20 bg-[#212124] w-80 h-auto border-solid mr-2"
    >
      <h1 className="text-center text-white">PlayList</h1>
      <div className="m-4 bg-[#171719] ">
        {musicPlayList.length === 0 ? (
          <p className="text-zinc-400">Empty</p>
        ) : (
          musicPlayList.map((music, index) => {
            return (
              <div key={index}>
                <p className="text-white">{music}</p>
                <br />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
