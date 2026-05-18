import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const products = [
  {
    id: 1,
    image: "/Amala.png",
  },
  {
    id: 2,
    image: "/Banana.png",
  },
  {
    id: 3,
    image: "/Tomato.png",
  },
];

function HomeBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % products.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 py-8">
      <div className="w-full relative">
        <Carousel className="w-full overflow-hidden rounded-2xl shadow-lg">
          <CarouselContent
            style={{
              transform: `translateX(-${index * 100}%)`,
              transition: "transform 0.6s ease-in-out",
              display: "flex",
            }}
          >
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="shrink-0 w-full flex justify-center"
              >
                <div className="relative w-full aspect-video md:h-[350px] lg:h-[400px] bg-white">
                  <img
                    src={product.image}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious
            onClick={() =>
              setIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1))
            }
          />
          <CarouselNext
            onClick={() => setIndex((prev) => (prev + 1) % products.length)}
          />
        </Carousel>
      </div>
    </div>
  );
}

export default HomeBanner;
