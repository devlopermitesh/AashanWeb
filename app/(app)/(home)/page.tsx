import { GridstyleWrapper } from "@/components/Share/GridstyleWrapper";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
  <div className="flex-1 flex items-center justify-center">


  <GridstyleWrapper>
 <div className="flex flex-col items-center justify-center  max-w-4xl px-10 gap-10">
  <h2 className="text-6xl  font-spacegro text-center leading-tight">
    Bring your{"  "}
    <span className="text-blue-500">business online</span>
    {"\n"}in just a{" "}
    <span className="text-blue-500 bg-blue-200/50 border-2 rounded-lg border-blue-500">

    few clicks</span>
  </h2>

  <Button variant={"default"} className="text-white capitalize text-2xl font-space-grotesk font-bold p-5 px-9">
Start Selling Online
  </Button>
</div>
  </GridstyleWrapper>
</div>
  );
}
