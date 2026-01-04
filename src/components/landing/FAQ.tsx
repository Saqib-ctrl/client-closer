import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How is this different from templates?",
    answer: "Templates are generic and clients can spot them instantly. Propel analyzes each job description and creates unique, tailored proposals that speak directly to the client's needs, incorporating your specific portfolio and experience."
  },
  {
    question: "Will my proposals sound authentic?",
    answer: "Absolutely. Propel learns your writing style and voice from your portfolio. Every proposal sounds like you wrote it — because the AI is trained on your work, not generic corporate speak."
  },
  {
    question: "Can I customize the output?",
    answer: "Yes! You have full control. Edit any section, adjust the tone, add personal touches, or regenerate specific parts. Think of Propel as your first draft that's already 90% there."
  },
  {
    question: "What types of projects does this work for?",
    answer: "Propel works for any freelance project — design, development, marketing, video editing, writing, and more. If you're pitching services to clients, Propel can help you craft the perfect proposal."
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! Start with a 7-day free trial. No credit card required. Generate unlimited proposals and see the difference in your response rates before committing."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Of course. No long-term contracts, no hidden fees. Cancel with one click whenever you want. Your generated proposals are yours to keep forever."
  }
];

const FAQ = () => {
  return (
    <section id="faq" className="section-padding">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Questions? We've got answers.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about Propel.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="bg-card border border-border/50 rounded-xl px-6 data-[state=open]:shadow-lg transition-shadow"
                >
                  <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
