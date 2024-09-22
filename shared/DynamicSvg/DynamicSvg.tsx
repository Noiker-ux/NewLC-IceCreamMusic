import { ComponentProps } from "react";

import dynamic from "next/dynamic";

type DynamicSvg = ComponentProps<"svg"> & {
  name: string;
};

export const DynamicSvg = ({ name, ...props }: DynamicSvg) => {
  const Svg = dynamic(() => import(`@/public/assets/ArrowsUp/${name}.svg`));

  // Or without using `dynamic`:
  // We use `default` here because `@svgr/webpack` converts all other *.svg imports to React components, this might be different for other loaders.
  // const Svg = (await import(`@/assets/${name}.svg`)).default;

  return <Svg {...props} />;
};
