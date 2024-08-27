import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product | RentX",
  description: "Rent anything",
};
export default function DashboardLayout({
  children, 
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}