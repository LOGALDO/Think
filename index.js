import { useState, useEffect } from "react";
import produce from "immer";

const state = () => {
  let data = {};

  const newReality = ({ responsable, action, resources }) => {
    data = produce(data, (draft) => {
      draft[responsable] = {
        action,
        resources
      };
    });
  };

  const reality = () => data;

  return [reality, newReality];
};
const [reality, newReality] = state();

// #1AS Teoria para conectar un responsable con las decisiones:
const performers = new Map();

// Creates the new reality and communicates it to those
// responsible for taking the necessary actions to do so
function decide(responsable, action, resources = {}) {
  if (performers.has(responsable)) {
    performers.get(responsable)({
      action,
      resources
    });
  } else throw new Error("No existe el performer", responsable);
  // Update reality
  newReality({
    responsable,
    action,
    resources
  });

  return null;
}

// It connects decision makers with the thoughts that determine them.
export function perform(responsable, capacity) {
  /**
   * #1AS Teoria para conectar un responsable con las decisiones:
   *    - Crear un componente con estado
   *    - Su hook de estado registrarlo bajo el nombre del responsable
   *      en una estructura de datos
   *    - ´decide´ accede a la estructura de datos con el nombre del resaponsable
   *      - Entonces, obtiene su hook de estado y le pasa una decision, compuesta
   *        por una accion como ´action´ y los recursos necesarios como ´resources´.
   */
  return () => {
    const [decision, decide] = useState({ action: "", resources: {} });
    performers.set(responsable, decide);

    return capacity(decision.action, decision.resources);
  };
}

// Gives thought the ability to be applied
export function learn(situation, thought) {
  return (perception) => {
    thought(reality(), perception, decide);
  };
}

export function UI({ start, init }) {
  useEffect(start);
  const Init = init;
  return <Init />;
}
