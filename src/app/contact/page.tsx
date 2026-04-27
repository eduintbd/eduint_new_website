"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { contactSchema, type ContactInput } from "@/lib/validators";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
  });

  const onSubmit = async (values: ContactInput) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        setSent(true);
        reset();
        toast.success("Message sent");
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "Failed to send message");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Get in <span className="gradient-text">Touch</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h2 className="font-semibold text-lg mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-gray-500">info@eduintbd.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-gray-500">+880 1898 934855</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Office</p>
                  <p className="text-sm text-gray-500">Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h2 className="font-semibold text-lg mb-2">Office Hours</h2>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p>Sunday - Thursday: 10:00 AM - 7:00 PM</p>
              <p>Friday: 3:00 PM - 7:00 PM</p>
              <p>Saturday: 10:00 AM - 5:00 PM</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          {sent ? (
            <div className="text-center py-16 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h2>
              <p className="text-gray-500 mb-6">We&apos;ll get back to you within 24 hours.</p>
              <Button onClick={() => setSent(false)}>Send Another Message</Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Name"
                  autoComplete="name"
                  placeholder="Your full name"
                  error={errors.name?.message}
                  {...register("name")}
                />
                <Input
                  label="Email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  error={errors.email?.message}
                  {...register("email")}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Phone (optional)"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+880..."
                  error={errors.phone?.message}
                  {...register("phone")}
                />
                <Input
                  label="Subject"
                  placeholder="How can we help?"
                  error={errors.subject?.message}
                  {...register("subject")}
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                <textarea
                  id="contact-message"
                  rows={5}
                  placeholder="Tell us more about your inquiry..."
                  aria-invalid={errors.message ? "true" : "false"}
                  aria-describedby={errors.message ? "contact-message-error" : undefined}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("message")}
                />
                {errors.message && (
                  <p id="contact-message-error" className="mt-1 text-sm text-red-500">
                    {errors.message.message}
                  </p>
                )}
              </div>
              <Button type="submit" loading={isSubmitting} size="lg">
                <Send className="h-4 w-4 mr-2" /> Send Message
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
