import ImportFiles from "./ImportFile";
import MusicList from "./MusicList";

export default function MainScreen() {
  return (
    <section className="flex flex-row grow bg-[#171719]">
      <div className="w-1/6 bg-[#212124] p-10">
        <ImportFiles />
      </div>
      <main
        className="flex flex-row mt-10 w-full justify-center h-auto"
        style={{ overflowY: "auto", height: "calc(100vh - 10rem)" }}
      >
        <MusicList />
      </main>
    </section>
  );
}
