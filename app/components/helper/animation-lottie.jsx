'use client';
import Lottie from "lottie-react";

const AnimationLottie = ({ animationPath, width }) => {
  return (
    <Lottie
      loop
      autoplay
      animationData={animationPath}
      style={{ width: width || '95%' }}
    />
  );
};

export default AnimationLottie;
