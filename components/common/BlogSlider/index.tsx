"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import BlogCard from "../BlogCard";

const BlogsSlider = ({ blogs }: { blogs: BlogType[] }) => {
  return (
    <Swiper
      modules={[Pagination]}
      spaceBetween={16}
      slidesPerView={1}
      autoplay
      pagination={{ clickable: true }}
      breakpoints={{
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 4 },
      }}
      className="!pb-[56px]"
    >
      {blogs.map((blog) => (
        <SwiperSlide key={blog.id}>
          <BlogCard blog={blog} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default BlogsSlider;
