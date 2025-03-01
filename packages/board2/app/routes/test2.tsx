import {
  DurableLoaderFunctionArgs,
  IdentifierFunctionArgs,
  RouteDurableObject,
  useDurableObject,
} from "@orange-js/orange";

export class Board extends RouteDurableObject<Env> {
  async loader({ params }: DurableLoaderFunctionArgs) {
    return {
      message: "Hello World!!!",
    };
  }

  static id({ params }: IdentifierFunctionArgs) {
    return "test2";
  }
}

export default function Home() {
  const data = useDurableObject<Board>();

  // Use null check instead of fallback to ensure consistent rendering
  if (data === null) {
    return (
      <main className="w-screen h-screen flex flex-col gap-6 p-8">
        <h1>Loading...</h1>
      </main>
    );
  }

  return (
    <main className="w-screen h-screen flex flex-col gap-6 p-8">
      <h1>{data.message}</h1>
    </main>
  );
}

// <Nav>
//   <BoardControl username={session?.user?.username} />
// </Nav>
// <ClientOnly fallback={<div className="w-full h-full shadow-lg" />}>
//   <TlDrawCanvas readOnly={session === null} editorRef={editorRef} />
// </ClientOnly>
