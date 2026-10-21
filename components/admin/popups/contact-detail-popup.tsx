"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone } from "lucide-react";
import { useContact } from "@/hooks/useContact";
import {
  Contact,
  ContactStatus,
  Priority,
  getPriorityLabel,
  getPriorityColor,
} from "@/types/contact";

interface ContactDetailPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
  onUpdate: () => void;
}

export function ContactDetailPopup({
  open,
  onOpenChange,
  contact,
  onUpdate,
}: ContactDetailPopupProps) {
  const { t, locale } = useI18n();
  const { updateContact: updateContactAPI } = useContact();
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<ContactStatus | undefined>(undefined);
  const [priority, setPriority] = useState<Priority | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize note from contact
  useEffect(() => {
    if (contact) {
      setNote(contact.note || "");
      setStatus(contact.status);
      setPriority(contact.priority);
    }
  }, [contact]);

  const handleSaveAll = async () => {
    if (!contact) return;

    setIsSaving(true);
    await updateContactAPI(contact.id, {
      status: status ?? contact.status,
      priority: priority ?? contact.priority,
      note: note || null,
    });
    onUpdate();
    setIsSaving(false);
    onOpenChange(false);
  };

  if (!contact) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("admin.contacts.contactDetail")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t("admin.contacts.contactInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("admin.contacts.name")}
                  </p>
                  <p className="font-medium">{contact.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("admin.contacts.phone")}
                  </p>
                  <p className="font-medium">{contact.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">
                    {t("admin.contacts.email")}
                  </p>
                  <p className="font-medium">{contact.email}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">
                    {t("admin.contacts.date")}
                  </p>
                  <p className="font-medium">
                    {new Date(contact.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Message */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t("admin.contacts.message")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{contact.message}</p>
            </CardContent>
          </Card>

          {/* Status & Priority Update */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("admin.contacts.status")}
              </Label>
              <Select
                disabled={isSaving}
                value={(status ?? contact.status).toString()}
                onValueChange={(value) =>
                  setStatus(parseInt(value) as ContactStatus)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ContactStatus.OPEN.toString()}>
                    {t("admin.contacts.open")}
                  </SelectItem>
                  <SelectItem value={ContactStatus.IN_PROGRESS.toString()}>
                    {t("admin.contacts.inProgress")}
                  </SelectItem>
                  <SelectItem value={ContactStatus.CLOSED.toString()}>
                    {t("admin.contacts.closed")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("admin.contacts.priority")}
              </Label>
              <Select
                disabled={isSaving}
                value={(priority ?? contact.priority).toString()}
                onValueChange={(value) =>
                  setPriority(parseInt(value) as Priority)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Priority.LOW.toString()}>
                    {getPriorityLabel(Priority.LOW, locale)}
                  </SelectItem>
                  <SelectItem value={Priority.NORMAL.toString()}>
                    {getPriorityLabel(Priority.NORMAL, locale)}
                  </SelectItem>
                  <SelectItem value={Priority.HIGH.toString()}>
                    {getPriorityLabel(Priority.HIGH, locale)}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Note Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t("admin.contacts.note")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t("admin.contacts.notePlaceholder")}
                rows={4}
                className="resize-none"
                disabled={isSaving}
              />
            </CardContent>
          </Card>
          <Button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="w-full"
          >
            {isSaving ? t("admin.saving") : t("admin.save")}
          </Button>

          {/* Quick Actions
					<div className="flex gap-2">
						<Button
							variant="outline"
							className="flex-1 gap-2"
							onClick={() =>
								window.open(
									`mailto:${contact.email}?subject=Re: Liên hệ từ ${contact.name}`
								)
							}>
							<Mail className="h-4 w-4" />
							{t("admin.contacts.reply")}
						</Button>
						<Button
							variant="outline"
							className="flex-1 gap-2"
							onClick={() =>
								window.open(`tel:${contact.phone}`)
							}>
							<Phone className="h-4 w-4" />
							{t("admin.contacts.call")}
						</Button>
					</div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
