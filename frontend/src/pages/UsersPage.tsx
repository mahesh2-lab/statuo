import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Mail,
  UserPlus,
  Trash2,
  Edit2,
  Shield,
} from 'lucide-react';
import { useToast } from '../context/useToast';
import { Button } from '../components/ui/button';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Checkbox } from '../components/ui/checkbox';

interface BetterAuthUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  dateJoined: string;
  relativeTime: string;
}

export const UsersPage: React.FC = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [users, setUsers] = useState<BetterAuthUser[]>([
    {
      id: '1',
      name: 'Jane Doe',
      email: 'jane@example.com',
      initials: 'JD',
      dateJoined: 'Today, 03:14 PM',
      relativeTime: 'less than a minute ago',
    },
    {
      id: '2',
      name: 'Antigravity Verified Tester',
      email: 'tester_1785787064714@example.com',
      initials: 'AV',
      dateJoined: 'Today, 03:14 PM',
      relativeTime: 'less than a minute ago',
    },
  ]);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail) return;
    const name = newUserName.trim() || newUserEmail.split('@')[0];
    const initials = name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const newUser: BetterAuthUser = {
      id: Date.now().toString(),
      name,
      email: newUserEmail.trim(),
      initials: initials || 'U',
      dateJoined: 'Today, 03:14 PM',
      relativeTime: 'just now',
    };

    setUsers((prev) => [newUser, ...prev]);
    setIsAddUserOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    toast.success(`User ${newUser.name} created successfully`);
  };

  const handleDeleteUser = (id: string, name: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.success(`User ${name} removed`);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 py-1">
      {/* Page Header */}
      <div>
        <h1 className="text-base font-bold tracking-tight text-white font-sans">Users</h1>
        <p className="text-[11px] text-zinc-400 mt-0.5 font-sans">
          Manage your users and create new ones
        </p>
      </div>

      {/* Meta Bar */}
      <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
        <span>Showing 1-{filteredUsers.length} of {users.length} users</span>
        <span>•</span>
        <div className="flex items-center gap-1 text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-none bg-[#34d399] inline-block" />
          <span>0 Online</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <div className="flex flex-1 items-center gap-2 max-w-xl">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users, emails or ids..."
              className="w-full pl-8 pr-8 rounded-none bg-black border-[#1f1f23] text-white placeholder:text-zinc-600 font-mono text-xs h-8"
            />
            <div className="absolute right-2.5 top-2.5 text-emerald-400">
              <Mail className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Sort By Dropdown */}
          <Button
            variant="outline"
            size="sm"
            className="rounded-none border-[#1f1f23] text-zinc-300 text-xs font-mono h-8 hover:border-zinc-500"
          >
            <span>Sort By: Created</span>
          </Button>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info('Filter options applied.')}
            className="text-[11px] h-8 px-3 border-[#1f1f23] hover:border-zinc-500 font-mono"
          >
            <Filter className="w-3 h-3 mr-1.5" />
            <span>Filter</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => setIsAddUserOpen(true)}
            className="text-[11px] h-8 px-3 font-semibold"
          >
            <Plus className="w-3 h-3 mr-1" />
            <span>Add User</span>
          </Button>
        </div>
      </div>

      {/* Users Resource Table */}
      <div className="border border-[#1f1f23] bg-black overflow-hidden rounded-none">
        <Table className="w-full text-left text-xs">
          <TableHeader className="bg-black border-b border-[#1f1f23]">
            <TableRow className="border-b border-[#1f1f23] hover:bg-transparent">
              <TableHead className="py-2.5 pl-3.5 pr-2 w-8">
                <Checkbox className="rounded-none border-[#27272a]" />
              </TableHead>
              <TableHead className="py-2.5 px-3 text-[10px] font-medium text-zinc-500 font-mono uppercase tracking-wider">
                User
              </TableHead>
              <TableHead className="py-2.5 px-3 text-[10px] font-medium text-zinc-500 font-mono uppercase tracking-wider">
                Date Joined &darr;
              </TableHead>
              <TableHead className="py-2.5 pl-2 pr-4 text-right text-[10px] font-medium text-zinc-500 font-mono uppercase tracking-wider">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-[#1f1f23]">
            {filteredUsers.map((u) => (
              <TableRow
                key={u.id}
                className="hover:bg-white/[0.02] border-[#1f1f23] transition-colors duration-150 group"
              >
                {/* Checkbox */}
                <TableCell className="py-3 pl-3.5 pr-2 w-8" onClick={(e) => e.stopPropagation()}>
                  <Checkbox className="rounded-none border-[#27272a]" />
                </TableCell>

                {/* User Avatar, Name & Email */}
                <TableCell className="py-3 px-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="w-6 h-6 rounded-none bg-zinc-900 border border-zinc-700 shrink-0">
                      <AvatarFallback className="text-[10px] font-bold text-zinc-300 uppercase rounded-none bg-zinc-900 font-mono">
                        {u.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="font-semibold text-white text-xs truncate font-sans">
                        {u.name}
                      </div>
                      <div className="text-[11px] text-zinc-500 font-mono truncate">
                        {u.email}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Date Joined */}
                <TableCell className="py-3 px-3 font-mono text-[11px]">
                  <div className="text-zinc-300">{u.dateJoined}</div>
                  <div className="text-[10px] text-zinc-500">{u.relativeTime}</div>
                </TableCell>

                {/* Action Menu */}
                <TableCell className="py-3 pl-2 pr-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="text-zinc-500 hover:text-white"
                        aria-label="User actions"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-40 rounded-none bg-black border-[#27272a] text-zinc-200 p-1"
                    >
                      <DropdownMenuItem
                        onClick={() => toast.info(`Viewing profile for ${u.name}`)}
                        className="rounded-none text-xs cursor-pointer text-white"
                      >
                        <Edit2 className="w-3.5 h-3.5 mr-2" />
                        <span>Edit User</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => toast.info(`Permissions updated for ${u.name}`)}
                        className="rounded-none text-xs cursor-pointer text-white"
                      >
                        <Shield className="w-3.5 h-3.5 mr-2" />
                        <span>Permissions</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-[#27272a]" />
                      <DropdownMenuItem
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="rounded-none text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-2" />
                        <span>Delete User</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add User Modal with Shadcn Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="rounded-none border-[#27272a] bg-black p-6 max-w-md">
          <DialogHeader className="border-b border-[#27272a] pb-3">
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-white" />
              <DialogTitle className="text-sm font-bold text-white font-sans">
                Create New User
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-zinc-400 font-sans">
              Add a new member to your organization directory.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddUser} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="new-user-name" className="text-xs text-zinc-300 font-mono">
                Name
              </Label>
              <Input
                id="new-user-name"
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="e.g. Sarah Connor"
                className="rounded-none bg-black border-[#27272a] text-xs text-white placeholder:text-zinc-600 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="new-user-email" className="text-xs text-zinc-300 font-mono">
                Email <span className="text-rose-400">*</span>
              </Label>
              <Input
                id="new-user-email"
                type="email"
                required
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="sarah@example.com"
                className="rounded-none bg-black border-[#27272a] text-xs text-white placeholder:text-zinc-600 font-mono"
              />
            </div>

            <DialogFooter className="pt-3 border-t border-[#27272a] flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddUserOpen(false)}
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
                Create User
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
