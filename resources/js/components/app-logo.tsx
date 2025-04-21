import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-2 grid flex-1 text-left">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    <span className="text-gray-900 dark:text-white">Smart</span>Parking
                </span>
            </div>
        </div>
    );
}