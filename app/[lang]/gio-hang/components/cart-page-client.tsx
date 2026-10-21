"use client";

import { useEffect, useState } from "react";
import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";
import {
  CartItem,
  getCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  getTotals,
} from "@/lib/cart";
import { formatUsd, formatVnd } from "@/lib/formatAmount";
import { useOrder } from "@/hooks/useOrder";
import { CreateOrderInput } from "@/types/order";
import type { Locale } from "@/lib/types";

// Validation regex patterns
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(0|\+84)[0-9]{9,10}$/; // Vietnamese phone format

interface CartTranslations {
  title: string;
  empty: string;
  orderInfo: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  note: string;
  subtotal: string;
  shipping: string;
  total: string;
  placeOrder: string;
  processing: string;
  remove: string;
  success: string;
  summary: string;
  error: {
    validation: string;
    submit: string;
    emptyCart: string;
    invalidItems: string;
    nameRequired: string;
    nameMinLength: string;
    phoneRequired: string;
    phoneInvalid: string;
    emailInvalid: string;
    addressRequired: string;
    addressMinLength: string;
  };
}

interface CartPageClientProps {
  lang: Locale;
  translations: CartTranslations;
}

export function CartPageClient({ lang, translations: t }: CartPageClientProps) {
  // State management
  const { createOrder, loading } = useOrder();
  const [items, setItems] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const locale = lang;

  // Load cart items on mount
  useEffect(() => {
    setItems(getCart());
  }, []);

  // Validate individual field
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        if (!value.trim()) {
          return t.error.nameRequired;
        }
        if (value.trim().length < 2) {
          return t.error.nameMinLength;
        }
        return "";

      case "phone":
        if (!value.trim()) {
          return t.error.phoneRequired;
        }
        // Remove spaces and dashes for validation
        const cleanPhone = value.replace(/[\s-]/g, "");
        if (!PHONE_REGEX.test(cleanPhone)) {
          return t.error.phoneInvalid;
        }
        return "";

      case "email":
        // Email is optional, but if provided, must be valid
        if (value.trim() && !EMAIL_REGEX.test(value.trim())) {
          return t.error.emailInvalid;
        }
        return "";

      case "address":
        if (!value.trim()) {
          return t.error.addressRequired;
        }
        if (value.trim().length < 10) {
          return t.error.addressMinLength;
        }
        return "";

      default:
        return "";
    }
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors = {
      name: validateField("name", name),
      phone: validateField("phone", phone),
      email: validateField("email", email),
      address: validateField("address", address),
    };

    setErrors(newErrors);

    // Return true if no errors
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    // Clear error when user starts typing
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
    // Clear error when user starts typing
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    // Clear error when user starts typing
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setAddress(value);
    // Clear error when user starts typing
    if (errors.address) {
      setErrors((prev) => ({ ...prev, address: "" }));
    }
  };

  const handleNameBlur = () => {
    const error = validateField("name", name);
    setErrors((prev) => ({ ...prev, name: error }));
  };

  const handlePhoneBlur = () => {
    const error = validateField("phone", phone);
    setErrors((prev) => ({ ...prev, phone: error }));
  };

  const handleEmailBlur = () => {
    const error = validateField("email", email);
    setErrors((prev) => ({ ...prev, email: error }));
  };

  const handleAddressBlur = () => {
    const error = validateField("address", address);
    setErrors((prev) => ({ ...prev, address: error }));
  };

  const handleQty = (id: string, qty: number) => {
    const updated = updateQuantity(id, qty);
    setItems(updated);
  };

  const handleRemove = (id: string) => {
    const updated = removeFromCart(id);
    setItems(updated);
  };

  const handlePlaceOrder = async () => {
    setSubmitStatus("idle");
    setErrorMessage("");

    // Check if cart is empty
    if (items.length === 0) {
      setSubmitStatus("error");
      setErrorMessage(t.error.emptyCart);
      return;
    }

    // Validate all fields
    if (!validateForm()) {
      setSubmitStatus("error");
      setErrorMessage(t.error.validation);
      return;
    }

    setIsSubmitting(true);

    try {
      // Filter out items with invalid IDs first
      const validItems = items.filter(
        (item) =>
          item.id != null &&
          item.id !== undefined &&
          typeof item.id === "string" &&
          item.id.trim().length > 0,
      );

      if (validItems.length === 0) {
        setSubmitStatus("error");
        setErrorMessage(t.error.invalidItems);
        setIsSubmitting(false);
        return;
      }

      // Recalculate totals with valid items only
      const { subtotal, shipping, total } = getTotals(validItems, locale);

      // Prepare order data
      const orderInput: CreateOrderInput = {
        name,
        phone,
        email: email || null,
        address,
        message: note || null,
        subtotal: locale === "vi" ? subtotal : subtotal,
        shippingFee: locale === "vi" ? shipping : shipping,
        totalAmount: locale === "vi" ? total : total,
        paymentMethod: "COD",
        orderDetails: validItems.map((item) => ({
          productId: item.id, // Already a string
          price: locale === "vi" ? item.priceVND : item.price,
          quantity: item.quantity,
          totalPrice:
            (locale === "vi" ? item.priceVND : item.price) * item.quantity,
        })),
      };

      // Create order via API
      const order = await createOrder(orderInput);

      if (order) {
        // Clear cart and form
        clearCart();
        setItems([]);
        setName("");
        setPhone("");
        setEmail("");
        setAddress("");
        setNote("");
        // Clear errors
        setErrors({
          name: "",
          phone: "",
          email: "",
          address: "",
        });

        setSubmitStatus("success");
        // Hide success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus("idle");
        }, 5000);
      } else {
        setSubmitStatus("error");
        setErrorMessage(t.error.submit);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setSubmitStatus("error");
      setErrorMessage(t.error.submit);
    } finally {
      setIsSubmitting(false);
    }
  };

  const { subtotal, shipping, total } = getTotals(items, locale);

  return (
    <div className="min-h-screen bg-background">
      <section className="storefront-section !pt-12">
        <div className="container mx-auto px-4">
          <h1 className="storefront-heading mb-8 text-center">{t.title}</h1>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.length === 0 ? (
                <Card className="storefront-card">
                  <CardContent className="p-6 text-center text-muted-foreground">
                    {t.empty}
                  </CardContent>
                </Card>
              ) : (
                items.map((item) => (
                  <Card key={item.id} className="storefront-card">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="h-24 w-24 overflow-hidden rounded-xl border border-primary/10 bg-muted">
                          <Image
                            src={item.image}
                            alt={item.nameVi}
                            width={96}
                            height={96}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.nameVi}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.name}
                          </p>
                          <p className="mt-1 text-primary font-semibold">
                            {locale === "vi"
                              ? formatVnd(item.priceVND)
                              : formatUsd(Number(item.price))}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleQty(item.id, item.quantity - 1)
                            }
                          >
                            -
                          </Button>
                          <Input
                            className="w-16 text-center"
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) =>
                              handleQty(item.id, parseInt(e.target.value) || 1)
                            }
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleQty(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemove(item.id)}
                          >
                            {t.remove}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Order Form & Summary */}
            <div className="space-y-6">
              {/* Order Information */}
              <Card className="storefront-card">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">{t.orderInfo}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        {t.name} *
                      </label>
                      <Input
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        onBlur={handleNameBlur}
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        {t.phone} *
                      </label>
                      <Input
                        type="tel"
                        value={phone}
                        onChange={handlePhoneChange}
                        onBlur={handlePhoneBlur}
                        className={errors.phone ? "border-red-500" : ""}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        {t.email}
                      </label>
                      <Input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        onBlur={handleEmailBlur}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        {t.address} *
                      </label>
                      <Textarea
                        value={address}
                        onChange={handleAddressChange}
                        onBlur={handleAddressBlur}
                        className={errors.address ? "border-red-500" : ""}
                        rows={3}
                      />
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.address}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        {t.note}
                      </label>
                      <Textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card className="storefront-card bg-secondary/30">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">{t.summary}</h3>

                  {/* Status Messages */}
                  {submitStatus === "success" && (
                    <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-emerald-800">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="text-sm whitespace-pre-line">
                        {t.success}
                      </span>
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/80 p-3 text-red-800">
                      <AlertCircle className="h-5 w-5" />
                      <span className="text-sm">{errorMessage}</span>
                    </div>
                  )}

                  <div className="mt-4 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>{t.subtotal}</span>
                      <span>
                        {locale === "vi"
                          ? formatVnd(subtotal)
                          : formatUsd(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t.shipping}</span>
                      <span>
                        {locale === "vi"
                          ? formatVnd(shipping)
                          : formatUsd(shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold text-primary">
                      <span>{t.total}</span>
                      <span>
                        {locale === "vi" ? formatVnd(total) : formatUsd(total)}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="mt-5 w-full shadow-[0_12px_24px_-16px_oklch(0.3_0.07_155/0.8)]"
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={
                      isSubmitting ||
                      items.length === 0 ||
                      submitStatus === "success"
                    }
                  >
                    {isSubmitting ? t.processing : t.placeOrder}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
