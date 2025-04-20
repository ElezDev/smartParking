import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Car, ParkingMeter, Clock, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Smart Parking Dashboard" />
            <div className="flex flex-col gap-4 p-4">
                {/* Parking Overview Section */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Spaces
                            </CardTitle>
                            <ParkingMeter className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">250</div>
                            <p className="text-xs text-muted-foreground">
                                +20 new spaces this month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Occupied
                            </CardTitle>
                            <Car className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">187</div>
                            <p className="text-xs text-muted-foreground">
                                74.8% occupancy rate
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Average Stay
                            </CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">2h 15m</div>
                            <p className="text-xs text-muted-foreground">
                                +5% from yesterday
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Active Sensors
                            </CardTitle>
                            <Zap className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">243/250</div>
                            <p className="text-xs text-muted-foreground">
                                7 sensors need maintenance
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Section */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Parking Occupancy</CardTitle>
                            <CardDescription>
                                Real-time parking space utilization
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[300px] flex items-center justify-center">
                                <PlaceholderPattern className="size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Recent Activities</CardTitle>
                            <CardDescription>
                                Latest parking events
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {[
                                    { time: "10:42 AM", plate: "ABC-1234", zone: "B2", status: "entry", icon: <Car className="h-4 w-4 text-blue-500" /> },
                                    { time: "10:38 AM", plate: "XYZ-9876", zone: "A1", status: "exit", icon: <Car className="h-4 w-4 text-green-500" /> },
                                    { time: "10:35 AM", plate: "DEF-5678", zone: "C3", status: "overstay", icon: <AlertCircle className="h-4 w-4 text-yellow-500" /> },
                                    { time: "10:30 AM", plate: "GHI-2468", zone: "B1", status: "payment", icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" /> },
                                    { time: "10:25 AM", plate: "JKL-1357", zone: "A2", status: "entry", icon: <Car className="h-4 w-4 text-blue-500" /> },
                                ].map((activity, index) => (
                                    <div key={index} className="flex items-start">
                                        {activity.icon}
                                        <div className="ml-3 space-y-0.5">
                                            <p className="text-sm font-medium leading-none">
                                                {activity.plate} - {activity.zone}
                                            </p>
                                            <p className="text-sm text-muted-foreground capitalize">
                                                {activity.status}
                                            </p>
                                        </div>
                                        <div className="ml-auto text-sm font-medium">
                                            {activity.time}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Parking Zones Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Parking Zones Status</CardTitle>
                        <CardDescription>
                            Current availability by parking zone
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            {[
                                { name: "Zone A", total: 80, occupied: 65, level: "busy" },
                                { name: "Zone B", total: 70, occupied: 40, level: "moderate" },
                                { name: "Zone C", total: 100, occupied: 82, level: "very busy" },
                            ].map((zone, index) => (
                                <Card key={index} className="p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-medium">{zone.name}</h4>
                                        <Badge variant={
                                            zone.level === "very busy" ? "destructive" :
                                            zone.level === "busy" ? "outline" : "default"
                                        }>
                                            {zone.level}
                                        </Badge>
                                    </div>
                                    <Progress 
                                        value={(zone.occupied / zone.total) * 100} 
                                        className="h-2"
                                    />
                                    <div className="flex justify-between mt-2 text-sm">
                                        <span className="text-muted-foreground">
                                            {zone.occupied}/{zone.total} spaces
                                        </span>
                                        <span className="font-medium">
                                            {Math.round((zone.occupied / zone.total) * 100)}%
                                        </span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Button variant="outline" className="h-24 flex-col gap-2">
                        <Car className="h-6 w-6" />
                        <span>Register Vehicle</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col gap-2">
                        <ParkingMeter className="h-6 w-6" />
                        <span>Manage Spaces</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col gap-2">
                        <AlertCircle className="h-6 w-6" />
                        <span>View Alerts</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col gap-2">
                        <Clock className="h-6 w-6" />
                        <span>History Log</span>
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}