import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Users,
  Shield,
  Building2,
  MoreHorizontal,
  Mail,
  UserPlus,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '../components/ui/table';
import { useToast } from '../context/useToast';

interface OrgMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Member';
  initials: string;
  joinedAt: string;
}

export const OrganizationsPage: React.FC = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [orgSlug, setOrgSlug] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Member'>('Member');

  const [members, setMembers] = useState<OrgMember[]>([
    {
      id: '1',
      name: 'Mahesh Chopade',
      email: 'mahesh@example.com',
      role: 'Owner',
      initials: 'MC',
      joinedAt: 'Aug 15, 2026',
    },
    {
      id: '2',
      name: 'Jane Doe',
      email: 'jane@example.com',
      role: 'Admin',
      initials: 'JD',
      joinedAt: 'Aug 15, 2026',
    },
    {
      id: '3',
      name: 'Antigravity Verified Tester',
      email: 'tester@example.com',
      role: 'Member',
      initials: 'AV',
      joinedAt: 'Aug 15, 2026',
    },
  ]);

  const handleCreateOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) return;
    toast.success(`Organization "${orgName}" created successfully`);
    setIsOpen(false);
    setOrgName('');
    setOrgSlug('');
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    const newMember: OrgMember = {
      id: Date.now().toString(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail.trim(),
      role: inviteRole,
      initials: inviteEmail.substring(0, 2).toUpperCase(),
      joinedAt: 'Just now',
    };
    setMembers((prev) => [...prev, newMember]);
    toast.success(`Invitation sent to ${inviteEmail}`);
    setIsInviteOpen(false);
    setInviteEmail('');
  };

  return (
    <div className="space-y-4 py-1">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1f1f23] pb-3">
        <div>
          <h1 className="text-base font-bold tracking-tight text-white font-sans">Organizations</h1>
          <p className="text-[11px] text-zinc-400 mt-0.5 font-sans">
            Manage multi-tenant organizations, roles, API tokens, and member permissions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsInviteOpen(true)}
            className="text-[11px] h-8 px-3 border-[#27272a] hover:border-zinc-500 font-mono"
          >
            <UserPlus className="w-3 h-3 mr-1.5" />
            <span>Invite Member</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => setIsOpen(true)}
            className="text-[11px] h-8 px-3 font-semibold"
          >
            <Plus className="w-3 h-3 mr-1" />
            <span>New Organization</span>
          </Button>
        </div>
      </div>

      {/* Main Org Overview Banner */}
      <Card className="border border-[#1f1f23] bg-black p-5 space-y-4 rounded-none shadow-none gap-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Avatar className="w-10 h-10 rounded-none bg-zinc-900 border border-zinc-700">
              <AvatarFallback className="text-white font-bold font-mono text-sm rounded-none bg-zinc-900">
                K
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white font-sans">Kjhj Core Organization</h2>
                <Badge variant="success" className="rounded-none font-mono text-[9px]">
                  ACTIVE TENANT
                </Badge>
              </div>
              <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                slug: <span className="text-zinc-300 font-semibold">kjhj</span> • Plan: <span className="text-white font-semibold">Enterprise Tier</span> • created Aug 15, 2026
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-[10px] font-mono text-zinc-400 bg-[#09090b] px-3 py-1.5 border border-[#27272a]">
              ID: <span className="text-zinc-200">org_q0U7A2J3NxtERa</span>
            </div>
          </div>
        </div>

        {/* 3 Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#1f1f23] text-xs font-mono">
          <div className="p-3 bg-[#09090b] border border-[#27272a]">
            <div className="text-[10px] text-zinc-500 flex items-center justify-between">
              <span>MEMBERS</span>
              <Users className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <div className="text-lg font-bold text-white mt-1.5">{members.length} Active Users</div>
            <div className="text-[10px] text-[#34d399] mt-0.5">Unlimited seats</div>
          </div>

          <div className="p-3 bg-[#09090b] border border-[#27272a]">
            <div className="text-[10px] text-zinc-500 flex items-center justify-between">
              <span>ROLES & POLICIES</span>
              <Shield className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <div className="text-lg font-bold text-white mt-1.5">Owner, Admin, Member</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">RBAC Enforced</div>
          </div>

          <div className="p-3 bg-[#09090b] border border-[#27272a]">
            <div className="text-[10px] text-zinc-500 flex items-center justify-between">
              <span>TEAMS & SERVICES</span>
              <Layers className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <div className="text-lg font-bold text-white mt-1.5">Engineering, Ops, DevOps</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">3 Team Scopes</div>
          </div>
        </div>
      </Card>

      {/* Organization Members Table */}
      <Card className="border border-[#1f1f23] bg-black p-4 space-y-3 rounded-none shadow-none gap-0">
        <div className="flex items-center justify-between border-b border-[#1f1f23] pb-3">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-sans">
              Organization Members ({members.length})
            </h3>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
              Users with explicit access to this workspace and tenant credentials.
            </p>
          </div>
          <Button
            variant="outline"
            size="xs"
            onClick={() => setIsInviteOpen(true)}
            className="text-[10px] h-7 px-2.5 font-mono"
          >
            <UserPlus className="w-3 h-3 mr-1" />
            <span>Add Member</span>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table className="w-full text-left text-xs">
            <TableHeader className="bg-black border-b border-[#1f1f23]">
              <TableRow className="border-b border-[#1f1f23] hover:bg-transparent">
                <TableHead className="py-2.5 px-3 text-[10px] font-medium text-zinc-500 font-mono uppercase tracking-wider">
                  Member
                </TableHead>
                <TableHead className="py-2.5 px-3 text-[10px] font-medium text-zinc-500 font-mono uppercase tracking-wider">
                  Role
                </TableHead>
                <TableHead className="py-2.5 px-3 text-[10px] font-medium text-zinc-500 font-mono uppercase tracking-wider">
                  Joined Date
                </TableHead>
                <TableHead className="py-2.5 pl-2 pr-4 text-right text-[10px] font-medium text-zinc-500 font-mono uppercase tracking-wider">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-[#1f1f23]">
              {members.map((m) => (
                <TableRow
                  key={m.id}
                  className="hover:bg-white/[0.02] border-[#1f1f23] transition-colors duration-150"
                >
                  <TableCell className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="w-6 h-6 rounded-none bg-zinc-900 border border-zinc-700">
                        <AvatarFallback className="text-[10px] font-bold text-zinc-300 uppercase rounded-none bg-zinc-900 font-mono">
                          {m.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-white text-xs font-sans">{m.name}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">{m.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-3">
                    <Badge
                      variant={m.role === 'Owner' ? 'default' : m.role === 'Admin' ? 'info' : 'secondary'}
                      className="text-[10px] font-mono"
                    >
                      {m.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 px-3 font-mono text-[11px] text-zinc-400">
                    {m.joinedAt}
                  </TableCell>
                  <TableCell className="py-3 pl-2 pr-4 text-right">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => toast.info(`Managing permissions for ${m.name}`)}
                      className="text-zinc-500 hover:text-white"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* New Organization Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="rounded-none border-[#27272a] bg-black p-6 max-w-md">
          <DialogHeader className="border-b border-[#27272a] pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-white" />
              <DialogTitle className="text-sm font-bold text-white font-sans">
                Create Organization
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-zinc-400 font-sans">
              Create a new multi-tenant workspace.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateOrg} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="org-name" className="text-xs text-zinc-300 font-mono">
                Organization Name <span className="text-rose-400">*</span>
              </Label>
              <Input
                id="org-name"
                type="text"
                required
                value={orgName}
                onChange={(e) => {
                  setOrgName(e.target.value);
                  if (!orgSlug) setOrgSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                }}
                placeholder="e.g. Acme Corp"
                className="rounded-none bg-black border-[#27272a] text-xs text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="org-slug" className="text-xs text-zinc-300 font-mono">
                URL Slug
              </Label>
              <Input
                id="org-slug"
                type="text"
                value={orgSlug}
                onChange={(e) => setOrgSlug(e.target.value)}
                placeholder="acme-corp"
                className="rounded-none bg-black border-[#27272a] text-xs text-white font-mono"
              />
            </div>

            <DialogFooter className="pt-3 border-t border-[#27272a] flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                size="sm"
                className="text-xs font-semibold"
              >
                Create Organization
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Invite Member Dialog */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="rounded-none border-[#27272a] bg-black p-6 max-w-md">
          <DialogHeader className="border-b border-[#27272a] pb-3">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-white" />
              <DialogTitle className="text-sm font-bold text-white font-sans">
                Invite Member
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-zinc-400 font-sans">
              Send an invitation link to a team member.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleInvite} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="invite-email" className="text-xs text-zinc-300 font-mono">
                Email Address <span className="text-rose-400">*</span>
              </Label>
              <Input
                id="invite-email"
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="rounded-none bg-black border-[#27272a] text-xs text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-300 font-mono">Role</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={inviteRole === 'Member' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setInviteRole('Member')}
                  className="rounded-none text-xs h-8 border-[#27272a]"
                >
                  Member
                </Button>
                <Button
                  type="button"
                  variant={inviteRole === 'Admin' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setInviteRole('Admin')}
                  className="rounded-none text-xs h-8 border-[#27272a]"
                >
                  Admin
                </Button>
              </div>
            </div>

            <DialogFooter className="pt-3 border-t border-[#27272a] flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsInviteOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                size="sm"
                className="text-xs font-semibold"
              >
                Send Invite
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
