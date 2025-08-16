"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function FAQPage() {
  const faqs = [
    {
      question: "How do I create an account?",
      answer:
        "To create an account, click the 'Sign Up' button on the homepage and fill in your details. You'll need a valid email address and a password.",
    },
    {
      question: "How can I follow other users?",
      answer:
        "Visit a user's profile and click the 'Follow' button. You can manage your followed users from your profile page.",
    },
    {
      question: "Can I publish my own blog posts?",
      answer:
        "Yes! Once logged in, go to your dashboard and click 'Create Post' to write and publish your blog.",
    },
    {
      question: "What can admins do?",
      answer:
        "Admins can manage users, view all blog posts, and moderate content to ensure community guidelines are followed.",
    },
    {
      question: "How do I contact support?",
      answer:
        "Use the 'Contact Us' form in the footer or email us at support@yourblog.com.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            className="text-4xl font-semibold text-primary mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Frequently Asked Questions
          </motion.h1>
          <p className="text-muted-foreground mb-8">
            Find answers to common questions about using our blog platform.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-2xl pt-5 font-semibold text-primary">
                Your Questions, Answered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-lg font-medium text-foreground hover:text-primary">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
