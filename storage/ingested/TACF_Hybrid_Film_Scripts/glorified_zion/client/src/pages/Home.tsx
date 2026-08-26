import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * THE GLORIFIED ZION - Interactive Multimedia Experience
 * Design: Ethereal Ascension
 * Typography: Playfair Display (headings) + Lora (body)
 * Color Palette: Deep charcoal background, golden accents, pearl white text
 * Animation: Scroll-triggered reveals, glowing particles, ethereal transitions
 */

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollHeight = containerRef.current.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY / scrollHeight;
        setScrollProgress(Math.min(scrolled, 1));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground">
      {/* Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 h-1 bg-gradient-to-r from-primary via-primary to-transparent z-50"
        style={{ width: `${scrollProgress * 100}%` }} />

      {/* SECTION 1: COSMIC VOID TO LIGHT */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663633887181/SmDQLnWoGEfJ5uRtcvV6KN/cosmic_void_to_light-WaXGXoxvjCKDyLdCbTLBro.webp"
            alt="Cosmic void transforming to light"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <motion.div
          className="relative z-10 text-center max-w-3xl mx-auto px-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-primary drop-shadow-lg">
            The Glorified Zion
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 leading-relaxed drop-shadow-md">
            A Visionary Epic Based on Isaiah 60
          </p>
          <div className="mt-12 text-lg text-gray-300 italic">
            "Arise, shine; for your light is come, and the glory of Yahweh is risen on you."
          </div>
        </motion.div>

        {/* Animated scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-primary text-sm">Scroll to begin</div>
          <div className="text-2xl text-primary mt-2">↓</div>
        </motion.div>
      </section>

      {/* SECTION 2: DARKNESS COVERS THE EARTH */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-background via-background to-background">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-primary">
              Verse 2
            </h2>
            <p className="text-xl leading-relaxed text-gray-300 mb-6">
              "For, behold, darkness shall cover the earth, and gross darkness the peoples; but Yahweh will arise on you, and his glory shall be seen on you."
            </p>
            <p className="text-lg text-gray-400 italic">
              The world lies in profound shadow. Yet from this darkness, a divine light begins to emerge—not from the heavens alone, but rising upon the chosen city, transforming despair into hope.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: NATIONS COME TO YOUR LIGHT */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663633887181/SmDQLnWoGEfJ5uRtcvV6KN/glorified_city_dawn-Q5dHdQVzdbefizVLJtUBTS.webp"
            alt="Glorified city at dawn"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <motion.div
          className="relative z-10 text-center max-w-2xl mx-auto px-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
            Verses 3-4
          </h2>
          <p className="text-xl text-gray-100 leading-relaxed drop-shadow-md">
            "Nations shall come to your light, and kings to the brightness of your rising. Lift up your eyes all around, and see: they all gather themselves together, they come to you; your sons shall come from far, and your daughters shall be carried in the arms."
          </p>
        </motion.div>
      </section>

      {/* SECTION 4: ABUNDANCE AND WEALTH */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-background to-background">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-primary">
              Verses 5-6
            </h2>
            <p className="text-xl leading-relaxed text-gray-300 mb-6">
              "Then you shall see and be radiant, and your heart shall thrill and be enlarged; because the abundance of the sea shall be turned to you, the wealth of the nations shall come to you. The multitude of camels shall cover you, the dromedaries of Midian and Ephah; all they from Sheba shall come; they shall bring gold and frankincense, and shall proclaim the praises of Yahweh."
            </p>
            <p className="text-lg text-gray-400 italic">
              The city radiates with joy as the wealth of distant lands flows toward it. Caravans laden with precious goods—gold, frankincense, and treasures from every nation—converge upon the glorified Zion.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 5: GATHERING OF NATIONS */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663633887181/SmDQLnWoGEfJ5uRtcvV6KN/gathering_nations-imvHe7kVZGCjFuDZc9Gpm2.webp"
            alt="Gathering of nations and caravans"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>

        <motion.div
          className="relative z-10 text-center max-w-2xl mx-auto px-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
            Verses 7-9
          </h2>
          <p className="text-xl text-gray-100 leading-relaxed drop-shadow-md">
            "All the flocks of Kedar shall be gathered together to you, the rams of Nebaioth shall minister to you... Surely the islands shall wait for me, and the ships of Tarshish first, to bring your sons from far, their silver and their gold with them, for the name of Yahweh your God, and for the Holy One of Israel, because he has glorified you."
          </p>
        </motion.div>
      </section>

      {/* SECTION 6: FOREIGNERS BUILD YOUR WALLS */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-background to-background">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-primary">
              Verses 10-12
            </h2>
            <p className="text-xl leading-relaxed text-gray-300 mb-6">
              "Foreigners shall build up your walls, and their kings shall minister to you: for in my wrath I struck you, but in my favor have I had mercy on you. Your gates also shall be open continually; they shall not be shut day nor night; that men may bring to you the wealth of the nations, and their kings led captive. For that nation and kingdom that will not serve you shall perish; yes, those nations shall be utterly wasted."
            </p>
            <p className="text-lg text-gray-400 italic">
              The walls are rebuilt not by the city's own hands, but by those who once opposed it. The gates stand eternally open, welcoming all who come in peace. Those who refuse the light face desolation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 7: THE SANCTUARY BEAUTIFIED */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663633887181/SmDQLnWoGEfJ5uRtcvV6KN/eternal_light_sanctuary-7DwPLJzxu4CaocRS8mGuKP.webp"
            alt="Eternal light sanctuary"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <motion.div
          className="relative z-10 text-center max-w-2xl mx-auto px-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
            Verses 13-14
          </h2>
          <p className="text-xl text-gray-100 leading-relaxed drop-shadow-md">
            "The glory of Lebanon shall come to you, the fir tree, the pine, and the box tree together, to beautify the place of my sanctuary; and I will make the place of my feet glorious. The sons of those who afflicted you shall come bending to you; and all those who despised you shall bow themselves down at the soles of your feet; and they shall call you The city of Yahweh, The Zion of the Holy One of Israel."
          </p>
        </motion.div>
      </section>

      {/* SECTION 8: ETERNAL EXCELLENCY */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-background to-background">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-primary">
              Verses 15-16
            </h2>
            <p className="text-xl leading-relaxed text-gray-300 mb-6">
              "Whereas you have been forsaken and hated, so that no man passed through you, I will make you an eternal excellency, a joy of many generations. You shall also suck the milk of the nations, and shall nurse from royal breasts; and you shall know that I, Yahweh, am your Savior, and your Redeemer, the Mighty One of Jacob."
            </p>
            <p className="text-lg text-gray-400 italic">
              The city's former desolation transforms into eternal glory. What was once abandoned becomes a beacon of joy for all generations. The city receives sustenance and honor from all peoples.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 9: TRANSFORMATION OF ALL THINGS */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663633887181/SmDQLnWoGEfJ5uRtcvV6KN/transformation_abstract-QUEHTGjUMx9gn3PEBKrTUg.webp"
            alt="Abstract transformation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <motion.div
          className="relative z-10 text-center max-w-2xl mx-auto px-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
            Verses 17-18
          </h2>
          <p className="text-xl text-gray-100 leading-relaxed drop-shadow-md">
            "For brass I will bring gold, and for iron I will bring silver, and for wood brass, and for stones iron. I will also make your officers peace, and righteousness your ruler. Violence shall no more be heard in your land, desolation nor destruction within your borders; but you shall call your walls Salvation, and your gates Praise."
          </p>
        </motion.div>
      </section>

      {/* SECTION 10: EVERLASTING LIGHT */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-background to-background">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-primary">
              Verses 19-20
            </h2>
            <p className="text-xl leading-relaxed text-gray-300 mb-6">
              "The sun shall be no more your light by day; neither for brightness shall the moon give light to you: but Yahweh will be to you an everlasting light, and your God your glory. Your sun shall no more go down, neither shall your moon withdraw itself; for Yahweh will be your everlasting light, and the days of your mourning shall be ended."
            </p>
            <p className="text-lg text-gray-400 italic">
              The city is illuminated not by celestial bodies, but by the divine presence itself. Eternal light banishes all darkness. Sorrow is no more. The cycle of day and night gives way to perpetual radiance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 11: RIGHTEOUS INHERITANCE */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-background to-background">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-primary">
              Verses 21-22
            </h2>
            <p className="text-xl leading-relaxed text-gray-300 mb-6">
              "Your people also shall be all righteous; they shall inherit the land forever, the branch of my planting, the work of my hands, that I may be glorified. The little one shall become a thousand, and the small one a strong nation; I, Yahweh, will hasten it in its time."
            </p>
            <p className="text-lg text-gray-400 italic">
              All inhabitants are righteous, inheriting the land eternally. They are the divine planting, the work of Yahweh's hands. From small beginnings, the city grows into a mighty nation, fulfilling the divine purpose.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FINAL SECTION: REFLECTION */}
      <section className="relative min-h-screen flex items-center justify-center py-24 px-6 bg-gradient-to-b from-background via-background to-background overflow-hidden">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-primary">
            The Glorified Zion
          </h2>
          <p className="text-2xl leading-relaxed text-gray-300 mb-12">
            From darkness to eternal light. From desolation to glory. From rejection to universal honor. This is the vision of Isaiah 60—a city transformed, a people redeemed, and a divine purpose fulfilled.
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-transparent mx-auto mb-12" />
          <p className="text-lg text-gray-400 italic">
            "Arise, shine; for your light is come, and the glory of Yahweh is risen on you."
          </p>
        </motion.div>

        {/* Decorative particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full opacity-50"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
