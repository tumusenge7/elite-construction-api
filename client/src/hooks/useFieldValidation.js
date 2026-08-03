import { useState, useEffect, useRef } from 'react';

/**
 * useFieldValidation — debounced async field validator
 *
 * @param {string} value        - current field value
 * @param {'email'|'phone'} type - validation type
 * @param {number} delay        - debounce ms (default 600)
 *
 * Returns: { status: 'idle'|'checking'|'valid'|'invalid', message, suggestion, data }
 */
export function useFieldValidation(value, type, delay = 600) {
  const [status, setStatus] = useState('idle');   // idle | checking | valid | invalid
  const [message, setMessage] = useState('');
  const [suggestion, setSuggestion] = useState(null);
  const [data, setData] = useState(null);
  const timerRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    const trimmed = value?.trim() || '';

    // Reset when empty
    if (!trimmed) {
      setStatus('idle');
      setMessage('');
      setSuggestion(null);
      setData(null);
      return;
    }

    // Quick client-side pre-check before hitting the API
    if (type === 'email' && !trimmed.includes('@')) {
      setStatus('invalid');
      setMessage('Enter a valid email address.');
      return;
    }

    if (type === 'phone' && trimmed.length < 7) {
      setStatus('invalid');
      setMessage('Phone number is too short.');
      return;
    }

    setStatus('checking');

    // Debounce
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      // Cancel previous in-flight request
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      try {
        const res = await fetch(`/api/validate/${type}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ [type]: trimmed }),
          signal: abortRef.current.signal,
        });

        const json = await res.json();

        if (json.valid) {
          setStatus('valid');
          setMessage(json.data?.warning || '');
          setSuggestion(null);
          setData(json.data || null);
        } else {
          setStatus('invalid');
          setMessage(json.message || 'Invalid input.');
          setSuggestion(json.suggestion || null);
          setData(null);
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        // Network error — don't block the user, just clear
        setStatus('idle');
        setMessage('');
      }
    }, delay);

    return () => clearTimeout(timerRef.current);
  }, [value, type, delay]);

  return { status, message, suggestion, data };
}
