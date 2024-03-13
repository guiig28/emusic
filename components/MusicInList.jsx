import AddIcon from "./icons/AddIcon";
import DeleteIcon from "./icons/DeleteIcon";
import EmptyAlbumIcon from "./icons/EmptyAlbumIcon";

export default function MusicInList({ music }) {
  function handleAddMusic(music) {
    window.electronAPI.SendToElectron("music-to-play", music);
  }

  function handleDeleteMusic(music) {
    window.electronAPI.SendToElectron("music-delete", music);
  }

  return (
    <div className="m-5 p-2 flex flex-row border border-gray-500 w-full gap-2 items-center">
      <EmptyAlbumIcon />
      <div className="flex justify-between w-full items-center">
        <div>
          <h1 className="text-white">Name:</h1>
          <h2 className="text-white">{music}</h2>
        </div>
        <div className="flex flex-row justify-center gap-5 h-full">
          <AddIcon onClick={() => handleAddMusic(music)} />
          <DeleteIcon onClick={() => handleDeleteMusic(music)} />
        </div>
      </div>
    </div>
  );
}
