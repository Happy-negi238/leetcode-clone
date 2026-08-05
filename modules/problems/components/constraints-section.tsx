import React from "react";

export const ConstraintSection = ({ constraints }: any) => {
  if (!constraints) return null;

  return (
    <div>
      <h3 className="font-semibold text-lg mb-3">Constraints: </h3>
      <div className="bg-muted p-4 rounded-lg">
        <pre className="text-muted-foreground whitespace-pre-wrap text-sm">
          {constraints}
        </pre>
      </div>
    </div>
  );
};
