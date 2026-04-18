import { useEffect, useState } from "react";
import { Mail, UserRound } from "lucide-react";
import DashboardShell from "../components/DashboardShell";
import { getCurrentUser, updateCurrentUserProfile } from "../lib/auth";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/Card";
import { Feedback } from "../components/ui/Feedback";
import { Input } from "../components/ui/Input";
import { PageHeader } from "../components/ui/PageHeader";
import { Skeleton } from "../components/ui/Skeleton";

export default function Profile() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const user = await getCurrentUser();

        if (!user) return;

        setEmail(user.email || "");
        setFullName((user.user_metadata?.full_name as string) || "");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "We couldn't load your profile.",
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!fullName.trim()) {
      setError("Add your name so your workspace feels a little more personal.");
      return;
    }

    try {
      setSaving(true);
      await updateCurrentUserProfile({ fullName });
      setSuccessMessage("Your profile is updated.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "We couldn't save your profile.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardShell>
      <PageHeader
        title="Profile"
        subtitle="Keep your name current so teammates can see who owns each survey."
      />

      {loading ? (
        <Card className="space-y-4">
          <Skeleton className="h-12 rounded-[20px]" />
          <Skeleton className="h-12 rounded-[20px]" />
          <Skeleton className="h-12 w-40 rounded-[20px]" />
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-[1fr_0.82fr]">
          <Card>
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ada Lovelace"
                leadingIcon={<UserRound className="h-4 w-4" />}
              />

              <Input
                label="Email"
                value={email}
                readOnly
                leadingIcon={<Mail className="h-4 w-4" />}
                helperText="Your email is managed by your sign-in provider"
              />

              {error ? (
                <Feedback variant="error" title="Your profile wasn't saved" description={error} />
              ) : null}

              {successMessage ? (
                <Feedback
                  variant="success"
                  title="Changes saved"
                  description={successMessage}
                />
              ) : null}

              <Button type="submit" loading={saving} size="lg">
                {saving ? "Saving changes" : "Save changes"}
              </Button>
            </form>
          </Card>

          <Card variant="flat" className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-[var(--text)]">
                Keep this simple
              </h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                A clear profile helps your team know who's publishing and reviewing surveys
              </p>
            </div>

            <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-sm font-semibold text-[var(--text)]">
                Best practice
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                Use the name your teammates recognize most often. It keeps shared survey workflows easier to scan.
              </p>
            </div>
          </Card>
        </div>
      )}
    </DashboardShell>
  );
}
