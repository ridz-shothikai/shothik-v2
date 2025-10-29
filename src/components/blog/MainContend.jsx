import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";
import { useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import { useGetBlogsQuery } from "../../redux/api/blog/blogApiSlice";
import BlogHeader from "./BlogHeader";
import BlogLoading from "./BlogLoading";

const MainContend = ({ selectedCategory, page, setPage, children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedValue = useDebounce(searchQuery);
  const options = { page, selectedCategory, debouncedValue };
  const { data: blogs, isLoading } = useGetBlogsQuery(options);
  const totalPages = blogs?.totalPages || 1;

  return (
    <div className="w-full flex-1">
      <BlogHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <h5 className="text-xl font-semibold mb-6">Results</h5>

      {/* Blog Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <BlogLoading />
        ) : !blogs.data?.length ? (
          <NoBlogFound />
        ) : (
          blogs.data?.map((blog) => <BlogCard key={blog._id} blog={blog} />)
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 ? (
        <div className="flex justify-center my-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && setPage(page - 1)}
                  className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => setPage(pageNum)}
                    isActive={page === pageNum}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => page < totalPages && setPage(page + 1)}
                  className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ) : null}

      {children}
    </div>
  );
};

function BlogCard({ blog }) {
  return (
    <Link href={`/blogs/${blog.slag}`} className="no-underline">
      <Card className="h-full shadow-lg rounded-lg overflow-hidden transition-transform hover:scale-105">
        <CardContent className="p-4">
          <h6 className="text-lg font-semibold mb-2">{blog.title}</h6>
          <p className="text-sm text-muted-foreground">
            {new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "long",
              day: "2-digit",
            }).format(new Date(blog.updatedAt))}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

function NoBlogFound() {
  return (
    <div className="py-12 text-center w-full col-span-full">
      <h6 className="text-lg text-muted-foreground">No blogs found.</h6>
    </div>
  );
}

export default MainContend;
