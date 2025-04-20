import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ParkingSquare, Users, Shield, Clock, CreditCard, Settings } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="SmartParking - Solución Inteligente de Estacionamiento">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
                {/* Header */}
                <header className="container mx-auto px-6 py-6">
                    <nav className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <ParkingSquare className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                <span className="text-gray-900 dark:text-white">Smart</span>Parking
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-md"
                                >
                                    <Settings className="h-4 w-4" />
                                    Panel de Control
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded-lg px-6 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors dark:text-blue-400 dark:hover:bg-blue-900/30"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-md"
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Hero Section */}
                <main className="container mx-auto px-6 py-12 md:py-24 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                            Revoluciona tu <span className="text-blue-600 dark:text-blue-400">gestión de parqueaderos</span>
                        </h1>
                        
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
                            La solución todo-en-uno para control de accesos, reservas en línea y cobros automatizados en tu parqueadero.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                href={auth.user ? route('dashboard') : route('register')}
                                className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-700 transition-colors shadow-lg"
                            >
                                {auth.user ? 'Ir al Panel' : 'Comenzar Gratis'}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </Link>
                            <Link
                                href="#demo"
                                className="rounded-lg border-2 border-blue-600 px-8 py-4 text-lg font-semibold text-blue-600 hover:bg-blue-50 transition-colors dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
                            >
                                Ver Demo
                            </Link>
                        </div>
                    </div>
                </main>

                {/* Features Section */}
                <section id="features" className="py-16 bg-white dark:bg-gray-950">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <span className="inline-block bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                                TODO LO QUE NECESITAS
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                Características de <span className="text-blue-600 dark:text-blue-400">SmartParking</span>
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                Optimiza cada aspecto de tu operación de estacionamiento
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <ParkingSquare className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
                                    title: "Gestión de Espacios",
                                    description: "Visualización en tiempo real de disponibilidad por pisos y zonas"
                                },
                                {
                                    icon: <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
                                    title: "Reservas Online",
                                    description: "Permite a tus clientes reservar espacios desde tu web o app"
                                },
                                {
                                    icon: <CreditCard className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
                                    title: "Pagos Automatizados",
                                    description: "Sistema integrado de cobros con múltiples métodos de pago"
                                },
                                {
                                    icon: <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
                                    title: "Clientes Recurrentes",
                                    description: "Gestión de planes mensuales y clientes corporativos"
                                },
                                {
                                    icon: <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
                                    title: "Control de Accesos",
                                    description: "Reconocimiento de placas y tickets QR para entrada/salida"
                                },
                                {
                                    icon: <Settings className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
                                    title: "Panel Administrativo",
                                    description: "Reportes detallados y configuración avanzada del sistema"
                                }
                            ].map((feature, index) => (
                                <div key={index} className="group bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-400 transition-all">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 dark:group-hover:bg-blue-400 group-hover:text-white transition-colors">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Demo Section */}
                <section id="demo" className="py-16 bg-gray-100 dark:bg-gray-900">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                ¿Cómo funciona <span className="text-blue-600 dark:text-blue-400">SmartParking</span>?
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                Mira nuestro video demo y descubre la plataforma en acción
                            </p>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl max-w-4xl mx-auto">
                            <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <div className="text-center p-8">
                                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Video Demo</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Próximamente: Mira cómo SmartParking puede transformar tu operación</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-blue-600 dark:bg-blue-900">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            ¿Listo para modernizar tu parqueadero?
                        </h2>
                        <p className="text-xl text-blue-100 dark:text-blue-200 max-w-2xl mx-auto mb-8">
                            Regístrate hoy y obtén 14 días gratis para probar todas las funcionalidades.
                        </p>
                        <Link
                            href={route('register')}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-blue-600 hover:bg-gray-100 transition-colors shadow-lg"
                        >
                            Comenzar Ahora
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12">
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-4 gap-8">
                            <div>
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="bg-blue-600 p-2 rounded-lg">
                                        <ParkingSquare className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="text-xl font-bold">SmartParking</span>
                                </div>
                                <p className="text-gray-400">
                                    La solución inteligente para la gestión moderna de parqueaderos.
                                </p>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Producto</h3>
                                <ul className="space-y-2">
                                    <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Características</a></li>
                                    <li><a href="#demo" className="text-gray-400 hover:text-white transition-colors">Demo</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Precios</a></li>
                                </ul>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Empresa</h3>
                                <ul className="space-y-2">
                                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Nosotros</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contacto</a></li>
                                </ul>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Legal</h3>
                                <ul className="space-y-2">
                                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacidad</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Términos</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Seguridad</a></li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                            <p>&copy; {new Date().getFullYear()} SmartParking. Todos los derechos reservados.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}