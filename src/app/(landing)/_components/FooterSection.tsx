import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const navigation = {
  product: [
    { name: "Features", href: "/#features" },
    { name: "How it Works", href: "/#how-it-works" },
    { name: "Pricing", href: "/#pricing" },
    { name: "Templates", href: "/templates" },
    { name: "Examples", href: "/examples" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Partners", href: "/partners" },
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "Contact", href: "/contact" },
  ],
  social: [
    {
      name: "Twitter",
      href: "https://twitter.com/storybook",
      icon: Twitter,
    },
    {
      name: "Facebook",
      href: "https://facebook.com/storybook",
      icon: Facebook,
    },
    {
      name: "Instagram",
      href: "https://instagram.com/storybook",
      icon: Instagram,
    },
    {
      name: "Youtube",
      href: "https://youtube.com/storybook",
      icon: Youtube,
    },
  ],
  contact: [
    {
      name: "Email",
      value: "hello@storybook.com",
      icon: Mail,
    },
    {
      name: "Phone",
      value: "+1 (555) 123-4567",
      icon: Phone,
    },
    {
      name: "Address",
      value: "123 Story Street, Book City, BC 12345",
      icon: MapPin,
    },
  ],
};

export function FooterSection() {
  return (
    <footer
      className="border-t-2 border-gray-200 bg-white"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/logo.png"
                alt="StoryBook"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <span className="text-xl font-bold">StoryBook</span>
            </Link>
            <p className="text-sm leading-6 text-gray-600">
              Create magical stories with AI-powered storytelling platform.
              Perfect for authors, educators, and parents.
            </p>
            <div className="flex space-x-6">
              {navigation.social.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900">
                  Product
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.product.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-gray-900">
                  Company
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900">
                  Support
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-gray-900">
                  Contact
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.contact.map((item) => (
                    <li key={item.name} className="flex items-center gap-x-3">
                      <item.icon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <span className="text-sm leading-6 text-gray-600">
                        {item.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24">
          <div className="flex flex-col items-center justify-between gap-y-8 sm:flex-row">
            <div className="flex-1">
              <h3 className="text-sm font-semibold leading-6 text-gray-900">
                Subscribe to our newsletter
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Get weekly updates about new features and stories.
              </p>
            </div>
            <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="w-full sm:w-72"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
          <p className="mt-8 text-xs leading-5 text-gray-500">
            &copy; {new Date().getFullYear()} StoryBook. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
