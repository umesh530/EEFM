import { MessageCircle, Send, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../services/api';

const initialMessages = [
  { id: 1, from: 'ai', text: 'Hello! I can analyze procurement decisions, compare suppliers, and explain risks. Ask me anything about your project.', time: 'Now' },
];

const suggestions = ['Analyze my procurement', 'Find the lowest-risk supplier', 'How can I reduce cost?', 'Compare suppliers', 'Explain the recommendation'];

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [projectContext, setProjectContext] = useState({
    projectName: 'Bridge Construction Project',
    projectCode: 'BRG-101',
    budget: 2500000,
    projectType: 'Infrastructure',
    status: 'Procurement',
  });
  const [supplierContext, setSupplierContext] = useState([
    { supplierName: 'ABC Steel Pvt. Ltd.', riskLevel: 'Low', qualityScore: 91, deliveryScore: 94, reliabilityScore: 89, onTimeDelivery: 96, averagePrice: 68000 },
    { supplierName: 'SolarGrid Solutions', riskLevel: 'Low', qualityScore: 94, deliveryScore: 90, reliabilityScore: 90, onTimeDelivery: 92, averagePrice: 980000 },
    { supplierName: 'Powertron Equipment', riskLevel: 'Medium', qualityScore: 90, deliveryScore: 88, reliabilityScore: 86, onTimeDelivery: 89, averagePrice: 155000 },
    { supplierName: 'Delta Pipe Works', riskLevel: 'High', qualityScore: 81, deliveryScore: 75, reliabilityScore: 70, onTimeDelivery: 74, averagePrice: 90000 },
  ]);
  const [requirementContext, setRequirementContext] = useState({
    materialName: 'Structural Steel',
    quantity: 5000,
    unit: 'kg',
    maxBudget: 400000,
    minSupplierRating: 80,
    criticality: 'High',
  });
  const [requirementsContext, setRequirementsContext] = useState([]);
  const [historyContext, setHistoryContext] = useState([
    { project: 'Bridge Construction Project', materialName: 'Structural Steel', status: 'Open', maxBudget: 400000 },
    { project: 'Industrial Plant Expansion', materialName: 'Electrical Panels', status: 'In Review', maxBudget: 650000 },
    { project: 'Solar Power Plant', materialName: 'Solar Panels', status: 'Open', maxBudget: 2600000 },
  ]);

  useEffect(() => {
    const loadContext = async () => {
      try {
        const [projectsRes, suppliersRes, procurementRes] = await Promise.all([
          api.get('/projects'),
          api.get('/suppliers'),
          api.get('/procurements'),
        ]);

        const projects = projectsRes.data || [];
        const suppliers = suppliersRes.data || [];
        const procurements = procurementRes.data || [];

        const primaryProject = projects[0] || projectContext;
        const primaryRequirement = procurements[0] || requirementContext;

        setProjectContext(primaryProject);
        setRequirementContext(primaryRequirement);
        setRequirementsContext(procurements);
        setSupplierContext(suppliers.length ? suppliers : supplierContext);
        setHistoryContext(procurements.slice(0, 5).map((item) => ({
          project: item.project?.projectName || 'Project',
          materialName: item.materialName,
          status: item.status,
          maxBudget: item.maxBudget,
          requiredDeliveryDate: item.requiredDeliveryDate,
        })));
      } catch (error) {
        console.error('AI assistant context load failed:', error);
      }
    };

    loadContext();

    const handleToggle = () => {
      setOpen((current) => !current);
    };

    window.addEventListener('procureai-chatbot-toggle', handleToggle);

    return () => {
      window.removeEventListener('procureai-chatbot-toggle', handleToggle);
    };
  }, []);

  const sendMessage = async (text = input) => {
    if (!text.trim()) return;

    const newUserMessage = { id: Date.now(), from: 'user', text: text.trim(), time: 'Now' };
    setMessages((current) => [...current, newUserMessage]);
    setInput('');
    setLoading(true);
    const normalizedQuestion = text.trim().toLowerCase();
    const contextualRequirement = requirementsContext.find((item) =>
      normalizedQuestion.includes(item.materialName?.toLowerCase() || '')
    ) || requirementContext;
    const contextualProject = contextualRequirement.project && typeof contextualRequirement.project === 'object'
      ? contextualRequirement.project
      : projectContext;
    const contextualSuppliers = supplierContext.filter((supplier) =>
      (supplier.materialsSupplied || []).some((material) =>
        material.trim().toLowerCase() === contextualRequirement.materialName?.trim().toLowerCase()
      )
    );

    try {
      const response = await api.post('/ai/chat', {
        question: text,
        project: contextualProject,
        requirement: contextualRequirement,
        suppliers: contextualSuppliers,
        history: historyContext,
      });

      const botMessage = { id: Date.now() + 1, from: 'ai', text: response.data.answer || 'I do not have enough data to determine that.', time: 'Now' };
      setMessages((current) => [...current, botMessage]);
    } catch (error) {
      setMessages((current) => [...current, { id: Date.now() + 2, from: 'ai', text: 'I do not have enough data to determine that.', time: 'Now' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-indigo-500"
        >
          <MessageCircle size={18} />
          ProcureAI Assistant
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[380px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
          <div className="flex items-center justify-between bg-slate-900 px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">ProcureAI Assistant</p>
              <p className="text-xs text-slate-300">Always grounded in your application data</p>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-slate-800">
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${message.from === 'user' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}>
                  {message.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-slate-500">AI is thinking...</div>}
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {suggestions.map((item) => (
                <button key={item} onClick={() => sendMessage(item)} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-700 hover:bg-slate-200">
                  {item}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                placeholder="Type your procurement question..."
              />
              <button onClick={() => sendMessage()} className="rounded-xl bg-indigo-600 p-2.5 text-white hover:bg-indigo-500">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
