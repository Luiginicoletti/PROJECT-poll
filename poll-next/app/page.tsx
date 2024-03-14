import Form from "./components/Form";

async function fetchData() {
  const req = await fetch("");
}

export default function Home() {
  return (
    <div className="bg-blue-500 flex h-screen  justify-center items-center">
      <div>
        <div className="absolute h-[220px] w-[300px] bg-violet-400/50 rounded-full transform translate-x-[220px]"></div>

        <div className="absolute h-[240px] w-[200px] bg-pink-500/20 rounded-full transform translate-y-[240px]"></div>
        <div className="p-4 bg-white/10 z-10 backdrop-blur-lg relative rounded-2xl shadow-lg backdrop-filter h-[500px] w-[600px]">
          <Form />
        </div>
      </div>
    </div>
  );
}
