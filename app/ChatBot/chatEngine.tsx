import { chatFlow, ChatStep, getFAQResponse } from "../ChatBot/HelperFunctions/chatFlow";

export interface ChatState {
  [x: string]: any;
  stepId: string;
  data?: Record<string, any>;
}
export function getNextStep(
  state: ChatState,
  userResponse: string
): { state: ChatState; botStep: ChatStep | { id: "faq-answer"; message: string } } {
  // First check FAQ
  const faqAnswer = getFAQResponse(userResponse);
  if (faqAnswer) {
    return {
      state, // don’t advance flow
      botStep: { id: "faq-answer", message: faqAnswer },
    };
  }

  // Otherwise proceed in flow
  const currentStep = chatFlow[state.stepId];
  if (!currentStep) {
    return {
      state: { stepId: "start", data: {} },
      botStep: chatFlow.start,
    };
  }

  let updatedState: ChatState = { ...state, data: { ...state.data } };

  if (currentStep.handler) {
    updatedState = currentStep.handler(userResponse, updatedState);
  }

  let nextStepId: string | undefined;
  if (typeof currentStep.next === "function") {
    nextStepId = currentStep.next(userResponse, updatedState);
  } else if (typeof currentStep.next === "string") {
    nextStepId = currentStep.next;
  }

  const nextStep = nextStepId ? chatFlow[nextStepId] : undefined;

  return {
    state: { ...updatedState, stepId: nextStep?.id ?? currentStep.id },
    botStep: nextStep ?? currentStep,
  };
}