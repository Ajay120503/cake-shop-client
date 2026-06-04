import { useState } from "react";
import { ChevronDown, Sparkles, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "How do I place an order?",
    a: "Browse our shop, add items to your cart, and proceed to checkout. You can pay using Razorpay, UPI, or Cash on Delivery.",
  },
  {
    q: "What is the delivery time?",
    a: "We offer same-day delivery for orders placed before 6 PM. Standard delivery takes 24-48 hours.",
  },
  {
    q: "Do you offer eggless options?",
    a: "Yes! We have a wide range of eggless cakes, pastries, and desserts. Look for the Eggless badge on product pages.",
  },
  {
    q: "Can I customize a cake?",
    a: "Absolutely! Contact us for custom orders. We can create personalized cakes for any occasion with your preferred flavors, designs, and messages.",
  },
  {
    q: "What is your return policy?",
    a: "Due to the perishable nature of our products, we do not accept returns. However, we will replace any defective or damaged items at no extra cost.",
  },
  {
    q: "How do I track my order?",
    a: "Once your order is shipped, you can track it in real-time from the My Orders section of your account dashboard.",
  },
  {
    q: "Do you deliver outside the city?",
    a: "Currently we deliver within the city limits. For bulk or custom orders outside the city, please contact us directly for arrangements.",
  },
  {
    q: "How can I pay?",
    a: "We accept Razorpay (cards, UPI, netbanking, wallets), Cash on Delivery, and direct UPI transfers.",
  },
  {
    q: "Do you have a loyalty program?",
    a: "Yes! New customers get a welcome bonus of 100 loyalty points. Earn points on every purchase and redeem them on future orders.",
  },
  {
    q: "Can I cancel my order?",
    a: "Yes, you can cancel your order from the My Orders page before it is shipped. Once shipped, cancellations are not possible.",
  },
];

const FAQ = () => {
  const [open, setOpen] = useState(0);
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? faqs.filter(
        (f) =>
          f.q.toLowerCase().includes(search.toLowerCase()) ||
          f.a.toLowerCase().includes(search.toLowerCase())
      )
    : faqs;

  return (
    <div>
      {/* Premium Header */}
      <section className="relative min-h-[35vh] flex items-center bg-gradient-to-br from-primary-50 via-cream-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-primary-900/20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-20 dark:opacity-5">
          <div className="absolute -top-10 left-1/3 w-80 h-80 rounded-full bg-primary-200 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-pink-200 blur-3xl" />
        </div>
        <div className="container-custom text-center relative z-10 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-xs font-semibold mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
            >
              <Sparkles size={12} />
              Help Center
            </motion.span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold gradient-text mb-3">
              FAQ
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Find answers to commonly asked questions
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-custom py-12 max-w-3xl mx-auto">
        {/* Search */}
        <div className="relative mb-8">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search FAQs..."
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all shadow-soft"
          />
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p className="text-lg font-medium">No results found</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          ) : (
            filtered.map((f, i) => {
              const actualIndex = faqs.indexOf(f);
              const isOpen = open === actualIndex;
              return (
                <motion.div
                  key={actualIndex}
                  layout
                  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-soft hover:shadow-elegant transition-all duration-200"
                >
                  <button
                    onClick={() => setOpen(isOpen ? -1 : actualIndex)}
                    className="w-full p-5 flex items-center justify-between text-left gap-4 group"
                  >
                    <span className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors text-sm sm:text-base">
                      {f.q}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                    >
                      <ChevronDown
                        size={16}
                        className="text-gray-500 dark:text-gray-400"
                      />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4">
                          {f.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Still have questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center p-8 bg-gradient-to-br from-primary-50 to-pink-50 dark:from-primary-900/20 dark:to-pink-900/20 rounded-3xl border border-primary-100 dark:border-primary-800"
        >
          <Sparkles size={24} className="mx-auto text-primary-500 mb-3" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Still have questions?
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            We're here to help! Reach out to our support team.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-pink-600 hover:from-primary-700 hover:to-pink-700 text-white rounded-full font-semibold shadow-elegant hover:shadow-glow transition-all duration-200 text-sm"
          >
            Contact Support
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
