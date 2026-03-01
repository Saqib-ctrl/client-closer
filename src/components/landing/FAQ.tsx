import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What tools are included?",
    answer: "Propel includes three AI-powered tools: a Proposal Generator that creates client-specific pitches, a Mockup Generator that produces professional portfolio visuals, and a Cover Letter Generator that writes tailored job applications. All three are included in every plan."
  },
  {
    question: "How is this different from ChatGPT or templates?",
    answer: "Templates are generic and ChatGPT requires careful prompting. Propel is purpose-built for freelancers — it analyzes job descriptions, integrates your portfolio, and outputs ready-to-send deliverables in the right format. No prompt engineering needed."
  },
  {
    question: "What do I get for free?",
    answer: "Every new account gets 5 AI proposals, 5 portfolio mockups, and 3 cover letters — completely free, no credit card required. Upgrade to Pro ($19/mo) for unlimited access to all tools plus priority AI models and export features."
  },
  {
    question: "Will my proposals and cover letters sound authentic?",
    answer: "Yes. Propel adapts to your experience and portfolio to produce output that sounds like you wrote it. You can also choose tone (professional, friendly, creative) and edit any section before sending."
  },
  {
    question: "What types of freelancers is this for?",
    answer: "Propel works for designers, developers, marketers, writers, video editors, and any freelancer who pitches services to clients. If you apply for projects or jobs, Propel helps you stand out."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Absolutely. No contracts, no hidden fees. Cancel with one click anytime. Your generated content is yours to keep forever, and we offer a 14-day money-back guarantee."
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
            Everything you need to know about Propel's AI toolkit.
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
