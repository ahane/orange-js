import { useLoaderData } from "@orange-js/orange";

export const loader = async () => {
  return {
    message: "Hello World!!!",
  };
};

export default function Home() {
  const { message } = useLoaderData<typeof loader>();
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-10">
      <h1 className="text-6xl font-bold text-center">{message}</h1>
    </div>
  );
}
