"use client";

import { useState } from 'react';
import { MessageSquare, X, Phone } from 'lucide-react';
import { FacebookIcon } from './icons/facebook-icon';
import { LineIcon } from './icons/line-icon';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { dictionaries } from '@/lib/client-dictionaries';
import { Locale } from '@/i18n.config';

export function FloatingContact({ locale }: { locale: Locale }) {
    const [isOpen, setIsOpen] = useState(false);
    
    const dict = dictionaries[locale].sync();

    const contactLinks = [
        {
            href: "https://www.facebook.com/your-page",
            label: "Facebook",
            icon: <FacebookIcon className="h-7 w-7 text-white" />,
            bgClass: "bg-blue-600 hover:bg-blue-700"
        },
        {
            href: "https://line.me/ti/p/~yourlineid",
            label: "Line",
            icon: <LineIcon className="h-8 w-8 text-white" />,
            bgClass: "bg-green-500 hover:bg-green-600"
        },
        {
            href: "tel:0812345678",
            label: "Phone",
            icon: <Phone className="h-7 w-7 text-white" />,
            bgClass: "bg-indigo-600 hover:bg-indigo-700"
        }
    ];

    const toggleButtonLabel = isOpen ? dict.floatingContact.close : dict.floatingContact.open;

    return (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-center">
            <div className={cn(
                "flex flex-col items-center gap-3 mb-3 transition-all duration-300 ease-in-out",
                isOpen ? 'max-h-96 opacity-100 translate-y-0' : 'max-h-0 opacity-0 translate-y-4 overflow-hidden'
            )}>
                {contactLinks.map((link, index) => (
                    <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                            "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform transform hover:scale-110",
                            link.bgClass
                        )}
                        aria-label={link.label}
                        style={{ transitionDelay: isOpen ? `${index * 50}ms` : '0ms' }}
                    >
                        {link.icon}
                    </a>
                ))}
            </div>

            <Button
                onClick={() => setIsOpen(!isOpen)}
                aria-label={toggleButtonLabel}
                aria-expanded={isOpen}
                size="icon"
                className="bg-emerald-600 hover:bg-emerald-700 text-white w-16 h-16 rounded-full shadow-xl focus:outline-none relative"
            >
                <MessageSquare className={cn("h-8 w-8 transition-all duration-300", isOpen ? 'opacity-0 scale-50 rotate-45' : 'opacity-100 scale-100 rotate-0')} />
                <X className={cn("h-8 w-8 absolute transition-all duration-300", isOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-45')} />
            </Button>
        </div>
    );
}
