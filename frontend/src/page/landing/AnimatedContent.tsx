"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import StarGrid from "./StarGrid";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import Button from "@/components/shared/Button";
import Image from "../../assets/SmartAgro.png";

export default function AnimatedContent() {
  const container = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  gsap.registerPlugin(useGSAP);

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        gsap.set(
          ".hero__heading, .hero__body, .hero__button, .hero__image, .hero__glow",
          { opacity: 1 }
        );
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

      tl.fromTo(
        ".hero__heading",
        { scale: 0.5 },
        { scale: 1, opacity: 1, duration: 1.4 }
      );

      tl.fromTo(
        ".hero__body",
        { y: 20 },
        { y: 0, opacity: 1, duration: 1.2 },
        "-=0.6"
      );

      tl.fromTo(
        ".hero__button",
        { scale: 1.5 },
        { scale: 1, opacity: 1, duration: 1.3 },
        "-=0.8"
      );
      tl.fromTo(
        ".hero__image",
        { y: 100 },
        { y: 0, opacity: 1, duration: 1.3 },
        "+=0.3"
      );
      tl.fromTo(
        ".hero__glow",
        { scale: 0.5 },
        { scale: 1, opacity: 1, duration: 1.8 },
        "-=1"
      );
    },
    { scope: container }
  );

  return (
    <div className="relative" ref={container}>
      <StarGrid />
      <h1 className="hero__heading text-balance text-5xl font-medium opacity-0 md:text-7xl text-foreground">
        Farmer{" "}
      </h1>

      <div className="hero__body mx-auto mt-6 max-w-md text-balance text-muted-foreground opacity-0">
        <p>Join Agro</p>
      </div>

      <Button
        href="/login"
        title="Join agro Community"
        containerClass="hero__button mx-auto mt-8 opacity-0"
      ></Button>

      <a
        href="https://www.youtube.com/shorts/goVOUaWfykU"
        target="_blank"
        className="block hero__image glass-container mx-auto mt-16 w-full max-w-6xl opacity-0"
      >
        <div className="hero__glow absolute inset-0 -z-10 bg-primary/30 opacity-0 blur-2xl filter" />
        <img
          src={Image}
          alt="agro Community Platform"
          width={1200}
          height={800}
          className="h-auto w-full rounded-lg object-cover shadow-2xl"
        />
      </a>
    </div>
  );
}
