import { OwnerDashboardLayout } from "@/components/OwnerDashboardLayout";
import { trpc } from "@/lib/trpc";
import { ArrowUpRight, FileBadge, FolderKanban, Mail, UserRound } from "lucide-react";
import React from "react";
import { Link } from "wouter";

export default function Admin() {
  const overview = trpc.portfolio.admin.overview.useQuery();
  const cards = [
    { label: "Projects", value: overview.data?.projectCount ?? 0, icon: FolderKanban, href: "/admin/projects" },
    { label: "Certificates", value: overview.data?.certificateCount ?? 0, icon: FileBadge, href: "/admin/certificates" },
    { label: "Unread messages", value: overview.data?.unreadCount ?? 0, icon: Mail, href: "/admin/messages" },
  ];
  return <OwnerDashboardLayout><div className="owner-page"><p className="admin-kicker">Control room</p><div className="owner-page-heading"><div><h1>Portfolio at a glance.</h1><p>Manage what visitors see, review incoming messages, and keep your work current.</p></div><Link href="/" target="_blank">View public site <ArrowUpRight size={15} /></Link></div><div className="overview-cards">{cards.map(card => { const Icon = card.icon; return <Link href={card.href} key={card.label}><div><p>{card.label}</p><strong>{card.value}</strong></div><Icon size={24} /><ArrowUpRight size={17} /></Link>; })}</div><section className="dashboard-next-step"><div><p className="admin-kicker">Next step</p><h2>Keep the public site current.</h2><p>Every change in the profile, projects, credentials, and languages is stored in your portfolio database.</p></div><div><Link href="/admin/profile"><UserRound size={16} />Edit profile</Link><Link href="/admin/projects"><FolderKanban size={16} />Add a project</Link></div></section></div></OwnerDashboardLayout>;
}
