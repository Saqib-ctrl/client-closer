import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { question: "What tools are included?", answer: "Propel includes 8 AI-powered tools: Proposal Generator, Mockup Generator, Cover Letter Generator, Email Assistant, Invoice Generator, Client CRM, Portfolio Builder, and Analytics Dashboard. All are included in every plan." },
  { question: "How is this different from ChatGPT?", answer: "ChatGPT requires careful prompting. Propel is purpose-built for freelancers — it analyzes job descriptions, integrates your portfolio, and outputs ready-to-send deliverables. No prompt engineering needed." },
  { question: "What do I get for free?", answer: "5 AI proposals, 5 mockups, 3 cover letters, 5 emails, invoices, CRM, 1 portfolio page, and basic analytics — completely free, no credit card required." },
  { question: "Will my proposals sound authentic?", answer: "Yes. Propel adapts to your experience and portfolio. Choose professional, friendly, or creative tone and edit any section before sending." },
  { question: "Who is this for?", answer: "Designers, developers, marketers, writers, video editors — any freelancer who pitches services to clients or applies for jobs." },
  { question: "Can I cancel anytime?", answer: "Absolutely. No contracts, no hidden fees. Cancel with one click. Your content is yours to keep, and we offer a 14-day money-back guarantee." }
];

const FAQ = () => {
  return (
    <section id="faq" className="py-24 md:py-32 border-t border-border/30">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground/50 font-medium mb-4">FAQ</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Questions & answers.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="max-w-2xl"
        >
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border/30 rounded-xl px-5 data-[state=open]:border-border/60 transition-colors bg-card"
              >
                <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
