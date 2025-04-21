import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Users,           
    ParkingSquare,  
    Shield,          
    UserCog,         
    BookOpen,        
} from 'lucide-react';
import AppLogo from './app-logo';
import { usePage } from '@inertiajs/react';

const mainNavItems: (NavItem & { permission?: string })[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      permission: 'dashboard', 
    },
    {
      title: 'Clientes',
      href: '/clientes',
      icon: Users, 
      permission: 'gestionar clientes',
    },
    {
      title: 'Espacios',
      href: '/espacios',
      icon: ParkingSquare, 
      permission: 'gestionar espacios',
    },
    {
      title: 'Roles',
      href: '/roles',
      icon: Shield, 
      permission: 'gestionar roles',
    },
    {
      title: 'Usuarios',
      href: '/usuarios',
      icon: UserCog, 
      permission: 'gestionar usuarios',
    },
    {
      title: 'Tarifas',
      href: '/tarifas',
      icon: BookOpen, 
      permission: 'gestionar tarifas',
    },
    {
      title: 'Configuración',
      href: '/configuracion',
      icon: LayoutDashboard,
      permission: 'gestionar configuracion',
    },
  ];
  

const footerNavItems: (NavItem & { permission?: string })[] = [
   
];

export function AppSidebar() {
    const { auth } = usePage().props;
    const permissions = auth.permissions || [];

    const filteredMainNavItems = mainNavItems.filter(item => {
        return !item.permission || permissions.includes(item.permission);
    });

    const filteredFooterNavItems = footerNavItems.filter(item => {
        return !item.permission || permissions.includes(item.permission);
    });

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredMainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={filteredFooterNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}