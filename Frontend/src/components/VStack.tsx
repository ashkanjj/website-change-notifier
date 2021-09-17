import React from "react";

interface Iprops {
  children: React.ReactNode;
  spacing: string;
}

function VStack(props: Iprops) {
  const { children, spacing } = props;
  const arrayChildren = React.Children.toArray(children);
  return (
    <>
      {arrayChildren.map((child) => (
        <div key={(child as any).key} style={{ marginBottom: spacing }}>
          {child}
        </div>
      ))}
    </>
  );
}

export default VStack;
