"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/language-switcher';
import { dictionaries } from '@/lib/client-dictionaries';
import { cn } from '@/lib/utils';
import { i18n, type Locale } from '@/i18n.config';

export function Header({ locale }: { locale: Locale }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const dict = dictionaries[locale] ? dictionaries[locale].sync() : dictionaries[i18n.defaultLocale].sync();

    const navLinks = dict.navigation.links;
    const baseLocalePath = locale === 'th' ? '' : `/${locale}`;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
            isScrolled || isOpen ? "bg-white shadow-md text-gray-800" : "bg-transparent text-white"
        )}>
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-20">
                    <div className="text-2xl font-bold">
                        <Link href={baseLocalePath || '/'} className={cn(isScrolled || isOpen ? "text-emerald-600" : "text-white")}>
                            Clean & Care
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex items-center space-x-6">
                        {navLinks.map((link: { href: string; label: string; }) => (
                            <Link key={link.href} href={`${baseLocalePath}${link.href}`} className="font-medium hover:text-emerald-500 transition-colors">
                                {link.label}
                            </Link>
                        ))}
                        <LanguageSwitcher />
                        <Button asChild>
                            <Link href={`${baseLocalePath}/#booking`}>{dict.navigation.contact}</Link>
                        </Button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <LanguageSwitcher />
                        <Button onClick={() => setIsOpen(!isOpen)} variant="ghost" size="icon" className="ml-2">
                            <Menu className={cn("h-6 w-6", { 'hidden': isOpen })}/>
                            <X className={cn("h-6 w-6", { 'hidden': !isOpen })}/>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={cn(
                "md:hidden absolute top-20 left-0 right-0 bg-white shadow-lg text-gray-800 transition-all duration-300 ease-in-out transform",
                isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
            )}>
                <nav className="flex flex-col items-center p-6 space-y-4">
                     {navLinks.map((link: { href: string; label: string; }) => (
                        <Link key={link.href} href={`${baseLocalePath}${link.href}`} className="font-medium text-lg hover:text-emerald-500 transition-colors" onClick={() => setIsOpen(false)}>
                            {link.label}
                        </Link>
                    ))}
                    <Button asChild className="w-full">
                        <Link href={`${baseLocalePath}/#booking`} onClick={() => setIsOpen(false)}>{dict.navigation.contact}</Link>
                    </Button>
                </nav>
            </div>
        </header>
    );
}
