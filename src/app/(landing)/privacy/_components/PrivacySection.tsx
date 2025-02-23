export function PrivacySection() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24 lg:px-8">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Privacy Policy
        </h1>

        <div className="mt-8">
          <p className="text-gray-600">
            This Policy defines the scope of privacy and degree of
            confidentiality protecting the information provided by users during
            registration and normal use of kidbooks.fun ("Site"), KidBooks's
            services, programs and facilities. At any time, users can, at their
            discretion, allow or forbid collection and use of their personal
            information.
          </p>

          <p className="mt-6 text-gray-600">
            This Site is owned and operated by KidBooks Technologies Inc., a US
            company, and its affiliates (doing business as and collectively
            referred to as "KidBooks"). By using the Site, user provides his/her
            consent that KidBooks has the authority to collect, use and disclose
            the user's personal information according to the rules of this
            Policy.
          </p>

          <p className="mt-6 text-gray-600">
            KidBooks proclaims and accepts its responsibility to protect the
            user's personal information. This document contains the rules upon
            which such information is collected and used, and also the reasons
            for disclosure of such information. These rules apply to any
            personal information collected by KidBooks.
          </p>

          <h2 className="mt-12 text-2xl font-bold text-gray-900">
            Personal Information We Collect
          </h2>

          <p className="mt-6 text-gray-600">
            When you visit the Site, we automatically collect certain
            information about your device, including information about your web
            browser, IP address, time zone, and some of the cookies that are
            installed on your device. Additionally, as you browse the Site, we
            collect information about the individual web pages or products that
            you view, what websites or search terms referred you to the Site,
            and information about how you interact with the Site. We refer to
            this automatically-collected information as "Device Information."
          </p>

          <p className="mt-6 text-gray-600">
            We collect Device Information using the following technologies:
          </p>

          <ul className="mt-4 list-disc space-y-4 pl-6 text-gray-600">
            <li>
              <strong>Cookies</strong> are data files that are placed on your
              device or computer and often include an anonymous unique
              identifier. For more information about cookies, and how to disable
              cookies, visit{" "}
              <a
                href="http://www.allaboutcookies.org"
                className="text-brand-primary hover:underline"
              >
                http://www.allaboutcookies.org
              </a>
              .
            </li>
            <li>
              <strong>Log files</strong> track actions occurring on the Site,
              and collect data including your IP address, browser type, Internet
              service provider, referring/exit pages, and date/time stamps.
            </li>
            <li>
              <strong>Web beacons, tags, and pixels</strong> are electronic
              files used to record information about how you browse the Site.
            </li>
          </ul>

          <h2 className="mt-12 text-2xl font-bold text-gray-900">
            How Do We Use Your Personal Information?
          </h2>

          <p className="mt-6 text-gray-600">
            We use the Order Information that we collect generally to fulfill
            any orders placed through the Site (including processing your
            payment information, arranging for shipping, and providing you with
            invoices and/or order confirmations). Additionally, we use this
            Order Information to:
          </p>

          <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-600">
            <li>Communicate with you;</li>
            <li>Screen our orders for potential risk or fraud;</li>
            <li>
              When in line with the preferences you have shared with us, provide
              you with information or advertising relating to our products or
              services.
            </li>
          </ul>

          <h2 className="mt-12 text-2xl font-bold text-gray-900">
            Third Party Disclosure
          </h2>

          <p className="mt-6 text-gray-600">
            We share your Personal Information with third parties to help us use
            your Personal Information, as described above. We use Google
            Analytics to help us understand how our customers use the Site--you
            can read more about how Google uses your Personal Information here:{" "}
            <a
              href="https://www.google.com/intl/en/policies/privacy/"
              className="text-brand-primary hover:underline"
            >
              https://www.google.com/intl/en/policies/privacy/
            </a>
            . You can also opt-out of Google Analytics here:{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              className="text-brand-primary hover:underline"
            >
              https://tools.google.com/dlpage/gaoptout
            </a>
            .
          </p>

          <p className="mt-6 text-gray-600">
            Finally, we may also share your Personal Information to comply with
            applicable laws and regulations, to respond to a subpoena, search
            warrant or other lawful request for information we receive, or to
            otherwise protect our rights.
          </p>
        </div>
      </div>
    </div>
  );
}
