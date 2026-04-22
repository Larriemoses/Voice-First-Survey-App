import { useState } from "react";
import { Plus } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { Modal } from "../ui/Modal";
import { Select } from "../ui/Select";

const members = [
  { name: "Jane Adele", email: "jane@acme.co", role: "Admin" },
  { name: "Moses Okafor", email: "moses@acme.co", role: "Editor" },
  { name: "Lina Kim", email: "lina@acme.co", role: "Viewer" },
];

export function TeamTab() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Team</h2>
          <p className="mt-1 text-sm text-gray-500">Invite collaborators and manage survey access.</p>
        </div>
        <Button leadingIcon={<Plus className="h-4 w-4" />} onClick={() => setOpen(true)}>Invite member</Button>
      </div>
      <Card className="divide-y divide-gray-200 p-0">
        {members.map((member) => (
          <div key={member.email} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-sm font-medium text-primary-700">{member.name.split(" ").map((part) => part[0]).join("")}</span>
              <div>
                <p className="font-medium text-gray-900">{member.name}</p>
                <p className="text-sm text-gray-500">{member.email}</p>
              </div>
            </div>
            <Badge variant={member.role === "Admin" ? "active" : member.role === "Editor" ? "done" : "closed"}>{member.role}</Badge>
          </div>
        ))}
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title="Invite member" description="Admins have full access. Editors can build and review. Viewers can read analytics.">
        <div className="space-y-4">
          <Input label="Email address" placeholder="teammate@company.com" />
          <Select label="Role">
            <option>Admin</option>
            <option>Editor</option>
            <option>Viewer</option>
          </Select>
          <Button onClick={() => setOpen(false)}>Send invite</Button>
        </div>
      </Modal>
    </div>
  );
}
