export default function App() {
  return (
    <div
      className="
        relative
        h-screen
        w-full
        bg-[url('/par3.jpeg')]
        bg-contain
        sm:bg-cover
        bg-no-repeat
        bg-center
      "
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-white text-center">

        <h1 className="
          font-extrabold tracking-wide
          text-5xl
          sm:text-6xl
          md:text-7xl
          lg:text-8xl
          xl:text-9xl
        ">
          Paramount Place
        </h1>

        <ul className="
          mt-8 space-y-3
          text-[25px]
          sm:text-2xl
          md:text-3xl
          lg:text-4xl
          list-disc list-inside
        ">
          <li>Hotel</li>
          <li>Swimming Pool</li>
          <li>Lounge</li>
          <li>Gym</li>
          <li>Restaurant</li>
        </ul>

        <p className="
          mt-10 uppercase tracking-widest
          text-base
          sm:text-lg
          md:text-xl
          opacity-80
        ">
          Coming soon at Elewuro, Akobo, Ibadan.
        </p>
      </div>
    </div>
  );
}
