import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="h-screen grid place-items-center text-center">
      <main>
        <h1 className="text-3xl font-semibold text-deepblue-800 test2">
          Tailwind demo + designsystem-config
        </h1>
        <a
          href="https://aksel.nav.no/designsystem/side/tailwind"
          className="underline text-blue-500 mt-4 inline-block hover:no-underline focus:shadow-focus focus:bg-blue-800 focus:text-white focus:outline-none"
        >
          Dokumentasjon om Designsystem-config
        </a>
      </main>
    </div>
  );
};

export default Home;
