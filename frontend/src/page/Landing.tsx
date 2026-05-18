import type { JSX } from "react";
import Bounded from "./landing/Bounded";
import AnimatedContent from "./landing/AnimatedContent";

const Landing = (): JSX.Element => {
  return (
    <Bounded className="text-center">
      <AnimatedContent />
    </Bounded>
  );
};

export default Landing;
