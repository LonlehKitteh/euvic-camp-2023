import React from "react";
import { Stack } from "react-bootstrap";

type LabelsPropsType = {
  event: resultsEvent;
};

const Labels: React.FC<LabelsPropsType> = ({ event }) => {
  return (
    <Stack gap={2} direction="horizontal" className="justify-content-center align-items-center labels">
      {Array.from(new Set([...event.labels, ...(event.entities[0]?.labels || [])])).map((label, key) => (
        <div key={key} className="label">
          {label}
        </div>
      ))}
    </Stack>
  );
};

export default Labels;
