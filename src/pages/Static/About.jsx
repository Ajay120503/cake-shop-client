import { Cake, Heart, Award, Users } from "lucide-react";
import { motion } from "framer-motion";

const About = () => (
  <div>
    <section className="bg-gradient-to-br from-primary-50 to-cream-100 py-20">
      <div className="container-custom text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-display font-bold gradient-text mb-4"
        >
          Our Story
        </motion.h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Baking happiness since 2010. From a small kitchen to your
          celebrations.
        </p>
      </div>
    </section>
    <section className="container-custom py-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-display font-bold mb-4">
            Crafted with Passion
          </h2>
          <p className="text-gray-600 mb-4">
            At Cake Shop, every cake tells a story. Our master bakers combine
            traditional techniques with modern flavors to create unforgettable
            experiences.
          </p>
          <p className="text-gray-600">
            From birthdays to weddings, from intimate gatherings to grand
            celebrations, we are honored to be part of your special moments.
          </p>
        </div>
        <div className="aspect-square bg-gradient-to-br from-primary-100 to-cream-100 rounded-3xl flex items-center justify-center text-9xl">
          🎂
        </div>
      </div>
    </section>
    <section className="container-custom py-16">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-display font-bold mb-3">Our Values</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: Cake,
            title: "Quality",
            desc: "Finest ingredients, always fresh",
          },
          { icon: Heart, title: "Love", desc: "Handcrafted with care" },
          { icon: Award, title: "Excellence", desc: "Award-winning recipes" },
          { icon: Users, title: "Community", desc: "Serving since 2010" },
        ].map((v, i) => (
          <div key={i} className="card p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
              <v.icon size={28} />
            </div>
            <h3 className="font-semibold mb-2">{v.title}</h3>
            <p className="text-sm text-gray-600">{v.desc}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default About;
