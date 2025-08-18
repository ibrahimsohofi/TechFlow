import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is DataVault Pro?",
    answer:
      "DataVault Pro is an enterprise-grade web scraping platform that allows you to extract structured data from websites without writing complex code or managing infrastructure. It provides tools for data extraction, processing, and integration into your workflow.",
  },
  {
    question: "Do I need coding knowledge to use DataVault Pro?",
    answer:
      "No, our no-code scraper builder lets you visually select elements on a webpage to extract data without any programming. However, for advanced use cases, we also support custom JavaScript and Python scripts.",
  },
  {
    question: "Is web scraping legal?",
    answer:
      "Web scraping is legal when done responsibly and ethically. DataVault Pro helps you comply with website terms of service, robots.txt files, and rate limiting. We recommend only scraping publicly available data and respecting website owners' wishes.",
  },
  {
    question: "How does DataVault Pro handle anti-scraping measures?",
    answer:
      "DataVault Pro employs rotating proxies, request throttling, and CAPTCHA solving capabilities to handle common anti-scraping measures. Our system automatically adjusts to website changes and maintains session consistency.",
  },
  {
    question: "What formats can I export my data in?",
    answer:
      "DataVault Pro supports exporting data in JSON, CSV, and Excel formats. You can also access your data programmatically through our RESTful API.",
  },
  {
    question: "Can I schedule scraping jobs?",
    answer:
      "Yes, DataVault Pro allows you to schedule scraping jobs to run hourly, daily, weekly, or at custom intervals. You can also set up triggers to run jobs based on specific events.",
  },
  {
    question: "How much data can I scrape on the free plan?",
    answer:
      "The free plan includes up to 1,000 requests per month with 1 concurrent scraper. This is perfect for small projects or testing our platform before upgrading.",
  },
  {
    question: "Do you provide customer support?",
    answer:
      "Yes, all paid plans include email support. The Pro plan and above include priority support, while Enterprise customers get a dedicated support manager.",
  },
];

export function FAQ() {
  return (
    <section className="py-16 md:py-24" id="faq">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about DataVault Pro and web data extraction
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Still have questions?{" "}
            <a href="/contact" className="text-primary hover:underline font-medium">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
