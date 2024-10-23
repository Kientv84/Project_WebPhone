import { Steps } from "antd";
import React from "react";
import "./StepDetailOrderComponent.css";

const { Step } = Steps;

const StepDetailOrderComponent = ({ current = 0, items = [] }) => {
  return (
    <Steps current={current}>
      {items.map((item) => (
        <Step
          key={item.title}
          title={item.title}
          description={item.description}
        />
      ))}
    </Steps>
  );
};

export default StepDetailOrderComponent;
