import Header from "@/components/Header";

export const experimental_ppr = true;
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-ful">
      <div className="w-full">
        <Header />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
