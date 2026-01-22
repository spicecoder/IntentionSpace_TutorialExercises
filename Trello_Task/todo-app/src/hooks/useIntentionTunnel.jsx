import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Field from '../core/Field';
import TodoReflector from '../core/Objects';
import TodoManager from '../core/DesignNodes';

const Context = createContext(null);

export function IntentionTunnelProvider({ children }) {
  const [field, setField] = useState(() => new Field());

  const { object, dn } = useMemo(() => ({
    object: new TodoReflector(),
    dn: new TodoManager()
  }), []);

  useEffect(() => {
    object.listen(field, setField);
    dn.listen(field, setField);
  }, [field, object, dn]);

  const emit = (id, pulses) => {
    setField(prev => {
      const next = new Field();
      prev.pulses.forEach((p, k) => next.pulses.set(k, { ...p }));
      prev.intentions.forEach(i => next.intentions.add(i));
      next.subscribers = prev.subscribers;
      next.addIntention(id, pulses);
      return next;
    });
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

  useEffect(() => subscribe(pulse, setValue), [pulse]);
  return value;
}
