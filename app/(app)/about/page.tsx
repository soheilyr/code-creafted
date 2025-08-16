"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "John Doe",
      role: "Founder & CEO",
      bio: "Passionate about connecting people through storytelling.",
    },
    {
      name: "Jane Smith",
      role: "Lead Developer",
      bio: "Building a seamless experience for bloggers worldwide.",
    },
    {
      name: "Alex Johnson",
      role: "Community Manager",
      bio: "Ensuring our community thrives with engaging content.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            className="text-4xl font-semibold text-primary mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            About Our Blog Platform
          </motion.h1>
          <p className="text-muted-foreground mb-8 text-lg">
            We&apos;re dedicated to empowering voices and fostering a vibrant
            community of bloggers and readers.
          </p>
          <Button asChild variant="default" size="lg">
            <Link href="/signup">Join Our Community</Link>
          </Button>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-primary mb-4">
            Our Mission
          </h2>
          <p className="text-muted-foreground mb-8">
            We aim to create a platform where everyone can share their stories,
            connect with others, and inspire change. Our blog platform is built
            with simplicity, accessibility, and community in mind.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold text-primary text-center mb-8">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-xl pt-3 font-medium text-foreground">
                      {member.name}
                    </CardTitle>
                    <p className="text-primary">{member.role}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-primary mb-4">
            Ready to Share Your Story?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join our community of bloggers and start creating today.
          </p>
          <Button asChild variant="default" size="lg">
            <Link href="/auth/register">Get Started</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
