"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

export default function LandingPage() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const t = useTranslations("LandingPage");
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.startsWith("/kn") ? "kn" : "en";

  const switchLocale = () => {
    const newLocale = currentLocale === "en" ? "kn" : "en";

    router.replace(`/${newLocale}`);
  };
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Header navItems={[]} userName={undefined} />
      <div className="mt-8">
        {/* <div className="flex justify-center items-center">
          <span className="text-gray-700 p-2">English</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={currentLocale === "kn"}
              onChange={switchLocale}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
            <div
              className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                currentLocale === "kn"
                  ? "transform translate-x-6"
                  : "transform translate-x-0"
              }`}
            ></div>
          </label>
          <span className="ml-2 text-gray-700">Kannada</span>
        </div> */}
      </div>
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 mt-12 text-black">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{t("title")}</h1>
        <p className="text-lg md:text-xl mb-6">{t("subtitle")}</p>
        <Link
          href="/books"
          className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-gray-200 transition duration-300"
        >
          {t("exploreBooks")}
        </Link>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-10">{t("whyChooseUs")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">
                {t("feature1.title")}
              </h3>
              <p className="text-gray-600">{t("feature1.description")}</p>
            </div>
            <div className="p-6 border rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">
                {t("feature2.title")}
              </h3>
              <p className="text-gray-600">{t("feature2.description")}</p>
            </div>
            <div className="p-6 border rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">
                {t("feature3.title")}
              </h3>
              <p className="text-gray-600">{t("feature3.description")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
