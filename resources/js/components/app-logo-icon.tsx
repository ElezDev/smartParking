import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 40 42" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="42" rx="8" fill="#4F46E5" />
            <text 
                x="20" 
                y="28" 
                fontFamily="Arial, sans-serif" 
                fontSize="20" 
                fontWeight="bold" 
                fill="white" 
                textAnchor="middle"
                dominantBaseline="middle"
            >
                SP
            </text>
        </svg>
    );
}