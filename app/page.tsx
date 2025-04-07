import BlogCard from "@/components/common/BlogCard";
import HeroSection from "@/components/pages/hmoe/HeroSection";
import sampleImg1 from "@/public/samples/1.jpg";
import Image from "next/image";
const sampleContent: Partial<BlogType>[] = [
  {
    content:
      "Top 16+ Modern React Libraries To Supercharge Your Next Big Project",
    id: 1,
    createdAt: "2020-12-01",
    imageUrl: sampleImg1,
    title: "Monorepo in Next.js",
  },
];

export default function Home() {
  return (
    <>
      <HeroSection />
      <div className="container mx-auto my-5 bg-white shadow-sm p-10 rounded-md">
        <h1 className="flex gap-3 justify-center items-center text-[36px] font-bold text-center text-[#384967] mb-[40px]">
          <div className="h-[2px] w-[20px] bg-[#384967]"></div>
          Latest Blog
          <div className="h-[2px] w-[20px] bg-[#384967]"></div>
        </h1>
        <div className="flex gap-[23px] justify-center items-center ">
          <BlogCard blog={sampleContent[0]} />
          <BlogCard blog={sampleContent[0]} />
          <BlogCard blog={sampleContent[0]} />
        </div>
      </div>
      <div className="container mx-auto my-5 bg-white shadow-sm p-10 rounded-md">
        <h1 className="flex gap-3 justify-center items-center text-[36px] font-bold text-center text-[#384967] mb-[40px]">
          <div className="h-[2px] w-[20px] bg-[#384967]"></div>
          Latest Blog
          <div className="h-[2px] w-[20px] bg-[#384967]"></div>
        </h1>
        <div className="flex gap-[23px] justify-center items-center ">
          <BlogCard blog={sampleContent[0]} />
          <BlogCard blog={sampleContent[0]} />
          <BlogCard blog={sampleContent[0]} />
        </div>
      </div>
      <div className="container mx-auto my-5 bg-white shadow-sm p-10 rounded-md">
        <h1 className="flex gap-3 justify-center items-center text-[36px] font-bold text-center text-[#384967] mb-[40px]">
          <div className="h-[2px] w-[20px] bg-[#384967]"></div>
          Latest Blog
          <div className="h-[2px] w-[20px] bg-[#384967]"></div>
        </h1>
        <div className="flex gap-[23px] justify-center items-center ">
          <BlogCard blog={sampleContent[0]} />
          <BlogCard blog={sampleContent[0]} />
          <BlogCard blog={sampleContent[0]} />
        </div>
      </div>
    </>
  );
}
