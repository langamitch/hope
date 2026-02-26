import NewsletterSignupButton from "./components/NewsletterSignupButton";

export default function Home() {
  const youtubeVideoId = "Gg_ncsRWboo";

  return (
    <div className="relative min-h-screen">
      {/*navbar */}
      <div className="fixed top-0 z-20 flex w-full mix-blend-difference flex-row justify-between p-2 text-white">
        <div className="flex  cursor-pointer gap-4 p-2">
          <span>Shop</span>
          <span>Archive</span>
          <span>Accessories</span>
        </div>
        <div className="logo flex gap-4 p-2">
          <span>Hope&apos;s iPhone Collection</span>
        </div>
        <div className="flex cursor-pointer gap-4 p-2">
          <input
            type="text"
            placeholder="Search"
            className="w-50 border-b bg-transparent px-1 text-white placeholder:text-white/70 outline-none"
          />
          <span>Wishlist</span>
          <span className="border-2 border-white px-2 text-white">0</span>
        </div>
      </div>

      {/*hero */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <iframe
            className="pointer-events-none absolute top-1/2 left-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
            src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeVideoId}&modestbranding=1&rel=0&playsinline=1`}
            title="Hero background video"
            allow="autoplay; fullscreen; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/35" />
        <div className="absolute top-1/2 right-6 z-10 max-w-xl -translate-y-1/2 text-right text-white sm:right-10">
          <p className="text-xl leading-relaxed sm:text-2xl">
            Affordable brand new and pre-owned devices at a <br />student-friendly prices.
          </p>
          <button
            type="button"
            className="mt-6 inline-flex items-center border border-white bg-white px-6 py-2 text-sm font-medium text-black transition hover:bg-transparent hover:text-white"
          >
            Shop now
          </button>
        </div>
      </section>

      <section className='h-screen'>
        <div></div>
      </section>

      {/*footer */}
      <section className='h-screen w-full bg-[#f3f3f3]'>
        <div className='grid w-full grid-cols-12 gap-8 px-4 py-15'>
          <div className='col-span-12 flex flex-col gap-2 py-4 uppercase text-[13px] md:col-span-3'>
            <span>WhatsApp</span>
            <span>Instagram</span>
            <span>E-Mail</span>
          </div>
          <div className='col-span-12 flex flex-col gap-2 py-4 uppercase text-[13px] md:col-span-3'>
            <span>Shipping</span>
            <span>Payments</span>
            <span>Returns and Refunds</span>
          </div>
          <div className='col-span-12 flex flex-col gap-2 py-4 uppercase text-[13px] md:col-span-3'>
            <span>About</span>
            <span>Privacy</span>
            
          </div>
          <div className='col-span-12 flex flex-col gap-2 py-4 text-[13px] md:col-span-3'>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border-b uppercase bg-transparent px-0 text-black placeholder:text-black/70 outline-none"
            />
            <span className='text-[13px]'>
              Subscribe to receice monthly updates on new devices and exclusive offers.</span>
            <NewsletterSignupButton />
          </div>
        </div>
      </section>

    </div>
  );
}
