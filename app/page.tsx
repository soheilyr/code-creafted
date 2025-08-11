import BlogsSlider from "@/components/common/BlogSlider";
import HeroSection from "@/components/pages/hmoe/HeroSection";

export default async function Home() {
  const res = await fetch("http://localhost:3000/api/blog");
  const blogs = await res.json();
  console.log(blogs);
  return (
    <>
      <HeroSection />
      <div className="container mx-auto my-5 bg-white shadow-sm p-10 rounded-md">
        <h1 className="flex gap-3 justify-center items-center text-[36px] font-bold text-center text-[#384967] mb-[40px]">
          <div className="h-[2px] w-[20px] bg-[#384967]"></div>
          Latest Blog
          <div className="h-[2px] w-[20px] bg-[#384967]"></div>
        </h1>
        <BlogsSlider blogs={blogs.data.blogs} />

        {/* <BlogCard blog={sampleContent[0]} />
          <BlogCard blog={sampleContent[0]} />
          <BlogCard blog={sampleContent[0]} /> */}
      </div>
    </>
  );
}
