import { useState } from "react";
import { ChevronDown } from "lucide-react";

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
    a: "Yes! We have a wide range of eggless cakes, pastries, and desserts. Look for the Eggless badge.",
  },
  {
    q: "Can I customize a cake?",
    a: "Absolutely! Contact us for custom orders. We can create personalized cakes for any occasion.",
  },
  {
    q: "What is your return policy?",
    a: "Due to the perishable nature of our products, we do not accept returns. However, we will replace any defective items.",
  },
  {
    q: "How do I track my order?",
    a: "Once your order is shipped, you can track it in real-time from the My Orders section of your account.",
  },
  {
    q: "Do you deliver outside the city?",
    a: "Currently we deliver within the city. For bulk orders outside, please contact us directly.",
  },
  {
    q: "How can I pay?",
    a: "We accept Razorpay (cards, UPI, netbanking, wallets), Cash on Delivery, and direct UPI.",
  },
  {
    q: "Do you have a loyalty program?",
    a: "Yes! New customers get a welcome bonus of 100 loyalty points. Earn points on every purchase.",
  },
  {
    q: "Can I cancel my order?",
    a: "Yes, you can cancel your order from the My Orders page before it is shipped.",
  },
];

const FAQ = () => {
  const [open, setOpen] = useState(0);
  return (
    <div className="container-custom py-12 max-w-3xl">
      <h1 className="text-4xl font-display font-bold text-center mb-3">
        Frequently Asked Questions
      </h1>
      <p className="text-gray-600 text-center mb-10">
        Find answers to common questions
      </p>
      <div className="space-y-3">
        {faqs.map((f, i) => (
          <div key={i} className="card overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="w-full p-4 flex items-center justify-between text-left"
            >
              <span className="font-medium">{f.q}</span>
              <ChevronDown
                size={20}
                className={
                  "transition-transform " + (open === i ? "rotate-180" : "")
                }
              />
            </button>
            {open === i && (
              <div className="px-4 pb-4 text-sm text-gray-600">{f.a}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
