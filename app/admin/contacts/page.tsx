"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/contexts/admin-context";
import { useI18n } from "@/lib/i18n";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { ContactDetailPopup } from "@/components/admin/popups/contact-detail-popup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Eye,
  Trash2,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useContact } from "@/hooks/useContact";
import {
  Contact,
  ContactStatus,
  getPriorityLabel,
  getPriorityColor,
} from "@/types/contact";

export default function ContactsPage() {
  const { isAuthenticated } = useAdmin();
  const router = useRouter();
  const { t, locale } = useI18n();
  const {
    contacts,
    loading,
    totalContacts,
    totalPages,
    fetchContacts,
    deleteContact: deleteContactAPI,
  } = useContact();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<number | undefined>(
    undefined,
  );
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  // Effect for initial auth check and data loading
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login");
    } else {
      fetchContacts({
        page,
        limit,
        search: searchQuery || undefined,
        status: filterStatus,
      });
    }
  }, [isAuthenticated, router, page, limit, searchQuery, filterStatus]);

  // Effect to reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, filterStatus]);

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm(t("admin.contacts.confirmDelete"))) {
      const success = await deleteContactAPI(id);
      if (success) {
        if (selectedContact && selectedContact.id === id) {
          setIsDialogOpen(false);
        }
        // Reload data on the current page after deletion
        fetchContacts({
          page,
          limit,
          search: searchQuery || undefined,
          status: filterStatus,
        });
      }
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const getStatusColor = (status: ContactStatus) => {
    switch (status) {
      case ContactStatus.OPEN:
        return "bg-secondary text-foreground";
      case ContactStatus.IN_PROGRESS:
        return "bg-secondary text-foreground";
      case ContactStatus.CLOSED:
        return "bg-secondary text-foreground";
      default:
        return "bg-secondary text-muted-foreground";
    }
  };

  const getStatusText = (status: ContactStatus) => {
    switch (status) {
      case ContactStatus.OPEN:
        return t("admin.contacts.open");
      case ContactStatus.IN_PROGRESS:
        return t("admin.contacts.inProgress");
      case ContactStatus.CLOSED:
        return t("admin.contacts.closed");
      default:
        return String(status);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />

      <div className="lg:pl-64">
        <AdminHeader
          title={t("admin.contacts.title")}
          subtitle={t("admin.contacts.subtitle").replace(
            "{totalContacts}",
            String(totalContacts),
          )}
        />

        <main className="pt-[100px] min-h-screen overflow-y-auto">
          <div className="p-6 lg:p-8">
            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t("admin.contacts.search")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={
                  filterStatus !== undefined ? filterStatus.toString() : "all"
                }
                onValueChange={(value) =>
                  setFilterStatus(value === "all" ? undefined : parseInt(value))
                }
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("admin.contacts.allStatus")}
                  </SelectItem>
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

            {/* Contacts Table */}
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("admin.contacts.table.customer")}</TableHead>
                    <TableHead>{t("admin.contacts.table.message")}</TableHead>
                    <TableHead>{t("admin.contacts.table.note")}</TableHead>
                    <TableHead>{t("admin.contacts.table.status")}</TableHead>
                    <TableHead>{t("admin.contacts.table.priority")}</TableHead>
                    <TableHead>{t("admin.contacts.table.date")}</TableHead>
                    <TableHead className="text-right">
                      {t("admin.contacts.table.actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        {t("admin.loading")}
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading &&
                    contacts.map((contact) => (
                      <TableRow
                        key={contact.id}
                        className={`${contact.status === ContactStatus.OPEN ? "bg-secondary/50" : ""}`}
                      >
                        <TableCell>
                          <div className="font-medium">{contact.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {contact.email}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {contact.phone}
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm line-clamp-3">
                            {contact.message}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm line-clamp-3">
                            {contact.note ?? ""}
                          </p>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(contact.status)}`}
                          >
                            {getStatusText(contact.status)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(contact.priority)} text-white`}
                          >
                            {getPriorityLabel(contact.priority, locale)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(contact.createdAt).toLocaleDateString(
                            "vi-VN",
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleViewContact(contact)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDelete(contact.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  {!loading && contacts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          {t("admin.contacts.noData")}
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                {t("admin.pagination.showing")
                  .replace("{start}", String((page - 1) * limit + 1))
                  .replace(
                    "{end}",
                    String(Math.min(page * limit, totalContacts)),
                  )
                  .replace("{total}", String(totalContacts))}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePreviousPage}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  {t("admin.pagination.page")
                    .replace("{page}", String(page))
                    .replace("{totalPages}", String(totalPages))}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextPage}
                  disabled={page >= totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Contact Detail Popup */}
      <ContactDetailPopup
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        contact={selectedContact}
        onUpdate={() =>
          fetchContacts({
            page,
            limit,
            search: searchQuery || undefined,
            status: filterStatus,
          })
        }
      />
    </div>
  );
}
