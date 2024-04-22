import Home from "../../page";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <Home function={params.id}/>
    // <main className="flex flex-col items-center justify-between p-24">
    //   <div className="flex flex-col items-center justify-center h-full pt-32">
    //     <h1 className="text-4xl text-white mb-6">{params.id}</h1>
    //   </div>
    // </main>
  );
}