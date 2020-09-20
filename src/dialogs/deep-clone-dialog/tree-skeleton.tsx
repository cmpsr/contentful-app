import React from "react";
import {
  SkeletonContainer,
  SkeletonBodyText,
} from "@contentful/forma-36-react-components";

const TreeSkeleton: React.FC<{}> = () => {
  return (
    <SkeletonContainer
      animate
      animateId="animation-162"
      ariaLabel="Loading component..."
      backgroundColor="#e5ebed"
      backgroundOpacity={1}
      clipId="cf-ui-skeleton-clip-159"
      foregroundColor="#f7f9fa"
      foregroundOpacity={1}
      gradientId="cf-ui-skeleton-clip-gradient-160"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      speed={2}
      svgHeight="100%"
      svgWidth="100%"
      testId="cf-ui-skeleton-form"
      width="100%"
    >
      <SkeletonBodyText
        lineHeight={16}
        marginBottom={8}
        numberOfLines={1}
        offsetLeft={0}
        offsetTop={0}
      />
      <SkeletonBodyText
        lineHeight={16}
        marginBottom={8}
        numberOfLines={1}
        offsetLeft={36}
        offsetTop={24}
      />
      <SkeletonBodyText
        lineHeight={16}
        marginBottom={8}
        numberOfLines={1}
        offsetLeft={72}
        offsetTop={24 * 2}
      />
      <SkeletonBodyText
        lineHeight={16}
        marginBottom={8}
        numberOfLines={1}
        offsetLeft={36}
        offsetTop={24 * 3}
      />
      <SkeletonBodyText
        lineHeight={16}
        marginBottom={8}
        numberOfLines={1}
        offsetLeft={0}
        offsetTop={24 * 4}
      />
      <SkeletonBodyText
        lineHeight={16}
        marginBottom={8}
        numberOfLines={1}
        offsetLeft={35}
        offsetTop={24 * 5}
      />
    </SkeletonContainer>
  );
};

export { TreeSkeleton };
