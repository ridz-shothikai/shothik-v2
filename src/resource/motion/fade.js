import { varTranEnter, varTranExit } from "./transations";

export const varFade = (props) => {
  const distance = props?.distance || 120;
  const durationIn = props?.durationIn;
  const durationOut = props?.durationOut;
  const easeIn = props?.easeIn;
  const easeOut = props?.easeOut;

  return {
    // IN
    in: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: varTranEnter({ durationIn, easeIn }) },
      exit: { opacity: 0, transition: varTranExit({ durationOut, easeOut }) },
    },
    inUp: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
    inDown: {
      initial: { y: -distance, opacity: 0 },
      animate: {
        y: 0,
        opacity: 1,
        transition: varTranEnter({ durationIn, easeIn }),
      },
      exit: {
        y: -distance,
        opacity: 0,
        transition: varTranExit({ durationOut, easeOut }),
      },
    },
    inLeft: {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0 },
    },
    inRight: {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0 },
    },

    // OUT
    out: {
      initial: { opacity: 1 },
      animate: { opacity: 0, transition: varTranEnter({ durationIn, easeIn }) },
      exit: { opacity: 1, transition: varTranExit({ durationOut, easeOut }) },
    },
    outUp: {
      initial: { y: 0, opacity: 1 },
      animate: {
        y: -distance,
        opacity: 0,
        transition: varTranEnter({ durationIn, easeIn }),
      },
      exit: {
        y: 0,
        opacity: 1,
        transition: varTranExit({ durationOut, easeOut }),
      },
    },
    outDown: {
      initial: { y: 0, opacity: 1 },
      animate: {
        y: distance,
        opacity: 0,
        transition: varTranEnter({ durationIn, easeIn }),
      },
      exit: {
        y: 0,
        opacity: 1,
        transition: varTranExit({ durationOut, easeOut }),
      },
    },
    outLeft: {
      initial: { x: 0, opacity: 1 },
      animate: {
        x: -distance,
        opacity: 0,
        transition: varTranEnter({ durationIn, easeIn }),
      },
      exit: {
        x: 0,
        opacity: 1,
        transition: varTranExit({ durationOut, easeOut }),
      },
    },
    outRight: {
      initial: { x: 0, opacity: 1 },
      animate: {
        x: distance,
        opacity: 0,
        transition: varTranEnter({ durationIn, easeIn }),
      },
      exit: {
        x: 0,
        opacity: 1,
        transition: varTranExit({ durationOut, easeOut }),
      },
    },
  };
};
