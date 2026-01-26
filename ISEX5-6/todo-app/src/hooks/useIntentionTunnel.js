import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Field from '../core/Field';
import TodoReflector from '../core/Objects';
import TodoManager from '../core/DesignNodes';

const Context = createContext(null);
export function IntentionTunnelProvider({ children }) {
  const [field] = useState(() => new Field());

  const object = useMemo(() => new TodoReflector(), []);
  const dn = useMemo(() => new TodoManager(), []);

 
  const emit = (id, pulses) => {
    field.addIntention(id, pulses);
    object.listen(field);
    dn.listen(field);
  };

  const subscribe = (pulse, cb) => field.subscribe(pulse, cb);
  const getFieldPulse = pulse => field.getPulseValue(pulse);

  return (
    <Context.Provider value={{ emit, subscribe, getFieldPulse }}>
      {children}
    </Context.Provider>
  );
}


export function useIntentionTunnel() {
  return useContext(Context);
}

export function useFieldPulse(pulse) {
  const { subscribe, getFieldPulse } = useIntentionTunnel();
  const [value, setValue] = useState(getFieldPulse(pulse));

 useEffect(() => subscribe(pulse, setValue), [pulse,subscribe]);
  return value;
}