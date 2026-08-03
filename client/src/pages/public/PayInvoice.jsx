import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import { useParams, Link } from 'react-router-dom';
import { CreditCard, Smartphone, Landmark, Banknote, Check, Loader2, FileText, ChevronRight } from 'lucide-react';

const METHOD_ICONS = {
  card: CreditCard,
  mtn_momo: Smartphone,
  airtel_money: Smartphone,
  bank_transfer: Landmark,
  cash: Banknote,
};

export default function PayInvoice() {
  const { invoiceNumber } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState('');
  const [ref, setRef] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(API_BASE_URL + `/api/invoices/pay/${invoiceNumber}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message || 'Invoice not found');
        setInvoice(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [invoiceNumber]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    try {
      const res = await fetch(API_BASE_URL + `/api/invoices/pay/${invoiceNumber}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: selected, transactionId: ref }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Payment submission failed');
      setSubmitted(json.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-[#3b82f6] mb-3" size={36} />
        <p className="text-gray-500 text-sm">Loading invoice...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 p-6">
        <FileText className="text-gray-300 mb-3" size={48} />
        <h1 className="text-xl font-bold text-gray-800 mb-1">Invoice not found</h1>
        <p className="text-gray-500 text-sm mb-6">{error}</p>
        <Link to="/" className="bg-[#1a3a5c] text-white px-6 py-2.5 rounded-lg text-sm font-semibold">Back to Home</Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 p-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Check className="text-green-600" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Submitted</h1>
        <p className="text-gray-600 max-w-md text-center mb-2">
          Your payment via <strong>{submitted.method}</strong> has been recorded.
        </p>
        <p className="text-gray-500 text-sm max-w-md text-center mb-6">
          Reference: <strong>{submitted.paymentNumber}</strong>. Our team will verify your payment and confirm your invoice shortly.
        </p>
        <Link to="/" className="bg-[#1a3a5c] text-white px-6 py-2.5 rounded-lg text-sm font-semibold">Back to Home</Link>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#1a3a5c] text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <FileText size={16} />
            Invoice {invoice.invoiceNumber}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pay Your Invoice</h1>
          <p className="text-gray-500">Choose a payment method below to complete your payment.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-bold text-[#1a3a5c] mb-4">Invoice Summary</h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 text-xs mb-1">Client</p>
                <p className="font-medium text-gray-900">{invoice.clientName || '-'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Project</p>
                <p className="font-medium text-gray-900">{invoice.projectName || '-'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Due Date</p>
                <p className="font-medium text-gray-900">{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Status</p>
                <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full capitalize ${invoice.status === 'paid' ? 'bg-green-100 text-green-700' : invoice.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{invoice.status}</span>
              </div>
            </div>
            {invoice.description && (
              <p className="text-sm text-gray-500 mt-4">{invoice.description}</p>
            )}
            <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
              <span className="text-gray-600 font-medium">Amount Due</span>
              <span className="text-2xl font-bold text-[#1a3a5c]">{invoice.currency} {Number(invoice.balance || invoice.total).toLocaleString()}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <h3 className="font-bold text-[#1a3a5c] mb-4">Select Payment Method</h3>
            {invoice.paymentMethods?.length === 0 ? (
              <p className="text-gray-500 text-sm">No payment methods available.</p>
            ) : (
              <div className="space-y-3 mb-6">
                {invoice.paymentMethods?.map((m) => {
                  const Icon = METHOD_ICONS[m.id] || CreditCard;
                  return (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setSelected(m.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                        selected === m.id ? 'border-[#3b82f6] bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${selected === m.id ? 'bg-[#3b82f6] text-white' : 'bg-gray-100 text-gray-500'}`}>
                        <Icon size={22} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">{m.name}</p>
                        <p className="text-xs text-gray-500">{m.description}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 shrink-0 ${selected === m.id ? 'border-[#3b82f6]' : 'border-gray-300'}`}>
                        {selected === m.id && <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] m-auto mt-[3px]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {selected && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {selected === 'card' ? 'Card / Transaction Reference (optional)' : selected === 'bank_transfer' ? 'Bank / Transaction Reference (optional)' : 'Transaction Reference or Phone (optional)'}
                </label>
                <input
                  type="text"
                  value={ref}
                  onChange={(e) => setRef(e.target.value)}
                  placeholder="e.g. MoMo transaction ID"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#3b82f6] text-sm"
                />
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-5">{error}</div>
            )}

            <button
              type="submit"
              disabled={!selected || submitting}
              className="w-full flex items-center justify-center gap-2 bg-[#1a3a5c] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#2a5a8c] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <ChevronRight size={18} />}
              {submitting ? 'Submitting...' : `Pay ${invoice.currency} ${Number(invoice.balance || invoice.total).toLocaleString()}`}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
