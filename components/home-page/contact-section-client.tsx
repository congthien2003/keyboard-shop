"use client";

import { useState } from "react";
import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useContact } from "@/hooks/useContact";

// Validation regex patterns
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(0|\+84)[0-9]{9,10}$/; // Vietnamese phone format

// Define the props for the client component
type ContactSectionClientProps = {
  txt: {
    title: string;
    subtitle: string;
    formTitle: string;
    info: {
      title: string;
      address: string;
      phone: string;
      email: string;
      hours: string;
    };
    placeholders: {
      name: string;
      phone: string;
      email: string;
      message: string;
    };
    errors: {
      nameRequired: string;
      nameMinLength: string;
      emailRequired: string;
      emailInvalid: string;
      phoneRequired: string;
      phoneInvalid: string;
      messageRequired: string;
      messageMinLength: string;
      validation: string;
      submit: string;
    };
    cta: {
      submit: string;
      submitting: string;
    };
    successMessage: string;
  };
  href: {
    phone: string;
    email: string;
  };
};

export function ContactSectionClient({ txt, href }: ContactSectionClientProps) {
  const { createContact, loading } = useContact();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Validate individual field
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        if (!value.trim()) return txt.errors.nameRequired;
        if (value.trim().length < 2) return txt.errors.nameMinLength;
        return "";

      case "email":
        if (!value.trim()) return txt.errors.emailRequired;
        if (!EMAIL_REGEX.test(value)) return txt.errors.emailInvalid;
        return "";

      case "phone":
        if (!value.trim()) return txt.errors.phoneRequired;
        const cleanPhone = value.replace(/[\s-]/g, "");
        if (!PHONE_REGEX.test(cleanPhone)) return txt.errors.phoneInvalid;
        return "";

      case "message":
        if (!value.trim()) return txt.errors.messageRequired;
        if (value.trim().length < 10) return txt.errors.messageMinLength;
        return "";

      default:
        return "";
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      phone: validateField("phone", formData.phone),
      message: validateField("message", formData.message),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setSubmitStatus("idle");
    setErrorMessage("");

    if (!validateForm()) {
      setSubmitStatus("error");
      setErrorMessage(txt.errors.validation);
      return;
    }

    const result = await createContact(formData);

    if (result) {
      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
      setErrors({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } else {
      setSubmitStatus("error");
      setErrorMessage(txt.errors.submit);
    }
  };

  const contactInfo = [
    { icon: MapPin, label: txt.info.address, href: null },
    { icon: Phone, label: txt.info.phone, href: href.phone },
    { icon: Mail, label: txt.info.email, href: href.email },
    { icon: Clock, label: txt.info.hours, href: null },
  ];

  return (
    <section id="contact" className="storefront-section bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="storefront-heading">
            {txt.title}
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            {txt.subtitle}
          </p>
        </div>

        <div className="mb-16">
          <div className="grid gap-8 lg:grid-cols-2">
            <Card className="storefront-card">
              <CardContent className="p-6">
                <h3 className="mb-6 text-xl font-semibold">{txt.formTitle}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {submitStatus === "success" && (
                    <div role="status" className="flex items-center gap-3 rounded-xl border border-border bg-secondary p-4">
                      <CheckCircle2 className="h-5 w-5 text-foreground shrink-0" />
                      <p className="text-foreground text-sm">
                        {txt.successMessage}
                      </p>
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div role="alert" className="flex items-center gap-3 rounded-xl border border-primary/40 bg-primary/10 p-4">
                      <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                      <p className="text-destructive text-sm">{errorMessage}</p>
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Input
                        name="name"
                        aria-label={txt.placeholders.name}
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={txt.placeholders.name}
                        className={`h-12 ${
                          errors.name
                            ? "border-red-500 focus:border-red-500"
                            : ""
                        }`}
                        disabled={loading}
                        required
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <Input
                        type="tel"
                        name="phone"
                        aria-label={txt.placeholders.phone}
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={txt.placeholders.phone}
                        className={`h-12 ${
                          errors.phone
                            ? "border-red-500 focus:border-red-500"
                            : ""
                        }`}
                        disabled={loading}
                        required
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Input
                      type="email"
                      name="email"
                        aria-label={txt.placeholders.email}
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={txt.placeholders.email}
                      className={`h-12 ${
                        errors.email
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                      disabled={loading}
                      required
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <Textarea
                      name="message"
                        aria-label={txt.placeholders.message}
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={txt.placeholders.message}
                      rows={5}
                      className={`resize-none ${
                        errors.message
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                      disabled={loading}
                      required
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? txt.cta.submitting : txt.cta.submit}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="storefront-card">
              <CardContent className="p-6">
                <h3 className="mb-6 text-xl font-semibold">{txt.info.title}</h3>
                {!contactInfo.some(info => info.label) && <p className="text-sm leading-7 text-muted-foreground">{txt.subtitle}</p>}
                <div className="space-y-4">
                  {contactInfo.filter(info => info.label).map((item) => {
                    const Icon = item.icon;
                    const content = (
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-primary/10 p-2 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium leading-relaxed">
                            {item.label}
                          </p>
                        </div>
                      </div>
                    );

                    if (item.href) {
                      return (
                        <a
                          key={item.label}
                          href={item.href}
                          className="block hover:text-primary rounded-lg transition-colors duration-200"
                        >
                          {content}
                        </a>
                      );
                    }

                    return <div key={item.label}>{content}</div>;
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
