import Providers from "../config/Providers";

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
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
