import { Geist, Geist_Mono } from "next/font/google";
import Providers from "../config/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

// for blog page
// export async function generateMetadata({ params }) {
//   const blog = await fetchBlogData(params.slug);

//   return {
//     title: blog?.title || "Default Title",
//     description: blog?.description || "Default description",
//     openGraph: {
//       title: blog?.title || "Default Title",
//       description: blog?.description || "Default description",
//       images: [{ url: blog?.image || "/default-image.jpg" }],
//     },
//   };
// }
