"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Briefcase,
  AtSign,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MenuItem {
  label: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    label: "Demandeurs d'emploi",
    icon: Users,
    children: [
      { label: "Inscriptions à valider", href: "/dashboard/job-seekers/pending", icon: Users },
      { label: "Liste des inscrits", href: "/dashboard/job-seekers", icon: Users },
      { label: "Inscriptions refusées", href: "/dashboard/job-seekers/rejected", icon: Users },
    ],
  },
  {
    label: "Professionnels",
    icon: Briefcase,
    children: [
      { label: "Inscriptions à valider", href: "/dashboard/professionals/pending", icon: Briefcase },
      { label: "Liste des professionnels", href: "/dashboard/professionals", icon: Briefcase },
    ],
  },
  {
    label: "Offres d'emploi",
    icon: AtSign,
    children: [
      { label: "Liste des offres", href: "/dashboard/job-offers", icon: AtSign },
      { label: "Nouvelle offre", href: "/dashboard/job-offers/new", icon: AtSign },
    ],
  },
  {
    label: "Inspirations",
    icon: Lightbulb,
    children: [
      { label: "Liste des inspirations", href: "/dashboard/inspirations", icon: Lightbulb },
      { label: "Nouvelle inspiration", href: "/dashboard/inspirations/new", icon: Lightbulb },
      { label: "En attente", href: "/dashboard/inspirations/pending", icon: Lightbulb },
      { label: "Refusées", href: "/dashboard/inspirations/rejected", icon: Lightbulb },
    ],
  },
  {
    label: "Help",
    icon: HelpCircle,
    href: "/dashboard/help",
  },
];


export default function AviationSidebar() {
  return (
    <div className="hidden lg:flex flex-col w-16 h-screen bg-gray-100 border-r border-gray-200">
      <div className="flex-1 flex flex-col items-center py-4">
        {/* Logo or icon at top */}
        <div className="mb-8">
          <Link href="/dashboard" className="block">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer border border-gray-200">
              <Image
                src="/aviationstaff.logo"
                alt="Aviation Staff Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
          </Link>
        </div>
        
        {/* Menu items - vertical icons */}
        <div className="flex flex-col gap-4">
          {menuItems.map((item) => {
            if (item.children && item.children.length > 0) {
              return (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors text-gray-600 hover:bg-white hover:text-aviation-blue-dark"
                      title={item.label}
                    >
                      <item.icon className="h-5 w-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start" className="ml-2">
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.href} asChild>
                        <Link href={child.href!}>
                          {child.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }
            
            return (
              <Link
                key={item.label}
                href={item.href || "#"}
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors text-gray-600 hover:bg-white hover:text-aviation-blue-dark"
                title={item.label}
              >
                <item.icon className="h-5 w-5" />
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}

