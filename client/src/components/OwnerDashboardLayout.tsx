import { trpc } from "@/lib/trpc";
import { BarChart3, FileBadge, FolderKanban, LogOut, Mail, UserRound } from "lucide-react";
import React, { useEffect } from "react";
import { Link, useLocation } from "wouter";

const links = [
  { href: "/admin", label: "Overview", icon: BarChart3 },
  { href: "/admin/profile", label: "Profile", icon: UserRound },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/certificates", label: "Certificates", icon: FileBadge },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

export function OwnerDashboardLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const session = trpc.owner.session.useQuery();
  const logout = trpc.owner.logout.useMutation({ onSuccess: () => setLocation("/admin/login") });
  useEffect(() => { if (session.data && !session.data.authenticated) setLocation("/admin/login"); }, [session.data, setLocation]);
  if (session.isLoading || !session.data?.authenticated) return <main className="admin-loading">Loading dashboard…</main>;
  return <main className="owner-dashboard"><aside className="owner-sidebar"><Link href="/" className="owner-brand"><span>&lt;/&gt;</span><b>OWNER<br />WORKSPACE</b></Link><nav>{links.map(item => { const Icon = item.icon; const active = item.href === "/admin" ? location === "/admin" : location.startsWith(item.href); return <Link href={item.href} className={active ? "active" : ""} key={item.href}><Icon size={17} />{item.label}</Link>; })}</nav><div className="owner-sidebar-footer"><p>Madonna Paules Bishay<br /><span>Portfolio owner</span></p><button type="button" onClick={() => logout.mutate()}><LogOut size={16} />Sign out</button></div></aside><section className="owner-main"><header className="owner-topbar"><Link href="/">View public site</Link><span>Owner dashboard</span></header>{children}</section></main>;
}
