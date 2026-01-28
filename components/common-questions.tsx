"use client"
import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "How do I book a photography session?",
    answer:
      "You can book a session by visiting our Booking page, selecting your preferred service, date, and time. We'll confirm your appointment within 24 hours.",
  },
  {
    question: "What should I wear for my portrait session?",
    answer:
      "We recommend solid colors and comfortable clothing that reflects your personality. Avoid busy patterns and logos. We're happy to provide guidance during your consultation.",
  },
  {
    question: "How long until I receive my photos?",
    answer:
      "Portrait and event photos are typically delivered within 2-3 weeks. Wedding photography takes 4-6 weeks due to the extensive editing process. Rush delivery is available upon request.",
  },
  {
    question: "Do you travel for destination shoots?",
    answer:
      "Yes! We love destination shoots. Travel fees apply based on location. Contact us for a custom quote for your destination photography needs.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "Sessions can be rescheduled up to 48 hours before your appointment. Cancellations within 48 hours may incur a fee. We're flexible and understanding of emergencies.",
  },
]

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const smoothTransition = { duration: 0.6, ease: "easeOut" as const }

export default function CommonQuestions() {
  return (
    <motion.section
      className="py-20 px-6 bg-background"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer}
    >
      <div className="max-w-3xl mx-auto">
        <motion.div className="text-center mb-12" variants={fadeInUp} transition={smoothTransition}>
          <p className="text-sm uppercase tracking-widest text-gold font-semibold mb-3">FAQ</p>
          <h2 className="text-4xl md:text-5xl font-bold font-serif mb-4">Common Questions</h2>
          <p className="text-lg text-muted-foreground">Everything you need to know about our services</p>
        </motion.div>

        <motion.div variants={fadeInUp} transition={smoothTransition}>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="border border-gold/30 rounded-lg px-6 hover:border-gold transition-colors duration-300 data-[state=open]:border-gold data-[state=open]:bg-gold/5"
                >
                  <AccordionTrigger className="text-left font-semibold hover:text-gold transition-colors py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">{faq.answer}</AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </motion.section>
  )
}
