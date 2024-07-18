import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools | RentX",
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